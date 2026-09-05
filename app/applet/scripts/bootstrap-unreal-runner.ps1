# bootstrap-unreal-runner.ps1
#
# DESCRIPTION:
# This script configures a dedicated GitHub Actions runner on a Windows machine
# specifically for building Unreal Engine projects.
#
# REQUIREMENTS:
# 1. Run this PowerShell script as Administrator on the physical machine where UE5 is installed.
# 2. Provide the repository URL and a runner registration token (obtained from GitHub Settings -> Actions -> Runners).

param (
    [Parameter(Mandatory=$true)][string]$RepositoryUrl,
    [Parameter(Mandatory=$true)][string]$RunnerToken,
    [string]$UnrealEngineRoot = "C:\Program Files\Epic Games\UE_5.4",
    [string]$RunnerName = "Unreal-Local-Builder"
)

Write-Host "Creating dedicated builder directory..."
$RunnerDir = "C:\actions-runner"
if (-not (Test-Path -Path $RunnerDir)) {
    New-Item -ItemType Directory -Path $RunnerDir
}
Set-Location -Path $RunnerDir

Write-Host "Downloading GitHub Actions Runner payload..."
# Note: Ensure URL is updated to the latest runner version as needed.
$RunnerUrl = "https://github.com/actions/runner/releases/download/v2.316.1/actions-runner-win-x64-2.316.1.zip"
Invoke-WebRequest -Uri $RunnerUrl -OutFile "actions-runner.zip"

Write-Host "Extracting runner..."
Expand-Archive -Path "actions-runner.zip" -DestinationPath . -Force
Remove-Item "actions-runner.zip"

Write-Host "Setting UNREAL_ENGINE_ROOT environment variable securely for this machine..."
[System.Environment]::SetEnvironmentVariable("UNREAL_ENGINE_ROOT", $UnrealEngineRoot, [System.EnvironmentVariableTarget]::Machine)

Write-Host "Configuring GitHub Actions Runner with tags 'self-hosted', 'unreal'..."
.\config.cmd --url $RepositoryUrl --token $RunnerToken --name $RunnerName --labels "self-hosted,unreal" --runasservice --windowslogonaccount "NT AUTHORITY\NetworkService" --unattended

Write-Host "Starting runner service..."
Start-Service "actions.runner.*"

Write-Host "Bootstrap Complete. Runner is active and listening for Unreal build jobs."
