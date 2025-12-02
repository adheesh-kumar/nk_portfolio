# Setup Instructions

## Installing Node.js (Required)

To run `npm dev`, you need Node.js installed. Here are the easiest ways:

### Option 1: Direct Download (Recommended)
1. Go to https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
3. Run the installer (.msi file)
4. Follow the installation wizard (keep all default options)
5. **Restart your terminal/PowerShell** after installation
6. Verify installation by running: `node --version` and `npm --version`

### Option 2: Using Windows Package Manager (winget)
If you have Windows 10/11 with winget installed, run in PowerShell (as Administrator):
```powershell
winget install OpenJS.NodeJS.LTS
```

### Option 3: Using Chocolatey
If you have Chocolatey installed, run in PowerShell (as Administrator):
```powershell
choco install nodejs-lts
```

## After Installing Node.js

1. **Restart your terminal/PowerShell** (important!)

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev
   ```
   
   Or use the provided startup scripts:
   - Double-click `start-dev.bat`
   - OR run `.\start-dev.ps1` in PowerShell

The server will start at `http://localhost:3000` and automatically open your portfolio in the browser.

## Troubleshooting

### If `npm` command is not recognized:

**Option 1: Use the provided startup scripts (Easiest)**
- Double-click `start-dev.bat` to start the server
- OR run `.\start-dev.ps1` in PowerShell

**Option 2: Restart your terminal/IDE**
- Close and reopen your terminal/PowerShell window
- Close and reopen Cursor/VS Code completely
- This reloads the PATH environment variable

**Option 3: Refresh PATH manually in current session**
Run this in PowerShell:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Other Issues

- If you get port 3000 already in use, the script will use the next available port
- Make sure you're in the project root directory when running `npm dev`

