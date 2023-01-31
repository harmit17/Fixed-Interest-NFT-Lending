import Image from "next/image";
import React from "react";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import contract from "../artifacts/NFTStake.json";
import ERC721_contract from "../artifacts/ERC721.json";
import TransactionPopUp from "./TransactionPopUp";
export const CONTRACT_ADDRESS = "0xD906B953a92FC7Cde79eFd2b9EB9f3f3D7795D93";

function StakePopUp({ setOpenStake, showStakeNftDetails }) {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [transactionUpdates, setTransactionUpdates] = useState();
  const [showErrorInTrans, setErrorInTrans] = useState();
  // contract integration
  const stakeNFT = async () => {
    setLoading(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        // superfluid part
        const sf = await Framework.create({
          chainId: 80001,
          provider: provider,
        });
        const daix = await sf.loadSuperToken("fDAIx");

        // erc721 contract
        const erc721_contract_address = ethers.utils.getAddress(
          showStakeNftDetails.token_address
        );
        const con1 = new ethers.Contract(
          erc721_contract_address,
          ERC721_contract,
          signer
        );
        // main contract
        const con = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);

        // check for ACL permission
        const isAuthorized = await daix.getFlowOperatorData({
          sender: address,
          flowOperator: CONTRACT_ADDRESS,
          token: daix.address,
          providerOrSigner: signer,
        });
        const permission = isAuthorized.permissions;
        setTransactionUpdates(
          "Authorizing contract to manage interest stream."
        );
        // if permission is not given then give permission
        if (permission === String(0)) {
          const aclApproval = daix.updateFlowOperatorPermissions({
            flowOperator: CONTRACT_ADDRESS,
            flowRateAllowance: "3858024691358024", //10k tokens per month in flowRateAllowanace
            permissions: 7, //NOTE: this allows for full create, update, and delete permissions. Change this if you want more granular permissioning
          });
          await aclApproval.exec(signer).then(async function (tx) {
            await tx.wait();
            console.log(`
            Congrats! You've just successfully made the money router contract a flow operator.
            Tx Hash: ${tx.hash}
        `);
          });
        }

        // nft approval
        setTransactionUpdates("Authorizing contract to access your NFT.");
        const tx = await con1.setApprovalForAll(CONTRACT_ADDRESS, true);
        await tx.wait();
        console.log("nft approved");
        // nft data
        const nft_data = JSON.parse(showStakeNftDetails.metadata);

        // call deposit nft function
        setTransactionUpdates("Staking NFT into contract.");
        const tx1 = await con.depositNFT(
          address,
          showStakeNftDetails.token_address,
          parseInt(showStakeNftDetails.token_id),
          nft_data.name,
          nft_data.description,
          nft_data.image
        );
        await tx1.wait();
        console.log("nft deposited");

        // check if the stream is already running and start stream for interest
        const loanAmount = await con.getTotalLoanAmount(address);
        let coneverted_loanAmount = parseInt(loanAmount._hex, 16);
        let interestRate = (coneverted_loanAmount * 10) / 1200;
        let flowrate = interestRate * 18144000;
        const response = await daix.getFlow({
          sender: address,
          receiver: CONTRACT_ADDRESS,
          providerOrSigner: signer,
        });
        if (
          response.deposit === "0" &&
          response.owedDeposit === "0" &&
          response.flowRate === "0"
        ) {
          setTransactionUpdates("Starting interst stream into the contract.");
          const txn = await con.createFlowIntoContract(daix.address, flowrate);
          await txn.wait();
          setLoading(false);
          console.log("stream started");
        } else {
          setTransactionUpdates("Updating interst stream into the contract.");
          const txn = await con.updateFlowIntoContract(daix.address, flowrate);
          await txn.wait();
          setLoading(false);
          console.log("stream updated");
        }
      }
    } catch (error) {
      setErrorInTrans(error.message.substring(0, 40) + "...");
      // setTransactionUpdates(error.message);
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className="popup relative rounded-md overflow-hidden"
        id="notification-box"
      >
        <div className="flex justify-center w-full text-[#1E4DD8] p-4 font-[700] items-center sticky top-0 ">
          <h1 className=" text-[1.5rem]">STAKE</h1>
          <svg
            className="cursor-pointer absolute right-[20px]"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#1E4DD8"
            onClick={() => setOpenStake(false)}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
          </svg>
        </div>
        <div className="m-auto p-2 border-2 border-[#1E4DD8] max-w-max rounded-xl">
          <Image
            src={JSON.parse(showStakeNftDetails.metadata).image}
            width={200}
            height={200}
            alt="profile"
            className="m-auto rounded-xl"
          />
        </div>
        <div className="m-4 nft-token-detials border border-[#1E4DD8] rounded-xl p-4 ">
          <div className="flex flex-row max-w-[100%] justify-between px-2 py-[2px] bg-[#d5def9] ">
            <p className="font-[700] text-[#1E4DD8]">Token Address</p>
            <p className="text-[#000] font-[600]">
              {showStakeNftDetails.token_address}
            </p>
          </div>
          <div className="flex flex-row max-w-[100%] justify-between px-2 py-[2px]">
            <p className="font-[700] text-[#1E4DD8]">Token Id</p>
            <p className="text-[#000] font-[600]">
              {" "}
              {showStakeNftDetails.token_id}
            </p>
          </div>
          <div className="flex flex-row max-w-[100%] justify-between px-2 py-[2px] bg-[#d5def9]">
            <p className="font-[700] text-[#1E4DD8]">Loan Amount</p>
            <p className="text-[#000] font-[600]">100 fDAI</p>
          </div>
          <div className="flex flex-row max-w-[100%] justify-between px-2 py-[2px]">
            <p className="font-[700] text-[#1E4DD8]">Monthly Interest</p>
            <p className="text-[#000] font-[600]">
              {(100 * 10) / 1200} fDAIx / month (10%APR)
            </p>
          </div>
          <div className="flex flex-row max-w-[100%] justify-between bg-[#d5def9] py-[2px] px-2">
            <p className="font-[700] text-[#1E4DD8]">Yearly Interest</p>
            <p className="text-[#000] font-[600]">
              {(100 * 10) / 100} fDAIx / year (10% APR)
            </p>
          </div>
        </div>
        <div className="text-center p-2 sticky bottom-0">
          <button
            className="hover:bg-[#1E4DD8] hover:text-[#ffffff] mb-4 p-1 px-4 rounded-lg font-[600] border-[2px] border-[#1E4DD8] bg-[#ffffff] text-[#1E4DD8] hover:border-[2px] hover:border-[#1E4DD8]"
            onClick={() => stakeNFT()}
          >
            Take Loan
          </button>
        </div>
      </div>
      <div className="overlay" onClick={() => setOpenStake(false)}></div>
      {loading ? (
        <TransactionPopUp
          setLoading={setLoading}
          transactionUpdates={transactionUpdates}
          setTransactionUpdates={setTransactionUpdates}
          showErrorInTrans={showErrorInTrans}
          setErrorInTrans={setErrorInTrans}
        />
      ) : null}
    </div>
  );
}

export default StakePopUp;
