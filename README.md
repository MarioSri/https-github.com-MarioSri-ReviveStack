# ReviveStack 🚀

**The marketplace for abandoned SaaS projects where developers can discover hidden gems and give them a second chance at success.**

![ReviveStack Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=ReviveStack+-+Revive+Abandoned+SaaS+Projects)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)

## 🌟 Overview

ReviveStack is a comprehensive marketplace platform that connects sellers of abandoned SaaS projects with developers and entrepreneurs looking to acquire and revive promising software. Our platform provides secure transactions, AI-powered valuations, and comprehensive tools to help buyers successfully revive their acquired projects.

### Key Features

- 🔍 **Smart Discovery**: AI-powered project recommendations and valuations
- 💳 **Secure Transactions**: Stripe-powered escrow system for safe payments
- 🤖 **AI Tools**: Automated documentation generation and tech stack analysis
- 📊 **Analytics Dashboard**: Comprehensive insights for buyers and sellers
- 💬 **Communication Hub**: Built-in messaging system for negotiations
- ⭐ **Trust System**: Rating and review system for community trust
- 🛠️ **Revival Toolkit**: Tools and checklists to help revive projects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase account)
- Stripe account for payments
- OpenAI API key for AI features
- GitHub OAuth app (optional)
- Google OAuth app (optional)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/ReviveStack.git
   cd ReviveStack
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Fill in your environment variables in `.env.local`

4. **Set up the database**
   \`\`\`bash
   # Run the database setup script in your Supabase dashboard
   # Or if using PostgreSQL directly:
   npm run db:setup
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

\`\`\`
ReviveStack/
├── app/                          # Next.js 14 App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── projects/             # Project CRUD operations
│   │   ├── payments/             # Stripe payment handling
│   │   ├── ai/                   # AI-powered features
│   │   └── messaging/            # Communication system
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # User dashboards
│   ├── project/                  # Project detail pages
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── Layout.tsx                # Main layout component
│   ├── ProjectCard.tsx           # Project listing card
│   ├── RevivalToolkit.tsx        # Post-acquisition tools
│   └── MessagingSystem.tsx       # Communication interface
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication hook
│   ├── useProjects.ts            # Project data management
│   └── useMessaging.ts           # Messaging functionality
├── lib/                          # Utility functions and configurations
│   ├── auth.ts                   # Authentication utilities
│   ├── stripe.ts                 # Payment processing
│   ├── supabase.ts               # Database client
│   ├── ai.ts                     # AI service integrations
│   └── utils.ts                  # General utilities
├── public/                       # Static assets
│   ├── images/                   # Images and icons
│   └── docs/                     # Documentation assets
├── tests/                        # Test files
│   ├── __mocks__/                # Test mocks
│   ├── components/               # Component tests
│   └── pages/                    # Page tests
├── docs/                         # Project documentation
│   ├── API.md                    # API documentation
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── CONTRIBUTING.md           # Contribution guidelines
└── scripts/                     # Build and deployment scripts
    ├── setup-db.js              # Database setup
    └── deploy.js                # Deployment script
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Services
OPENAI_API_KEY=sk-...

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

### Database Setup

1. **Using Supabase (Recommended)**
   - Create a new Supabase project
   - Run the SQL script from `lib/database-setup.sql` in the Supabase SQL editor
   - Enable Row Level Security (RLS) policies

2. **Using PostgreSQL directly**
   \`\`\`bash
   npm run db:setup
   \`\`\`

## 🧪 Testing

We use Jest and React Testing Library for testing:

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## 📖 API Documentation

### Authentication Endpoints

- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User sign out

### Project Endpoints

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Payment Endpoints

- `POST /api/checkout` - Create checkout session
- `POST /api/webhook` - Stripe webhook handler
- `GET /api/session` - Get session details

For complete API documentation, see [docs/API.md](docs/API.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards

- Use TypeScript for all new code
- Follow the existing code style (Prettier + ESLint)
- Write tests for new features
- Update documentation as needed

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: NextAuth.js v5, Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel
- **Testing**: Jest, React Testing Library, Playwright

## 📊 Features

### For Sellers
- List abandoned projects with detailed information
- AI-powered project valuation
- Secure escrow transactions
- Communication with potential buyers
- Analytics dashboard for listings

### For Buyers
- Browse and search project listings
- AI-powered project recommendations
- Secure payment processing
- Revival toolkit with documentation generation
- Post-acquisition support tools

### Platform Features
- User authentication and profiles
- Rating and review system
- Messaging system
- Analytics and insights
- Mobile-responsive design

## 🔮 Roadmap

- [ ] **Q1 2024**: Mobile app development
- [ ] **Q2 2024**: Advanced AI features and recommendations
- [ ] **Q3 2024**: International payment support
- [ ] **Q4 2024**: Enterprise features and white-label solutions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [v0.dev](https://v0.dev) for rapid prototyping
- Icons by [Lucide](https://lucide.dev)
- UI components by [shadcn/ui](https://ui.shadcn.com)
- Inspired by the need to revive abandoned open-source projects

## 📞 Support

- 📧 Email: support@revivestack.com
- 💬 Discord: [Join our community](https://discord.gg/revivestack)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ReviveStack/issues)
- 📖 Documentation: [docs.revivestack.com](https://docs.revivestack.com)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/ReviveStack&type=Date)](https://star-history.com/#yourusername/ReviveStack&Date)

---

**Made with ❤️ by the ReviveStack team**

*Give abandoned projects a second chance at success.*
\`\`\`
