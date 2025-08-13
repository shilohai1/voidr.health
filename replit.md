# VOIDR Health - AI-Powered Medical Education Platform

## Overview

VOIDR Health is a comprehensive AI-powered medical education platform designed for medical students, residents, and healthcare professionals. The application provides three main tools: ClinicBot (medical document summarization), AskVoidr (symptom analysis), and CaseWise (medical case simulations). Built with modern web technologies, it features a React frontend with TypeScript, an Express.js backend, and uses Supabase for authentication and data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom component library (shadcn/ui)
- **State Management**: React Context API for authentication, React Query for server state
- **Routing**: React Router for client-side navigation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Server**: Express.js with TypeScript
- **API Pattern**: RESTful APIs under `/api` prefix
- **Database**: PostgreSQL via Neon serverless with Drizzle ORM
- **Authentication**: Supabase Auth with JWT tokens
- **File Processing**: Edge functions for AI-powered content generation

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle with schema-first approach
- **File Storage**: Supabase Storage for user-generated content
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

## Key Components

### Authentication System
- Supabase-based authentication with email/password
- Protected routes using React Context
- User profiles with subscription tracking
- JWT token management for API access

### AI Integration Services
1. **ClinicBot**: Document summarization using OpenAI API
2. **AskVoidr**: Symptom analysis with medical AI
3. **CaseWise**: Medical case generation and simulation
4. **StudyWithAI**: Video generation (coming soon feature)

### Subscription Management
- Tiered subscription system (Free, Clinical Starter/Pro, Wise Starter/Pro, Launch Bundle)
- Usage tracking for notes and simulations
- Feature gating based on subscription level
- Polar.sh integration for payment processing

### UI Components
- Custom liquid glass design system
- Responsive design with mobile-first approach
- Animated components using Framer Motion
- Accessible components from Radix UI primitives

## Data Flow

1. **User Authentication**: Supabase handles login/signup → JWT tokens for API access
2. **Content Generation**: Frontend sends requests → Edge functions process with OpenAI → Results stored in database
3. **Subscription Validation**: Each request checks user subscription → Usage limits enforced → Features enabled/disabled accordingly
4. **File Processing**: Files uploaded → Base64 encoded → Processed by AI → Summaries generated and stored

## External Dependencies

### Authentication & Database
- **Supabase**: Authentication, database, edge functions, and file storage
- **Neon Database**: PostgreSQL serverless database hosting

### AI Services
- **OpenAI API**: Text processing, summarization, and analysis
- **ElevenLabs**: Text-to-speech for future features

### Payment Processing
- **Polar.sh**: Subscription management and payment processing
- **Webhooks**: Real-time subscription status updates

### Development Tools
- **Vercel/Replit**: Deployment and hosting
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development Environment
- Vite dev server for frontend hot reloading
- TSX for TypeScript execution in development
- Environment variables for API keys and database connections

### Production Build
- Vite builds frontend to `dist/public`
- ESBuild bundles backend to `dist/index.js`
- Static assets served by Express in production
- Database migrations via Drizzle Kit

### Environment Configuration
- Database URL required for PostgreSQL connection
- API keys for OpenAI, ElevenLabs, and Supabase
- Webhook secrets for payment processing
- Production/development environment detection

### Scaling Considerations
- Serverless edge functions for AI processing
- Connection pooling for database efficiency
- CDN-ready static asset structure
- Modular component architecture for feature expansion

## Recent Blog System Optimization (February 2024)

### Performance Enhancements
- **Pagination System**: 12 posts per page with smooth navigation
- **Caching Strategy**: 5-minute in-memory cache for optimal performance  
- **Search Functionality**: Real-time search across titles, excerpts, authors, and categories
- **Scalability**: Designed to handle up to 10,000 blog posts efficiently
- **Product Integration**: Automatic VOIDR Health product cards on every blog post

### Content Management
- **Simple Data File**: TypeScript-based blog data management in `client/src/lib/blogData.ts`
- **Easy Addition**: Adding new posts requires only editing one file
- **Dynamic Categories**: Automatic category generation and filtering
- **SEO Optimized**: Built-in meta tags and structured data

### Technical Implementation
- **Blog Service**: Optimized service layer with caching (`client/src/lib/blogService.ts`)
- **Pagination Logic**: Efficient client-side pagination with server-side patterns
- **Performance**: "Smooth like butter" loading with no delays or lags
- **Responsive Design**: Mobile-first approach with liquid glass design system