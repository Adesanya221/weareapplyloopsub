const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up Orderly Web App...');

// Check if package.json exists
if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
  console.error('Error: package.json not found. Make sure you run this script from the project root.');
  process.exit(1);
}

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Create necessary directories
  const directories = [
    'public/images',
    'src/shared/components',
    'src/shared/hooks',
    'src/shared/services',
    'src/shared/utils'
  ];

  directories.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  console.log('\nSetup completed successfully!');
  console.log('\nTo start the development server, run one of the following:');
  console.log('- npm run dev');
  console.log('- run-dev.bat');
} catch (error) {
  console.error('Error during setup:', error.message);
  process.exit(1);
} 