@echo off
setlocal

echo ==============================================
echo On A Trip Holidays - V18 full site updater
echo ==============================================
echo.
set /p REPO=Enter the full path to your cloned On-a-trip repository: 
set /p ZIP=Enter the full path to the V18 ZIP file: 

echo.
echo Updating repository: %REPO%
echo Using ZIP: %ZIP%
echo.

if not exist "%REPO%\.git" (
  echo ERROR: That folder does not look like a Git repository.
  pause
  exit /b 1
)
if not exist "%ZIP%" (
  echo ERROR: ZIP file not found.
  pause
  exit /b 1
)

set "TMP=%TEMP%\onatrip-v18-update"
if exist "%TMP%" rmdir /s /q "%TMP%"
mkdir "%TMP%"

powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -LiteralPath '%ZIP%' -DestinationPath '%TMP%' -Force"

if not exist "%TMP%\On-a-trip-main" (
  echo ERROR: ZIP structure is unexpected. Expected On-a-trip-main folder.
  pause
  exit /b 1
)

robocopy "%TMP%\On-a-trip-main" "%REPO%" /E /COPY:DAT /R:2 /W:1 /XD .git
set RC=%ERRORLEVEL%
if %RC% GEQ 8 (
  echo ERROR: File copy failed with code %RC%.
  pause
  exit /b %RC%
)

rmdir /s /q "%TMP%"

echo.
echo Files copied successfully.
echo Now open GitHub Desktop, review the changes, Commit to main, and Push origin.
echo.
pause
