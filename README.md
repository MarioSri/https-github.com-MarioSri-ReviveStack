# ReviveStack 🚀

A marketplace for abandoned SaaS projects where developers can discover hidden gems and give them a second chance at success.

![ReviveStack](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=ReviveStack)

## ✨ Features

- **🔍 Project Discovery**: Browse abandoned SaaS projects with detailed analytics
- **🤖 AI Valuation**: Automated project valuation using OpenAI
- **💳 Secure Payments**: Stripe-powered escrow system for safe transactions
- **📊 GitHub Integration**: Automatic repository analysis and health scoring
- **👥 User Profiles**: Reputation system for buyers and sellers
- **🔒 Authentication**: Secure login with GitHub OAuth and email/password

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (or Supabase)
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe Connect
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- Stripe account
- GitHub OAuth app
- OpenAI API key

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/revivestack.git
   cd revivestack
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   npm run setup
   \`\`\`
   This creates a `.env.local` template. Fill in your actual values.

4. **Set up the database**
   \`\`\`bash
   npx prisma db push
   npx prisma generate
   \`\`\`

5. **Seed the database (optional)**
   \`\`\`bash
   npm run db:seed
   \`\`\`

6. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [API Documentation](./docs/api.md) - API endpoints and usage
- [Database Schema](./docs/schema.md) - Database structure and relationships

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | ✅ |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | ✅ |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | ✅ |

See [SETUP.md](./SETUP.md) for a complete list.

## 🧪 Testing

\`\`\`bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
\`\`\`

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [v0.dev](https://v0.dev) for rapid prototyping
- Inspired by the need to revive abandoned open-source projects
- Thanks to the open-source community for amazing tools and libraries

## 📞 Support

- 📧 Email: support@revivestack.com
- 💬 Discord: [Join our community](https://discord.gg/revivestack)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/revivestack/issues)

---

Made with ❤️ by the ReviveStack team
