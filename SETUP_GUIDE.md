# Complete Local Setup Guide for VectorShift Pipeline Builder

## Prerequisites Installation

### 1. Install Node.js (v18 or higher)
```bash
# Windows: Download from https://nodejs.org/
# macOS with Homebrew:
brew install node

# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install PostgreSQL
```bash
# Windows: Download from https://www.postgresql.org/download/windows/

# macOS with Homebrew:
brew install postgresql
brew services start postgresql

# Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### 3. Install Git
```bash
# Windows: Download from https://git-scm.com/
# macOS: git should be pre-installed or install with Xcode tools
# Ubuntu/Debian:
sudo apt install git
```

### 4. Install VS Code
Download from https://code.visualstudio.com/

**Recommended VS Code Extensions:**
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- PostgreSQL
- Thunder Client (for API testing)

## Project Setup

### Step 1: Create Project Directory
```bash
mkdir vectorshift-pipeline-builder
cd vectorshift-pipeline-builder
```

### Step 2: Initialize Project
```bash
npm init -y
```

### Step 3: Copy All Files
Copy the provided files into the following structure:

```
vectorshift-pipeline-builder/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── drizzle.config.ts
├── .env
├── README.md
├── client/
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       │   ├── BaseNode.tsx
│       │   ├── PipelineCanvas.tsx
│       │   ├── PipelineToolbar.tsx
│       │   ├── PipelineActions.tsx
│       │   ├── NodeDocumentation.tsx
│       │   ├── SubmitButton.tsx
│       │   ├── DraggableNode.tsx
│       │   └── ui/ (all UI components)
│       ├── nodes/
│       │   ├── InputNode.tsx
│       │   ├── OutputNode.tsx
│       │   ├── TextNode.tsx
│       │   ├── LLMNode.tsx
│       │   ├── MathNode.tsx
│       │   ├── APINode.tsx
│       │   ├── ConditionNode.tsx
│       │   ├── LoopNode.tsx
│       │   └── DataNode.tsx
│       ├── store/
│       │   └── useStore.ts
│       ├── lib/
│       │   ├── queryClient.ts
│       │   └── utils.ts
│       ├── hooks/
│       │   └── use-toast.ts
│       └── utils/
│           └── nodeTypes.ts
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── db.ts
│   └── vite.ts
└── shared/
    └── schema.ts
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Database Setup
```bash
# Create database
sudo -u postgres createdb vectorshift_db

# Create user (replace with your preferred credentials)
sudo -u postgres psql
CREATE USER vectorshift_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vectorshift_db TO vectorshift_user;
\q
```

### Step 6: Environment Configuration
Create `.env` file:
```env
DATABASE_URL="postgresql://vectorshift_user:your_password@localhost:5432/vectorshift_db"
NODE_ENV=development
PORT=5000
```

### Step 7: Database Schema Setup
```bash
npm run db:push
```

### Step 8: Start Development Server
```bash
npm run dev
```

Visit http://localhost:5000 to see the application.

## VS Code Setup

### 1. Open Project in VS Code
```bash
code .
```

### 2. Create VS Code Workspace Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

### 3. Create VS Code Tasks
Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "npm run dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Database Push",
      "type": "shell",
      "command": "npm run db:push",
      "group": "build"
    }
  ]
}
```

## Troubleshooting

### Common Issues:

1. **Port 5000 already in use**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **PostgreSQL connection failed**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   
   # Start PostgreSQL if not running
   sudo systemctl start postgresql
   ```

3. **Database permissions error**
   ```bash
   # Grant permissions to user
   sudo -u postgres psql
   GRANT ALL PRIVILEGES ON DATABASE vectorshift_db TO vectorshift_user;
   GRANT ALL ON SCHEMA public TO vectorshift_user;
   ```

4. **Node modules not found**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database operations
npm run db:push

# Install new package
npm install package-name

# Install dev dependency
npm install -D package-name
```

## Testing the Application

1. **Open browser** to http://localhost:5000
2. **Drag nodes** from the left sidebar to the canvas
3. **Connect nodes** by dragging from output (right) to input (left) handles
4. **Test deletion** by hovering over nodes and clicking the red X
5. **Test submission** by clicking Submit Pipeline
6. **Test save** by clicking Save button
7. **Test export** by clicking Export button

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in environment
2. Use a production PostgreSQL database
3. Run `npm run build` to create production build
4. Use `npm start` to run production server
5. Consider using PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "vectorshift" -- start
   ```

This completes the setup guide. The application should now be running locally with full functionality.