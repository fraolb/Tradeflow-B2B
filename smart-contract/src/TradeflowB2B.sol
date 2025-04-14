// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TradeflowB2B {
    address public owner;
    mapping(address => bool) public allowedStablecoins; // Whitelisted stablecoins

    enum TxType {
        SENT,
        RECEIVED
    }

    struct Transaction {
        address counterparty; // The other address in the transaction
        address stablecoin;
        uint256 amount;
        uint256 timestamp;
        uint256 blockNumber;
        string reason;
        TxType txType;
    }

    struct UserBook {
        string name;
        Transaction[] transactions;
    }

    mapping(address => UserBook) private userBooks; // Store user transactions

    event PaymentMade(
        address indexed payer,
        address indexed receiver,
        address stablecoin,
        uint256 amount,
        uint256 timestamp
    );

    event NameUpdated(address indexed user, string name);

    constructor(address[] memory _stablecoins) {
        owner = msg.sender;
        for (uint i = 0; i < _stablecoins.length; i++) {
            allowedStablecoins[_stablecoins[i]] = true;
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    function updateStablecoinStatus(
        address token,
        bool status
    ) external onlyOwner {
        allowedStablecoins[token] = status;
    }

    function addName(string memory name) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        userBooks[msg.sender].name = name;
        emit NameUpdated(msg.sender, name);
    }

    function pay(
        address stablecoin,
        address receiver,
        uint256 amount,
        string memory reason
    ) external {
        require(allowedStablecoins[stablecoin], "Token not allowed");
        require(amount > 0, "Amount must be greater than 0");
        require(receiver != address(0), "Invalid receiver");
        require(receiver != msg.sender, "Cannot send to yourself");

        IERC20 token = IERC20(stablecoin);
        require(
            token.transferFrom(msg.sender, receiver, amount),
            "Transfer failed"
        );

        // Record for sender
        userBooks[msg.sender].transactions.push(
            Transaction({
                counterparty: receiver,
                stablecoin: stablecoin,
                amount: amount,
                timestamp: block.timestamp,
                blockNumber: block.number,
                reason: reason,
                txType: TxType.SENT
            })
        );

        // Record for receiver
        userBooks[receiver].transactions.push(
            Transaction({
                counterparty: msg.sender,
                stablecoin: stablecoin,
                amount: amount,
                timestamp: block.timestamp,
                blockNumber: block.number,
                reason: reason,
                txType: TxType.RECEIVED
            })
        );

        emit PaymentMade(
            msg.sender,
            receiver,
            stablecoin,
            amount,
            block.timestamp
        );
    }

    function getUserTransactions(
        address user
    ) external view returns (Transaction[] memory) {
        return userBooks[user].transactions;
    }

    function getUserName(address user) external view returns (string memory) {
        return userBooks[user].name;
    }
}
