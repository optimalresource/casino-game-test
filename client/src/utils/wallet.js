const networks = {
  "0x1": "Ethereum Mainnet",
  "0x3": "Ropsten Testnet",
  "0x4": "Rinkeby Testnet",
  "0x5": "Goerli Testnet",
  "0x2a": "Kovan Testnet",
  "0x89": "Polygon",
  "0x38": "Binance Smart Chain",
  "0xa": "Optimism",
  "0xa4b1": "Arbitrum One",
};

export const getNetworkName = (chainId) => {
  return networks[chainId] || `Chain ID: ${chainId}`;
};

// Wallet connection utilities
export const connectWallet = async () => {
  try {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const account = accounts[0];

        // Get network information
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        return {
          success: true,
          account: account,
          chainId: chainId,
          provider: "metamask",
        };
      } else {
        throw new Error("No accounts found");
      }
    } else {
      throw new Error("MetaMask is not installed");
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const disconnectWallet = () => {
  // Clear wallet data from localStorage/cookies
  localStorage.removeItem("casino_wallet_connected");
  localStorage.removeItem("casino_wallet_address");
  localStorage.removeItem("casino_wallet_chain");

  return {
    success: true,
    message: "Wallet disconnected",
  };
};

export const getWalletStatus = () => {
  const isConnected =
    localStorage.getItem("casino_wallet_connected") === "true";
  const address = localStorage.getItem("casino_wallet_address");
  const chainId = localStorage.getItem("casino_wallet_chain");

  return {
    isConnected,
    address,
    chainId,
  };
};

export const saveWalletData = (walletData) => {
  localStorage.setItem("casino_wallet_connected", "true");
  localStorage.setItem("casino_wallet_address", walletData.account);
  localStorage.setItem("casino_wallet_chain", walletData.chainId);
};

export const switchNetwork = async (chainId) => {
  try {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
      return { success: true };
    } else {
      throw new Error("MetaMask is not installed");
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Listen for wallet events
export const setupWalletListeners = (
  onAccountChange,
  onChainChange,
  onDisconnect
) => {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        disconnectWallet();
        if (onDisconnect) onDisconnect();
      } else {
        // Account changed
        if (onAccountChange) onAccountChange(accounts[0]);
      }
    });

    window.ethereum.on("chainChanged", (chainId) => {
      if (onChainChange) onChainChange(chainId);
    });

    window.ethereum.on("disconnect", () => {
      disconnectWallet();
      if (onDisconnect) onDisconnect();
    });
  }
};
