# Current Asset Inventory

Status: W1 inventory.

## Public assets

| Path | Role | Classification |
| --- | --- | --- |
| `public/favicon.svg` | MechLab browser/site icon | KEEP |
| `public/icons.svg` | SVG symbol sheet used for branded/social iconography | KEEP / VERIFY USAGE |

## Source assets

| Path | Role | Classification |
| --- | --- | --- |
| `src/assets/hero.png` | Product visual asset; no filename reference found in current indexed source search | NEEDS VALIDATION |
| `src/assets/react.svg` | Vite/React template artifact; no source reference found | DELETE after final reference check |
| `src/assets/vite.svg` | Vite template artifact; no source reference found | DELETE after final reference check |

## Asset rules

1. Product visuals must have known origin/ownership and be safe for intended commercial distribution.
2. Rocket League/Psyonix/Epic trademarks or game art must not be assumed commercially reusable merely because they are technically accessible.
3. Generated/reference mockups are design references unless explicitly approved as production assets.
4. UI icons should come from one deliberate icon system rather than arbitrary Unicode glyphs mixed through production views.
5. Raster assets must have an intentional resolution/compression strategy and responsive dimensions.
6. Unused template assets should be removed rather than carried indefinitely.
7. Public metadata images (OpenGraph/share cards) require explicit ownership, dimensions, and stable URLs.

## Current visual-system debt

The current UI mixes CSS-drawn graphics, Unicode symbols, inline SVG/chart markup, the public SVG symbol sheet, and raster assets. W4 should establish one design-system ownership model for icons, illustration, data visualization, and product imagery before further visual expansion.
