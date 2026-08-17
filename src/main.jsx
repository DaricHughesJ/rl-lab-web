import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LegalDocs from './components/LegalDocs.jsx'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const content = path === '/privacy' ? <LegalDocs type="privacy"/> : path === '/terms' ? <LegalDocs type="terms"/> : <App/>

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {content}
  </StrictMode>,
)
