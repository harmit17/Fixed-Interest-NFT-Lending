// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721Receiver.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import "https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import "https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperApp.sol";

contract NFTStake is IERC721Receiver {
    using SuperTokenV1Library for ISuperToken;

    struct Stake {
        address tokenAddress;
        uint256 tokenId;
        string tokenName;
        string tokenDescription;
        string tokenImage;
    }
    mapping(address => Stake[]) public userToStakeArray;
    mapping(address => mapping(uint256 => bool)) public hasBorrowed;
    mapping(address => mapping(uint256 => bool)) public hasStaked;
    mapping(address => mapping(uint256 => uint256))
        public amountBorrowedForToken;
    mapping(address => uint256) public totalLoanAmount;

    // mapping (address=>uint) public userFlowRate;

    function increaseContractBalace(uint256 _amount) public {
        IERC20(0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
    }

    /// @param _user is the address of the user who wants to stake the NFT, _tokenAddress
    // is the address of the NFT which user wants to stake, _tokenID is the tokenId
    // of the NFT
    function depositNFT(
        address _user,
        address _tokenAddress,
        uint256 _tokenID,
        string memory _tokenName,
        string memory _tokenDescription,
        string memory _tokenImage
    ) public {
        require(
            !hasStaked[_tokenAddress][_tokenID],
            "Oops!, you already staked this NFT!"
        );
        userToStakeArray[_user].push(
            Stake(
                _tokenAddress,
                _tokenID,
                _tokenName,
                _tokenDescription,
                _tokenImage
            )
        );
        ERC721(_tokenAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenID
        );
        hasStaked[_tokenAddress][_tokenID] = true;
        borrow(_user, _tokenAddress, _tokenID);
    }

    function borrow(
        address user,
        address _tokenAddress,
        uint256 _tokenID
    ) public {
        require(
            !hasBorrowed[_tokenAddress][_tokenID],
            "Oops!, already borrowed against this NFT"
        );
        require(
            hasStaked[_tokenAddress][_tokenID],
            "you have to stake NFT first!"
        );
        IERC20(0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7).transfer(
            user,
            100 * 10**18
        );
        amountBorrowedForToken[_tokenAddress][_tokenID] = 100;
        totalLoanAmount[user] += 100;
        hasBorrowed[_tokenAddress][_tokenID] = true;
    }

    // function calculateInterest(address user) public {
    //     uint totalBorrowedAmount;
    //     for (uint i=0;i<userToStakeArray[user].length;i++){
    //         totalBorrowedAmount+=userToStakeArray[user][i].amountBorrowed;
    //     }
    //     uint yearlyInterest=totalBorrowedAmount*10/100;
    //     userFlowRate[user]=(yearlyInterest/12)*10**18;
    // }

    function repay(
        address _user,
        address _tokenAddress,
        uint256 _tokenID,
        uint256 amount
    ) public {
        IERC20(0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7).transferFrom(
            msg.sender,
            address(this),
            100 * 10**18
        );
        amountBorrowedForToken[_tokenAddress][_tokenID] -= amount;
        totalLoanAmount[_user] -= amount;
        if (amountBorrowedForToken[_tokenAddress][_tokenID] == 0) {
            if (hasStaked[_tokenAddress][_tokenID]) {
                hasBorrowed[_tokenAddress][_tokenID] = false;
                unstakeNFT(_tokenAddress, _tokenID);
            }
        }
    }

    function unstakeNFT(address _tokenAddress, uint256 _tokenID) public {
        require(
            hasStaked[_tokenAddress][_tokenID],
            "you have to stake NFT first!"
        );
        require(
            !hasBorrowed[_tokenAddress][_tokenID],
            "you can't unstake, repay your loan first!"
        );
        ERC721(_tokenAddress).safeTransferFrom(
            address(this),
            msg.sender,
            _tokenID
        );
        hasStaked[_tokenAddress][_tokenID] = false;
    }

    function createFlowIntoContract(ISuperToken token, int96 flowRate)
        external
    {
        token.createFlowFrom(msg.sender, address(this), flowRate);
    }

    function updateFlowIntoContract(ISuperToken token, int96 flowRate)
        external
    {
        token.updateFlowFrom(msg.sender, address(this), flowRate);
    }

    function deleteFlowIntoContract(ISuperToken token) external {
        token.deleteFlow(msg.sender, address(this));
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function getStakeStructArray(address _user)
        public
        view
        returns (Stake[] memory)
    {
        return userToStakeArray[_user];
    }

    function checkBorrowed(address _tokenAddress, uint256 _tokenID)
        public
        view
        returns (bool)
    {
        return hasBorrowed[_tokenAddress][_tokenID];
    }

    function checkStaked(address _tokenAddress, uint256 _tokenID)
        public
        view
        returns (bool)
    {
        return hasStaked[_tokenAddress][_tokenID];
    }

    function getLoanAmountForToken(address _tokenAddress, uint256 _tokenID)
        public
        view
        returns (uint256)
    {
        return amountBorrowedForToken[_tokenAddress][_tokenID];
    }

    function getTotalLoanAmount(address _user) public view returns (uint256) {
        return totalLoanAmount[_user];
    }
}
