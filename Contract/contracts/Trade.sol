// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Trade {
    address private owner;

    enum orderProcess{
        CREATE,
        SENDING,
        ACCEPT,
        REJECT
    }

    event orderLog(bytes16 seller, bytes16 buyer, bytes32 itemList, orderProcess status, uint timeStamp);
    event lendLog(bool accept, bytes16 seller, bytes16 buyer, uint16 amount, uint timeStamp);
    event payLoanLog(bytes16 seller, bytes16 buyer, uint16 amount, uint timeStamp);
    event registerUser(string userType, bytes16 userId, uint timeStamp);

    mapping(bytes16 => mapping(bytes16 => uint32)) grantCredit;

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(owner == msg.sender, "You are not allowed to use");
        _;
    }

    function registerSeller(
        bytes16 seller
    ) public isOwner {
        emit registerUser("seller", seller, block.timestamp);
    }

    function registerBuyer(
        bytes16 buyer
    ) public isOwner {
        emit registerUser("buyer", buyer, block.timestamp);
    }

    function lendCreditProceed(
        bool accept, bytes16 seller, bytes16 buyer, uint16 amount
    ) public isOwner  {
        emit lendLog(accept, seller, buyer, amount, block.timestamp);
        if(accept == true){
            grantCredit[seller][buyer] += amount;
        }
    }

    function payLoanCredit(
        bytes16 seller, bytes16 buyer, uint16 amount
    ) public isOwner {
        emit payLoanLog(seller, buyer, amount, block.timestamp);
        grantCredit[seller][buyer] -= amount;
    }

    function orderProceed(
        bytes16 seller, bytes16 buyer, bytes32 itemList, orderProcess status
    ) public isOwner{
        emit orderLog(seller, buyer, itemList, status, block.timestamp);
    }

    function getLendCredit(
        bytes16 seller, bytes16 buyer
    ) public isOwner view returns(uint32){
        return grantCredit[seller][buyer];
    }
}