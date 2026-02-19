import { NextResponse } from "next/server";

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

/**
 * Basic in-memory rate limiter
 * For a distributed system, use Redis or a similar store
 */
export async function rateLimit(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const userData = store[key] || { count: 0, resetTime: now + windowMs };

    if (now > userData.resetTime) {
        userData.count = 0;
        userData.resetTime = now + windowMs;
    }

    userData.count++;
    store[key] = userData;

    const remaining = Math.max(0, limit - userData.count);
    const reset = userData.resetTime;

    return {
        success: userData.count <= limit,
        limit,
        remaining,
        reset,
    };
}

export function RateLimitResponse(limit: number, reset: number) {
    return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
            status: 429,
            headers: {
                "X-RateLimit-Limit": limit.toString(),
                "X-RateLimit-Reset": reset.toString(),
            }
        }
    );
}
