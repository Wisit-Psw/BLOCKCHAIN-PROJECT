// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Credit {
    address owner;

    mapping(string => bool) registeredUser;

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(owner == msg.sender, "You are not allowed to use");
        _;
    }

    public function registerUser(string userHash) isOwner {

    }
}
