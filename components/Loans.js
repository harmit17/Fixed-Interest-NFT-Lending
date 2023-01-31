import React from "react";
import axios from "axios";
import Image from "next/image";
import RepayPopUp from "../components/RepayPopUp";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import contract from "../artifacts/NFTStake.json";
import TransactionPopUp from "./TransactionPopUp";
export const CONTRACT_ADDRESS = "0xD906B953a92FC7Cde79eFd2b9EB9f3f3D7795D93";

function Loans() {
  const { address } = useAccount();
  const [showStakeNftDetails, setStakeNftDetails] = useState([]);

  const [openRepay, setOpenRepay] = useState(false);

  // contract integration
  const [nftData, setNftData] = useState([]);
  const [loadData, setLoadData] = useState(false);

  // show all loans
  const showStakedNFTs = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }

        // get all staked nfts
        const con = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
        const loanData = await con.getStakeStructArray(address);
        console.log(loanData);
        for (let i = 0; i < loanData.length; i++) {
          let isStaked = await con.checkStaked(loanData[i][0], loanData[i][1]);
          let dueAmount = await con.getLoanAmountForToken(
            loanData[i][0],
            loanData[i][1]
          );
          let converted_dueAmount = parseInt(dueAmount._hex, 16);
          let yearlyInterestRate = (converted_dueAmount * 10) / 100;
          let monthlyInterestRate = yearlyInterestRate / 12;
          // if (!nftData.find((temp) => loadData[i][1] === temp[1])) {
          if (isStaked) {
            nftData.push([
              loanData[i][0],
              parseInt(loanData[i][1]._hex, 16),
              loanData[i][2],
              loanData[i][3],
              loanData[i][4],
              converted_dueAmount,
              yearlyInterestRate,
              monthlyInterestRate,
            ]);
          }
          // }
        }
        setNftData(nftData);
        setLoadData(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const [nftMetaData, setnftMetaData] = useState([]);
  // const [showAllNfts, setShowAllNfts] = useState(false);

  // temp function
  // const fetchNfts = async () => {
  //   let url = "https://deep-index.moralis.io/api/v2/" + address + "/nft";
  //   const options = {
  //     method: "GET",
  //     url: url,
  //     params: {
  //       chain: "mumbai",
  //       format: "decimal",
  //       normalizeMetadata: "false",
  //     },
  //     headers: {
  //       accept: "application/json",
  //       "X-API-Key":
  //         "YpaTqOenvaYJpRWGoFjbeZBXrcDRkvijfJaN22Rh6kY0XCib84Oruyvr9jf47Y2M",
  //     },
  //   };

  //   await axios
  //     .request(options)
  //     .then(function (response) {
  //       // console.log(response.data.result);
  //       // Nftpush(response.data.result);
  //       for (let i = 0; i < response.data.result.length; i++) {
  //         // const nft = JSON.parse(item.metadata);
  //         // console.log(nft);
  //         if (
  //           !nftData.find(
  //             (temp) =>
  //               response.data.result[i]["block_number"] === temp["block_number"]
  //           )
  //         ) {
  //           nftData.push(response.data.result[i]);
  //         }
  //         // nftData.push([item]);
  //       }
  //       setNftData(nftData);
  //       // console.log(nftData);
  //       for (let i = 0; i < nftData.length; i++) {
  //         let nft = JSON.parse(nftData[i].metadata);
  //         if (nftMetaData.length < nftData.length) nftMetaData.push(nft);
  //       }
  //       setnftMetaData(nftMetaData);
  //       // console.log(nft.image);
  //       setShowAllNfts(true);
  //       setLoadData(true);

  //       // console.log("inside the api function");
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };

  // useEffect(() => {
  //   fetchNfts();

  //   if (address) {
  //     // setProfileComponent(true);
  //   } else {
  //     // navigate("/");
  //   }
  //   return () => {
  //     // dataFetchedRef.current = true;
  //     setShowAllNfts(false);
  //   };
  // }, []);

  // useEffect(() => {
  //   fetchNfts();

  //   if (address) {
  //     // setProfileComponent(true);
  //   } else {
  //     // navigate("/");
  //   }
  //   return () => {
  //     // dataFetchedRef.current = true;
  //     setShowAllNfts(false);
  //   };
  // }, [address]);

  useEffect(() => {
    showStakedNFTs();
  }, []);

  if (loadData) {
    return (
      <>
        <div className="p-8 text-[#000] grid-parent-2 ">
          {/* ********* map item start ********** */}
          {nftData.length > 0 ? (
            nftData.map((item, key) => {
              return (
                <div key={key}>
                  {" "}
                  <div className="rounded-xl bg-[#16151A]  w-[500px] nft-card-2 flex flex-row items-center max-w-[550px]">
                    <div className="m-4 max-w-[100%] rounded-xl overflow-hidden min-w-[100px]">
                      <Image
                        src={item[4]}
                        width={100}
                        height={100}
                        alt="randomimage"
                        className="nft-image "
                      />
                    </div>
                    <div className="flex flex-col justify-between m-2 max-w-[70%] leading-tight text-gray-500">
                      <p className="font-[700] text-ellipsis--2 text-[#000]">
                        {item[2]}
                      </p>
                      <p className="font-[600] text-ellipsis--2 font-[0.665rem] mt-2 ">
                        Loan Amount -
                        <span className="text-[#1E4DD8] font-[700] font-[0.665rem] ml-2">
                          {"100 fDAI"}
                        </span>
                      </p>
                      <p className="font-[600] font-[0.665rem]">
                        Loan Interest -
                        <span className="text-[#1E4DD8] font-[700] font-[0.665rem] ml-2">
                          {item[6]} fDAIx / year (10% APR)
                        </span>
                      </p>
                      <p className="font-[600] font-[0.665rem]">
                        Due Amount -
                        <span className="text-[#1E4DD8] font-[700] font-[0.665rem] ml-2">
                          {item[5]} fDAI
                        </span>
                      </p>
                    </div>
                    <div className="ml-auto m-2 max-w-[100%]">
                      <button
                        className="border hover:border-[#1E4DD8] bg-[#1E4DD8] hover:bg-[#fff] px-6 mx-2 py-2 text-[#fff] hover:text-[#1E4DD8] font-[700] text-[1.1rem] rounded-lg h-3/5"
                        onClick={() => {
                          // setOpenStake(false);
                          setStakeNftDetails(nftData[key]);
                          setOpenRepay(true);
                        }}
                      >
                        Repay
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-[#ffffff] font-600 text-center text-[1.3rem] my-20 max-w-[50%] mx-auto">
              Currently, you don&lsquo;t have any loans! Stake your NFT and take
              a loan with fixed interest.
            </p>
          )}
          {openRepay ? (
            <RepayPopUp
              setOpenRepay={setOpenRepay}
              showStakeNftDetails={showStakeNftDetails}
            />
          ) : null}

          {/* ********* map item ends ********** */}
        </div>
      </>
    );
  } else {
    return (
      <div className="flex flex-col w-full h-full min-h-[400px] justify-center items-center">
        <div className="lds-ring my-[40px]">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}
export default Loans;
