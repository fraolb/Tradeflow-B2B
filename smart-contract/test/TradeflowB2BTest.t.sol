// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TradeflowB2B} from "../src/TradeflowB2B.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {HelperConfig} from "../script/HelperConfig.s.sol";

contract TradeflowB2BTest is Test {
    TradeflowB2B public tradeflow;
    HelperConfig public helperConfig;
    address[] public stablecoins;

    address public owner = makeAddr("owner");
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    function setUp() public {
        vm.startPrank(owner);
        helperConfig = new HelperConfig();
        stablecoins = helperConfig.getConfigByChainId(block.chainid);
        tradeflow = new TradeflowB2B(stablecoins);
        vm.stopPrank();
    }

    // Helper function to fund an address with stablecoin
    function fundUser(
        address user,
        address stablecoin,
        uint256 amount
    ) internal {
        vm.startPrank(user);
        deal(stablecoin, user, amount);
        vm.stopPrank();
    }

    // Test constructor
    function testConstructorSetsOwner() public {
        assertEq(tradeflow.owner(), owner);
    }

    function testConstructorWhitelistsStablecoins() public {
        for (uint i = 0; i < stablecoins.length; i++) {
            assertTrue(tradeflow.allowedStablecoins(stablecoins[i]));
        }
    }

    // Test stablecoin management
    function testOwnerCanUpdateStablecoinStatus() public {
        address newToken = makeAddr("newToken");
        vm.prank(owner);
        tradeflow.updateStablecoinStatus(newToken, true);
        assertTrue(tradeflow.allowedStablecoins(newToken));
    }

    function testNonOwnerCannotUpdateStablecoinStatus() public {
        address newToken = makeAddr("newToken");
        vm.prank(alice);
        vm.expectRevert("Not contract owner");
        tradeflow.updateStablecoinStatus(newToken, true);
    }

    // Test name management
    function testUserCanAddName() public {
        string memory name = "Alice";
        vm.prank(alice);
        tradeflow.addName(name);
        assertEq(tradeflow.getUserName(alice), name);
    }

    function testCannotAddEmptyName() public {
        vm.prank(alice);
        vm.expectRevert("Name cannot be empty");
        tradeflow.addName("");
    }

    // Test payment functionality
    function testPaymentWorksWithAllowedToken() public {
        address stablecoin = stablecoins[0];
        uint256 amount = 100 ether;

        // Fund Alice
        fundUser(alice, stablecoin, amount);

        // Approve and make payment
        vm.startPrank(alice);
        IERC20(stablecoin).approve(address(tradeflow), amount);
        tradeflow.pay(stablecoin, bob, amount, "Test payment");
        vm.stopPrank();

        // Check balances
        assertEq(IERC20(stablecoin).balanceOf(alice), 0);
        assertEq(IERC20(stablecoin).balanceOf(bob), amount);
    }

    function testPaymentFailsWithUnallowedToken() public {
        address invalidToken = makeAddr("invalidToken");
        uint256 amount = 100 ether;

        vm.prank(alice);
        vm.expectRevert("Token not allowed");
        tradeflow.pay(invalidToken, bob, amount, "Test payment");
    }

    function testPaymentFailsWithZeroAmount() public {
        address stablecoin = stablecoins[0];

        vm.prank(alice);
        vm.expectRevert("Amount must be greater than 0");
        tradeflow.pay(stablecoin, bob, 0, "Test payment");
    }

    function testPaymentFailsWithInvalidReceiver() public {
        address stablecoin = stablecoins[0];
        uint256 amount = 100 ether;

        vm.prank(alice);
        vm.expectRevert("Invalid receiver");
        tradeflow.pay(stablecoin, address(0), amount, "Test payment");
    }

    function testPaymentFailsWhenSendingToSelf() public {
        address stablecoin = stablecoins[0];
        uint256 amount = 100 ether;

        vm.prank(alice);
        vm.expectRevert("Cannot send to yourself");
        tradeflow.pay(stablecoin, alice, amount, "Test payment");
    }

    function testPaymentRecordsTransactionsCorrectly() public {
        address stablecoin = stablecoins[0];
        uint256 amount = 100 ether;

        // Fund Alice
        fundUser(alice, stablecoin, amount);

        // Make payment
        vm.startPrank(alice);
        IERC20(stablecoin).approve(address(tradeflow), amount);
        tradeflow.pay(stablecoin, bob, amount, "Test payment");
        vm.stopPrank();

        // Check transactions
        TradeflowB2B.Transaction[] memory aliceTxns = tradeflow
            .getUserTransactions(alice);
        TradeflowB2B.Transaction[] memory bobTxns = tradeflow
            .getUserTransactions(bob);

        assertEq(aliceTxns.length, 1);
        assertEq(bobTxns.length, 1);

        assertEq(aliceTxns[0].counterparty, bob);
        assertEq(aliceTxns[0].stablecoin, stablecoin);
        assertEq(aliceTxns[0].amount, amount);
        assertEq(aliceTxns[0].txType, TradeflowB2B.TxType.SENT);

        assertEq(bobTxns[0].counterparty, alice);
        assertEq(bobTxns[0].stablecoin, stablecoin);
        assertEq(bobTxns[0].amount, amount);
        assertEq(bobTxns[0].txType, TradeflowB2B.TxType.RECEIVED);
    }

    function testPaymentEmitsEvent() public {
        address stablecoin = stablecoins[0];
        uint256 amount = 100 ether;

        // Fund Alice
        fundUser(alice, stablecoin, amount);

        // Expect event
        vm.expectEmit(true, true, true, true);

        // Make payment
        vm.startPrank(alice);
        IERC20(stablecoin).approve(address(tradeflow), amount);
        tradeflow.pay(stablecoin, bob, amount, "Test payment");
        vm.stopPrank();
    }

    function testMultiplePaymentsWorkCorrectly() public {
        address stablecoin = stablecoins[0];
        uint256 amount1 = 50 ether;
        uint256 amount2 = 30 ether;

        // Fund Alice
        fundUser(alice, stablecoin, amount1 + amount2);

        // Make payments
        vm.startPrank(alice);
        IERC20(stablecoin).approve(address(tradeflow), amount1 + amount2);
        tradeflow.pay(stablecoin, bob, amount1, "First payment");
        tradeflow.pay(stablecoin, bob, amount2, "Second payment");
        vm.stopPrank();

        // Check transactions
        TradeflowB2B.Transaction[] memory aliceTxns = tradeflow
            .getUserTransactions(alice);
        TradeflowB2B.Transaction[] memory bobTxns = tradeflow
            .getUserTransactions(bob);

        assertEq(aliceTxns.length, 2);
        assertEq(bobTxns.length, 2);

        assertEq(aliceTxns[0].amount, amount1);
        assertEq(aliceTxns[1].amount, amount2);
        assertEq(bobTxns[0].amount, amount1);
        assertEq(bobTxns[1].amount, amount2);
    }
}
