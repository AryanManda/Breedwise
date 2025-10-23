# BreedWise - AI-Powered Animal Breeding Platform

## Overview
BreedWise is an AI-powered breeding recommendation platform that helps ranchers and breeders make data-driven decisions for their breeding programs. The application uses Google's Gemini AI to analyze entire herds and provide intelligent breeding strategies with comprehensive herd analysis and natural language explanations.

## Tech Stack
- **Frontend**: React + TypeScript, Tailwind CSS, Shadcn UI, Recharts
- **Backend**: Node.js + Express
- **AI**: Google Gemini API (gemini-2.5-flash)
- **Storage**: In-memory storage (MemStorage)
- **State Management**: TanStack React Query

## Features

### Dashboard
- Total animal count with male/female breakdown
- Herd tracking statistics
- Breeding potential calculation
- Interactive charts:
  - Male/female ratio (pie chart)
  - Herd distribution by species (bar chart)

### Animal Management
- Add, edit, and delete animals
- Track comprehensive animal data:
  - Name, species, sex
  - Horn/antler size (optional)
  - Health notes (optional text field)
  - Parent tracking (sire and dam)
- Search functionality by name or species
- Beautiful data table with all animal information
- Form validation with Zod schemas

### Herd Breeding Analysis
- AI-powered herd breeding strategy recommendations
- Multi-animal selection for comprehensive herd analysis
- Trait compatibility analysis across entire herd
- Lineage validation (prevents breeding related animals)
- Herd predictions including:
  - Estimated offspring count
  - Average horn size prediction
  - Trait strength assessment
  - Genetic diversity analysis
  - Confidence level
- Breeding strategy recommendations from Gemini AI
- Herd scoring algorithm

### Herd Organization
- Create and manage multiple herds for organizing animals
- Assign animals to herds during creation or editing
- Filter and view animals by herd on Herd Data page
- Edit herd names and descriptions
- Delete herds (animals remain, just unassigned)
- Visual indicators showing animal count per herd
- Quick reassignment of animals between herds via dropdown selectors

### Herd Data
- Visual family tree showing parent-child relationships
- Organize and filter animals by herd
- Track sire (father) and dam (mother) for each animal
- Displays lineage depth and offspring counts
- Identifies root animals (those without parent records)
- Prevents circular references in lineage
- Herd-specific filtering for focused lineage viewing

## Data Model

### Herd
- id: UUID
- name: string
- description: text (optional)
- createdAt: timestamp

### Animal
- id: UUID
- name: string
- species: string
- sex: "Male" | "Female"
- hornSize: decimal (optional)
- healthNotes: text (optional)
- sireId: UUID (optional, references male parent)
- damId: UUID (optional, references female parent)
- herdId: UUID (optional, references herd)
- createdAt: timestamp

### Breeding Recommendation
- id: UUID
- animalIds: text (JSON array of animal IDs in herd)
- aiExplanation: text
- confidence: decimal (0-1)
- createdAt: timestamp

## API Endpoints

### Animals
- `GET /api/animals` - Fetch all animals
- `POST /api/animals` - Create new animal
- `PUT /api/animals/:id` - Update animal
- `DELETE /api/animals/:id` - Delete animal

### Herds
- `GET /api/herds` - Fetch all herds
- `POST /api/herds` - Create new herd
- `PUT /api/herds/:id` - Update herd
- `DELETE /api/herds/:id` - Delete herd (animals remain, just unassigned)

### Breeding Recommendations
- `POST /api/recommendations` - Generate AI-powered herd breeding analysis
  - Body: `{ animalIds: string[] }` - Array of animal IDs to analyze

## Herd Breeding Analysis Algorithm

The herd breeding engine calculates a comprehensive herd score:

```
HerdScore = species_consistency + horn_quality + gender_ratio
```

Factors considered:
- Species consistency (single species vs multi-species)
- Average horn size across herd
- Male to female ratio (balanced ratios score higher)
- Lineage validation (detects related animals)

### Lineage Rules
The algorithm identifies related animals:
- Parent and child relationships
- Animals sharing the same sire (half-siblings via father)
- Animals sharing the same dam (half-siblings via mother)

## AI Integration

The platform uses Google's Gemini AI for:
1. **Herd Analysis**: Comprehensive assessment of entire breeding herds
2. **Genetic Diversity**: Analysis of genetic diversity across selected animals
3. **Natural Language Explanations**: Clear, understandable breeding strategies
4. **Trait Prediction**: Intelligent offspring predictions (horn size, trait strength)
5. **Breeding Strategy**: Customized breeding strategy recommendations

Models used:
- `gemini-2.5-flash` - Fast herd analysis with structured JSON output

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
- Removed weight, age, and breed fields from animal data model
- Added healthNotes field for tracking animal health status
- Implemented herd-based breeding analysis (replacing pair-based)
- Multi-animal selection for comprehensive herd breeding strategies
- Updated Gemini AI prompts for herd analysis
- Renamed "Lineage" to "Herd Data" throughout the UI
- Updated dashboard to show species-based herd distribution
- Focused analytics on health, traits, and genetic diversity

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
3. **View Analytics** - Monitor herd demographics and species distribution on dashboard
4. **View Herd Data** - Visualize family trees and parent-child relationships
5. **Select Herd** - Choose multiple animals for breeding analysis
6. **Generate Analysis** - Get AI-powered herd breeding strategy recommendations
7. **Review Strategy** - Analyze predicted offspring count, genetic diversity, and breeding strategy
8. **Make Decisions** - Use insights to optimize breeding program

## Design Philosophy
- Data-first interface prioritizing critical information
- Professional, trustworthy design for agricultural use
- Efficient navigation with minimal clicks
- Clear visual hierarchy and color-coded data
- Beautiful charts and visualizations
- Smooth interactions and transitions
