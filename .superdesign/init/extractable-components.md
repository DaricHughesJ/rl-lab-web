# Extractable Components

## NavBar
- Source: `src/components/LabChrome.jsx` (nav portion; same pattern in `src/App.jsx`)
- Category: layout
- Description: Top marketing nav with MechLab wordmark, section/page links, Sign in, Join alpha, mobile menu
- Extractable props: `activeItem` (string, default: "home"), `appHref` (string, default: "/#app"), `mechanicsHref` (string, default: "/#mechanics"), `roadmapHref` (string, default: "/roadmap"), `blogHref` (string, default: "/blog"), `signinHref` (string, default: "/signin"), `signupHref` (string, default: "/signup")
- Hardcoded: Wordmark image URL (Brand Asset), link labels (The app, Mechanics, Roadmap, Blog, Sign in, Join alpha), CSS classes, clip-path chrome, hamburger

## SiteFooter
- Source: `src/components/LabChrome.jsx` (footer portion; same pattern in `src/App.jsx`)
- Category: layout
- Description: Marketing footer with brand wordmark, tagline, utility links, copyright
- Extractable props: none required beyond optional `tagline` (string, default: "Windows app for Rocket League mechanics.")
- Hardcoded: Wordmark URL, link set (Roadmap, Blog, Support, Privacy, Alpha terms), copyright line, CSS

## Basic Components
Skip extraction for `.v2-button`, status blocks, mechanic cards — better as inline HTML in drafts.
