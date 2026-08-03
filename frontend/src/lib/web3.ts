import { ethers } from "ethers";

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

export async function connectMetaMask(): Promise<WalletState> {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      return {
        address: accounts[0],
        chainId: Number(network.chainId),
        isConnected: true,
      };
    } catch (error) {
      console.error("MetaMask connection failed:", error);
      throw error;
    }
  } else {
    // Fallback simulation for browsers without MetaMask extension
    console.warn("MetaMask extension not detected. Running in simulated Web3 mode.");
    return {
      address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      chainId: 80002, // Polygon Amoy Testnet
      isConnected: true,
    };
  }
}

export function formatAddress(addr: string | null): string {
  if (!addr) return "Connect Wallet";
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}
