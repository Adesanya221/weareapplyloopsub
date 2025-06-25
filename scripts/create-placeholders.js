const fs = require('fs');
const path = require('path');

// Path to save images
const imagesDir = path.join(__dirname, '../public/images/food-items');

// Ensure directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create a simple SVG placeholder with a color and text
function createSvgPlaceholder(filename, text, bgColor = '#3B82F6') {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="${bgColor}" />
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
          fill="white" text-anchor="middle" dominant-baseline="middle">
      ${text}
    </text>
  </svg>`;
  
  const filePath = path.join(imagesDir, filename);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created placeholder: ${filename}`);
}

// Food items to create placeholders for
const foodItems = [
  { name: 'tuna-soup.jpg', text: 'Tuna Soup', color: '#2563EB' },
  { name: 'pizza.jpg', text: 'Mozzarella Pizza', color: '#DC2626' },
  { name: 'sweet-pizza.jpg', text: 'Sweet Cheesy Pizza', color: '#F59E0B' },
  { name: 'chicken-curry.jpg', text: 'Chicken Curry', color: '#16A34A' },
  { name: 'watermelon-juice.jpg', text: 'Watermelon Juice', color: '#EC4899' },
  { name: 'italiano-pizza.jpg', text: 'Italiano Pizza', color: '#8B5CF6' },
  { name: 'spaghetti.jpg', text: 'Spaghetti Italiano', color: '#EF4444' },
  { name: 'food-placeholder.jpg', text: 'Food Placeholder', color: '#6B7280' }
];

// Create a general food placeholder
fs.writeFileSync(
  path.join(__dirname, '../public/images/food-placeholder.jpg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#6B7280" />
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
          fill="white" text-anchor="middle" dominant-baseline="middle">
      Food Placeholder
    </text>
  </svg>`
);
console.log('Created general food placeholder');

// Create a profile placeholder
fs.writeFileSync(
  path.join(__dirname, '../public/images/profile.jpg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#3B82F6" />
    <circle cx="256" cy="180" r="100" fill="#F3F4F6" />
    <circle cx="256" cy="450" r="160" fill="#F3F4F6" />
    <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
          fill="white" text-anchor="middle" dominant-baseline="middle">
      JS
    </text>
  </svg>`
);
console.log('Created profile placeholder');

// Create all food item placeholders
foodItems.forEach(item => {
  createSvgPlaceholder(item.name, item.text, item.color);
});

console.log('All placeholder images created successfully!');
console.log('Now you can run your Next.js application with "npm run dev"'); 