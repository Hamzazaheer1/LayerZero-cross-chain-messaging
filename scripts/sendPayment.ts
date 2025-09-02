import { ethers, network } from 'hardhat'

async function main() {
    // === CONFIG ===
    const dstEid = 40267 // EndpointId.AMOY_V2_TESTNET
    const ledgerAddress = '0xF7ABce32e3cBAd782827437cC41E62e6422ee83b' // PaymentLedger on Amoy

    // Sender contract addresses (deployed earlier)
    const senders: Record<string, string> = {
        sepolia: '0x5a4C3D3f3e20be18F461Fc4a5062bE4f4EeC2351',
        bsctest: '0x920543F4D19f89EB346a0f257b85ef9c76147BD4',
        amoy: '0x920543F4D19f89EB346a0f257b85ef9c76147BD4',
    }

    const activeNetwork = network.name // comes from `--network xxx`

    if (!senders[activeNetwork]) {
        throw new Error(`No sender configured for network: ${activeNetwork}`)
    }

    const senderAddress = senders[activeNetwork]
    const sender = await ethers.getContractAt('PaymentSender', senderAddress)

    // === Payment data ===
    const amount = ethers.utils.parseEther('0.001')
    const txId = `TX-${Date.now()}`
    const options = '0x'

    console.log(`Sending payment from [${activeNetwork}] sender: ${senderAddress} → Amoy ledger: ${ledgerAddress}`)
    console.log(`Amount: ${ethers.utils.formatEther(amount)} ETH, txId: ${txId}`)

    // === GET QUOTE FIRST ===
    console.log('🔍 Getting LayerZero fee quote...')
    let fee
    try {
        const quote = await sender.quoteSendPayment(dstEid, amount, txId, options)
        // Add 20% buffer to the native fee
        fee = quote.nativeFee.mul(120).div(100)
        console.log(`📋 Native fee: ${ethers.utils.formatEther(quote.nativeFee)} ETH`)
        console.log(`💰 Fee with buffer: ${ethers.utils.formatEther(fee)} ETH`)
    } catch (error: any) {
        console.error('❌ Quote failed:', error.message)
        console.log('⚠️ Using fallback fee of 0.02 ETH')
        fee = ethers.utils.parseEther('0.02')
    }

    // === SEND PAYMENT ===
    console.log('\n🚀 Sending payment...')
    const tx = await sender.sendPayment(dstEid, amount, txId, options, {
        value: fee,
        gasLimit: 500000,
    })

    console.log(`✅ Sent payment tx: ${tx.hash}`)
    await tx.wait()

    console.log('⏳ Waiting for LayerZero delivery... (few mins)')
    console.log(`👉 Then check PaymentLedger on Amoy at ${ledgerAddress}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
