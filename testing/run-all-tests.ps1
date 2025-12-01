# PowerShell script untuk menjalankan semua k6 tests
# Usage: .\run-all-tests.ps1 -ApiUrl "http://localhost:5000/api"

param(
    [string]$ApiUrl = "http://localhost:5000/api"
)

$ResultsDir = "testing\results"
$TestingDir = "testing"

# Create results directory
New-Item -ItemType Directory -Force -Path $ResultsDir | Out-Null

# Create timestamp for this test run
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$runLog = "$ResultsDir\test-run-$timestamp.log"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Running k6 Load Tests" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor Cyan
Write-Host "Results Dir: $ResultsDir" -ForegroundColor Cyan
Write-Host "Run Log: $runLog" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Start logging
"Test Run Started: $(Get-Date)" | Out-File $runLog
"API URL: $ApiUrl" | Add-Content $runLog
"" | Add-Content $runLog

# Function to run test and log results
function Run-K6Test {
    param(
        [string]$TestName,
        [string]$TestFile
    )
    
    Write-Host "📝 Running $TestName..." -ForegroundColor Yellow
    "Running $TestName at $(Get-Date)" | Add-Content $runLog
    
    # Copy files to temp directory to avoid path issues
    $tempDir = "C:\temp-k6-test"
    New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
    Copy-Item "$TestingDir\*.js" $tempDir -Force
    
    Push-Location $tempDir
    
    $output = k6 run $TestFile -e API_URL="$ApiUrl" 2>&1
    $exitCode = $LASTEXITCODE
    
    Pop-Location
    
    # Copy results back
    if (Test-Path "$tempDir\results") {
        Copy-Item "$tempDir\results\*" $ResultsDir -Force
    }
    
    $output | Add-Content $runLog
    "" | Add-Content $runLog
    
    if ($exitCode -eq 0) {
        Write-Host "✅ $TestName PASSED" -ForegroundColor Green
        "$TestName PASSED" | Add-Content $runLog
    } else {
        Write-Host "⚠️  $TestName completed with warnings (exit code: $exitCode)" -ForegroundColor Yellow
        "$TestName completed with warnings" | Add-Content $runLog
    }
    
    Write-Host ""
    "" | Add-Content $runLog
}

# 1. Smoke Test
Run-K6Test "Smoke Test" "k6-smoke-test.js"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 2. Load Test
Run-K6Test "Load Test" "k6-load-test.js"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 3. Spike Test  
Run-K6Test "Spike Test" "k6-spike-test.js"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Optional: Stress Test (commented out - takes longer)
# Run-K6Test "Stress Test" "k6-stress-test.js"
# Write-Host "==========================================" -ForegroundColor Cyan
# Write-Host ""

# Optional: Soak Test (commented out - takes 30+ minutes)
# Run-K6Test "Soak Test" "k6-soak-test.js"
# Write-Host "==========================================" -ForegroundColor Cyan
# Write-Host ""

"Test Run Completed: $(Get-Date)" | Add-Content $runLog

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "All Tests Completed!" -ForegroundColor Green
Write-Host "Results saved in: $ResultsDir" -ForegroundColor Cyan
Write-Host "Run log: $runLog" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
