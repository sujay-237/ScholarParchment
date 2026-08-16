// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ScholarshipTracker is ReentrancyGuard {
    address public ministryAdmin;
    address public collegeVerifier;

    struct Student {
        uint256 allocatedAmount;
        bool isVerified;
        bool isPaid;
    }

    mapping(address => Student) public students;

    event FundsAllocated(address indexed student, uint256 amount);
    event StudentVerified(address indexed student);
    event FundsDisbursed(address indexed student, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == ministryAdmin, "Only Ministry Admin can perform this action");
        _;
    }

    modifier onlyVerifier() {
        require(msg.sender == collegeVerifier, "Only College Verifier can perform this action");
        _;
    }

    constructor(address _collegeVerifier) {
        ministryAdmin = msg.sender;
        collegeVerifier = _collegeVerifier;
    }

    function allocateFunds(address _student) external payable onlyAdmin {
        require(msg.value > 0, "Allocation amount must be greater than 0");
        require(students[_student].allocatedAmount == 0, "Funds already allocated for this student");

        students[_student].allocatedAmount = msg.value;
        emit FundsAllocated(_student, msg.value);
    }

    function verifyStudent(address _student) external onlyVerifier {
        require(!students[_student].isVerified, "Student is already verified");

        students[_student].isVerified = true;
        emit StudentVerified(_student);
    }

    function disburseFunds(address _student) external nonReentrant {
        require(students[_student].isVerified, "Student is not verified yet");
        require(students[_student].allocatedAmount > 0, "No funds allocated for this student");
        require(!students[_student].isPaid, "Funds have already been disbursed");

        uint256 amount = students[_student].allocatedAmount;
        require(address(this).balance >= amount, "Insufficient contract balance");

        students[_student].isPaid = true;

        (bool success, ) = payable(_student).call{value: amount}("");
        require(success, "Fund transfer failed");

        emit FundsDisbursed(_student, amount);
    }
}