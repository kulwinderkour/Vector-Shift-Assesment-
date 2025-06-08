# VectorShift Pipeline Builder

A ReactFlow-based visual pipeline builder with PostgreSQL backend integration, featuring node abstraction, dynamic components, and comprehensive pipeline management.

## Features

- **Visual Pipeline Builder**: Drag-and-drop interface for creating data processing workflows
- **Multiple Node Types**: Input, Output, Text, LLM, Math, API, Condition, Loop, and Data Store nodes
- **PostgreSQL Integration**: Full database persistence with Drizzle ORM
- **Real-time Validation**: DAG (Directed Acyclic Graph) validation
- **Export/Import**: JSON export and shareable pipeline links
- **Node Management**: Delete, edit, and configure nodes with real-time updates
- **Responsive UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: React 18, TypeScript, ReactFlow, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: Zustand
- **Build Tool**: Vite
- **Validation**: Zod schemas

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Git

## Local Setup Instructions

### 1. Clone and Setup Project

```bash
# Create project directory
mkdir vectorshift-pipeline-builder
cd vectorshift-pipeline-builder

# Initialize Node.js project
npm init -y

# Install all dependencies (copy package.json first, then run this)
npm install
```

### 2. Database Setup

```bash
# Install PostgreSQL locally or use Docker
# For Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib

# For macOS with Homebrew:
brew install postgresql
brew services start postgresql

# Create database
sudo -u postgres createdb vectorshift_db

# Create user (optional)
sudo -u postgres createuser --interactive
```

### 3. Environment Variables

Create `.env` file in root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/vectorshift_db"
NODE_ENV=development
PORT=5000
```

### 4. Database Migration

```bash
# Push database schema
npm run db:push
```

### 5. Run Development Server

```bash
# Start the application
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
vectorshift-pipeline-builder/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── BaseNode.tsx
│   │   │   ├── PipelineCanvas.tsx
│   │   │   ├── PipelineToolbar.tsx
│   │   │   ├── PipelineActions.tsx
│   │   │   ├── NodeDocumentation.tsx
│   │   │   └── SubmitButton.tsx
│   │   ├── nodes/          # Node type definitions
│   │   │   ├── InputNode.tsx
│   │   │   ├── OutputNode.tsx
│   │   │   ├── TextNode.tsx
│   │   │   ├── LLMNode.tsx
│   │   │   ├── MathNode.tsx
│   │   │   ├── APINode.tsx
│   │   │   ├── ConditionNode.tsx
│   │   │   ├── LoopNode.tsx
│   │   │   └── DataNode.tsx
│   │   ├── store/          # State management
│   │   │   └── useStore.ts
│   │   ├── lib/            # Utilities
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── hooks/          # Custom hooks
│   │   │   └── use-toast.ts
│   │   ├── utils/          # Helper utilities
│   │   │   └── nodeTypes.ts
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── db.ts              # Database connection
│   ├── storage.ts         # Data access layer
│   ├── routes.ts          # API routes
│   ├── index.ts           # Server entry point
│   └── vite.ts            # Vite development configuration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and validation
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── drizzle.config.ts      # Database configuration
└── tsconfig.json          # TypeScript configuration
```

## API Endpoints

- `POST /api/pipelines/parse` - Validate and analyze pipeline structure
- `GET /api/pipelines?userId=1` - Get user's pipelines
- `GET /api/pipelines/:id` - Get specific pipeline
- `POST /api/pipelines` - Save new pipeline
- `PUT /api/pipelines/:id` - Update pipeline
- `DELETE /api/pipelines/:id` - Delete pipeline

## Usage

1. **Create Pipeline**: Drag nodes from the sidebar to the canvas
2. **Connect Nodes**: Drag from output handles (right) to input handles (left)
3. **Configure Nodes**: Click on nodes to edit their properties
4. **Delete Nodes**: Hover over nodes and click the red X button
5. **Validate**: Use Submit Pipeline to check DAG validity
6. **Save**: Click Save to store in database
7. **Export**: Download as JSON or create shareable links

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push  # Push schema changes

# Type checking
npm run check
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License