import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initOneSignal } from './lib/oneSignal'

initOneSignal().catch((error) => {
  console.warn('OneSignal initialization failed:', error)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
