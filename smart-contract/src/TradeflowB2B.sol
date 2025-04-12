// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TradeflowB2B {
    address public owner;
    mapping(address => bool) public allowedStablecoins; // Whitelisted stablecoins

    struct Transaction {
        address receiver;
        address stablecoin;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Transaction[]) public userTransactions; // Store user transactions

    event PaymentMade(
        address indexed payer,
        address indexed receiver,
        address stablecoin,
        uint256 amount,
        uint256 timestamp
    );

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

    function pay(
        address stablecoin,
        address receiver,
        uint256 amount
    ) external {
        require(allowedStablecoins[stablecoin], "Token not allowed");
        require(amount > 0, "Amount must be greater than 0");
        require(receiver != address(0), "Invalid receiver");

        IERC20 token = IERC20(stablecoin);
        require(
            token.transferFrom(msg.sender, receiver, amount),
            "Transfer failed"
        );

        Transaction memory newTransaction = Transaction({
            receiver: receiver,
            stablecoin: stablecoin,
            amount: amount,
            timestamp: block.timestamp
        });

        userTransactions[msg.sender].push(newTransaction);
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
        return userTransactions[user];
    }
}
