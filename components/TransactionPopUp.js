import React from "react";

function TransactionPopUp({
  setLoading,
  transactionUpdates,
  setTransactionUpdates,
  showErrorInTrans,
  setErrorInTrans,
}) {
  return (
    <div>
      <div
        className="popup-2 relative rounded-md overflow-hidden "
        id="notification-box"
      >
        <div className="flex justify-center w-full text-[#1E4DD8] p-4 font-[700] items-center sticky top-0 ">
          {/* <h1 className=" text-[1.5rem]">STAKE</h1> */}
          <svg
            className="cursor-pointer absolute right-[20px] top-[20px]"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#ffffff"
            onClick={() => {
              setTransactionUpdates();
              setErrorInTrans();
              setLoading(false);
            }}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
          </svg>
        </div>
        {showErrorInTrans ? (
          <>
            <p className="absolute left-[20px] top-[20px] text-[#ffffff] font-[600]">
              Error
            </p>
            <h1 className="max-w-[50%] text-center mx-auto text-[#ffffff] font-[600] text-[1.2rem] my-8">
              {showErrorInTrans}
            </h1>
            <div className="text-center p-2 sticky bottom-0">
              <button
                className="bg-[#ffffff] text-[#1e4dd8] px-8 py-2 my-4 font-[600] rounded-xl"
                onClick={() => {
                  setTransactionUpdates();
                  setErrorInTrans();
                  setLoading(false);
                }}
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="m-auto p-2 max-w-max rounded-xl">
              <div class="lds-roller my-[20px]">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <h1 className="max-w-[50%] text-center mx-auto text-[#ffffff] font-[600] text-[1.2rem]">
              Waiting for the transaction to get confirmed...
            </h1>
            <p className="max-w-[70%] my-4 text-center mx-auto text-[#ffffffc7] font-[600] text-[1.1rem]">
              {transactionUpdates}
            </p>
          </>
        )}
      </div>
      <div
        className="overlay"
        onClick={() => {
          setTransactionUpdates();
          setErrorInTrans();
          setLoading(false);
        }}
      ></div>
    </div>
  );
}

export default TransactionPopUp;
