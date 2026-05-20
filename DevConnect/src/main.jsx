import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/authContext'
import { PostContextProvider } from './context/postContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PostContextProvider>


        <App />
      </PostContextProvider>
    </AuthProvider>
  </StrictMode>,
)
