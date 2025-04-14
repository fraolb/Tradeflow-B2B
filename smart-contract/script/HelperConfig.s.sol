// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error HelperConfig__InvalidChainId();

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    uint256 constant CELO_MAINNET_CHAIN_ID = 42220;
    uint256 constant CELO_ALFAJORES_CHAIN_ID = 44787;

    address[] ALFAJORES_TOKEN_ADDRESSES = [
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1,
        0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F,
        0xE4D517785D091D3c54818832dB6094bcc2744545
    ]; // cUSD, cEUR and cReal
    address[] CELO_TOKEN_ADDRESSES = [
        0x765DE816845861e75A25fCA122bb6898B8B1282a,
        0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73,
        0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787
    ]; // cUSD, cEUR and cReal

    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getConfig() public view returns (address[] memory) {
        return getConfigByChainId(block.chainid);
    }

    function getConfigByChainId(
        uint256 chainId
    ) public view returns (address[] memory) {
        if (chainId == CELO_MAINNET_CHAIN_ID) {
            return CELO_TOKEN_ADDRESSES;
        } else if (chainId == CELO_ALFAJORES_CHAIN_ID) {
            return ALFAJORES_TOKEN_ADDRESSES;
        } else {
            revert HelperConfig__InvalidChainId();
        }
    }
}
