import Image from "next/image";
import React from "react";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import contract from "../artifacts/NFTStake.json";
import ERC20_contract from "../artifacts/ERC20.json";
import TransactionPopUp from "./TransactionPopUp";
export const CONTRACT_ADDRESS = "0xD906B953a92FC7Cde79eFd2b9EB9f3f3D7795D93";

function RepayPopUp({ setOpenRepay, showStakeNftDetails }) {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [transactionUpdates, setTransactionUpdates] = useState();
  const [showErrorInTrans, setErrorInTrans] = useState();
  // contract integration

  // repay loan
  const repayLoan = async () => {
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

        //
        const erc20_contract_address = ethers.utils.getAddress(
          "0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7"
        );
        const con1 = new ethers.Contract(
          erc20_contract_address,
          ERC20_contract,
          signer
        );

        //
        let amount = document.getElementById("amount").value;
        let amount_ = parseInt(amount);

        // token approval
        setTransactionUpdates(
          "Authorizing contract to access fDAI of entered value."
        );
        const tx = await con1.approve(
          CONTRACT_ADDRESS,
          String(amount_ * 10 ** 18)
        );
        await tx.wait();

        setTransactionUpdates("Repaying the entered value of loan.");
        // call repay function from contract
        const con = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
        const tx1 = await con.repay(
          address,
          showStakeNftDetails[0],
          showStakeNftDetails[1],
          amount_
        );
        await tx1.wait();

        // update the stream for interest
        // check if the stream is already running and start stream for interest
        const loanAmount = await con.getTotalLoanAmount(address);
        if (loanAmount > 0) {
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
            setTransactionUpdates(
              "Creating the interest stream into the contract"
            );

            const txn = await con.createFlowIntoContract(
              daix.address,
              flowrate
            );
            await txn.wait();
            setLoading(false);
            console.log("stream started");
          } else {
            setTransactionUpdates(
              "Updating the interest stream into the contract"
            );
            const txn = await con.updateFlowIntoContract(
              daix.address,
              flowrate
            );
            await txn.wait();
            setLoading(false);
            console.log("stream updated");
          }
        } else {
          setTransactionUpdates(
            "Deleting the interest stream into the contract"
          );
          const txn = await con.deleteFlowIntoContract(daix.address);
          await txn.wait();
          setLoading(false);
          console.log("stream deleted");
        }
      }
    } catch (error) {
      setErrorInTrans(error.message.substring(0, 40) + "...");
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
          <h1 className=" text-[1.5rem]">REPAY</h1>
          <svg
            className="cursor-pointer absolute right-[20px]"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#1E4DD8"
            onClick={() => setOpenRepay(false)}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
          </svg>
        </div>
        <div className="m-auto p-2 border-2 border-[#1E4DD8] max-w-max rounded-xl">
          <Image
            src={showStakeNftDetails[4]}
            width={100}
            height={100}
            alt="profile"
            className="m-auto rounded-xl"
          />
        </div>
        <div className="m-4 nft-token-detials border border-[#1E4DD8] rounded-xl p-4 ">
          <div className="flex flex-row max-w-[100%] justify-between px-2 py-[2px] bg-[#d5def9] ">
            <p className="font-[700] text-[#1E4DD8]">Token Address</p>
            <p className="text-[#000] font-[600]">{showStakeNftDetails[0]}</p>
          </div>
          <div className="flex flex-row max-w-[100%] justify-between px-2 py-[2px]">
            <p className="font-[700] text-[#1E4DD8]">Token Id</p>
            <p className="text-[#000] font-[600]"> {showStakeNftDetails[1]}</p>
          </div>
          <div className="flex flex-row max-w-[100%] justify-between px-2 py-[2px] bg-[#d5def9]">
            <p className="font-[700] text-[#1E4DD8]">Loan Amount</p>
            <p className="text-[#000] font-[600]">100 fDAI</p>
          </div>
          <div className="flex flex-row max-w-[100%] justify-between px-2 py-[2px]">
            <p className="font-[700] text-[#1E4DD8]">Due Loan Amount</p>
            <p className="text-[#000] font-[600]">
              {showStakeNftDetails[5]} fDAI
            </p>
          </div>
          <div className="flex flex-row max-w-[100%] justify-between bg-[#d5def9] py-[2px] px-2">
            <p className="font-[700] text-[#1E4DD8]">Yearly Interest</p>
            <p className="text-[#000] font-[600]">
              {showStakeNftDetails[6]} fDAIx
            </p>
          </div>
          <div className="flex flex-row max-w-[100%] justify-between px-2 py-[2px]">
            <p className="font-[700] text-[#1E4DD8]">Monthly Interest</p>
            <p className="text-[#000] font-[600]">
              {showStakeNftDetails[7]} fDAIx
            </p>
          </div>
        </div>
        <div className="m-4 p-4 flex flex-row items-center">
          <h2 className="font-[700] text-[#1E4DD8] px-2 py-[2px] mr-2 w-[30%]">
            Repay Amount
          </h2>
          <input
            type="number"
            className="px-2 py-[2px] repay-input w-full"
            placeholder="Enter Repay Amount"
            id="amount"
          />
        </div>
        <div className="text-center p-2 sticky bottom-0">
          <button
            className="hover:bg-[#1E4DD8] hover:text-[#ffffff] mb-4 p-1 px-4 rounded-lg font-[600] border-[2px] border-[#1E4DD8] bg-[#ffffff] text-[#1E4DD8] hover:border-[2px] hover:border-[#1E4DD8]"
            onClick={() => repayLoan()}
          >
            Repay
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

export default RepayPopUp;
