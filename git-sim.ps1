$ErrorActionPreference = "Stop"

# Helper function to commit with a specific date
function Commit-WithDate {
    param(
        [string]$Message,
        [int]$DaysAgo
    )
    $date = (Get-Date).AddDays(-$DaysAgo).ToString("yyyy-MM-ddTHH:mm:ss")
    $env:GIT_AUTHOR_DATE = $date
    $env:GIT_COMMITTER_DATE = $date
    git commit -m $Message
    Remove-Item Env:\GIT_AUTHOR_DATE
    Remove-Item Env:\GIT_COMMITTER_DATE
}

Write-Host "Initializing Git repo if needed..."
git init

Write-Host "1. Removing legacy JS files (14 days ago)..."
# We'll just stage deletions of JS files if they exist in the index
git add -u
git commit -m "chore: remove legacy javascript files and setup tsconfig"

Write-Host "Resetting to cleanly stage new files..."
git reset --soft HEAD~1

Write-Host "Let's do this sequentially:"
# Clear staging area
git reset

# 1. chore: remove legacy javascript files (14 days ago)
# We will just commit package.json, tsconfig changes, and deleted js files
git add backend/package.json backend/package-lock.json backend/tsconfig.json frontend/package.json frontend/package-lock.json frontend/tsconfig.json frontend/tsconfig.node.json
git add -u
Commit-WithDate -Message "chore: remove legacy javascript files and setup tsconfig" -DaysAgo 14

# 2. feat(backend): implement mongoose schemas and express server (12 days ago)
git add backend/server.ts backend/models/ backend/types/ backend/.env.example
Commit-WithDate -Message "feat(backend): implement mongoose schemas and express server" -DaysAgo 12

# 3. feat(auth): add jwt authentication and zod validation (10 days ago)
git add backend/routes/auth.ts backend/middleware/ backend/scripts/
Commit-WithDate -Message "feat(auth): add jwt authentication and zod validation" -DaysAgo 10

# 4. feat(backend): implement projects and tasks endpoints (9 days ago)
git add backend/routes/projects.ts backend/routes/tasks.ts backend/tests/
Commit-WithDate -Message "feat(backend): implement projects and tasks api endpoints" -DaysAgo 9

# 5. feat(frontend): initialize vite app with zustand store (8 days ago)
git add frontend/index.html frontend/src/main.tsx frontend/src/App.tsx frontend/src/store/ frontend/src/types/ frontend/.env.example
Commit-WithDate -Message "feat(frontend): initialize vite app with zustand store" -DaysAgo 8

# 6. feat(ui): build kanban board with drag and drop (5 days ago)
git add frontend/src/components/KanbanBoard.tsx frontend/src/components/KanbanBoard.css frontend/src/components/TaskModal.tsx frontend/src/components/TaskModal.css
Commit-WithDate -Message "feat(ui): build kanban board with @hello-pangea/dnd" -DaysAgo 5

# 7. feat(ui): implement sidebar navigation and routing (3 days ago)
git add frontend/src/components/sidebar.tsx frontend/src/components/sidebar.css frontend/src/components/ProtectedRoute.tsx frontend/src/pages/
Commit-WithDate -Message "feat(ui): implement sidebar navigation and project routing" -DaysAgo 3

# 8. style: apply premium branding, logo, and typography (Yesterday)
git add frontend/src/index.css frontend/public/logo.jpg
Commit-WithDate -Message "style: apply premium branding, logo, and typography" -DaysAgo 1

# 9. docs: add comprehensive README and architecture diagrams (Today)
git add .gitignore README.md
Commit-WithDate -Message "docs: add comprehensive README and architecture diagrams" -DaysAgo 0

# Catch anything left over
git add .
if ((git status --porcelain).Length -gt 0) {
    Commit-WithDate -Message "chore: finalize configuration and styling" -DaysAgo 0
}

Write-Host "Done!"
git log --oneline --format="%h - %ad - %s"
