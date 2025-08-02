#Baengpun System Flow and Diagram (with Descriptions)
##1. Baengpun: System Structure
![Structure](Group%20336.png)
###Figure 1: Baengpun System Structure - Shows system components such as DApp, API Gateway, Service Layer, Database, zk-Rollup Layer2 and Ethereum Layer1.
👤 Users: Community users who make transactions such as receiving/transferring credit or withdrawing.
🧑‍💻 Baengpun DApp (UI Layer): Frontend user interface that displays credit and transaction information.
🌐 API Gateway: Connection point between DApp and Backend Services via HTTPS
🛠 Service Layer: Process business logic such as crediting, authentication
🔄 Transaction Service: Receive and manage transaction orders such as credit transfers, 
withdrawal queues
🗄 Database Layer: Connect to MongoDB and Redis databases
🍃 MongoDB: Stores user data, transaction history, credit policies
⚡ Redis: Cache For quick information such as your latest credit balance
🌀 zk-Rollup (Layer2): Merge multiple transactions and create a zk-proof
🧠 Prover: Create a zk-proof from batch transactions
🚚 Relayer: Send zk-proof to Smart Contract on Ethereum Layer1
🛑 Monitoring: Check the status of all Node Sequencer, Prover, Relayer.
⛓️ Layer1 Ethereum: The main blockchain layer (Mainnet) that accepts zk-proof for verification.
📜 Rollup Smart Contract: Zk-proof L1 contract
💸 Exit/Withdraw Contract: Allow users to withdraw credit from Layer 2 back to Layer 1.

##2. Flow Diagram Baengpun
![Structure](Group%20337.png)
###Figure 2: Flow Diagram Baengpun - Shows the transaction flow from the user to zk-Rollup Layer2 and confirmation on Ethereum Layer1.
1️⃣ Users (Community): Connect Wallet (MetaMask) to verify your identity
2️⃣ Baengpun DApp: Send transactions via API Gateway or directly connect to Layer 2 Smart Contract.
3️⃣ API Gateway: Verify request validity (Authentication, Rate Limiting)
4️⃣ Service Layer: Credit Service Check credit limit, Transaction Service Manage transaction orders, Queue Withdraw Requests, Batch Transactions
5️⃣ MongoDB + Redis: MongoDB stores the actual data, Redis caches the credit balance data for speed.
6️⃣ Layer2 zk-Rollup: Prover creates zk-proof, Relayer sends proof to Ethereum L1.
7️⃣ Layer1 Ethereum: Rollup Contract is zk-proof and Exit/Withdraw Contract allows users to claim token.
