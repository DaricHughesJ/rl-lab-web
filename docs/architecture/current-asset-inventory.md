# Current Asset Inventory

Status: W1 source asset audit complete for the pre-migration tree; production/design licensing review remains ongoing for assets added later.

## Public assets

| Path | Role | Classification |
| --- | --- | --- |
| `public/favicon.svg` | MechLab browser/site icon | KEEP |
| `public/icons.svg` | SVG symbol sheet used for branded/social iconography | KEEP / VERIFY SYMBOL USAGE DURING W4 |

## Removed source assets

The following files had no source references in the current application and were removed from the migration branch after reference audit:

| Former path | Reason |
| --- | --- |
| `src/assets/hero.png` | Unreferenced legacy raster asset. |
| `src/assets/react.svg` | Unreferenced React/Vite template artifact. |
| `src/assets/vite.svg` | Unreferenced Vite template artifact. |

They remain recoverable from the preserved pre-standardization Git history and canonical rollback branch; they are not copied into an archive directory inside the active source tree.

## Asset rules

1. Product visuals must have known origin/ownership and be safe for intended commercial distribution.
2. Rocket League/Psyonix/Epic trademarks or game art must not be assumed commercially reusable merely because they are technically accessible.
3. Generated/reference mockups are design references unless explicitly approved as production assets.
4. UI icons should come from one deliberate icon system rather than arbitrary Unicode glyphs mixed through production views.
5. Raster assets must have an intentional resolution/compression strategy and responsive dimensions.
6. Unused template/legacy assets are removed from the active tree, with Git history serving as history rather than an in-tree junk drawer.
7. Public metadata images (OpenGraph/share cards) require explicit ownership, dimensions, and stable URLs.

## Current visual-system debt

The current UI still mixes CSS-drawn graphics, Unicode symbols, inline SVG/chart markup, and the public SVG symbol sheet. W4 establishes one design-system ownership model for icons, illustration, data visualization, and product imagery before further visual expansion.
