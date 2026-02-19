import { z } from "zod";

/**
 * Landing Page Schemas
 */
export const createLandingPageSchema = z.object({
    projectId: z.string().cuid(),
    title: z.string().min(1, "Title is required").max(100),
    subtitle: z.string().max(200).optional(),
    content: z.record(z.any()).optional(),
});

export const updateLandingPageSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    subtitle: z.string().max(200).optional(),
    content: z.record(z.any()).optional(),
});

/**
 * Pitch Deck Schemas
 */
export const createPitchDeckSchema = z.object({
    projectId: z.string().cuid(),
    title: z.string().min(1, "Title is required").max(100),
    slides: z.array(z.record(z.any())).optional(),
});

export const updatePitchDeckSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    slides: z.array(z.record(z.any())).optional(),
});

/**
 * Lead Schemas
 */
export const createLeadSchema = z.object({
    projectId: z.string().cuid(),
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().max(20).optional(),
    status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED"]).default("NEW"),
    notes: z.string().max(1000).optional(),
});

export const updateLeadSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().max(20).optional(),
    status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED"]).optional(),
    notes: z.string().max(1000).optional(),
});

/**
 * Validation Entry Schemas
 */
export const createValidationEntrySchema = z.object({
    projectId: z.string().cuid(),
    question: z.string().min(1, "Question is required").max(500),
    answer: z.string().min(1, "Answer is required").max(2000),
    score: z.number().min(0).max(100).optional(),
    notes: z.string().max(1000).optional(),
});

export const updateValidationEntrySchema = z.object({
    question: z.string().min(1).max(500).optional(),
    answer: z.string().min(1).max(2000).optional(),
    score: z.number().min(0).max(100).optional(),
    notes: z.string().max(1000).optional(),
});

/**
 * Business Plan Schemas
 */
export const createBusinessPlanSchema = z.object({
    projectId: z.string().cuid(),
    executiveSummary: z.string().min(1, "Executive summary is required").max(5000),
    marketAnalysis: z.record(z.any()).optional(),
    financialPlan: z.record(z.any()).optional(),
    strategy: z.record(z.any()).optional(),
    content: z.record(z.any()).optional(),
});

export const updateBusinessPlanSchema = z.object({
    executiveSummary: z.string().min(1).max(5000).optional(),
    marketAnalysis: z.record(z.any()).optional(),
    financialPlan: z.record(z.any()).optional(),
    strategy: z.record(z.any()).optional(),
    content: z.record(z.any()).optional(),
});

/**
 * AI Generation Schemas
 */
export const generateLandingPageSchema = z.object({
    projectId: z.string().cuid(),
    projectName: z.string().min(1, "Project name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    targetAudience: z.string().max(200).optional(),
});

export const generatePitchDeckSchema = z.object({
    projectId: z.string().cuid(),
    projectName: z.string().min(1, "Project name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    problem: z.string().max(500).optional(),
    solution: z.string().max(500).optional(),
});

export const generateBusinessPlanSchema = z.object({
    projectId: z.string().cuid(),
    projectName: z.string().min(1, "Project name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    industry: z.string().max(100).optional(),
});

export const validateIdeaSchema = z.object({
    idea: z.string().min(10, "Idea description must be at least 10 characters"),
    targetMarket: z.string().max(200).optional(),
});

/**
 * Subscription Schemas
 */
export const createCheckoutSessionSchema = z.object({
    plan: z.enum(["PRO", "GROWTH"]),
});

export const updateSubscriptionSchema = z.object({
    plan: z.enum(["FREE", "PRO", "GROWTH"]),
});

/**
 * Type exports
 */
export type CreateLandingPageInput = z.infer<typeof createLandingPageSchema>;
export type UpdateLandingPageInput = z.infer<typeof updateLandingPageSchema>;
export type CreatePitchDeckInput = z.infer<typeof createPitchDeckSchema>;
export type UpdatePitchDeckInput = z.infer<typeof updatePitchDeckSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type CreateValidationEntryInput = z.infer<typeof createValidationEntrySchema>;
export type UpdateValidationEntryInput = z.infer<typeof updateValidationEntrySchema>;
export type CreateBusinessPlanInput = z.infer<typeof createBusinessPlanSchema>;
export type UpdateBusinessPlanInput = z.infer<typeof updateBusinessPlanSchema>;
export type GenerateLandingPageInput = z.infer<typeof generateLandingPageSchema>;
export type GeneratePitchDeckInput = z.infer<typeof generatePitchDeckSchema>;
export type GenerateBusinessPlanInput = z.infer<typeof generateBusinessPlanSchema>;
export type ValidateIdeaInput = z.infer<typeof validateIdeaSchema>;
