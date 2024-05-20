################################################################################
##  File:  Install-Jom.ps1
##  Desc:  Install JOM
################################################################################

Set-Location $PSScriptRoot\..

$InstallDir = 'C:\jom'

Invoke-WebRequest -Uri "https://download.qt.io/official_releases/jom/jom.zip" -OutFile "jom.zip" -Verbose
Expand-Archive -Path ".\jom.zip" -DestinationPath $InstallDir -Verbose
Remove-Item -Path ".\jom.zip" -Verbose

npm install
node $PSScriptRoot\main.js --path $InstallDir
