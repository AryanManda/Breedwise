# Design Guidelines: AI-Powered Animal Breeding Recommendation Platform

## Design Approach
**Selected System:** Fluent Design with agricultural/rancher-focused customization
**Rationale:** This is a data-intensive productivity tool requiring clarity, efficiency, and trustworthiness. Ranchers need quick access to animal data and actionable breeding insights without unnecessary visual complexity.

## Core Design Principles
1. **Data First:** Information hierarchy prioritizes critical breeding data and recommendations
2. **Professional Trust:** Clean, credible design that instills confidence in AI recommendations
3. **Efficient Navigation:** Ranchers should complete tasks (adding animals, viewing recommendations) with minimal clicks
4. **Rural-Friendly:** Design works well on various devices and slower connections

## Color Palette

**Light Mode:**
- Primary: 142 45% 35% (Forest green - represents agriculture, growth, nature)
- Primary Hover: 142 45% 28%
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Border: 220 13% 91%
- Text Primary: 222 47% 11%
- Text Secondary: 215 16% 47%
- Accent (Success/Genetics): 142 76% 36% (Vibrant green for positive genetic scores)
- Warning: 38 92% 50% (Breeding alerts)
- Muted: 220 14% 96%

**Dark Mode:**
- Primary: 142 45% 45%
- Primary Hover: 142 45% 52%
- Background: 222 47% 11%
- Surface: 217 33% 17%
- Border: 217 33% 24%
- Text Primary: 210 40% 98%
- Text Secondary: 215 20% 65%
- Accent: 142 76% 45%
- Warning: 38 92% 60%
- Muted: 217 33% 20%

## Typography
**Font Family:**
- Primary: 'Inter' (Google Fonts) - exceptional readability for data tables and forms
- Headings: 'Inter' with weights 600-700
- Body: 'Inter' weight 400
- Data/Metrics: 'JetBrains Mono' weight 500 (for genetic scores, numerical data)

**Scale:**
- Heading 1: text-4xl font-bold (Dashboard titles)
- Heading 2: text-2xl font-semibold (Section headers)
- Heading 3: text-xl font-semibold (Card titles)
- Body Large: text-base (Primary content)
- Body: text-sm (Secondary content, table data)
- Caption: text-xs (Metadata, timestamps)

## Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-20
- Card gaps: gap-4 to gap-6
- Form field spacing: space-y-4

**Grid System:**
- Dashboard: 3-column grid on desktop (lg:grid-cols-3), single column mobile
- Animal cards: 2-column on tablet (md:grid-cols-2), 3-column desktop (lg:grid-cols-3)
- Analytics: 4-column stat cards (lg:grid-cols-4), 2-column tablet
- Max container width: max-w-7xl

## Component Library

### Navigation
- **Top Navigation Bar:** Horizontal nav with logo left, primary links center, user profile right
- **Active State:** Green underline indicator (border-b-2 border-primary)
- **Responsive:** Hamburger menu on mobile with slide-out drawer

### Data Tables
- **Striped Rows:** Alternating background colors for readability
- **Sortable Columns:** Arrow indicators on headers
- **Action Column:** Quick edit/delete icons on right
- **Hover State:** Subtle row highlight (hover:bg-muted)
- **Pagination:** Bottom-aligned with records count

### Cards
- **Animal Cards:** Image placeholder top, name/breed header, key metrics grid, action buttons footer
- **Breeding Recommendation Cards:** Two-column layout showing parent animals side-by-side with prediction metrics below
- **Stat Cards:** Large numerical value, label below, optional trend indicator
- **Shadow:** shadow-sm with hover:shadow-md transition

### Forms
- **Input Fields:** Full-width with label above, border-2 on focus with primary color
- **Select Dropdowns:** Custom styling matching input fields
- **Validation:** Inline error messages in warning color below field
- **Submit Buttons:** Primary button style, full-width on mobile

### Buttons
- **Primary:** Solid primary color background, white text, rounded-lg, px-6 py-3
- **Secondary:** Outline style with primary border, primary text
- **Ghost:** No border, primary text, hover background muted
- **Icon Buttons:** Square aspect ratio, p-2, hover:bg-muted

### Charts (Recharts)
- **Bar Charts:** For age distribution, genetic score ranges
- **Line Charts:** For breeding trends over time
- **Pie Charts:** For male/female ratio, breed distribution
- **Colors:** Use primary green gradient for positive data, muted grays for neutral
- **Tooltips:** Dark background with rounded corners

### Modals/Overlays
- **Breeding Recommendation Modal:** Full-screen on mobile, centered max-w-4xl on desktop
- **Add Animal Form:** Side drawer (slide from right) on desktop, full-screen mobile
- **Backdrop:** Semi-transparent dark overlay (bg-black/50)

### Analytics Dashboard
- **Top Row:** 4 stat cards showing total animals, average genetic score, breeding pairs, recent activity
- **Chart Section:** 2-column grid (age distribution chart left, genetic score distribution right)
- **Recent Activity Feed:** List view with timestamps and animal details
- **Top Performers:** Table showing highest genetic score animals

### AI Recommendation Display
- **Pairing Cards:** Side-by-side animal profiles with connecting arrow/icon in center
- **Predicted Offspring Panel:** Below pairing, showing estimated genetic score with confidence percentage
- **AI Explanation:** Collapsible text section explaining recommendation rationale (from Gemini)
- **Action Buttons:** "Select Pairing" primary, "View Details" secondary

## Images
**Hero Section (Dashboard):**
- Large hero image (h-64 to h-80) showing pastoral ranch scene with cattle or livestock
- Overlay: Dark gradient (from transparent to bg-black/40) for text legibility
- Headline: "Optimize Your Breeding Program with AI" in white text-4xl
- Subheadline: Brief value proposition in white/90 text-lg

**Animal Card Placeholders:**
- Square aspect ratio (aspect-square) animal silhouette or breed-specific imagery
- Fallback: Generic livestock icon on muted background if no image available

**Empty States:**
- Illustration or icon for "No animals added yet" with add animal CTA
- "No recommendations available" with explanation and data entry prompt

## Animations
**Minimal and Purposeful:**
- Page transitions: Fade-in (duration-200)
- Modal entry: Slide-in from right (duration-300)
- Button hover: Scale-105 transform
- Chart data: Staggered entry animation (built into Recharts)
- NO scroll-triggered animations, NO complex parallax

## Accessibility
- Dark mode toggle in user menu (persistent across sessions)
- All form inputs with proper labels and aria-labels
- Color contrast ratios meet WCAG AA standards
- Keyboard navigation for all interactive elements
- Focus rings visible (ring-2 ring-primary)

## Responsive Breakpoints
- Mobile: < 640px - Single column, stacked cards, full-width forms
- Tablet: 640px - 1024px - Two-column layouts, side navigation collapses
- Desktop: > 1024px - Full multi-column grids, expanded navigation