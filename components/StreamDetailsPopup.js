import React from "react";
export const CONTRACT_ADDRESS = "0xd906b953a92fc7cde79efd2b9eb9f3f3d7795d93";

function StreamDetailsPopup({
  flowHistoryDetails,
  itemNumber,
  setFlowHistoryInside,
}) {
  return (
    <div>
      <div
        className="popup_stream relative rounded-md overflow-hidden p-4"
        id="notification-box"
      >
        <div className="stream-table">
          <table className="w-full border border-[#404040]">
            <thead className="bg-[#1E4DD8] text-white border-b border-[#404040]">
              <tr>
                <th className="text-left p-2">To/From</th>
                <th className="text-left p-2">Flow Rate</th>
                <th className="text-left p-2">Total Streamed</th>
                <th className="text-left p-2">Start/end Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4}></td>
              </tr>
              {flowHistoryDetails[itemNumber].map((item, key) => {
                return (
                  <tr key={key} className="border-b border-[#404040]">
                    <td className="text-left p-2  text-black">
                      {CONTRACT_ADDRESS
                        ? CONTRACT_ADDRESS.substring(0, 6) +
                          "..." +
                          CONTRACT_ADDRESS.substring(
                            CONTRACT_ADDRESS.length - 5,
                            CONTRACT_ADDRESS.length
                          )
                        : ""}
                    </td>
                    <td className="text-left p-2">
                      {item.flowRate} <span className="text-black">fDAIx</span>
                    </td>
                    <td className="text-left p-2">
                      {item.totalAmountStreamedUntilTimestamp}{" "}
                      <span className="text-black">fDAIx</span>
                    </td>
                    <td className="text-left p-2 text-black ">
                      {item.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="overlay2"
        onClick={() => setFlowHistoryInside(false)}
      ></div>
    </div>
  );
}

export default StreamDetailsPopup;
