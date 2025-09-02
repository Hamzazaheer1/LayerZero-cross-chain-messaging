1. Deploy Contracts

npx hardhat lz:deploy

2. Wire and Configure Communication Channels (To establish trust and messaging rules)

npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts

This wires peers, applies routing, and sets your enforced gas options

You can verify setup with:

npx hardhat lz:oapp:peers:get --oapp-config layerzero.config.ts
npx hardhat lz:oapp:config:get --oapp-config layerzero.config.ts

3. Test current Ledger

npx hardhat run scripts/checkLedger.ts --network amoy

4. Send Payment Using any chain

From Sepolia:

npx hardhat run scripts/sendPayment.ts --network sepolia

From BSC testnet: [Tested]

npx hardhat run scripts/sendPayment.ts --network bsctest

From Polygon Amoy:

npx hardhat run scripts/sendPayment.ts --network amoy
