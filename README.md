# Instagram Snitch'r

A modern web application that helps you track who unfollowed you on Instagram. Compare your follower lists over time, identify unfollowers, and analyze your Instagram follower data with style.

![Next.js](https://img.shields.io/badge/Next.js-13-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-ff69b4)
![Zustand](https://img.shields.io/badge/Zustand-4.4-orange)

## 🌟 Features

- 🕵️ Track who unfollowed you on Instagram
- 📊 Compare follower lists over time
- 🔄 Identify new followers and unfollowers
- 📈 Analyze follower data with detailed insights
- 🎨 Beautiful, responsive UI with dark/light mode
- ⚡ Fast and efficient data processing
- 🔒 All processing done client-side for privacy
- 💾 Client-side data persistence with Zustand
- 👤 User authentication and personalized spaces

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/remcostoeten/Instagram-snitchr-find-out-who-unfollowed-you.git
cd Instagram-snitchr-find-out-who-unfollowed-you
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Important Notice: Data Generation

Currently, the application requires manually generated CSV files of your Instagram followers/following lists. 

### Current Method
We currently use the [Instagram Followers Exporter](https://chromewebstore.google.com/detail/instagram-volgers-exporte/ehbjlcniiagahknoclpikfjgnnggkoac) Chrome extension to generate the CSV files. After generating the files, you can upload them to Snitch'r for comparison.

### 🔄 Automation Plans
We are actively working on automating the data collection process. The planned automation will include:

- Backend service (Python or TypeScript) to periodically fetch Instagram data
- Automated data collection on a CRON schedule
- Direct integration with Instagram's API (where possible)
- Secure storage of historical data for trend analysis

This automation will eliminate the need for manual data collection and provide more consistent tracking.

## 🛠️ Tech Stack

### Current Implementation
- **Framework:** Next.js 13+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui
- **Animations:** Framer Motion
- **State & Storage:** 
  - Zustand for client-side state management
  - Local storage persistence for user data
- **Form Validation:** Zod
- **Authentication:** Custom JWT implementation with jose

### 🗺️ Roadmap

#### Phase 1: Enhanced Data Storage
- Implementation of Drizzle ORM with SQLite
- Data encryption using bcryptjs
- Secure storage of user preferences and historical data
- Automated backup system

#### Phase 2: Advanced Features
- Real-time unfollower notifications
- Advanced analytics dashboard
- Export customization options

#### Phase 3: Security & Performance
- End-to-end encryption for sensitive data
- Rate limiting and request caching
- Performance optimizations for large datasets
- Advanced user roles and permissions

## 📁 Project Structure

```
src/
├── app/                   # Next.js app router pages
├── components/           # React components
├── core/                # Core configuration
├── hooks/               # Custom React hooks
├── modules/             # Feature modules
│   ├── auth/           # Authentication module
│   └── ig-csv/         # Instagram data handling
├── shared/             # Shared utilities
└── types/              # TypeScript types
```

## 🔐 Data Storage

### Current Implementation
- Client-side state management using Zustand
- Persistent storage using localStorage
- Secure handling of sensitive data
- Data structure optimized for quick comparisons

### Future Implementation (In Progress)
- **Database:** SQLite with Drizzle ORM
- **Encryption:** bcryptjs for sensitive data
- **Storage:**
  - User preferences
  - Historical follower data
  - Comparison results
  - Analytics data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/remcostoeten/Instagram-snitchr-find-out-who-unfollowed-you)
- [Issue Tracker](https://github.com/remcostoeten/Instagram-snitchr-find-out-who-unfollowed-you/issues)

## ✨ Acknowledgments

- [Instagram Followers Exporter](https://chromewebstore.google.com/detail/instagram-volgers-exporte/ehbjlcniiagahknoclpikfjgnnggkoac) for current data generation
- All contributors and users of this project 