# Suggested Commands

## Development Commands
```bash
npm run dev          # Start development server (with --turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint linting
```

## UI Component Management
```bash
npx shadcn@latest add [component]  # Add new Shadcn/ui component
npx shadcn@latest add button       # Example: add button component
npx shadcn@latest add card         # Example: add card component
```

## Git Commands (Darwin system)
```bash
git status           # Check git status
git add .            # Stage all changes
git commit -m ""     # Commit changes
git push             # Push to remote
git pull             # Pull latest changes
```

## File Operations (Darwin/macOS)
```bash
ls -la               # List files with details
find . -name "*.ts"  # Find TypeScript files
grep -r "pattern"    # Search for patterns
cd path/to/dir       # Change directory
```

## Development Tools
```bash
code .               # Open in VS Code
open .               # Open in Finder (macOS)
```

## Task Completion Checklist
1. Run `npm run lint` to check code quality
2. Run `npm run build` to ensure no build errors
3. Test the feature in development mode
4. Verify GraphQL queries work via BFF `/api/graphql`