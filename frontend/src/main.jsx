/**
 * Main entry point for the React application
 * Renders the root component and sets up React Strict Mode for development
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * Create root element and render the application
 * ReactDOM.createRoot enables Concurrent Features and improved rendering
 * React.StrictMode helps identify potential problems in development
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)