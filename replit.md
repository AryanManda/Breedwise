# BreedWise - AI-Powered Animal Breeding Platform

## Overview
BreedWise is an AI-powered breeding recommendation platform that helps ranchers and breeders make data-driven decisions for their breeding programs. The application uses Google's Gemini AI to analyze genetic compatibility and provide intelligent breeding pair suggestions with natural language explanations.

## Tech Stack
- **Frontend**: React + TypeScript, Tailwind CSS, Shadcn UI, Recharts
- **Backend**: Node.js + Express
- **AI**: Google Gemini API (gemini-2.5-flash and gemini-2.5-pro)
- **Storage**: In-memory storage (MemStorage)
- **State Management**: TanStack React Query

## Features

### Dashboard
- Total animal count with male/female breakdown
- Average genetic score across herd
- Top performer identification
- Breeding potential calculation
- Interactive charts:
  - Age distribution (bar chart)
  - Male/female ratio (pie chart)
  - Genetic score distribution (bar chart)

### Animal Management
- Add, edit, and delete animals
- Track comprehensive animal data:
  - Name, breed, age, sex
  - Genetic score (0-100)
  - Horn/antler size (optional)
- Search functionality by name or breed
- Beautiful data table with color-coded genetic scores
- Form validation with Zod schemas

### Breeding Recommendations
- AI-powered breeding pair suggestions
- Genetic compatibility analysis
- Offspring predictions including:
  - Predicted genetic score
  - Breed strength assessment
  - Confidence level
  - Estimated traits (horn size, etc.)
- Natural language explanations from Gemini AI
- Compatibility scoring algorithm

## Data Model

### Animal
- id: UUID
- name: string
- age: integer (0-30)
- sex: "Male" | "Female"
- breed: string
- geneticScore: decimal (0-100)
- hornSize: decimal (optional)
- createdAt: timestamp

### Breeding Recommendation
- id: UUID
- parent1Id: UUID
- parent2Id: UUID
- predictedScore: decimal
- aiExplanation: text
- confidence: decimal (0-1)
- createdAt: timestamp

## API Endpoints

### Animals
- `GET /api/animals` - Fetch all animals
- `POST /api/animals` - Create new animal
- `PUT /api/animals/:id` - Update animal
- `DELETE /api/animals/:id` - Delete animal

### Breeding Recommendations
- `POST /api/recommendations` - Generate AI-powered breeding recommendations

## Genetic Scoring Algorithm

The breeding recommendation engine uses a multi-factor compatibility score:

```
Compatibility = (genetic_similarity * 0.5) + (trait_match * 0.3) + (age_factor * 0.2)
```

Factors considered:
- Genetic score compatibility
- Age appropriateness
- Breed compatibility
- Physical trait matching (horn size)

## AI Integration

The platform uses Google's Gemini AI for:
1. **Enhanced Analysis**: Deep genetic compatibility assessment
2. **Natural Language Explanations**: Clear, understandable breeding recommendations
3. **Trait Prediction**: Intelligent offspring trait estimation

Models used:
- `gemini-2.5-flash` - Fast recommendations and general analysis
- `gemini-2.5-pro` - Complex genetic analysis with structured JSON output

## Design System

### Colors
- Primary: Forest Green (142 45% 35%) - represents agriculture and growth
- Accent: Vibrant Green (142 76% 36%) - for positive genetic scores
- Warning: Amber (38 92% 50%) - for breeding alerts
- Charts: Green, amber, blue palette for data visualization

### Typography
- Primary Font: Inter (exceptional readability)
- Monospace: JetBrains Mono (for genetic scores and numerical data)
- Scale: 4xl (headings) → xl → base → sm → xs

### Spacing
- Component padding: p-4 to p-6
- Section spacing: py-6
- Card gaps: gap-4 to gap-6

## Development Notes

### Current State
- MVP features implemented with full frontend
- In-memory storage for rapid prototyping
- Dark mode support with theme toggle
- Fully responsive design
- Complete form validation
- Beautiful loading and empty states

### Next Steps (Post-MVP)
- PostgreSQL database for persistence
- User authentication system
- Lineage tracking and family trees
- Breeding history logs with outcomes
- CSV import/export
- Advanced filtering and search
- Mobile app version

## Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key (required)

## Running the Application
1. Ensure `GEMINI_API_KEY` is set in Replit Secrets
2. Run `npm run dev` to start the application
3. Frontend and backend served on same port via Vite

## User Workflow
1. **Add Animals** - Start by adding animals to the breeding program
2. **View Analytics** - Monitor herd genetics and demographics on dashboard
3. **Generate Recommendations** - Get AI-powered breeding pair suggestions
4. **Review Predictions** - Analyze predicted offspring traits and compatibility
5. **Make Decisions** - Use insights to optimize breeding program

## Design Philosophy
- Data-first interface prioritizing critical information
- Professional, trustworthy design for agricultural use
- Efficient navigation with minimal clicks
- Clear visual hierarchy and color-coded data
- Beautiful charts and visualizations
- Smooth interactions and transitions
