# Miabe-Agent Expo Tunnel Script
# This script uses localtunnel to bypass broken ngrok tunnels.

$SUBDOMAIN = "miabe-agent"
$PORT = 8081

Write-Host "--- Starting Localtunnel on port $PORT with subdomain $SUBDOMAIN ---" -ForegroundColor Cyan

# Start localtunnel in a separate process
$ltProcess = Start-Process -FilePath "npx.cmd" -ArgumentList "localtunnel --port $PORT --subdomain $SUBDOMAIN" -PassThru -NoNewWindow

# Wait a few seconds for localtunnel to initialize
Start-Sleep -Seconds 3

# Set the Expo proxy URL environment variable
$env:EXPO_PACKAGER_PROXY_URL = "https://$SUBDOMAIN.loca.lt"

Write-Host "--- Localtunnel started at https://$SUBDOMAIN.loca.lt ---" -ForegroundColor Green
Write-Host "--- Starting Expo with Proxy: $env:EXPO_PACKAGER_PROXY_URL ---" -ForegroundColor Cyan

# Start Expo
npx expo start --clear
