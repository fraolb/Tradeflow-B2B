// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TradeflowB2B} from "src/TradeflowB2B.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";

contract TradeflowB2BScript is Script {
    function setUp() public {}

    function run() public {
        deployTradeflowB2B();
    }

    function deployTradeflowB2B() public returns (HelperConfig, TradeflowB2B) {
        HelperConfig helperConfig = new HelperConfig();
        address[] memory config = helperConfig.getConfig();

        vm.startBroadcast();
        TradeflowB2B tradeflowB2B = new TradeflowB2B(config);

        vm.stopBroadcast();
        return (helperConfig, tradeflowB2B);
    }
}
