# Welcome to the Central Bank

This is a lightweight React component for creating a central bank UI for your ERC20 token.

It's assumed you're using the ERC20PresentMinterPauser configuration, but you can easily adapt it to any other config.

There's a sample Token contract using that Preset in the Contracts folder. You can deploy it with Hardhat to experiment with this yourself locally, or you can replace the Contract address in the React component with your own ERC20.

## How to Use the Sample Contract

1. Run `npm install`
2. Update it with any changes you want, you don't have to change anything though.
3. Run `npx hardhat compile`
4. Run `npx hardhat node` which will create your local ethereum node
5. In a new Terminal tab, run `npx hardhat run scripts/deploy.js --network localhost`
6. Once it deploys you'll see an address for the MyToken contract, copy it into the relevant field of App.js. If you already have a deployed token, you can also plug in that address to manage it on Mainnet
7. Then go back to your HardHat Node and copy the Private key in the top account, paste that into MetaMask to add it as a wallet
8. Then run `npm start` and you should be good!

GLHF!

Ping Nat on Twitter if you run into any issues or questions: https://twitter.com/nateliason
