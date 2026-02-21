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
  return `Generate a world-class, conversion-optimized landing page JSON for a startup named "${name}".
    
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
  ],
  "testimonials": [
    { "name": "Name", "role": "Role", "text": "Quote", "image": "pravatar logic" }
  ],
  "rawCode": "A complete, standalone HTML/Tailwind CSS file contents. YOU MUST include all necessary Tailwind scripts and Google Fonts in the <head>. Use premium aesthetics: glassmorphism, vibrant gradients, Framer Motion-style animations (using CSS), and high-end typography. DO NOT COMPROMISE on the user's description; include all specific details mentioned."
}

Ensure the tone matches the project description and is extremely premium and persuasive.`;
}

export function getRefineLandingPagePrompt(name: string, currentContent: any, instruction: string) {
  return `You are a world-class web designer. Refine the existing landing page for "${name}" based on this instruction: "${instruction}".

Current Page Data:
${JSON.stringify(currentContent, null, 2)}

Your task is to update the landing page JSON. You can modify any field including the 'rawCode' to reflect the new instructions. 
Ensure you maintain the premium aesthetic and follow the new instructions EXACTLY.

Return ONLY the updated valid JSON object.`;
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

export function getRefinePitchDeckPrompt(name: string, currentContent: any, instruction: string) {
  return `You are a world-class venture capitalist and pitch deck consultant. Refine the existing pitch deck for "${name}" based on this instruction: "${instruction}".

Current Pitch Deck Data:
${JSON.stringify(currentContent, null, 2)}

Your task is to update the pitch deck JSON. You can modify any slide content or reorganize it to follow the instruction. 
Ensure you maintain a professional, investor-ready tone.

Return ONLY the updated valid JSON object.`;
}

export function getRefineBusinessPlanPrompt(name: string, currentContent: any, instruction: string) {
  return `You are a world-class business strategist. Refine the existing business plan for "${name}" based on this instruction: "${instruction}".

Current Business Plan Data:
${JSON.stringify(currentContent, null, 2)}

Your task is to update the business plan JSON. You can refine the executive summary, SWOT, roadmap, or projections. 
Maintain a strategic and actionable tone.

Return ONLY the updated valid JSON object.`;
}
