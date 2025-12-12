# MAC - VM Management Dashboard

A full-stack Infrastructure as a Service (IaaS) application for managing AWS EC2 instances through a web interface. This project provides a centralized dashboard to create, monitor, and manage virtual machines (VMs) on AWS EC2.

## Overview

MAC is a modern web application that bridges the gap between AWS EC2 management and user-friendly interfaces. It allows users to:

- **Create EC2 instances** with customizable configurations (instance type, region, owner, etc.)
- **List and browse** all managed VMs with pagination support
- **View detailed information** about VM instances
- **Sync instance data** from AWS to keep information up-to-date
- **Terminate instances** and clean up resources

## Architecture

### Backend (`/server`)
- **Framework**: NestJS (Node.js with TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Cloud Integration**: AWS SDK for EC2 (`@aws-sdk/client-ec2`)
- **API Documentation**: Swagger/OpenAPI
- **Features**:
  - RESTful API endpoints
  - Input validation and error handling
  - Database persistence for VM metadata
  - Multi-region EC2 client support
  - Global exception filters and response interceptors

### Frontend (`/client`)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Features**:
  - Modern, responsive UI
  - State management with React hooks (useReducer)
  - Pagination controls
  - Real-time error handling
  - Form validation

## Project Structure

```
MAC/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── style/         # CSS styles
│   └── package.json
│
├── server/                 # NestJS backend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── controllers/  # API route handlers
│   │   │   ├── services/     # Business logic
│   │   │   ├── models/       # Database entities
│   │   │   ├── dto/          # Data transfer objects
│   │   │   ├── filters/      # Exception filters
│   │   │   └── interceptors/ # Response interceptors
│   │   └── config/           # Configuration
│   └── package.json
│
└── README.md
```

## Key Features

### VM Management
- Create EC2 instances with validation
- Support for multiple instance types
- Configurable regions
- Owner tagging and VM naming
- Min/max count support for batch creation

### Data Synchronization
- Database stores VM metadata locally
- Sync functionality to update instance state from AWS
- Automatic IP address updates
- Instance type verification

### User Interface
- Clean, modern dashboard design
- Paginated VM listing (10 per page)
- Detailed VM information panel
- Instance status and metadata display
- Form-based VM creation
- Error messages and loading states

## API Endpoints

- `POST /` - Create a new VM instance
- `GET /` - List all VMs (with pagination: `?page=1&onpage=10`)
- `GET /:id` - Get VM details by entity ID
- `GET /instances/:id` - Describe EC2 instance and sync database
- `DELETE /instances/:id` - Terminate EC2 instance and delete VM record

API documentation is available at `/api` (Swagger UI) when the server is running.

## Technology Stack

### Backend
- **NestJS** ^11.0.1 - Progressive Node.js framework
- **TypeORM** ^0.3.27 - ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **AWS SDK v3** - EC2 client integration
- **Swagger** - API documentation

### Frontend
- **React** ^19.2.0 - UI library
- **TypeScript** ~5.9.3 - Type safety
- **Vite** ^7.2.4 - Build tool and dev server
- **Axios** ^1.13.2 - HTTP client

## Environment Variables

### Server (`/server`)
```env
# Server Configuration
PORT=3000
VERSION=1.0.0
NODE_ENV=development

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
POSTGRES_USER=db
POSTGRES_PASSWORD=db
POSTGRES_DB=db

# AWS EC2 Configuration
ACCESS_KEY=your_aws_access_key
SECRETE_KEY=your_aws_secret_key
REGION=us-east-1
AMI_ID=ami-xxxxxxxxx
SECURITY_GROUP_ID=sg-xxxxxxxxx
SUBNET_ID=subnet-xxxxxxxxx
VPC_ID=vpc-xxxxxxxxx

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Client (`/client`)
```env
VITE_API_URL=http://localhost:3000
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- AWS account with EC2 access
- AWS credentials (Access Key and Secret Key)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MAC
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   - Create `.env` files in both `server/` and `client/` directories
   - Configure the variables as shown above

5. **Set up the database**
   - Ensure PostgreSQL is running
   - The database will be automatically created by TypeORM on first run

### Running the Application

**Start the backend server:**
```bash
cd server
npm run start:dev
```
The server will run on `http://localhost:3000` (or your configured PORT).

**Start the frontend client:**
```bash
cd client
npm run dev
```
The client will run on `http://localhost:5173` (or Vite's default port).

### Building for Production

**Build the server:**
```bash
cd server
npm run build
npm run start:prod
```

**Build the client:**
```bash
cd client
npm run build
```
The production build will be in `client/dist/`.

## Database Schema

The `VM` entity stores the following information:
- `id` - Primary key (auto-generated)
- `instanceId` - Unique AWS EC2 instance ID
- `instanceType` - EC2 instance type (e.g., t2.micro)
- `vmName` - User-friendly VM name
- `ownerUsername` - Owner identifier
- `region` - AWS region
- `publicIp` - Public IP address (nullable)
- `privateIp` - Private IP address (nullable)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Usage

1. **Create a VM**: Fill out the form with instance type, owner username, VM name, and optionally a region. Click "Create VM" to launch an EC2 instance.

2. **View VMs**: Browse the paginated list of all managed VMs. Click on a VM to view its details.

3. **Describe Instance**: Click "Describe Instance" to fetch the latest information from AWS and sync it with the database.

4. **Delete VM**: Click the delete button to terminate the EC2 instance and remove it from the database.

## Error Handling

The application includes comprehensive error handling:
- Input validation on both client and server
- AWS API error handling
- Database error handling
- User-friendly error messages
- Global exception filters

## Development

- **Linting**: Run `npm run lint` in either directory
- **Testing**: Server includes Jest test configuration
- **Type Checking**: TypeScript is configured for both projects
