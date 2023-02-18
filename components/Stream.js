import React, { useEffect, useState } from "react";
import { getTransactionDescription } from "@superfluid-finance/sdk-core";
import { Framework } from "@superfluid-finance/sdk-core";
import { createClient } from "urql";
import Image from "next/image";
import loop from "../public/stream-loop.gif";
import b1 from "../public/blockies01.webp";
import b2 from "../public/blockies02.webp";
import Web3 from "web3";
import { useAccount } from "wagmi";
import StreamDetailsPopup from "./StreamDetailsPopup";
export const CONTRACT_ADDRESS = "0xd906b953a92fc7cde79efd2b9eb9f3f3d7795d93";

function Stream() {
  // query function to get account streams
  const [totalAmountStreamed, setTotalAmountStreamed] = useState("");
  const [streamUpdatedTimestamp, setStreamUpdatedTimestamp] = useState("");
  const [currentFlowRate, setCurrentFlowRate] = useState();
  const [addCopied, setAddCopied] = useState();
  const [addCopied2, setAddCopied2] = useState();
  const [itemNumber, setItemNumber] = useState();
  //   const [currentFlowRateInfDAIx, setCurrentFlowRateInfDAIx] = useState();
  const [flowHistory, setFlowHistory] = useState([]);
  const [flowHistoryDetails, setFlowHistoryDetails] = useState([]);
  const [showflowHistoryInside, setFlowHistoryInside] = useState(false);

  const { address } = useAccount();
  const loadData = async () => {
    const APIURL =
      "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai";
    let add = address ? address.toLowerCase() : "";
    const allStreams = `
    query MyQuery {
        account(id: "${add}") {
          outflows {
            currentFlowRate
            flowUpdatedEvents(orderBy: timestamp, orderDirection: desc) {
              totalAmountStreamedUntilTimestamp
              totalSenderFlowRate
              flowRate
              timestamp
            }
          }
        }
      }
  `;

    const client = createClient({
      url: APIURL,
    });
    const loadedData_outgoing = await client.query(allStreams).toPromise();

    const data = loadedData_outgoing.data.account.outflows;
    if (data.length > 0) {
      let totalStreamedInWei =
        data[data.length - 1].flowUpdatedEvents[0]
          .totalAmountStreamedUntilTimestamp;
      let totalStreamedInFDAIx = Web3.utils.fromWei(
        totalStreamedInWei,
        "ether"
      );
      console.log(totalStreamedInFDAIx);
      setTotalAmountStreamed(totalStreamedInFDAIx);
      setStreamUpdatedTimestamp(
        data[data.length - 1].flowUpdatedEvents[0].timestamp
      );
      setCurrentFlowRate(data[data.length - 1].currentFlowRate);

      for (let i = 0; i < data[0].flowUpdatedEvents.length; i++) {
        if (data[0].flowUpdatedEvents.length > flowHistory.length) {
          let temp = parseInt(data[0].flowUpdatedEvents[i].timestamp) * 1000;
          let time = new Date(parseInt(temp));
          let year = time.getFullYear();
          let month;
          if (time.getMonth() === 0) {
            month = "JAN";
          } else if (time.getMonth() === 1) {
            month = "FEB";
          } else if (time.getMonth() === 2) {
            month = "MAR";
          } else if (time.getMonth() === 3) {
            month = "APR";
          } else if (time.getMonth() === 4) {
            month = "MAY";
          } else if (time.getMonth() === 5) {
            month = "JUN";
          } else if (time.getMonth() === 6) {
            month = "JUL";
          } else if (time.getMonth() === 7) {
            month = "AUG";
          } else if (time.getMonth() === 8) {
            month = "SEP";
          } else if (time.getMonth() === 9) {
            month = "OCT";
          } else if (time.getMonth() === 10) {
            month = "NOV";
          } else if (time.getMonth() === 11) {
            month = "DEC";
          }

          let dt = time.getDate();
          let flowRT = Web3.utils.fromWei(
            data[0].flowUpdatedEvents[i].flowRate.toString(),
            "ether"
          );
          let tAS = Web3.utils.fromWei(
            data[0].flowUpdatedEvents[
              i
            ].totalAmountStreamedUntilTimestamp.toString(),
            "ether"
          );
          flowHistory.push({
            flowRate: flowRT,
            timestamp: `${month} ${dt} ${year}`,
            totalAmountStreamedUntilTimestamp: tAS,
          });
        }
      }
    }
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let arr = [];
        if (data.length > flowHistoryDetails.length) {
          for (let j = 0; j < data[i].flowUpdatedEvents.length; j++) {
            let temp = parseInt(data[i].flowUpdatedEvents[j].timestamp) * 1000;
            let time = new Date(parseInt(temp));
            let year = time.getFullYear();
            let month;
            if (time.getMonth() === 0) {
              month = "JAN";
            } else if (time.getMonth() === 1) {
              month = "FEB";
            } else if (time.getMonth() === 2) {
              month = "MAR";
            } else if (time.getMonth() === 3) {
              month = "APR";
            } else if (time.getMonth() === 4) {
              month = "MAY";
            } else if (time.getMonth() === 5) {
              month = "JUN";
            } else if (time.getMonth() === 6) {
              month = "JUL";
            } else if (time.getMonth() === 7) {
              month = "AUG";
            } else if (time.getMonth() === 8) {
              month = "SEP";
            } else if (time.getMonth() === 9) {
              month = "OCT";
            } else if (time.getMonth() === 10) {
              month = "NOV";
            } else if (time.getMonth() === 11) {
              month = "DEC";
            }

            let dt = time.getDate();
            let flowRT = Web3.utils.fromWei(
              data[i].flowUpdatedEvents[j].flowRate.toString(),
              "ether"
            );
            let tAS = Web3.utils.fromWei(
              data[i].flowUpdatedEvents[
                j
              ].totalAmountStreamedUntilTimestamp.toString(),
              "ether"
            );

            arr.push({
              flowRate: flowRT,
              timestamp: `${month} ${dt} ${year}`,
              totalAmountStreamedUntilTimestamp: tAS,
            });
          }
          flowHistoryDetails.push(arr);
        }
      }
    }
    console.log(data);
  };

  useEffect(() => {
    if (address) loadData();
    // Counter();
  }, []);

  useEffect(() => {
    const Counter = () => {
      if (currentFlowRate) {
        console.log(flowHistoryDetails);
        // console.log(currentFlowRate);
        let currentRateInfDAIx = Web3.utils.fromWei(
          currentFlowRate.toString(),
          "ether"
        );
        let currentTime = Date.now() / 1000;
        // console.log(currentTime);
        // console.log(streamUpdatedTimestamp);
        let number = 0;
        let different = currentTime - streamUpdatedTimestamp;
        // console.log(parseInt(different));
        // console.log(typeof different);
        // console.log(currentFlowRate);
        let diffFlowRateInWei = parseInt(different) * parseInt(currentFlowRate);
        // console.log("dfrt", diffFlowRateInWei);
        // console.log(typeof diffFlowRateInWei);
        let diffFlowRateInfDAIx = Web3.utils.fromWei(
          diffFlowRateInWei.toString(),
          "ether"
        );
        // console.log(diffFlowRateInfDAIx);
        // console.log(typeof diffFlowRateInfDAIx);
        // console.log("currentTime", diffFlowRateInfDAIx);
        // console.log(typeof diffFlowRateInfDAIx);
        let finalStreamed =
          totalAmountStreamed + parseFloat(diffFlowRateInfDAIx);

        // console.log(finalStreamed);
        // console.log(typeof finalStreamed);
        setInterval(function () {
          finalStreamed =
            parseFloat(finalStreamed) + parseFloat(currentRateInfDAIx);
          setTotalAmountStreamed(finalStreamed);
          //   number++;
          //   console.log(finalStreamed);
          //   if (number === 20) clearInterval(this);
        }, 1000);
      }
    };
    if (currentFlowRate) Counter();
  }, [currentFlowRate]);

  const copyContent = async (n) => {
    if (address)
      try {
        await navigator.clipboard.writeText(address);
        if (n === 1) {
          setAddCopied(true);
          setTimeout(() => {
            setAddCopied(false);
          }, 1500);
        } else {
          setAddCopied2(true);
          setTimeout(() => {
            setAddCopied2(false);
          }, 1500);
        }
        console.log("Content copied to clipboard");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
  };
  useEffect(() => {
    console.log(itemNumber);
  }, [itemNumber]);

  return (
    <div className="flex flex-col justify-center items-center pt-[5rem] relative z-[49]">
      <span>Total Amount Streamed</span>
      <h1 className="text-[2.5rem] font-[700] my-4">
        {totalAmountStreamed
          ? parseFloat(totalAmountStreamed).toFixed(14)
          : "0"}{" "}
        <span className="ml-2 text-[#f3f4f6] font-[500] text-[1.5rem]">
          fDAIx
        </span>
      </h1>
      <div className="flex flex-col gap-[10px]">
        <div className="flex flex-row justify-between">
          <span>Sender</span>
          <span>Receiver</span>
        </div>
        {address && currentFlowRate ? (
          <div className="flex -flex-row items-center">
            <div className="flex flex-row gap-[1rem] p-4 items-center border border-white rounded-lg bg-white">
              <Image
                src={b2}
                alt="superfluid-loop-gif"
                width="36px"
                height="36px"
                className="max-w-[36px] rounded-lg"
              ></Image>
              <span className="text-[#1E4DD8] font-[600]">
                {address
                  ? address.substring(0, 6) +
                    "..." +
                    address.substring(address.length - 5, address.length)
                  : ""}
              </span>
              <span className="flex gap-1 ml-auto">
                {/* copy address svg */}
                {addCopied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enable-background="new 0 0 20 20"
                    height="18px"
                    viewBox="0 0 20 20"
                    width="18px"
                    fill="#1E4DD8"
                  >
                    <g>
                      <rect fill="none" height="20" width="20" />
                    </g>
                    <g>
                      <path d="M18,10l-1.77-2.03l0.25-2.69l-2.63-0.6l-1.37-2.32L10,3.43L7.53,2.36L6.15,4.68L3.53,5.28l0.25,2.69L2,10l1.77,2.03 l-0.25,2.69l2.63,0.6l1.37,2.32L10,16.56l2.47,1.07l1.37-2.32l2.63-0.6l-0.25-2.69L18,10z M13.18,8.47l-4.24,4.24 c-0.2,0.2-0.51,0.2-0.71,0L6.82,11.3c-0.2-0.2-0.2-0.51,0-0.71s0.51-0.2,0.71,0l1.06,1.06l3.89-3.89c0.2-0.2,0.51-0.2,0.71,0 S13.38,8.28,13.18,8.47z" />
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enableBackground="new 0 0 24 24"
                    height="18px"
                    viewBox="0 0 24 24"
                    width="18px"
                    fill="#000000"
                    className="cursor-pointer"
                    onClick={() => copyContent(1)}
                  >
                    <g>
                      <rect fill="none" height="24" width="24" />
                    </g>
                    <g>
                      <path d="M15,20H5V7c0-0.55-0.45-1-1-1h0C3.45,6,3,6.45,3,7v13c0,1.1,0.9,2,2,2h10c0.55,0,1-0.45,1-1v0C16,20.45,15.55,20,15,20z M20,16V4c0-1.1-0.9-2-2-2H9C7.9,2,7,2.9,7,4v12c0,1.1,0.9,2,2,2h9C19.1,18,20,17.1,20,16z M18,16H9V4h9V16z" />
                    </g>
                  </svg>
                )}
                {/* open in explorer option svg*/}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 0 24 24"
                  width="18px"
                  fill="#000000"
                  className="cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://mumbai.polygonscan.com/address/${address}`
                    )
                  }
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z" />
                </svg>
              </span>
            </div>
            <Image
              src={loop}
              alt="superfluid-loop-gif"
              className="max-h-[48px]"
            ></Image>
            <div className="flex flex-row gap-[1rem] p-4 items-center border border-white rounded-lg bg-white">
              <Image
                src={b1}
                alt="superfluid-loop-gif"
                width="36px"
                height="36px"
                className="max-w-[36px] rounded-lg"
              ></Image>
              <span className="text-[#1E4DD8] font-[600]">
                {CONTRACT_ADDRESS
                  ? CONTRACT_ADDRESS.substring(0, 6) +
                    "..." +
                    CONTRACT_ADDRESS.substring(
                      CONTRACT_ADDRESS.length - 5,
                      CONTRACT_ADDRESS.length
                    )
                  : ""}
              </span>
              <span className="flex gap-1 ml-auto">
                {/* copy address svg */}
                {addCopied2 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enable-background="new 0 0 20 20"
                    height="18px"
                    viewBox="0 0 20 20"
                    width="18px"
                    fill="#1E4DD8"
                  >
                    <g>
                      <rect fill="none" height="20" width="20" />
                    </g>
                    <g>
                      <path d="M18,10l-1.77-2.03l0.25-2.69l-2.63-0.6l-1.37-2.32L10,3.43L7.53,2.36L6.15,4.68L3.53,5.28l0.25,2.69L2,10l1.77,2.03 l-0.25,2.69l2.63,0.6l1.37,2.32L10,16.56l2.47,1.07l1.37-2.32l2.63-0.6l-0.25-2.69L18,10z M13.18,8.47l-4.24,4.24 c-0.2,0.2-0.51,0.2-0.71,0L6.82,11.3c-0.2-0.2-0.2-0.51,0-0.71s0.51-0.2,0.71,0l1.06,1.06l3.89-3.89c0.2-0.2,0.51-0.2,0.71,0 S13.38,8.28,13.18,8.47z" />
                    </g>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enableBackground="new 0 0 24 24"
                    height="18px"
                    viewBox="0 0 24 24"
                    width="18px"
                    fill="#000000"
                    className="cursor-pointer"
                    onClick={() => copyContent()}
                  >
                    <g>
                      <rect fill="none" height="24" width="24" />
                    </g>
                    <g>
                      <path d="M15,20H5V7c0-0.55-0.45-1-1-1h0C3.45,6,3,6.45,3,7v13c0,1.1,0.9,2,2,2h10c0.55,0,1-0.45,1-1v0C16,20.45,15.55,20,15,20z M20,16V4c0-1.1-0.9-2-2-2H9C7.9,2,7,2.9,7,4v12c0,1.1,0.9,2,2,2h9C19.1,18,20,17.1,20,16z M18,16H9V4h9V16z" />
                    </g>
                  </svg>
                )}
                {/* open in explorer option svg*/}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 0 24 24"
                  width="18px"
                  fill="#000000"
                  className="cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://mumbai.polygonscan.com/address/${address}`
                    )
                  }
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z" />
                </svg>
              </span>
            </div>
          </div>
        ) : (
          "Connect Your Wallet"
        )}
        <div className="max-w-max my-4 mx-auto">
          <button
            onClick={() =>
              window.open(
                `https://app.superfluid.finance/stream/polygon-mumbai/${address}-0xd906b953a92fc7cde79efd2b9eb9f3f3d7795d93-0x5d8b4c2554aeb7e86f387b4d6c00ac33499ed01f`
              )
            }
          >
            View More
          </button>
        </div>
      </div>
      <div className="w-full p-[2rem]">
        <h3 className="font-[700] text-[1.2rem]">Past Transaction</h3>
        <table className="w-full border mt-4">
          <thead className="bg-white text-[#1E4DD8] ">
            <tr>
              <th className="text-left p-2">To/From</th>
              <th className="text-left p-2">Flow Rate</th>
              <th className="text-left p-2">Total Streamed</th>
              <th className="text-left p-2">Start/end Time</th>
              <th className="text-left p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {flowHistory.length > 0 ? (
              <>
                <tr className="border-b">
                  <td className="text-left p-2 text-[0.865rem]">
                    {CONTRACT_ADDRESS
                      ? CONTRACT_ADDRESS.substring(0, 6) +
                        "..." +
                        CONTRACT_ADDRESS.substring(
                          CONTRACT_ADDRESS.length - 5,
                          CONTRACT_ADDRESS.length
                        )
                      : ""}
                  </td>
                  <td className="text-left p-2 text-[0.865rem]">
                    {flowHistory ? flowHistory[1].flowRate : "0"} fDAIx
                  </td>
                  <td className="text-left p-2 text-[0.865rem]">
                    {flowHistory
                      ? flowHistory[0].totalAmountStreamedUntilTimestamp
                      : "0"}
                    fDAIx
                  </td>
                  <td className="text-left p-2 text-[0.865rem]">
                    <p>{flowHistory ? flowHistory[0].timestamp : ""}</p>
                    <p>
                      {flowHistory
                        ? flowHistory[flowHistory.length - 1].timestamp
                        : ""}
                    </p>
                  </td>
                  <td className="items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 0 24 24"
                      width="18px"
                      fill="#ffffff"
                      className="hover:bg-white hover:fill-[#1E4DD8] rounded cursor-pointer"
                      onClick={() => {
                        setFlowHistoryInside(!showflowHistoryInside);
                      }}
                    >
                      <path d="M24 24H0V0h24v24z" fill="none" opacity=".87" />
                      <path d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z" />
                    </svg>
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan={4}>History not available</td>
              </tr>
            )}
            {flowHistoryDetails.length > 0 ? (
              <>
                {flowHistoryDetails.map((item, key) => {
                  return (
                    <tr className="border-b" key={key}>
                      <td className="text-left p-2 text-[0.865rem]">
                        {CONTRACT_ADDRESS
                          ? CONTRACT_ADDRESS.substring(0, 6) +
                            "..." +
                            CONTRACT_ADDRESS.substring(
                              CONTRACT_ADDRESS.length - 5,
                              CONTRACT_ADDRESS.length
                            )
                          : ""}
                      </td>
                      <td className="text-left p-2 text-[0.865rem]">
                        {flowHistory ? flowHistory[1].flowRate : "0"} fDAIx
                      </td>
                      <td className="text-left p-2 text-[0.865rem]">
                        {item[0].totalAmountStreamedUntilTimestamp}
                        fDAIx
                      </td>
                      <td className="text-left p-2 text-[0.865rem]">
                        <p>{item[0].timestamp}</p>
                        <p>
                          {flowHistory
                            ? flowHistory[flowHistory.length - 1].timestamp
                            : ""}
                        </p>
                      </td>
                      <td className="items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="18px"
                          viewBox="0 0 24 24"
                          width="18px"
                          fill="#ffffff"
                          className="hover:bg-white hover:fill-[#1E4DD8] rounded cursor-pointer"
                          onClick={() => {
                            setItemNumber(key);
                            setFlowHistoryInside(!showflowHistoryInside);
                          }}
                        >
                          <path
                            d="M24 24H0V0h24v24z"
                            fill="none"
                            opacity=".87"
                          />
                          <path d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z" />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  History not available
                </td>
              </tr>
            )}
            {/* {displayFlowDetails} */}
          </tbody>
        </table>
        {showflowHistoryInside ? (
          <StreamDetailsPopup
            flowHistoryDetails={flowHistoryDetails}
            itemNumber={itemNumber}
            setFlowHistoryInside={setFlowHistoryInside}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Stream;
