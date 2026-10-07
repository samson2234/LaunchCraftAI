import OpenAI from "openai";
import { SYSTEM_PROMPTS, getLandingPagePrompt, getPitchDeckPrompt, getBusinessPlanPrompt, getRefineLandingPagePrompt, getRefinePitchDeckPrompt, getRefineBusinessPlanPrompt } from "./prompts";

let client: OpenAI | undefined;

/**
 * Created on first use so a missing key fails the request, not the build.
 */
export function getOpenAI(): OpenAI {
    if (!client) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("Missing OPENAI_API_KEY environment variable");
        }
        client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return client;
}

/**
 * AI Service for generating content
 */
export class AIService {
    /**
     * Generate landing page content based on project description
     */
    async generateLandingPage(params: {
        projectName: string;
        description: string;
        targetAudience?: string;
    }) {
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPTS.MARKETING_EXPERT,
                },
                {
                    role: "user",
                    content: getLandingPagePrompt(params.projectName, params.description, params.targetAudience)
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    }

    /**
     * Refine an existing landing page
     */
    async refineLandingPage(params: {
        projectName: string;
        currentContent: any;
        instruction: string;
    }) {
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPTS.MARKETING_EXPERT,
                },
                {
                    role: "user",
                    content: getRefineLandingPagePrompt(params.projectName, params.currentContent, params.instruction)
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    }

    /**
     * Generate pitch deck slides
     */
    async generatePitchDeck(params: {
        projectName: string;
        description: string;
    }) {
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPTS.INVESTOR_PRO,
                },
                {
                    role: "user",
                    content: getPitchDeckPrompt(params.projectName, params.description)
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    }

    /**
     * Refine an existing pitch deck
     */
    async refinePitchDeck(params: {
        projectName: string;
        currentContent: any;
        instruction: string;
    }) {
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPTS.INVESTOR_PRO,
                },
                {
                    role: "user",
                    content: getRefinePitchDeckPrompt(params.projectName, params.currentContent, params.instruction)
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    }

    /**
     * Generate business plan sections
     */
    async generateBusinessPlan(params: {
        projectName: string;
        description: string;
    }) {
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPTS.STRATEGIST,
                },
                {
                    role: "user",
                    content: getBusinessPlanPrompt(params.projectName, params.description)
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    }

    /**
     * Refine an existing business plan
     */
    async refineBusinessPlan(params: {
        projectName: string;
        currentContent: any;
        instruction: string;
    }) {
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPTS.STRATEGIST,
                },
                {
                    role: "user",
                    content: getRefineBusinessPlanPrompt(params.projectName, params.currentContent, params.instruction)
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    }

    /**
     * Validate startup idea
     */
    async validateIdea(params: {
        idea: string;
        targetMarket?: string;
    }) {
        const prompt = `Analyze this startup idea and provide validation feedback:

Idea: ${params.idea}
${params.targetMarket ? `Target Market: ${params.targetMarket}` : ""}

Provide a JSON response with:
{
  "score": 75,
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "opportunities": ["Opportunity 1", "Opportunity 2"],
  "threats": ["Threat 1", "Threat 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "marketPotential": "High|Medium|Low",
  "competitiveLandscape": "Description of competition"
}`;

        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPTS.ADVISOR,
                },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    }
}

export const aiService = new AIService();
