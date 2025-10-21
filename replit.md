# BreedWise - AI-Powered Animal Breeding Platform

## Overview
BreedWise is an AI-powered breeding recommendation platform that helps ranchers and breeders make data-driven decisions for their breeding programs. The application uses Google's Gemini AI to analyze trait compatibility and hereditary lineages to provide intelligent breeding pair suggestions with natural language explanations.

## Tech Stack
- **Frontend**: React + TypeScript, Tailwind CSS, Shadcn UI, Recharts
- **Backend**: Node.js + Express
- **AI**: Google Gemini API (gemini-2.5-flash)
- **Storage**: In-memory storage (MemStorage)
- **State Management**: TanStack React Query

## Features

### Dashboard
- Total animal count with male/female breakdown
- Average weight across herd
- Lineage tracking statistics
- Breeding potential calculation
- Interactive charts:
  - Age distribution (bar chart)
  - Male/female ratio (pie chart)
  - Breed distribution (bar chart)

### Animal Management
- Add, edit, and delete animals
- Track comprehensive animal data:
  - Name, species, breed, age, sex
  - Weight (lbs)
  - Horn/antler size (optional)
  - Parent tracking (sire and dam)
- Search functionality by name or breed
- Beautiful data table with all animal information
- Form validation with Zod schemas

### Breeding Recommendations
- AI-powered breeding pair suggestions
- Trait compatibility analysis
- Lineage validation (prevents breeding related animals)
- Offspring predictions including:
  - Estimated weight
  - Breed strength assessment
  - Confidence level
  - Estimated traits (horn size, etc.)
- Natural language explanations from Gemini AI
- Compatibility scoring algorithm

### Lineage & Hereditary Tree
- Visual hereditary tree showing parent-child relationships
- Track sire (father) and dam (mother) for each animal
- Displays lineage depth and offspring counts
- Identifies root animals (those without parent records)
- Prevents circular references in lineage

## Data Model

### Animal
- id: UUID
- name: string
- species: string
- age: integer (0-30)
- sex: "Male" | "Female"
- breed: string
- weight: decimal (lbs)
- hornSize: decimal (optional)
- sireId: UUID (optional, references male parent)
- damId: UUID (optional, references female parent)
- createdAt: timestamp

### Breeding Recommendation
- id: UUID
- parent1Id: UUID
- parent2Id: UUID
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

## Breeding Compatibility Algorithm

The breeding recommendation engine uses a multi-factor compatibility score:

```
Compatibility = weight_factor + breed_compatibility + horn_match + age_factor
```

Factors considered:
- Average weight (heavier animals score higher)
- Breed compatibility (same breed vs crossbreed)
- Age appropriateness (younger animals preferred)
- Physical trait matching (horn size)
- Lineage validation (prevents breeding related animals)

### Lineage Rules
The algorithm prevents breeding between:
- Parent and child
- Animals sharing the same sire (half-siblings via father)
- Animals sharing the same dam (half-siblings via mother)

## AI Integration

The platform uses Google's Gemini AI for:
1. **Enhanced Analysis**: Deep trait compatibility assessment
2. **Natural Language Explanations**: Clear, understandable breeding recommendations
3. **Trait Prediction**: Intelligent offspring trait estimation (weight, horn size, breed strength)

Models used:
- `gemini-2.5-flash` - Fast recommendations with structured JSON output

## Design System

### Colors
- Primary: Forest Green (142 45% 35%) - represents agriculture and growth
- Accent: Vibrant Green (142 76% 36%) - for positive metrics
- Warning: Amber (38 92% 50%) - for breeding alerts
- Charts: Green, amber, blue palette for data visualization

### Typography
- Primary Font: Inter (exceptional readability)
- Monospace: JetBrains Mono (for numerical data like weight)
- Scale: 4xl (headings) → xl → base → sm → xs

### Spacing
- Component padding: p-4 to p-6
- Section spacing: py-6
- Card gaps: gap-4 to gap-6

## Development Notes

### Current State
- Complete hereditary tracking system implemented
- In-memory storage for rapid prototyping
- Dark mode support with theme toggle
- Fully responsive design
- Complete form validation
- Beautiful loading and empty states
- Lineage tree visualization

### Recent Changes (October 2025)
- Removed genetic score system
- Added hereditary tracking with sire/dam relationships
- Implemented lineage tree visualization page
- Updated breeding algorithm to prevent breeding related animals
- Added species and weight fields for better trait tracking
- Updated all analytics to focus on weight and breed diversity

### Future Enhancements
- PostgreSQL database for persistence
- User authentication system
- Deeper lineage analysis (grandparents, etc.)
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
2. **Track Lineage** - Record sire and dam when adding offspring
3. **View Analytics** - Monitor herd demographics and breed diversity on dashboard
4. **View Lineage** - Visualize hereditary trees and parent-child relationships
5. **Generate Recommendations** - Get AI-powered breeding pair suggestions
6. **Review Predictions** - Analyze predicted offspring traits and compatibility
7. **Make Decisions** - Use insights to optimize breeding program

## Design Philosophy
- Data-first interface prioritizing critical information
- Professional, trustworthy design for agricultural use
- Efficient navigation with minimal clicks
- Clear visual hierarchy and color-coded data
- Beautiful charts and visualizations
- Smooth interactions and transitions
