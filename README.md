# TradeFlow B2B

**Empowering Seamless Business Payments in Emerging Markets**

TradeFlow B2B is a decentralized B2B payment platform built on the **Celo blockchain** and optimized for **MiniPay**. It streamlines stablecoin-based transactions between merchants, wholesalers, and retailers, particularly in emerging markets where access to traditional banking is limited.

## Problem Statement

In many emerging markets, merchants face challenges in managing and auditing their transactions. For example:

- A merchant may accept payments through wallet addresses but struggle to track the purpose of each transaction during end-of-day audits.
- This often leads to inefficient manual processes, such as writing transaction reasons on paper and cross-checking them later.

## Solution

TradeFlow B2B addresses these challenges by providing a **decentralized payment platform** that:

- **Stores Payment Metadata**: Users can include a reason for each payment, which is stored on-chain for easy retrieval.
- **Notification System**: Recipients receive notifications with the payment reason, improving transparency.
- **Digital Receipts**: Automatically generates digital receipts for every transaction.
- **Transaction Reports**: Users can generate detailed reports of their transactions, simplifying audits for merchants, retailers, and wholesalers.

## Key Features

1. **Stablecoin Payments**:

   - Supports Mento stablecoins such as **cUSD**, **cEUR**, and others.
   - Enables fast, secure, and transparent transactions.

2. **On-Chain Metadata**:

   - Stores transaction metadata (e.g., payment reasons) on-chain for efficient retrieval.

3. **Notifications**:

   - Recipients are notified of incoming payments with details such as the reason for the transaction.

4. **Digital Receipts**:

   - Automatically generates receipts for each transaction, reducing manual effort.

5. **Transaction Reports**:

   - Users can generate comprehensive reports for auditing purposes.

6. **MiniPay Integration**:

   - Optimized for MiniPay’s mobile-first experience.
   - Utilizes MiniPay’s Pockets for smooth currency swaps and integrates with its on/off-ramp rails for fiat ↔ crypto conversions.

7. **Mento Broker Contract**:
   - Leverages Mento's broker contract for on-chain exchanges, ensuring seamless currency swaps.

## Benefits

- **Efficiency**: Simplifies transaction tracking and auditing for merchants.
- **Transparency**: Provides clear and accessible transaction details for both senders and recipients.
- **Reliability**: Ensures secure and fast payments using the Celo blockchain.
- **Mobile-First**: Designed for mobile users, making it accessible and user-friendly.

## Deployment

### Alfajores Testnet

- Contract Address: `0x92c7d8B28b2c487c7f455733470B27ABE2FefF13`

### Celo Mainnet

- Contract Address: `0x9b55647cb55B5a4367D356069d29e969584Ceb18`

## How It Works

1. **Send Payment**:

   - Users can send payments with a reason for the transaction.
   - The reason is stored on-chain, and the recipient is notified.

2. **Receive Notifications**:

   - Recipients receive notifications with details of the payment, including the reason.

3. **Generate Receipts**:

   - Users can generate digital receipts for their transactions.

4. **Audit Transactions**:
   - Merchants can generate detailed reports of their transactions for auditing purposes.

## Technologies Used

- **Celo Blockchain**: For decentralized and secure transactions.
- **Mento Stablecoins**: For stable and reliable payments.
- **MiniPay**: For a mobile-first payment experience.
- **Next.js**: For front-end user interface.
- **MongoDB**: For storing notifications.
- **Cloudinary** For report and receipt generation.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn or npm
- MongoDB instance

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/fraolb/Tradeflow-B2B.git
    cd Tradeflow-B2B
    ```

2.  Set up environment variables:

    - Create a `.env` file in the root directory.
    - Add the following variables:
      ```env
      MONGODB_URI=<your-mongodb-uri>
      CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
      CLOUDINARY_API_KEY=<your-cloudinary-api-key>
      CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
      NEXT_PUBLIC_UPLOAD_PRESET=ml_default
      ```

3.  Start the development server:

    ```bash
    yarn dev
    # or
    npm run dev
    ```

4.  Open the app in your browser:
    ```
    http://localhost:3000
    ```

## Future Enhancements

- **Multi-Language Support**: Add support for multiple languages to cater to a global audience.
- **Advanced Analytics**: Provide detailed analytics for transaction trends and insights.
- **Customizable Notifications**: Allow users to customize notification preferences.

## Contributing

We welcome contributions to improve TradeFlow B2B! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
