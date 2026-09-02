import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LegalDocs from './components/LegalDocs.jsx'
import AuthPage from './components/AuthPage.jsx'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const content = path === '/privacy'
  ? <LegalDocs type="privacy"/>
  : path === '/terms'
    ? <LegalDocs type="terms"/>
    : path === '/signin' || path === '/signup' || path === '/account'
      ? <AuthPage path={path}/>
      : <App/>

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {content}
  </StrictMode>,
)
