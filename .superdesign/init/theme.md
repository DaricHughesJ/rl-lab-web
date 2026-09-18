# Theme Tokens

## Compact token summary (prefer this as context)

### Colors (MarketingV2 — active marketing surface)
| Token | Value |
| --- | --- |
| `--ml-bg` | `#05080c` |
| `--ml-bg-2` | `#0a1016` |
| `--ml-text` | `#e8eef2` |
| `--ml-dim` | `#7a8b99` |
| `--ml-body` | `#9aabba` |
| `--ml-accent` | `#2fd4c8` (teal) |
| `--ml-accent-hi` | `#7aefe6` |
| `--ml-ok` | `#4ade9a` |
| `--ml-warn` | `#e8b84a` |
| `--ml-hair` | `rgba(160,200,210,.12)` |
| `--ml-panel` | `rgba(8,14,20,.88)` |

Root (`index.css`): `--bg:#05080c`, `--panel:#0f1820`, `--line:#243240`, `--muted:#8496a7`, `--accent:#2fd4c8`, `--lime:#4ade9a`.

### Typography
- Sans: `IBM Plex Sans` (UI / headlines)
- Mono: `IBM Plex Mono` (labels, CTAs, readouts, nav)
- Hero H1: clamp 32–50px, weight 600, tracking -0.045em
- Section H2: clamp 32–48px, weight 600
- Body: 14–15px, line-height ~1.65
- Labels: 8–11px mono, uppercase, letter-spacing 0.08–0.16em

### Layout / chrome
- Content max ~1160–1240px
- Nav height 64px, clipped panel corners (polygon cut)
- Buttons: clipped polygon corners (`clip-path` 7px cuts), mono 11–12px
- Background: dark navy + subtle teal/amber radial glow + faint grid pattern
- Motion: `v2-rise` hero fade-up; blink on specimen dot; reduce-motion respected

### Visual direction for redesign
Evolve lab look into **mechanics debugger / forensics**: evidence panels, attempt timelines, failed-vs-success contrast, inspectable readouts. Keep teal accent + IBM Plex. Avoid purple SaaS / AI-coach aesthetics.

---

## Raw sources

### `src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
:root{
  --bg:#05080c;
  --panel:#0f1820;
  --line:#243240;
  --muted:#8496a7;
  --accent:#2fd4c8;
  --accent-hi:#7aefe6;
  --lime:#4ade9a;
  --purple:var(--accent);
  --mono:'IBM Plex Mono',ui-monospace,monospace;
  font-family:'IBM Plex Sans',system-ui,sans-serif;
  color:#e8eef2;
  background:var(--bg);
  font-synthesis:none;
  text-rendering:optimizeLegibility;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;min-width:320px}
a{color:inherit}
button{font:inherit;cursor:pointer}
```

### MarketingV2 CSS variables (from `src/MarketingV2.css` lines 3–27)

```css
.marketing-v2{
  --ml-bg:#05080c;
  --ml-bg-2:#0a1016;
  --ml-text:#e8eef2;
  --ml-dim:#7a8b99;
  --ml-body:#9aabba;
  --ml-accent:#2fd4c8;
  --ml-accent-hi:#7aefe6;
  --ml-ok:#4ade9a;
  --ml-warn:#e8b84a;
  --ml-hair:rgba(160,200,210,.12);
  --ml-panel:rgba(8,14,20,.88);
  --font:'IBM Plex Sans',system-ui,sans-serif;
  --mono:'IBM Plex Mono',ui-monospace,monospace;
  /* background: layered radials + grid overlay via ::before/::after */
}
```

Full styling: `src/MarketingV2.css` (285 lines), `src/LabPages.css` (194 lines), legacy/auth in `src/App.css`.
