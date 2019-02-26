# Totle Trading Widget

Totle Trading Widget is a quick way to trade any commmon token pair listed on the API. It can be hosted standalone, added to your site, or packaged and delivered in a script CDN. 

## The Problem
* I often use trading widgets or Uniswap out of convenience , but am usually not happy with the prices. Usually, due to low liquidity or few participating relayers (Airswap), I end up paying 1-5% over market rate for token trades. 
* As a user, I don't want to have to leave a DApp to purchase tokens necessary for DApp usage. For example, if I'm attempting to purchase Dai to loan out via a DeFi Dapp, I shouldn't have to visit an exchange, wait for a while, and come back. 
* As a developer, I shouldn't have to build my own exchange functionality and source my own liquidity!
* Most Dex's only offer Ether<-->Erc-20 trades or Weth<--->ERC-20 trades. As a user, if I have a lot of $DAI and want to buy a token for an app or purchase, I don't want to have to make a second trade and lose on margins/fees :(

## The Solution
I built a Totle trading widget to instantly surface better token pair prices than any individual DEX. The Totle API is the best way to source token trading pairs, since it scans most major DEX's for the best price on any common token pair combination. It returns orders provided by Totle and allows the user to `approve()` and execute a trade. If distributed over a CDN, the 

For this demo, I retrieved all tokens via the `/tokens` endpoint but only made 3 popular token pairs available (ZRX, OMG, and DAI) since I knew there would be sufficient liquidity. Any token pair could be quickly added since I mapped the React `<select>` options to the 335 token label/values returned by your `/tokens` endpoint.

# How It Works in 5 Steps
1. Widget reads the user's Metamask address and network. If the user is not connected or is on the wrong network, then they're prompted to change network or connect via MetaMask. I used https://github.com/blocknative/assist for user Metamask help.
2. The User selects the token they'd like to sell, the amount they'd like to sell, and the token they'd like to buy. 
3. The widget retrieves the best available order from Totle's `/swap` endpoint and displays it to the user.
4. The "Approve" button is enabled, allowing the user to `approve()` Totle's smart contracts to trade on their behalf.
5. Once the `Approval` transaction is mined, the user is able to confirm the trade. 

# Improvements
* The widget is not packaged for distribution over a CDN but could be. I'm sure there's some nuances to getting the user's web3 provider, but it can be done.
* Use a redux store to track state across components. I didn't have the time to write reducers so it's a bit hack-a-thon-y.
* Improve design and styling to match Totle's styleguide. I'm not a FE developer so even this was challenging lol.
* Refresh Totle orders every 30 seconds. I ran into issues with the trade not being available by the time my transaction was mined on Mainnet, and so the transaction was cancelled. 
* Check `allowance` on the token contract before prompting the user to `approve()`. This saves a returning user the tx cost and time.

## Libraries used
* Web3
* Ethers.js (the best)
* BigNumber
* react-jazzicon
* axios
* material-ui

# Improvements to the Totle Developer experience
* I know it must be immensely difficult to standup support for a test network, but not having a test network really limits my capabilities and interest to use Totle's contracts as a developer. The API is great for making a telegram bot for retrieving prices or token pairs, but then again, there's already 0xfffffffffffffffffff of those in the wild :p I spent $10 in an hour or two of testing on Mainnet. 
* Overall the API and documentation were great. However, I had to find token contract addresses myself, and I believe you were missing code for your affiliate contract as well. 
* Since smart contract calls are so delicate, make sure to explain what you mean by `nextNonce`, what contract address should be in the `to` parameter, and what web3 method should be called. I had to use Web3 v0.2 since it's what metamask supports, and therefore couldn't use the method you had listed in your docs. 
* Sharing testing scripts or utils would be helpful. I have my own `shiftDecimal()` utility, but it could've been a huge time-savor to borrow one from you all. 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
