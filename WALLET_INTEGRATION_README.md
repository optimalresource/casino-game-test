# Wallet Integration

This document outlines the wallet connection feature, which requires users to connect a Web3 wallet (MetaMask) before signing in or signing up.

## Frontend

- **`client/src/components/sign/walletConnect.js`**: The main UI component for handling the wallet connection flow.
- **`client/src/components/sign/sign.js`**: Updated to show the `WalletConnect` component before the sign-in/up forms.
- **`client/src/reducers/auth.js`**: Extended to manage wallet state (connected, address, chain).
- **`client/src/utils/wallet.js`**: Contains helper functions for connecting to MetaMask, setting up event listeners for wallet changes, and saving wallet data to local storage.

## Backend

- **`server/index.js`**: A `wallet_verify` socket event is handled on the server to validate the wallet address.

## Tech Stack

This feature connects directly to the MetaMask browser extension via its `window.ethereum` provider, without relying on external Web3 libraries. This keeps the implementation lightweight.

## Connection Flow

1. The user is prompted to connect their wallet.
2. The user clicks the "Connect MetaMask" button.
3. Once the wallet is connected and verified by the server, the sign-in/sign-up form is displayed.

## Development

The wallet connection is a required step in the authentication flow. The wallet state is managed in the Redux store and can be accessed from any component.

### Future Enhancements

- Support for more wallets (e.g., WalletConnect, Coinbase Wallet).
- Implement message signing for stronger verification.
- Add checks for specific networks or token balances.
