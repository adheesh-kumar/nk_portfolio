# Refresh PATH environment variable to include Node.js
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Navigate to the project directory
Set-Location $PSScriptRoot

# Check if npm is available
$npmPath = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmPath) {
    Write-Host "ERROR: npm not found. Please restart your terminal or add Node.js to PATH manually." -ForegroundColor Red
    Write-Host "Node.js should be installed at: C:\Program Files\nodejs\" -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Run npm dev script
npm run dev

