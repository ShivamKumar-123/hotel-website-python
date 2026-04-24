import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { registerGsapPlugins } from './components/animations/gsapRegister'

// Register ScrollTrigger once at startup for hero + section reveals.
registerGsapPlugins()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
