import { useScrollPosition } from "../../hooks/useScrollPosition";
import { ConnectButton, useAccountModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import heroimg4 from "../../public/warren-umoh-YmTIxQbQo4I-unsplash.jpg";

import { useAccount } from "wagmi";
import Image from "next/image";
import Assets from "@/components/Assets";
import Loans from "@/components/Loans";
import { ethers } from "ethers";
import contract from "../../artifacts/NFTStake.json";
export const CONTRACT_ADDRESS = "0x750807e8B8F167ebc54f51dA2cac790F7d32F5b5";

function Index() {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  // const router = useRouter();
  // const { params } = router.query;
  // console.log(params);
  const { address } = useAccount();
  const [add, setAdd] = useState("");
  const [showAssets, setAssets] = useState(true);
  const [showLoans, setLoans] = useState(false);
  const [totalStakedNFTs, setTotalStakedNFTs] = useState();
  const [totalLoanAmount, setTotalLoanAmount] = useState();
  const [interest, setInterest] = useState();

  useEffect(() => {
    if (address) {
      setAdd(address);
    }
    return () => {
      setAdd("");
    };
  }, [address]);

  // contract integration
  const getUserData = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
        const loanAmount = await con.getTotalLoanAmount(address);
        let coneverted_loanAmount = parseInt(loanAmount._hex, 16);
        setTotalLoanAmount(coneverted_loanAmount);
        let interestRate = (coneverted_loanAmount * 10) / 100;
        setInterest(interestRate);
        const allLoans = await con.getStakeStructArray(address);
        let count = 0;
        for (let i = 0; i < allLoans.length; i++) {
          if (await con.checkStaked(allLoans[i][0], allLoans[i][1])) {
            count += 1;
          }
        }
        setTotalStakedNFTs(count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <div className="">
        <div className={styles.gradient1}></div>
        <div className=" m-auto mt-[13vh]">
          <div className="profile-cover bg-blend-darken overflow-hidden"></div>
          <div className="max-w-[70%] m-auto flex flex-row items-center mt-[-62px] backdrop-blur px-10 h-[30vh] bg-[#ffffff] rounded-[20px] profile-card">
            <div className="rounded-full max-w-max p-1 border-[4px] border-[#1E4DD8] ">
              <Image
                src={heroimg4}
                alt="profilephoto"
                className="rounded-full w-[124px] h-[124px] max-w-[124px]"
              ></Image>
            </div>

            <div className="ml-[2rem] grow">
              <h2 className="text-[1.5rem] text-[#ffffff] font-[700] mb-2">
                {add
                  ? add.substring(0, 7) +
                    "..." +
                    add.substring(add.length - 5, add.length)
                  : ""}
              </h2>
              <p className="text-[1.1rem] text-[#ffffff]">
                Total Staked NFTs :- {totalStakedNFTs} NFT/s
              </p>
              <p className="text-[1.1rem] text-[#ffffff]">
                Total Loan :- {totalLoanAmount} fDAI
              </p>
              <p className="text-[1.1rem] text-[#ffffff]">
                Total Interest :- {interest} fDAIx / year
              </p>
            </div>

            <div className="">
              <button className="bg-[#1E4DD8] px-[20px] py-[10px] rounded-lg ">
                Edit Profile
              </button>
            </div>
          </div>
          <div className={styles.gradient2}></div>
          <div className={styles.gradient3}></div>
        </div>
        <div className="mt-[10vh] text-[#ffffff]  py-4 min-h-[50vh] pt-[5rem]">
          <div className="max-w-[100%] m-auto mx-20">
            <ul className="flex flex-row font-[600] text-[1.5rem] relative z-20 pl-2 cursor-pointer">
              <li
                className={`mr-[20px] px-20 py-8 rounded-t-xl rounded-b-none ${
                  showAssets === true ? "bg-[#1E4DD8] text-[#ffffff]" : ""
                }`}
                onClick={() => {
                  setAssets(true);
                  setLoans(false);
                }}
              >
                Assets
              </li>
              <li
                className={`px-20 py-8 rounded-t-xl rounded-b-none ${
                  showLoans === true ? "bg-[#1E4DD8] text-[#ffffff]" : ""
                }`}
                onClick={() => {
                  setLoans(true);
                  setAssets(false);
                }}
              >
                Loans
              </li>
            </ul>
          </div>
          <div className="profile-card2 max-w-[100%] m-auto min-h-[50vh] mx-20">
            {showAssets ? <Assets /> : null}
            {showLoans ? <Loans /> : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
