import { useScrollPosition } from "@/hooks/useScrollPosition";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
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

import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient();

function Navrbar() {
  const scrollPosition = useScrollPosition();
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const { address } = useAccount();
  const [showFoundAdd, setFoundAdd] = useState(false);

  useEffect(() => {
    if (address) {
      setFoundAdd(true);
    } else {
      setFoundAdd(false);
    }
    return () => {
      setFoundAdd(false);
    };
  }, [address]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div
          className={classNames(
            scrollPosition > 800
              ? "bg-[#ffffff] backdrop-blur-none shadow-xl"
              : scrollPosition > 0
              ? "bg-[#081f75bf] "
              : "",
            "fixed w-[100vw] top-0 flex flex-row justify-between px-20 items-center py-4 backdrop-blur  z-50"
          )}
        >
          <div>
            <h2
              className={classNames(
                scrollPosition > 800 ? "text-[#1E4DD8]" : "",
                "font-[700] text-[2rem] tracking-widest"
              )}
            >
              <Link href="/">NFTFY</Link>
            </h2>
            {/* <Image src="" alt=""></Image> */}
          </div>
          <div className="flex flex-row justify-between items-center ml-auto">
            {showFoundAdd ? (
              <ul
                className={classNames(
                  scrollPosition > 800 ? "text-[#1E4DD8]" : "",
                  "mx-6 font-[600]"
                )}
              >
                <li>
                  <Link href="/profile/">Profile</Link>
                </li>
              </ul>
            ) : null}
            <ConnectButton />
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
}

export default Navrbar;
