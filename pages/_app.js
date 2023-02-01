import Navrbar from "../components/Navrbar";
import "@/styles/globals.css";
import "../styles/loader.css";
import { useState } from "react";

// ********* Rainbowkit wallet connect ***********
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  AddChainError,
  configureChains,
  createClient,
  useAccount,
  WagmiConfig,
} from "wagmi";
import { polygonMumbai, goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }) {
  const { chains, provider } = configureChains(
    [polygonMumbai, goerli],
    [
      alchemyProvider({ apiKey: "HxgUPr9F1aZfO3jgX1HsQUBfhpd49qpa" }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  // const queryClient = new QueryClient();

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <Layout />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
