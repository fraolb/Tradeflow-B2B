# TradeFlow B2B Front-End

**Empowering Seamless Business Payments in Emerging Markets**

This is the front-end application for the **TradeFlow B2B** platform, built using **Next.js**. It provides a user-friendly interface for merchants, wholesalers, and retailers to manage their transactions, notifications, and reports.

## Key Features

- **Stablecoin Payments**: Send and receive payments using Mento stablecoins like cUSD and cEUR.
- **Notifications**: Get real-time notifications for incoming payments and updates.
- **Digital Receipts**: Generate and download digital receipts for transactions.
- **Transaction Reports**: View and export detailed transaction reports.
- **Currency Swaps**: Swap between supported stablecoins using Mento's broker contract.
- **MiniPay Integration**: Optimized for MiniPay’s mobile-first experience.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn or npm
- MongoDB instance
- Cloudinary

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fraolb/Tradeflow-B2B.git
   cd Tradeflow-B2B/front-end
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the `front-end` directory.
   - Add the following variables:
     ```env
     MONGODB_URI=<your-mongodb-uri>
     CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
     CLOUDINARY_API_KEY=<your-cloudinary-api-key>
     CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
     NEXT_PUBLIC_UPLOAD_PRESET=ml_default
     ```

4. Start the development server:

   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## Project Structure

- **`app/`**: Contains the main pages and routes for the application.
- **`components/`**: Reusable UI components such as buttons, cards, and tables.
- **`context/`**: Context providers for managing global state (e.g., notifications, user data).
- **`lib/`**: Utility functions and configurations (e.g., MongoDB, Cloudinary).
- **`model/`**: Mongoose models for handling notification.
- **`public/`**: Static assets like images and icons.
- **`types/`**: TypeScript type definitions for transactions and reports.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Contributing

We welcome contributions to improve the front-end! Please follow these steps:

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
