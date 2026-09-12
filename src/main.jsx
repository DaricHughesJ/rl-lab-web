import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LegalDocs from './components/LegalDocs.jsx'
import AuthPage from './components/AuthPage.jsx'
import RoadmapPage from './components/RoadmapPage.jsx'
import DevBlogPage from './components/DevBlogPage.jsx'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const blogMatch = path.match(/^\/blog(?:\/([^/]+))?$/)

const content = path === '/privacy'
  ? <LegalDocs type="privacy" />
  : path === '/terms'
    ? <LegalDocs type="terms" />
    : path === '/roadmap'
      ? <RoadmapPage />
      : blogMatch
        ? <DevBlogPage slug={blogMatch[1] || null} />
        : path === '/signin' || path === '/signup' || path === '/account'
          ? <AuthPage path={path} />
          : <App />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {content}
  </StrictMode>,
)
