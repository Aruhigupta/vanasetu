import { ethers } from "ethers";

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  error?: string | null;
}

export const POLYGON_AMOY_CHAIN_ID = 80002;
export const POLYGON_AMOY_HEX_CHAIN_ID = "0x13882"; // 80002 in hex

export async function connectMetaMask(): Promise<WalletState> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask browser extension to connect a Web3 wallet.");
  }

  const ethereum = (window as any).ethereum;

  try {
    const provider = new ethers.BrowserProvider(ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    if (accounts.length === 0) {
      throw new Error("No accounts found in MetaMask.");
    }

    return {
      address: accounts[0],
      chainId: chainId,
      isConnected: true,
      isCorrectNetwork: chainId === POLYGON_AMOY_CHAIN_ID,
      error: chainId !== POLYGON_AMOY_CHAIN_ID ? `Connected to network ID ${chainId}. Please switch to Polygon Amoy Testnet (80002).` : null
    };
  } catch (error: any) {
    console.error("MetaMask connection failed:", error);
    throw new Error(error.message || "MetaMask connection failed.");
  }
}

export async function switchToPolygonAmoy(): Promise<boolean> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const ethereum = (window as any).ethereum;

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: POLYGON_AMOY_HEX_CHAIN_ID }],
    });
    return true;
  } catch (switchError: any) {
    // Error code 4902 indicates chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: POLYGON_AMOY_HEX_CHAIN_ID,
              chainName: "Polygon Amoy Testnet",
              rpcUrls: ["https://rpc-amoy.polygon.technology"],
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              blockExplorerUrls: ["https://amoy.polygonscan.com/"],
            },
          ],
        });
        return true;
      } catch (addError) {
        throw new Error("Failed to add Polygon Amoy Testnet to MetaMask.");
      }
    }
    throw new Error(switchError.message || "Failed to switch network in MetaMask.");
  }
}

export function formatAddress(addr: string | null): string {
  if (!addr) return "Connect Wallet";
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}
