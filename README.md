# 🧊 Baengpun System Flow and Diagram

> Comprehensive system architecture and transaction flow for the Baengpun platform.

---

## 📚 Table of Contents

- [1. System Structure](#1-🔧-baengpun-system-structure)
  - [1.1 Components Overview](#🔹-components)
- [2. Flow Diagram](#2-🔁-baengpun-transaction-flow)
  - [2.1 Step-by-Step Flow](#🔢-step-by-step-flow)

---

## 1. 🔧 Baengpun System Structure

<details>
  <summary><strong>Click to expand structure diagram and descriptions</strong></summary>

![Baengpun System Structure](Group%20336.png)  
**Figure 1:** *Baengpun System Structure — Shows system components such as DApp, API Gateway, Service Layer, Database, zk-Rollup Layer 2, and Ethereum Layer 1.*

### 🔹 Components

- 👤 **Users**  
  Community users who make transactions such as receiving/transferring credit or withdrawing.

- 🧑‍💻 **Baengpun DApp (UI Layer)**  
  Frontend interface that displays credit and transaction information.

- 🌐 **API Gateway**  
  Connection point between the DApp and Backend Services via HTTPS.

- 🛠 **Service Layer**  
  Processes business logic such as crediting and authentication.

- 🔄 **Transaction Service**  
  Handles transaction orders like credit transfers and withdrawal queues.

- 🗄 **Database Layer**  
  Interfaces with MongoDB and Redis databases.

  - 🍃 **MongoDB**  
    Stores user data, transaction history, and credit policies.

  - ⚡ **Redis**  
    Cache for quick access to recent data such as current credit balance.

- 🌀 **zk-Rollup (Layer 2)**  
  Combines multiple transactions and generates a zk-proof.

  - 🧠 **Prover**  
    Creates zk-proofs from batch transactions.

  - 🚚 **Relayer**  
    Sends zk-proofs to the Smart Contract on Ethereum Layer 1.

- 🛑 **Monitoring**  
  Observes the health and status of all nodes: Sequencer, Prover, and Relayer.

- ⛓️ **Layer 1: Ethereum Mainnet**  
  The base blockchain layer that verifies zk-proofs.

  - 📜 **Rollup Smart Contract**  
    Validates zk-proofs on Layer 1.

  - 💸 **Exit/Withdraw Contract**  
    Enables users to withdraw credit from Layer 2 back to Layer 1.

</details>

---

## 2. 🔁 Baengpun Transaction Flow

<details>
  <summary><strong>Click to expand flow diagram and step-by-step process</strong></summary>

![Baengpun Flow Diagram](Group%20337.png)  
**Figure 2:** *Baengpun Flow Diagram — Illustrates the transaction flow from the user through zk-Rollup Layer 2 to final confirmation on Ethereum Layer 1.*

### 🔢 Step-by-Step Flow

1️⃣ **Users (Community)**  
Connect Wallet (e.g., MetaMask) to verify identity.

2️⃣ **Baengpun DApp**  
Initiate transactions via the API Gateway or connect directly to the Layer 2 Smart Contract.

3️⃣ **API Gateway**  
Validates requests — handles authentication and rate limiting.

4️⃣ **Service Layer**  
- *Credit Service:* Checks user credit limits.  
- *Transaction Service:* Manages transactions, withdrawal queues, and batching.

5️⃣ **MongoDB + Redis**  
- *MongoDB:* Stores persistent user and transaction data.  
- *Redis:* Provides fast-access cached data like current credit balances.

6️⃣ **Layer 2 zk-Rollup**  
- *Prover:* Generates zk-proofs from batched transactions.  
- *Relayer:* Sends zk-proofs to Layer 1 Ethereum.

7️⃣ **Layer 1 Ethereum**  
- *Rollup Contract:* Verifies zk-proofs.  
- *Exit/Withdraw Contract:* Allows users to claim and withdraw tokens.

</details>

---
