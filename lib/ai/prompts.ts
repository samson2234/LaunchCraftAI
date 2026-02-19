/**
 * Structured prompt system for LaunchCraft AI
 */

export const SYSTEM_PROMPTS = {
    MARKETING_EXPERT: "You are an expert marketing copywriter specializing in high-conversion startup landing pages. Your tone is professional, persuasive, and modern.",
    INVESTOR_PRO: "You are an expert venture capitalist and pitch deck consultant. You know exactly what investors look for in seed and Series A decks.",
    STRATEGIST: "You are a world-class business strategist and consultant. You excel at creating actionable, data-driven business plans and roadmaps.",
    ADVISOR: "You are a seasoned startup advisor who provides brutally honest but constructive feedback on business ideas.",
};

export function getLandingPagePrompt(name: string, description: string, audience?: string) {
    return `Generate a conversion-optimized landing page JSON for a startup named "${name}".
    
Project Context:
Description: ${description}
${audience ? `Target Audience: ${audience}` : ""}

Strictly return ONLY a valid JSON object with this structure:
{
  "headline": "Main value proposition (max 60 chars)",
  "subheadline": "Supporting subheadline (max 100 chars)",
  "ctaText": "Primary action button text (max 20 chars)",
  "features": [
    {
      "title": "Short title",
      "description": "Benefit-driven description (max 120 chars)",
      "icon": "Choose from: Rocket, Zap, Shield, Target, Users, Layout, Globe, Star, BarChart, ShieldCheck"
    }
  ],
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "faq": [
    { "q": "Common question?", "a": "Clear answer." }
  ]
}

Ensure the tone matches the project description and is highly persuasive.`;
}

export function getPitchDeckPrompt(name: string, description: string) {
    return `Create a structured 10-slide startup pitch deck JSON for "${name}".
    
Project Context:
Description: ${description}

Strictly return ONLY a valid JSON object with this structure:
{
  "slides": [
    {
      "slideNumber": 1,
      "type": "COVER",
      "title": "Startup Name & Tagline",
      "content": "Mission statement"
    },
    {
      "slideNumber": 2,
      "type": "PROBLEM",
      "title": "The Problem",
      "content": "Describe the core pain point being solved."
    },
    {
      "slideNumber": 3,
      "type": "SOLUTION",
      "title": "The Solution",
      "content": "How ${name} solves this pain point effectively."
    },
    {
      "slideNumber": 4,
      "type": "MARKET",
      "title": "Market Opportunity",
      "content": "TAM/SAM/SOM or market potential."
    },
    {
      "slideNumber": 5,
      "type": "PRODUCT",
      "title": "The Product",
      "content": "Key features and user experience."
    },
    {
      "slideNumber": 6,
      "type": "MODEL",
      "title": "Business Model",
      "content": "How the startup makes money."
    },
    {
      "slideNumber": 7,
      "type": "TRACTION",
      "title": "Traction / Validation",
      "content": "Current progress or validation milestones."
    },
    {
      "slideNumber": 8,
      "type": "COMPETITION",
      "title": "Competition",
      "content": "Competitive advantage (The 'Moat')."
    },
    {
      "slideNumber": 9,
      "type": "TEAM",
      "title": "Why Us?",
      "content": "Founding team's unique advantages."
    },
    {
      "slideNumber": 10,
      "type": "ASK",
      "title": "The Ask",
      "content": "What the startup needs (funding/partnerships)."
    }
  ]
}`;
}

export function getBusinessPlanPrompt(name: string, description: string) {
    return `Create a comprehensive business plan JSON for "${name}".
    
Project Context:
Description: ${description}

Strictly return ONLY a valid JSON object with this structure:
{
  "executiveSummary": "Full executive summary text",
  "swot": {
    "strengths": ["S1", "S2"],
    "weaknesses": ["W1", "W2"],
    "opportunities": ["O1", "O2"],
    "threats": ["T1", "T2"]
  },
  "roadmap": [
    { "phase": "Phase 1: Foundation", "goals": ["Goal A", "Goal B"] },
    { "phase": "Phase 2: Launch", "goals": ["Goal C", "Goal D"] }
  ],
  "financialProjections": "Summary of 3-year financial outlook",
  "targetAudience": "Detailed persona profile"
}`;
}
