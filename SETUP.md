# ReviveStack Setup Guide

This guide will help you set up ReviveStack, a marketplace for abandoned SaaS projects.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Supabase)
- Stripe account
- GitHub account
- OpenAI API key
- Vercel account (for deployment)

## Environment Variables

Make sure you have all the required environment variables set up in your Vercel project:

### Database
- `DATABASE_URL` - PostgreSQL connection string
- `POSTGRES_URL` - Alternative PostgreSQL URL
- `POSTGRES_PRISMA_URL` - Prisma-specific PostgreSQL URL

### Supabase (Alternative to direct PostgreSQL)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### Authentication
- `NEXTAUTH_SECRET` - Random string for NextAuth.js
- `NEXTAUTH_URL` - Your app's URL (e.g., https://your-app.vercel.app)
- `GITHUB_CLIENT_ID` - GitHub OAuth app client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth app client secret

### Payments
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Public Stripe key for frontend
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook endpoint secret

### External APIs
- `GITHUB_TOKEN` - GitHub personal access token
- `OPENAI_API_KEY` - OpenAI API key for AI valuations

### App Configuration
- `NEXT_PUBLIC_BASE_URL` - Your app's base URL
- `NEXT_PUBLIC_URL` - Alternative app URL

## Setup Steps

### 1. Database Setup

If using Supabase:
1. Create a new Supabase project
2. Run the SQL script from `lib/database-setup.sql` in the Supabase SQL editor
3. Enable Row Level Security (RLS) policies

If using direct PostgreSQL:
1. Create a PostgreSQL database
2. Run `npx prisma db push` to create tables
3. Run `npx prisma generate` to generate the Prisma client

### 2. GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - Application name: ReviveStack
   - Homepage URL: https://your-app.vercel.app
   - Authorization callback URL: https://your-app.vercel.app/api/auth/callback/github
3. Copy the Client ID and Client Secret to your environment variables

### 3. Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Set up Stripe Connect for marketplace functionality:
   - Enable Express accounts
   - Configure your platform settings
4. Create a webhook endpoint pointing to `/api/webhook`
5. Add the webhook secret to your environment variables

### 4. OpenAI Setup

1. Create an OpenAI account
2. Generate an API key
3. Add it to your environment variables

### 5. GitHub Token Setup

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with `repo` and `user` scopes
3. Add it to your environment variables

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add all environment variables in the Vercel dashboard
3. Deploy the application

### Database Migration

After deployment, run the database setup:

\`\`\`bash
# If using Prisma
npx prisma db push
npx prisma generate

# If using Supabase, run the SQL script in the Supabase dashboard
\`\`\`

## Testing

1. Visit your deployed application
2. Test user registration and login
3. Try importing a GitHub repository
4. Test the project listing flow
5. Verify Stripe payment integration (use test mode)

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify your DATABASE_URL is correct
   - Check if your database is accessible from Vercel

2. **Authentication Issues**
   - Verify GitHub OAuth app settings
   - Check NEXTAUTH_URL matches your deployment URL

3. **Stripe Issues**
   - Ensure webhook endpoint is correctly configured
   - Verify all Stripe keys are in the correct environment

4. **GitHub API Issues**
   - Check if your GitHub token has the required permissions
   - Verify the token hasn't expired

## Security Considerations

1. **Environment Variables**: Never commit sensitive environment variables to your repository
2. **Rate Limiting**: The app includes basic rate limiting for API routes
3. **Input Validation**: All user inputs are validated using Zod schemas
4. **Authentication**: Secure authentication with NextAuth.js
5. **Database Security**: Row Level Security (RLS) policies protect user data

## Monitoring and Analytics

Consider adding:
- Error tracking (e.g., Sentry)
- Analytics (e.g., Vercel Analytics)
- Performance monitoring
- Database monitoring

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Review the database logs
3. Check Stripe webhook logs
4. Verify all environment variables are set correctly
\`\`\`

Let's create a development setup script:
