// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { OApp, Origin, MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentSender is OApp, OAppOptionsType3 {
    // Define message types
    uint16 public constant SEND = 1;

    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) Ownable(_owner) {}

    struct Payment {
        address payer;
        uint256 amount;
        string txId;
    }

    function quoteSendPayment(
        uint32 dstEid,
        uint256 amount,
        string calldata txId,
        bytes calldata options
    ) external view returns (MessagingFee memory fee) {
        Payment memory payment = Payment(msg.sender, amount, txId);
        bytes memory payload = abi.encode(payment);

        // Combine enforced options with caller-provided options
        bytes memory combinedOptions = combineOptions(dstEid, SEND, options);
        return _quote(dstEid, payload, combinedOptions, false);
    }

    function sendPayment(uint32 dstEid, uint256 amount, string calldata txId, bytes calldata options) external payable {
        Payment memory payment = Payment(msg.sender, amount, txId);
        bytes memory payload = abi.encode(payment);

        // Combine enforced options with caller-provided options
        bytes memory combinedOptions = combineOptions(dstEid, SEND, options);

        _lzSend(
            dstEid,
            payload,
            combinedOptions,
            MessagingFee(msg.value, 0), // fee in native gas token
            payable(msg.sender)
        );
    }

    // Required implementation for OApp - this contract only sends, doesn't receive
    function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*_guid*/,
        bytes calldata /*_message*/,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal pure override {
        // This contract only sends payments, doesn't receive them
        revert("PaymentSender: receiving not supported");
    }
}
