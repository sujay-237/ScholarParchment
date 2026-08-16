# 🔬 ScholarParchment — Comprehensive Implementation Architecture

This document provides a detailed technical breakdown of the architecture, database schema, smart contract mechanics, security framework, and API integration flows built for **ScholarParchment** (SIH 2026).

---

## 📐 1. System Architecture Overview

ScholarParchment implements a **Hybrid Off-Chain / On-Chain Architecture** designed to deliver instant transparency without exposing sensitive Personally Identifiable Information (PII) on the public blockchain.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRESENTATION LAYER                               │
│              Next.js 14 App Router • React 18 • Tailwind CSS                │
└──────────────────────┬──────────────────────────────┬───────────────────────┘
                       │                              │
                       ▼                              ▼
┌──────────────────────────────────────┐     ┌────────────────────────────────┐
│            OFF-CHAIN DATA            │     │         ON-CHAIN DATA          │
│    Supabase PostgreSQL DB & Storage  │     │   Ethers.js v6 JSON-RPC Gateway│
├──────────────────────────────────────┤     ├────────────────────────────────┤
│ • Student Profiles & Bank Details    │     │ • Student Address Verification │
│ • DigiLocker Marks & Certificates    │     │ • Fund Allocation (ETH/Wei)    │
│ • Scrutiny Checklists & Notes        │     │ • Automated Smart Disbursements│
│ • SHA-256 Audit Records Trail        │     │ • Event Logs (FundsAllocated)  │
└──────────────────────────────────────┘     └────────────────────────────────┘
```

---

## 🗄️ 2. Database Design & Supabase PostgreSQL Schemas

The database schema is defined in [`supabase/schema_and_seed.sql`](supabase/schema_and_seed.sql) and includes 9 core tables:

### 2.1 Core Schema Table Definitions

1. **`users`**: System-wide authenticated accounts for all personas (`student`, `college`, `ministry`).
2. **`students`**: Detailed academic, income, category, and Aadhaar-seeded bank account records for students.
3. **`scholarships`**: Central Sector and AICTE scholarship scheme guidelines, quotas, and criteria.
4. **`applications`**: Active applications tracking lifecycle state (`college_pending` ➔ `college_verified` ➔ `ministry_approved` ➔ `disbursed`).
5. **`student_verifications`**: Institute Nodal Officer scrutiny and blockchain transaction hashes.
6. **`scholarship_allocations`**: On-chain fund allocations tied to student wallet addresses.
7. **`disbursement_batches`**: Combined sanction files ready for Public Financial Management System (PFMS) clearing.
8. **`payments`**: Unique transaction receipts and UTR numbers generated upon DBT credit.
9. **`audit_records`**: Cryptographic, immutable audit log containing SHA-256 state hashes and digital signatures.

---

## 📜 3. Smart Contract Specifications (`ScholarshipTracker.sol`)

The Ethereum smart contract is located at [`contracts/ScholarshipTracker.sol`](contracts/ScholarshipTracker.sol). It is compiled with Solidity `0.8.20` and inherits OpenZeppelin `ReentrancyGuard`.

```solidity
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

    // Modifiers & Functions...
}
```

### 3.1 Contract Lifecycle Operations
1. **`verifyStudent(address _student)`**: Called by the College Nodal Officer wallet (`onlyVerifier`) to mark `isVerified = true` on-chain.
2. **`allocateFunds(address _student)`**: Called by the Ministry Director wallet (`onlyAdmin`) with attached ETH value (`msg.value > 0`) to record `allocatedAmount`.
3. **`disburseFunds(address _student)`**: Transfers `allocatedAmount` directly to `_student` via native EVM transfer with reentrancy protection (`nonReentrant`).

---

## 🔑 4. Authentication & Role-Based Access Control (RBAC)

Authentication is managed via [`src/context/AuthContext.tsx`](src/context/AuthContext.tsx) and synchronized with Supabase:

- **Session Persistence**: Stored in `localStorage` (`sp_auth_user`) with automated rehydration on application load.
- **Authorized Accounts**: Pre-seeded with 5 Students, 1 College Verification Officer, and 1 Ministry Director.
- **Route Guarding**: Ensures students can only access `/student/*`, colleges `/college/*`, and ministry `/ministry/*`.

---

## ⚙️ 5. API Route Architecture

Server-side API routes are implemented using Next.js Route Handlers:

### 5.1 `/api/verify` (`POST`)
- **Payload**: `{ "studentId": "STU-2026-8941" }`
- **Execution**: Looks up student wallet in Supabase using `.or(...)`, connects to Hardhat node via `collegeWallet`, calls `contract.verifyStudent(formattedAddress)`, and updates `student_verifications` in Supabase with transaction hash.

### 5.2 `/api/allocate` (`POST`)
- **Payload**: `{ "studentId": "STU-2026-8941", "amount": "20000000000000000" }`
- **Execution**: Connects via `ministryWallet`, executes `contract.allocateFunds(formattedAddress, { value: amount })`, and updates `scholarship_allocations` status to `allocated`.

### 5.3 `/api/disburse` (`POST`)
- **Payload**: `{ "studentAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" }`
- **Execution**: Triggers `contract.disburseFunds(formattedAddress)` and returns the block transaction hash.

### 5.4 `/api/explorer/[studentId]` (`GET`)
- **Execution**: Public query returning aggregated off-chain profile data from Supabase alongside live on-chain status queried from Hardhat.

---

## 🛡️ 6. Security & Auditability

1. **Ethers Checksum Normalization**: All address inputs are normalized using `ethers.getAddress(address.toLowerCase())` to eliminate checksum manipulation errors.
2. **Double-Spending Prevention**: The smart contract enforces `!students[_student].isPaid` and `allocatedAmount == 0` prior to allocation.
3. **Reentrancy Protection**: Financial disbursements are protected by OpenZeppelin `ReentrancyGuard`.
4. **Data Privacy (PII)**: Aadhaar numbers and bank accounts are masked on-screen (`XXXX-XXXX-8842`), while full hashes are stored securely.

---

## 💻 7. Front-End Context & State Hierarchy

```
<AuthProvider>
  └── <NotificationProvider>
        └── <ScholarshipDataProvider>
              ├── Navbar & Header
              ├── Sidebar Navigation
              └── Page Workspaces (/student, /college, /ministry, /records)
```

- **`AuthContext`**: Manages current user session, active persona role, and sign-in state.
- **`NotificationContext`**: Handles real-time system alerts and target-role notification broadcasts.
- **`ScholarshipDataProvider`**: Serves as the central data bridge syncing UI state with Supabase tables and smart contract web3 calls.
