// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { OApp, Origin, MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentLedger is OApp, OAppOptionsType3 {
    struct Payment {
        address payer;
        uint256 amount;
        string txId;
    }

    Payment[] public payments;
    uint256 public totalAmount;

    event PaymentReceived(address payer, uint256 amount, string txId);

    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) Ownable(_owner) {}

    function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*_guid*/,
        bytes calldata payload,
        address /*executor*/,
        bytes calldata /*extraData*/
    ) internal override {
        Payment memory p = abi.decode(payload, (Payment));
        payments.push(p);
        totalAmount += p.amount;

        emit PaymentReceived(p.payer, p.amount, p.txId);
    }

    function getPayments() external view returns (Payment[] memory) {
        return payments;
    }
}
