################################################################################
##  File:  Install-Jom.ps1
##  Desc:  Install JOM
################################################################################

$ErrorActionPreference = "Stop"

$InstallDir = "C:\jom"

Invoke-WebRequest -Uri "https://download.qt.io/official_releases/jom/jom.zip" -OutFile "jom.zip"
Expand-Archive -Path ".\jom.zip" -DestinationPath $InstallDir
Remove-Item -Path ".\jom.zip"

# Add vcpkg to system environment
Add-MachinePathItem $InstallDir
[Environment]::SetEnvironmentVariable("JOM_INSTALLATION_ROOT", $InstallDir, "Machine")
Update-Environment
