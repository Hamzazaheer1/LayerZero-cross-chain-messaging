import assert from 'assert'
import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'PaymentSender'

const deploy: DeployFunction = async (hre) => {
    // Only deploy PaymentSender on Sepolia, BSC and Amoy networks
    const allowedNetworks = ['sepolia', 'bsctest', 'amoy']
    if (!allowedNetworks.includes(hre.network.name)) {
        console.log(`Skipping ${contractName} deployment on ${hre.network.name} - not in allowed networks`)
        return
    }

    const { getNamedAccounts, deployments } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // Get LayerZero EndpointV2 for this chain
    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            endpointV2Deployment.address, // LayerZero endpoint for this chain
            deployer, // owner
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed ${contractName} at ${address} on ${hre.network.name}`)
}

deploy.tags = [contractName]

export default deploy
