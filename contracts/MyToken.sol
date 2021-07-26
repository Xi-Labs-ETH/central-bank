//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "hardhat/console.sol";


contract MyToken is ERC20PresetMinterPauser {

    constructor () ERC20PresetMinterPauser("MyToken", "MONEY") {
        _mint(msg.sender, 1000000);
    }
    
}