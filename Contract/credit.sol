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

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Learning {
    struct Credit {
        uint256 total;
        uint256 amount;
        uint256 lastUpdate;
    }

    event OrderCreditPayment(
        bytes32 supplier,
        bytes32 customer,
        uint256 totalPrice,
        uint256 dateCreate,
        bytes32 productListHash
    );

    mapping(bytes32 => mapping(bytes32 => Credit)) private CreditMapping;

    function createCreditMapping(
        bytes32 supplier, //222 gas
        bytes32 customer, //222
        uint256 amount, //262
        uint256 dateCreate // 262
    ) public {
        // bytes32 supplier;
        // bytes32 customer;
        // uint256 amount;
        // uint256 dateCreate;

        // Credit memory newCredit; //106
        // newCredit.total = amount; //25
        // newCredit.amount = amount;  //25
        // newCredit.lastUpdate = dateCreate; //25

        CreditMapping[supplier][customer] = Credit({
            total: amount,
            amount: amount,
            lastUpdate: dateCreate
        }); //15340
    }

    function updateCreditTotal(
        bytes32 supplier,
        bytes32 customer,
        uint256 total,
        uint256 amount,
        uint256 dateCreate
    ) public {
        CreditMapping[supplier][customer].total = total;
        CreditMapping[supplier][customer].amount = amount;
        CreditMapping[supplier][customer].lastUpdate = dateCreate;
    }

    function getAmount(bytes32 supplier, bytes32 customer)
        public
        view
        returns (uint256)
    {
        return CreditMapping[supplier][customer].amount;
    }

    function addSupplier(bytes32 supplier) public {
        require(
            CreditMapping[supplier][""].lastUpdate == 0,
            "Supplier already exists"
        );
        CreditMapping[supplier][""] = Credit({
            total: 0,
            amount: 0,
            lastUpdate: 0
        });
    }

    function orderCreditPayment(
        bytes32 supplier,
        bytes32 customer,
        uint256 totalPrice,
        uint256 dateCreate,
        bytes32 productListHash
    ) public {
        // CreditMapping[supplier][customer].amount; //205
        //  CreditMapping[supplier][customer].amount = totalPrice; //5215

        // address supplier;
        // address customer;
        // uint256 totalPrice;
        // uint256 dateCreate;
        // string memory productListHash;

        // dateCreate; //0
        // productListHash; //0
        emit OrderCreditPayment(
            supplier,
            customer,
            totalPrice,
            dateCreate,
            productListHash
        );
        CreditMapping[supplier][customer].amount =
            CreditMapping[supplier][customer].amount - totalPrice;
    }
}
