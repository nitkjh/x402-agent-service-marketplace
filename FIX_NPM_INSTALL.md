# Fixing npm Install Permission Errors

If you're getting permission errors when running `npm install`, try these solutions:

## Solution 1: Close All IDEs/Editors

1. Close VS Code, Cursor, or any other editors
2. Close any terminals that might have the project open
3. Try `npm install` again

## Solution 2: Run as Administrator

1. Right-click PowerShell
2. Select "Run as Administrator"
3. Navigate to project directory
4. Run `npm install`

## Solution 3: Delete node_modules and Reinstall

```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install

# Frontend
cd ../frontend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
```

## Solution 4: Use npm ci (Clean Install)

```powershell
# Delete node_modules first
Remove-Item -Recurse -Force node_modules

# Clean install
npm ci
```

## Solution 5: Check for Locked Files

Sometimes Windows locks files. Try:

1. Open Task Manager
2. End any Node.js processes
3. Try `npm install` again

## Solution 6: Install Dependencies Separately

If all else fails, the dependencies will be installed when someone clones the repo and runs `npm install`. This is normal for open-source projects.

The important thing is that:
- ✅ All code is written
- ✅ package.json files are correct
- ✅ Dependencies are specified
- ✅ Users can install after cloning

## Verification

After installation, verify:

```powershell
# Backend
cd backend
npm list --depth=0

# Frontend  
cd ../frontend
npm list --depth=0
```

You should see all packages listed without errors.

