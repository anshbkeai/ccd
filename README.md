# Bank Fraud Detection System

A real-time bank transaction fraud detection system built with microservices architecture. The system processes transactions through multiple services to detect and flag fraudulent activities using machine learning.

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Components](#components)
  - [Bank (Frontend)](#bank-frontend)
  - [CBS (Core Banking Service)](#cbs-core-banking-service)
  - [AIES (AI Evaluation Service)](#aies-ai-evaluation-service)
  - [Bank Fraud Detection (ML Model)](#bank-fraud-detection-ml-model)
- [Workflow](#workflow)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)

---

## Overview

This project implements a complete bank fraud detection pipeline that:
- Allows users to initiate payments through a web interface
- Processes transactions through a core banking system
- Enriches transaction data with historical account activity
- Evaluates transactions using a machine learning model
- Flags suspicious transactions in real-time
- Notifies the bank system of fraudulent activities

## System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│    Bank     │────────▶│     CBS     │────────▶│    AIES     │────────▶│    Fraud     │
│  (Frontend) │         │  (Backend)  │         │   (AI Svc)  │         │   Detection  │
│   React     │         │Spring Boot  │         │Spring Boot  │         │    Model     │
└─────────────┘         └─────────────┘         └─────────────┘         └──────────────┘
                               │                       │                         │
                               │                       │                         │
                               ▼                       ▼                         ▼
                        ┌─────────────┐         ┌─────────────┐         ┌──────────────┐
                        │   MySQL     │         │   Kafka     │         │   Python     │
                        │  Database   │         │  Messaging  │         │   sklearn    │
                        └─────────────┘         └─────────────┘         └──────────────┘
```

### Communication Flow

1. **User → Bank**: User initiates payment via React frontend
2. **Bank → CBS**: Payment request sent to Core Banking Service
3. **CBS → Kafka**: Transaction published to `txn-topic`
4. **Kafka → AIES**: AIES consumes transaction from `txn-topic`
5. **AIES → Database**: Fetches last 10 transactions for both debtor and creditor
6. **AIES → Kafka**: Enriched transaction data published to `model-txn`
7. **Model → Kafka**: Fraud prediction result published to `model-resp-txn`
8. **AIES → CBS**: Flagged transactions sent to `notification-prod` topic
9. **CBS → Bank**: Real-time notifications via Server-Sent Events (SSE)

---

## Project Structure

```
aies/
├── bank/                          # Frontend application
│   ├── src/
│   │   ├── pages/                 # React pages (Login, Dashboard, Payment)
│   │   ├── backend/               # API service layer
│   │   └── conf/                  # Configuration
│   ├── package.json
│   └── vite.config.js
│
├── cbs/                           # Core Banking Service
│   ├── src/main/java/com/cbs/
│   │   ├── Controller/            # REST controllers
│   │   ├── Service/               # Business logic
│   │   ├── Repo/                  # Database repositories
│   │   └── pojo/                  # Data models
│   └── pom.xml
│
├── aies/                          # AI Evaluation Service
│   ├── src/main/java/com/aies/
│   │   ├── service/               # Transaction processing & Kafka consumers
│   │   ├── pojo/                  # Transaction & model POJOs
│   │   ├── repo/                  # Database repositories
│   │   └── configs/               # Kafka topic configuration
│   ├── kafka/
│   │   ├── docker-compose.yml     # Kafka & Zookeeper setup
│   │   └── data.sql               # Initial database schema
│   └── pom.xml
│
└── bank-fraud-detection/          # Machine Learning Model
    ├── src/
    │   ├── model.py               # ML model training & persistence
    │   ├── features.py            # Feature extraction
    │   └── predict.py             # Fraud prediction logic
    ├── data/
    │   └── sample_transactions.json
    ├── tests/                     # Unit tests
    └── requirements.txt
```

---

## Components

### Bank (Frontend)

**Technology**: React + Vite + TailwindCSS

**Purpose**: User-facing web application for banking operations

**Key Features**:
- Customer login with account ID
- QR code-based payment system
- Real-time transaction dashboard
- View flagged/fraudulent transactions
- Secure payment processing

**Main Pages**:
- `Login.jsx`: Customer authentication
- `DashBoard.jsx`: Account overview and transaction history
- `Payment.jsx`: Payment initiation interface
- `Bank.jsx`: QR code scanning and generation

**Port**: Typically runs on `http://localhost:5173` (Vite default)

---

### CBS (Core Banking Service)

**Technology**: Spring Boot 3.5.6 + MySQL + Kafka

**Purpose**: Core banking backend that handles all transaction processing

**Key Responsibilities**:
1. **Account Management**: Store and retrieve customer account information
2. **Transaction Processing**: Create and persist transaction records
3. **Event Publishing**: Publish transactions to Kafka for fraud detection
4. **Notification Handling**: Receive fraud alerts and notify frontend
5. **Transaction History**: Provide last 10 transactions for accounts

**Key Components**:
- `DummyController`: REST API endpoints for account and payment operations
- `DummyService`: Business logic for payment processing
- `Notify`: Kafka consumer for fraud notifications
- `SseService`: Server-Sent Events for real-time updates
- `TransctionEventRepo`: Database access for transactions
- `AccountRepo`: Database access for accounts

**Database**: MySQL (`txn` database)

**Kafka Topics**:
- **Produces to**: `txn-topic` (new transactions)
- **Consumes from**: `notification-prod` (fraud alerts)

**Port**: `8080` (default Spring Boot)

---

### AIES (AI Evaluation Service)

**Technology**: Spring Boot 3.5.6 + MySQL + Kafka

**Purpose**: Enriches transactions with historical data and coordinates with ML model

**Key Responsibilities**:
1. **Transaction Enrichment**: Fetch last 10 debit and credit transactions for both parties
2. **Data Aggregation**: Combine current transaction with historical context
3. **Model Communication**: Send enriched data to fraud detection model
4. **Result Processing**: Receive fraud predictions and flag suspicious transactions
5. **Database Updates**: Mark flagged transactions in database

**Key Components**:
- `TransctionConsumer`: Consumes transactions from CBS
- `TransctionModelService`: Enriches transactions with historical data
- `ModelConsumer`: Receives fraud detection results
- `TransctionEventService`: Updates flagged transactions in database
- `TransctionEventRepo`: Database access for transaction history

**Data Models**:
- `TransctionEvent`: Transaction details (debtor, creditor, amount, timestamp)
- `ModelTransction`: Enriched transaction with history for both parties
- `ModelDebtor`/`ModelCreditor`: Historical transaction patterns
- `ModelResponse`: Fraud detection result

**Database**: MySQL (`txn` database, shared with CBS)

**Kafka Topics**:
- **Consumes from**: `txn-topic` (new transactions)
- **Produces to**: `model-txn` (enriched transactions)
- **Consumes from**: `model-resp-txn` (fraud predictions)
- **Produces to**: `notification-prod` (flagged transactions)

**Port**: `8081`

---

### Bank Fraud Detection (ML Model)

**Technology**: Python + scikit-learn + Kafka

**Purpose**: Machine learning service that predicts fraudulent transactions

**Key Features**:
- Random Forest classifier for fraud detection
- Feature extraction from transaction patterns
- Historical transaction analysis (last 10 transactions)
- Model persistence (save/load trained models)

**Components**:
- `model.py`: RandomForestClassifier training and persistence
- `features.py`: Extract features from current and historical transactions
- `predict.py`: Fraud prediction logic
- `tests/`: Unit tests for all components

**Feature Extraction**:
- Transaction amount patterns
- Time-based features
- Location analysis
- Account behavior patterns
- Historical transaction frequency

**Kafka Topics**:
- **Consumes from**: `model-txn` (enriched transactions from AIES)
- **Produces to**: `model-resp-txn` (fraud predictions)

---

## Workflow

### Complete Transaction Flow

1. **User Login**
   - User enters Customer ID (e.g., `CUST123`)
   - Frontend fetches account details from CBS
   - Account info stored in `localStorage`

2. **Payment Initiation**
   - User scans QR code or enters recipient details
   - Payment form captures: amount, receiver account, note
   - Frontend sends payment request to CBS

3. **Transaction Creation (CBS)**
   - CBS creates `TransctionEvent` with:
     - Unique UUID
     - Debtor and Creditor details
     - Payment amount and currency
     - Timestamp and remittance info
   - Transaction saved to MySQL database
   - Transaction published to Kafka topic `txn-topic`

4. **Transaction Enrichment (AIES)**
   - AIES consumes transaction from `txn-topic`
   - Fetches last 10 debits and credits for debtor account
   - Fetches last 10 debits and credits for creditor account
   - Creates enriched `ModelTransction` object
   - Publishes enriched data to `model-txn` topic

5. **Fraud Detection (ML Model)**
   - Model consumes enriched transaction from `model-txn`
   - Extracts features from current and historical transactions
   - Runs Random Forest classifier
   - Generates prediction: `is_fraud: true/false` with `reason`
   - Publishes result to `model-resp-txn` topic

6. **Result Processing (AIES)**
   - AIES consumes fraud prediction from `model-resp-txn`
   - If flagged as fraud:
     - Updates transaction in database (`flaged=true`, sets reason)
     - Publishes to `notification-prod` topic
   - Logs event for audit purposes

7. **Notification (CBS)**
   - CBS consumes flagged transaction from `notification-prod`
   - Sends real-time notification via Server-Sent Events (SSE)
   - Frontend displays fraud alert to bank staff

8. **Dashboard Display**
   - User/Bank staff can view:
     - All transactions
     - Flagged transactions (paginated)
     - Transaction history (last 10 for any account)

---

## Differences Between AIES and CBS

### CBS (Core Banking Service)
- **Primary Role**: Transaction processing and account management
- **Business Logic**: Banking operations (payments, account queries)
- **Database Operations**: Read/Write transactions and accounts
- **External Interface**: REST APIs for frontend
- **Kafka Role**: Transaction publisher (produces to `txn-topic`)
- **Notification**: Receives fraud alerts and notifies frontend

### AIES (AI Evaluation Service)
- **Primary Role**: Transaction enrichment and ML coordination
- **Business Logic**: Data aggregation for fraud detection
- **Database Operations**: Read transaction history, write fraud flags
- **External Interface**: No direct REST APIs (Kafka-based)
- **Kafka Role**: Middleware between CBS and ML model
  - Consumes raw transactions
  - Produces enriched transactions
  - Consumes fraud predictions
  - Produces notifications

### Key Distinction
**CBS is customer-facing** (handles actual banking operations), while **AIES is AI-facing** (prepares data for ML and processes results). They share the same database but have different responsibilities in the transaction lifecycle.

---

## Technology Stack

### Frontend
- **React 19**: UI framework
- **Vite 7**: Build tool and dev server
- **TailwindCSS 4**: Styling
- **React Router 7**: Client-side routing
- **html5-qrcode**: QR code scanning
- **qrcode.react**: QR code generation

### Backend (CBS & AIES)
- **Java 21**: Programming language
- **Spring Boot 3.5.6**: Framework
- **Spring Data JPA**: Database ORM
- **Spring Kafka**: Kafka integration
- **Lombok**: Code generation
- **MySQL**: Relational database

### ML Service
- **Python 3**: Programming language
- **scikit-learn**: Machine learning library
- **pandas**: Data manipulation
- **numpy**: Numerical computing
- **pytest**: Testing framework

### Infrastructure
- **Apache Kafka 7.6.0**: Message broker
- **Zookeeper 7.6.0**: Kafka coordination
- **Kafka UI**: Web-based Kafka monitoring
- **Docker Compose**: Container orchestration

---

## Prerequisites

- **Java 21** or higher
- **Maven 3.8+**
- **Node.js 18+** and npm
- **Python 3.8+**
- **MySQL 8.0+**
- **Docker** and **Docker Compose**

---

## Installation & Setup

### 1. Clone the Repository

```bash
cd /Users/ansh/Desktop/Clg/aies
```

### 2. Start Kafka and Zookeeper

```bash
cd aies/kafka
docker-compose up -d
```

This starts:
- Zookeeper on port `2181`
- Kafka on port `9092`
- Kafka UI on port `8085`

Verify Kafka is running: `http://localhost:8085`

### 3. Setup MySQL Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE txn;
USE txn;
SOURCE /Users/ansh/Desktop/Clg/aies/aies/kafka/data.sql;
```

### 4. Setup CBS (Core Banking Service)

```bash
cd cbs
./mvnw clean install
```

### 5. Setup AIES (AI Evaluation Service)

```bash
cd ../aies
./mvnw clean install
```

### 6. Setup Frontend (Bank)

```bash
cd ../bank
npm install
```

### 7. Setup ML Model (Bank Fraud Detection)

```bash
cd ../bank-fraud-detection
pip install -r requirements.txt
```

---

## Running the Application

### Start all services in order:

#### 1. Start CBS (Core Banking Service)
```bash
cd cbs
./mvnw spring-boot:run
```
Runs on: `http://localhost:8080`

#### 2. Start AIES (AI Evaluation Service)
```bash
cd aies
./mvnw spring-boot:run
```
Runs on: `http://localhost:8081`

#### 3. Start ML Model Service
```bash
cd bank-fraud-detection
python -m src.predict
```

#### 4. Start Frontend
```bash
cd bank
npm run dev
```
Runs on: `http://localhost:5173`

### Access the Application

- **Frontend**: http://localhost:5173
- **CBS API**: http://localhost:8080
- **AIES API**: http://localhost:8081
- **Kafka UI**: http://localhost:8085

---

## API Endpoints

### CBS Endpoints

#### Get Account by ID
```http
GET /dummy/{id}
```
**Response**: Account details

#### Get Last 10 Transactions
```http
GET /dummy/{id}/last10txn
```
**Response**: List of last 10 transactions for account

#### Make Payment
```http
POST /dummy/pay
Content-Type: application/json

{
  "fromAccount": { "id": "CUST123", "scheme": "CUSTOMER-ID" },
  "toAccount": { "id": "CUST456", "scheme": "CUSTOMER-ID" },
  "amount": 1000,
  "note": "Payment for services"
}
```

#### Get Flagged Transactions (Paginated)
```http
GET /dummy/bank/flagged?page=0&size=10
```
**Response**: Page of flagged transactions

---

## Testing

### Run Backend Tests (CBS)
```bash
cd cbs
./mvnw test
```

### Run Backend Tests (AIES)
```bash
cd aies
./mvnw test
```

### Run ML Model Tests
```bash
cd bank-fraud-detection
pytest tests/
```

### Run Frontend Linting
```bash
cd bank
npm run lint
```

---

## Key Kafka Topics

| Topic | Producer | Consumer | Purpose |
|-------|----------|----------|---------|
| `txn-topic` | CBS | AIES | New transactions |
| `model-txn` | AIES | ML Model | Enriched transactions |
| `model-resp-txn` | ML Model | AIES | Fraud predictions |
| `notification-prod` | AIES | CBS | Fraud alerts |

---

## Database Schema

### Account Table
- `id` (PK): Customer ID
- `scheme`: Account scheme type
- Other account details

### TransctionEvent Table
- `id` (PK): Transaction UUID
- `debtor_*`: Debtor account details
- `creditor_*`: Creditor account details
- `payment_info_*`: Amount, currency
- `remittance_info_*`: Note/reference
- `transaction_date`: Timestamp
- `flaged`: Boolean (fraud flag)
- `reason`: Fraud detection reason

---

## Development Notes

- **CORS**: CBS allows all origins (`@CrossOrigin("*")`)
- **Port Configuration**: Update `application.properties` for custom ports
- **Database**: Both CBS and AIES share the same MySQL database
- **Kafka Group ID**: `my-group` (can be configured per consumer)
- **Serialization**: JSON serialization for Kafka messages

---

## Contributors

This project was created as a team effort for bank fraud detection demonstration.

## License

MIT License

---

## Future Enhancements

- [ ] Add user authentication and authorization
- [ ] Implement real-time model retraining
- [ ] Add more sophisticated fraud detection features
- [ ] Implement transaction reversal for flagged transactions
- [ ] Add comprehensive logging and monitoring
- [ ] Deploy to cloud infrastructure (AWS/Azure/GCP)
- [ ] Add end-to-end integration tests
- [ ] Implement rate limiting and security measures
# ccd
# ccd
