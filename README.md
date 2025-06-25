# Orderly Dashboard

A modern dashboard for food delivery applications built with Next.js and Tailwind CSS.

## Fixed Image Loading Issues

This project uses placeholder images for the food items to ensure the dashboard displays correctly even without real images. The placeholders are created as SVG files with the `.jpg` extension.

## Running the Project

### Quick Start (Windows)

The easiest way to run the project on Windows is to use the provided batch file:

```
.\run-with-placeholders.bat
```

This will create all placeholder images and start the development server automatically.

### Manual Setup

1. Install dependencies:
   ```
   cd orderly-web-app
   npm install
   ```

2. Create placeholder images (required to fix image loading errors):
   ```
   npm run create-placeholders
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000/dashboard
   ```

## Windows Command Issues

If you're using PowerShell, commands with `&&` might not work as expected. Use one of these alternatives:

- Using PowerShell with semicolons:
  ```
  cd orderly-web-app; npm run dev
  ```

- Using the batch file:
  ```
  .\run-with-placeholders.bat
  ```

## Adding Real Images

To use real images instead of placeholders, add your images to:

```
orderly-web-app/public/images/food-items/
```

Use these filenames to match the ones referenced in the code:
- tuna-soup.jpg
- pizza.jpg
- sweet-pizza.jpg
- chicken-curry.jpg
- watermelon-juice.jpg
- italiano-pizza.jpg
- spaghetti.jpg

## Features

- Modern UI with responsive design
- Interactive charts with Chart.js
- Dynamic order management
- Trending menu items
- Real-time data visualization
- Interactive dropdown menus for order actions

## Technology Stack

- Next.js
- React
- Tailwind CSS
- Chart.js
- React Icons
