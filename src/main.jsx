import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import { Toaster } from './components/ui/toast'
import DataProvider from './context/DataContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Toaster>
            <App />
          </Toaster>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
