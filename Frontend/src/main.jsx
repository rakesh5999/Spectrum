import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/app/App.css'
import App from '../src/app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
