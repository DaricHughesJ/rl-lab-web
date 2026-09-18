import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './mechanic-media.css'
import App from './App.jsx'
import LegalDocs from './components/LegalDocs.jsx'
import AuthPage from './components/AuthPage.jsx'
import RoadmapPage from './components/RoadmapPage.jsx'
import DevBlogPage from './components/DevBlogPage.jsx'
import PricingPage from './components/PricingPage.jsx'
import ComparePage from './components/ComparePage.jsx'
import FaqPage from './components/FaqPage.jsx'
import WaitlistPage from './components/WaitlistPage.jsx'
import ThanksPage from './components/ThanksPage.jsx'
import { captureUtms } from './lib/utm'
import { track } from './lib/waitlist'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const blogMatch = path.match(/^\/blog(?:\/([^/]+))?$/)

captureUtms()
track('page_view', { page: path })

const content = path === '/privacy'
  ? <LegalDocs type="privacy" />
  : path === '/terms'
    ? <LegalDocs type="terms" />
    : path === '/roadmap'
      ? <RoadmapPage />
      : path === '/pricing'
        ? <PricingPage />
        : path === '/compare'
          ? <ComparePage />
          : path === '/faq'
            ? <FaqPage />
            : path === '/waitlist'
              ? <WaitlistPage />
              : path === '/thanks'
                ? <ThanksPage />
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
