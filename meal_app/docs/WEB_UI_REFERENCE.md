# MEALSHARE WEB UI REFERENCE DOCUMENTATION

This reference maps the design language, color palette, typography, and component styling of the completed **MealShare Web Application** (`frontend/`) to ensure the native **Flutter Mobile App** (`meal_app/`) shares 100% brand consistency.

---

## 1. Brand Identity & Visual Language

- **Brand Name**: `MealShare`
- **Tagline**: *"Your pantry, your recipes, your smarter meal plan."*
- **Theme Style**: Clean, modern, warm cream container cards, crisp emerald green accents, and deep navy readable typography.

---

## 2. Color System & Tokens

| Color Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| **Primary Emerald** | `#16A34A` | Main actions, primary buttons, active tab indicators |
| **Primary Dark** | `#15803D` | Hover states, card headers, gradient accents |
| **Primary Light** | `#DCFCE7` | Badge background, selected chip highlight |
| **Warm Background** | `#F8FAFC` | Main app scaffold background |
| **Card Surface** | `#FFFFFF` | Elevated container cards, modal dialogs |
| **Text Primary** | `#0F172A` | Deep navy for high-contrast titles and headings |
| **Text Secondary** | `#64748B` | Subtitles, captions, timestamps |
| **Status Fresh** | `#22C55E` | Green badge for fresh pantry items |
| **Status Use Soon** | `#F59E0B` | Amber alert for items expiring within 3 days |
| **Status Expired** | `#EF4444` | Red warning for expired items |

---

## 3. Typography & Hierarchy

- **Font Family**: Clean sans-serif (`Inter` / System Sans) with high legibility.
- **Headings**: Bold, prominent (`20px - 26px`), Deep Navy (`#0F172A`).
- **Body Text**: Regular/Medium (`14px - 16px`), Dark Charcoal.
- **Badges & Captions**: Semi-bold (`10px - 12px`), uppercase status labels.

---

## 4. Status Terminology

To match the backend API matching engine, the mobile UI uses exact business statuses:

- `READY_TO_COOK`: All required ingredients are fresh in pantry.
- `USE_SOON`: Ingredients available, but one or more expire within 3 days.
- `MISSING_INGREDIENTS`: Required ingredients missing or insufficient quantity.
- `UNAVAILABLE_EXPIRED`: Required ingredients present but expired.
