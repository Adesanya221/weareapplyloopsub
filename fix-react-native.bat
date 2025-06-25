@echo off
echo Fixing React Native Web integration...
cd /d %~dp0

echo Installing required dependencies...
call npm install patch-package@8.0.0 --save
call npm install babel-plugin-react-native-web@0.19.10 --save-dev
call npm install react-native-web@0.19.10 --save
call npm install next@14.1.0 --save

echo Creating patches directory if it doesn't exist...
if not exist patches mkdir patches

echo Applying patches...
call npx patch-package react-native

echo Done! Now you can run the application with 'npm run dev' 