# IPMS Frontend

A React-based frontend application for the IPMS (Integrated Project Management System) built with Redux Toolkit, React Router, and Tailwind CSS.

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── features/            # Redux slices by feature
├── guards/              # Route guards
├── hooks/               # Custom hooks
├── pages/               # Page components
├── routes/              # Route configuration
├── services/            # API services
├── store/               # Redux store configuration
└── utils/               # Utility functions
```

## Features

- **React 18** with JavaScript
- **Redux Toolkit** for state management
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Route Guards** for authentication and authorization
- **Lazy Loading** for code splitting

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Setup Status

✅ Project initialized with React and JavaScript  
✅ Redux Toolkit configured with feature slices  
✅ React Router DOM set up with route guards  
✅ Tailwind CSS configured with custom theme  
✅ Basic component structure created  
✅ Route guards implemented  
✅ Custom hooks created  
✅ Utility functions added  

## Next Steps

The project is set up with minimal components as requested. You can now:

1. Implement the full logic in each component
2. Connect to your backend API
3. Add more features and functionality
4. Customize the styling with Tailwind CSS

## Dependencies

- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-redux`: ^9.0.4
- `@reduxjs/toolkit`: ^2.0.1
- `react-router-dom`: ^6.20.1
- `tailwindcss`: ^3.3.6
- `postcss`: ^8.4.32
- `autoprefixer`: ^10.4.16
- `react-scripts`: ^5.0.1 