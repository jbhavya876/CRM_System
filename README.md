# CRM System

A modern, full-stack Customer Relationship Management (CRM) system designed for lead management and loan processing. This system features intelligent lead scoring, automated assignment, and real-time notifications powered by a robust queue system.

## 🚀 Features

### Lead Management

- **Intelligent Lead Scoring**: Automated scoring engine based on configurable rules
- **Smart Assignment**: Automatic lead distribution to loan officers based on speciality and availability
- **Lead Protection**: Prevents duplicate lead processing with built-in safeguards
- **Multi-Channel Entry**: Support for both API-based and manual lead entry

### Authentication & Security

- **JWT-based Authentication**: Secure token-based authentication system
- **Role-Based Access Control**: Support for multiple user roles (Admin, Loan Officer)
- **Password Encryption**: Bcrypt-powered password hashing

### Real-Time Processing

- **Queue System**: BullMQ-powered background job processing
- **Notification System**: Automated notifications for new leads and status updates
- **Worker Process**: Dedicated worker for asynchronous task processing

### Dashboard & Analytics

- **Officer Dashboard**: Personalized dashboard for loan officers
- **Lead Tracking**: Comprehensive lead status tracking and management
- **Performance Metrics**: Real-time analytics and reporting

## 🏗️ Architecture

### Backend

- **Framework**: Fastify (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Queue**: BullMQ with Redis
- **Authentication**: JWT (@fastify/jwt)

### Frontend

- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Form Management**: React Hook Form with Zod validation
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20 or higher
- **pnpm**: v10.13.1 or higher
- **PostgreSQL**: v12 or higher
- **Redis**: v6 or higher

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd crm_system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/crm_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key-here
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Database Setup

Run the database migrations and seed data:

```bash
cd backend
# Run your database initialisation scripts
pnpm run migrate  # If you have migrations
```

Create an admin user:

```bash
pnpm run ts-node src/scripts/create-admin.ts
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend Server:**

```bash
cd backend
pnpm run dev
```

**Terminal 2 - Background Worker:**

```bash
cd backend
pnpm run worker
```

**Terminal 3 - Frontend:**

```bash
cd frontend
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

### Production Mode

**Backend:**

```bash
cd backend
pnpm run build
pnpm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm start
```

## 📁 Project Structure

```
crm_system/
├── backend/
│   ├── src/
│   │   ├── db/              # Database connection and queries
│   │   ├── plugins/         # Fastify plugins (auth, etc.)
│   │   ├── queues/          # BullMQ queue definitions
│   │   ├── routes/          # API route handlers
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── scripts/         # Utility scripts
│   │   ├── services/        # Business logic services
│   │   ├── types/           # TypeScript type definitions
│   │   ├── workers/         # Background job workers
│   │   └── server.ts        # Main server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/                 # Next.js app directory
    ├── components/          # React components
    ├── lib/                 # Utility libraries
    ├── services/            # API service layer
    ├── public/              # Static assets
    ├── package.json
    └── tsconfig.json
```

## 🔌 API Endpoints

### Public Endpoints

- `POST /api/leads/entry` - Submit a new lead (public form submission)

### Protected Endpoints (Require Authentication)

- `POST /api/manual-entry` - Manual lead entry by officers
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/officer/leads` - Get assigned leads
- `PUT /api/officer/leads/:id` - Update lead status

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## 🧪 Testing

```bash
# Backend tests
cd backend
pnpm test

# Frontend tests
cd frontend
npm test
```

## 🔧 Configuration

### Scoring Rules

The scoring engine uses configurable rules stored in the database. Rules can be managed through:

- Database table: `scoring_rules`
- Categories: EMPLOYMENT, AMOUNT, LOAN_TYPE
- Operators: EQUALS, LESS_THAN, GREATER_THAN, CONTAINS

### Lead Assignment

Officers are assigned based on:

- Loan type specialty (BUSINESS_LOAN, HOME_LOAN, ALL)
- Random distribution among qualified officers
- Availability status

## 📊 Database Schema

Key tables:

- `leads` - Lead information and status
- `users` - System users (officers, admins)
- `scoring_rules` - Configurable scoring rules
- `lead_assignments` - Lead-to-officer assignments
- `lead_history` - Audit trail of lead changes

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration for frontend-backend communication
- SQL injection prevention with parameterised queries
- Input validation with Zod schemas
- Idempotency key support for duplicate prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Author

- Bhavya Jain - Initial work

## 🙏 Acknowledgments

- Fastify team for the excellent web framework
- Next.js team for the React framework
- BullMQ for the robust queue system

## 📞 Support

If you need help, please email jbhavya876@gmail.com or open an issue in the repository.

---

**Built with ❤️ using TypeScript, Fastify, and Next.js**
