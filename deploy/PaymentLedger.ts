import assert from 'assert'
import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'PaymentLedger'

const deploy: DeployFunction = async (hre) => {
    // Only deploy PaymentLedger on Amoy network
    const allowedNetworks = ['amoy']
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

    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [endpointV2Deployment.address, deployer],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed ${contractName} at ${address} on ${hre.network.name}`)
}

deploy.tags = [contractName]

export default deploy
