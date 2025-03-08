# Instagram CSV Comparer

A powerful Next.js application for comparing and analyzing CSV files, particularly useful for Instagram follower data analysis.

## 🚀 Features

- **CSV File Upload**: Easily upload and manage multiple CSV files
- **Advanced Comparison**: Compare two CSV files to find differences, similarities, and changes
- **Data Visualization**: Analyze your data with intuitive visualizations
- **File Management**: Organize files into folders and apply labels for better organization
- **Export Results**: Export comparison results to new CSV files
- **Demo Mode**: Try the tool with sample data before uploading your own files

## 📋 Prerequisites

- Node.js 18.0 or later
- pnpm or bun package manager (recommended)

## 🛠️ Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/instagram-csv-comparer.git
   cd instagram-csv-comparer
   ```

2. Install dependencies
   ```bash
   pnpm install
   # or
   bun install
   ```

3. Create a `.env.local` file with the following content:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   DEMO_ACCESS_PASSWORD=your-chosen-password
   ```

4. Start the development server
   ```bash
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

The project follows a modular architecture with clear separation of concerns, with all code organized within the `src` directory:

```
instagram-csv-comparer/
├── src/                     # All application code
│   ├── app/                 # Next.js app router pages
│   ├── components/          # UI components
│   │   └── ui/              # Shared UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── modules/             # Feature modules
│   │   ├── authentication/  # Authentication module
│   │   └── ig-csv/          # Instagram CSV module
│   │       ├── api/         # API queries and mutations
│   │       │   ├── mutations/
│   │       │   └── queries/
│   │       ├── models/      # Data models and schemas
│   │       └── store/       # State management with Zustand
│   ├── public/              # Public assets and demo data
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── .env.local               # Environment variables
├── next.config.mjs          # Next.js configuration
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 💻 Usage

1. **Upload CSV Files**: Drag and drop your CSV files or use the file browser
2. **Select Files to Compare**: Choose two files from your uploaded files
3. **View Comparison Results**: See entries that exist only in file 1, only in file 2, in both files, or have differences
4. **Export Results**: Export specific comparison results to new CSV files
5. **Organize Files**: Create folders and labels to organize your files

## 📊 Demo Data

The application includes demo CSV files to help you get started:

- `demo-users-1.csv`: Basic user data sample
- `demo-users-2.csv`: Extended user data sample with additional fields
- `demo-instagram-followers.csv`: Sample Instagram follower data

## 🔒 Authentication

The demo mode is protected with a simple password. Use the password provided in your `.env.local` file to access the demo features.

## 🔧 Technologies Used

- **Next.js**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Accessible UI components built with Radix UI
- **Zustand**: State management
- **Zod**: Schema validation
- **Papa Parse**: CSV parsing
- **Recharts**: Data visualization
- **Jose**: JWT handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests. 