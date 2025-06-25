@echo off
echo Installing React Native Web dependencies...
cd /d %~dp0
call npm install react-native-web@0.19.10 babel-plugin-react-native-web@0.19.10
echo Updating Next.js...
call npm install next@14.1.0
echo Setup complete! Run the web app with 'npm run dev' 