import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import heroimg2 from "../public/how-to-buy-nft.png";
// import heroimg from "../public/nft-header-visual.webp";
import heroimg4 from "../public/warren-umoh-YmTIxQbQo4I-unsplash.jpg";
import RepayPopUp from "../components/RepayPopUp";
import StakePopUp from "../components/StakePopUp";

function Assets() {
  const [nftData, setNftData] = useState([]);
  const [nftMetaData, setnftMetaData] = useState([]);
  const [showStakeNftDetails, setStakeNftDetails] = useState([]);
  const [openStake, setOpenStake] = useState(false);
  const [openRepay, setOpenRepay] = useState(false);
  const [showAllNfts, setShowAllNfts] = useState(false);
  const { address } = useAccount();

  const fetchNfts = async () => {
    let url = "https://deep-index.moralis.io/api/v2/" + address + "/nft";
    const options = {
      method: "GET",
      url: url,
      params: {
        chain: "mumbai",
        format: "decimal",
        normalizeMetadata: "false",
      },
      headers: {
        accept: "application/json",
        "X-API-Key":
          "YpaTqOenvaYJpRWGoFjbeZBXrcDRkvijfJaN22Rh6kY0XCib84Oruyvr9jf47Y2M",
      },
    };

    await axios
      .request(options)
      .then(function (response) {
        // console.log(response.data.result);
        // Nftpush(response.data.result);
        for (let i = 0; i < response.data.result.length; i++) {
          // const nft = JSON.parse(item.metadata);
          // console.log(nft);
          if (
            !nftData.find(
              (temp) =>
                response.data.result[i]["block_number"] === temp["block_number"]
            )
          ) {
            nftData.push(response.data.result[i]);
          }
          // nftData.push([item]);
        }
        setNftData(nftData);
        // console.log(nftData);
        for (let i = 0; i < nftData.length; i++) {
          let nft = JSON.parse(nftData[i].metadata);
          if (nftMetaData.length < nftData.length) nftMetaData.push(nft);
        }
        setnftMetaData(nftMetaData);
        // console.log(nft.image);
        setShowAllNfts(true);
        // console.log("inside the api function");
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchNfts();

    if (address) {
      // setProfileComponent(true);
    } else {
      // navigate("/");
    }
    return () => {
      // dataFetchedRef.current = true;
      setShowAllNfts(false);
    };
  }, []);

  useEffect(() => {
    fetchNfts();

    if (address) {
      // setProfileComponent(true);
    } else {
      // navigate("/");
    }
    return () => {
      // dataFetchedRef.current = true;
      setShowAllNfts(false);
    };
  }, [address]);
  if (showAllNfts)
    return (
      <>
        <div className="p-8 text-[#000] grid-parent ">
          {/* ********* map item start ********** */}
          {showAllNfts
            ? nftMetaData.map((item, key) => {
                return (
                  <div key={key}>
                    {" "}
                    <div className="rounded-xl bg-[#16151A] h-[400px] w-[200px] nft-card flex flex-col ">
                      <div className="m-4 max-w-[100%] rounded-xl overflow-hidden">
                        <Image
                          src={item ? item.image : ""}
                          width={280}
                          height={280}
                          alt="randomimage"
                          className="nft-image "
                        />
                      </div>
                      <div className="flex flex-row justify-between m-4 max-w-[100%]">
                        <p className="font-[600] text-center mx-auto text-[1.2rem]">
                          {item ? item.name : ""}
                        </p>
                      </div>
                      <div className="flex flex-row justify-center m-4 max-w-[100%]">
                        <button
                          className="bg-[#1E4DD8] px-6 py-2 mx-2 text-[#ffffff] rounded-lg font-[700] text-[1.1rem]"
                          onClick={() => {
                            setOpenStake(true);
                            setStakeNftDetails(nftData[key]);
                            setOpenRepay(false);
                          }}
                        >
                          Stake NFT
                        </button>

                        {/* <button
                        className="border border-[#1E4DD8] px-6 mx-2 py-2 text-[#1E4DD8] font-[700] text-[1.1rem] rounded-lg"
                        onClick={() => {
                          setOpenStake(false);
                          setStakeNftDetails(nftData[key]);
                          setOpenRepay(true);
                        }}
                      >
                        Repay
                      </button> */}
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
          {openStake ? (
            <StakePopUp
              setOpenStake={setOpenStake}
              showStakeNftDetails={showStakeNftDetails}
            />
          ) : null}
          {/* {openRepay ? (
          <RepayPopUp
            setOpenRepay={setOpenRepay}
            showStakeNftDetails={showStakeNftDetails}
          />
        ) : null} */}

          {/* <div className="rounded-xl bg-[#16151A] h-[400px] w-[200px] nft-card ">
          <div className="m-4 max-w-[100%] rounded-xl overflow-hidden">
            <Image
              src={heroimg2}
              alt="randomimage"
              className="nft-image min-h-[160px] max-h-[160px]"
            />
          </div>
          <div className="flex flex-row justify-between m-4 max-w-[100%]">
            <p>
              Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Minus, sunt?
            </p>
          </div>
          <div className="flex flex-row justify-center m-4 max-w-[100%]">
            <button className="bg-[#1E4DD8] px-6 py-2 mx-2 text-[#ffffff] rounded-lg font-[700] text-[1.1rem]">
              Stake
            </button>
            <button className="border border-[#1E4DD8] px-6 mx-2 py-2 text-[#1E4DD8] font-[700] text-[1.1rem] rounded-lg">
              Repay
            </button>
          </div>
        </div> */}

          {/* ********* map item ends ********** */}
        </div>
      </>
    );
  else
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

export default Assets;
