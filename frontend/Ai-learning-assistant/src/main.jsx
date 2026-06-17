
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// AuthProvider ko import karein (path check kar lein apne folder ke hisaab se)
import { AuthProvider } from './context/AuthContext' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider ko yahan lagana zaroori hai */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)