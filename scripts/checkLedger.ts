import { ethers } from 'hardhat'

async function main() {
    // === CONFIG ===
    const ledgerAddress = '0xF7ABce32e3cBAd782827437cC41E62e6422ee83b' // your PaymentLedger on Amoy

    // === LOAD CONTRACT ===
    const ledger = await ethers.getContractAt('PaymentLedger', ledgerAddress)

    // === READ DATA ===
    const totalAmount = await ledger.totalAmount()
    console.log(`💰 Total amount stored: ${ethers.utils.formatEther(totalAmount)} ETH`)

    const payments = await ledger.getPayments()
    console.log(`📜 Payments recorded: ${payments.length}`)

    payments.forEach((p: any, i: number) => {
        console.log(`  #${i + 1}`)
        console.log(`    payer:  ${p.payer}`)
        console.log(`    amount: ${ethers.utils.formatEther(p.amount)} ETH`)
        console.log(`    txId:   ${p.txId}`)
    })
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
