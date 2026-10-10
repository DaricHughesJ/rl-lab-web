import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LegalDocs from './components/LegalDocs.jsx'
import PricingPage from './components/PricingPage.jsx'
import FaqPage from './components/FaqPage.jsx'
import RoadmapPage from './components/RoadmapPage.jsx'
import DevBlogPage from './components/DevBlogPage.jsx'
import AuthPage from './components/AuthPage.jsx'
import WaitlistPage from './components/WaitlistPage.jsx'
import DocsPage from './components/DocsPage.jsx'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const blogMatch = path.match(/^\/blog\/([^/]+)$/)
const content = path === '/privacy'
  ? <LegalDocs type="privacy" />
    : path === '/terms'
      ? <LegalDocs type="terms" />
      : path === '/pricing'
        ? <PricingPage />
        : path === '/faq'
          ? <FaqPage />
          : path === '/docs'
            ? <DocsPage />
              : path === '/roadmap' || path === '/plans'
              ? <RoadmapPage />
              : path === '/blog'
                ? <DevBlogPage />
                : blogMatch
                  ? <DevBlogPage slug={decodeURIComponent(blogMatch[1] ?? '')} />
                  : ['/signin', '/signup', '/account'].includes(path)
                    ? <AuthPage path={path} />
                    : path === '/waitlist'
                      ? <WaitlistPage />
                      : path === '/' || path === '/launch-survey'
                        ? <App />
                        : <main className="marketing-v2"><section className="lab-hero"><p className="v2-specimen">404 · NOT FOUND</p><h1>That page isn’t here.</h1><p className="lab-lede"><a href="/">Return to MechLab</a></p></section></main>

const root = document.getElementById('root')
if (!root) throw new Error('MechLab root element was not found.')

createRoot(root).render(
  <StrictMode>
    {content}
  </StrictMode>,
)
