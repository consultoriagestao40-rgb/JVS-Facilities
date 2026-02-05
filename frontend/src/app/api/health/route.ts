import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    const status: any = {
        env: {
            DATABASE_URL: !!process.env.DATABASE_URL,
            NODE_ENV: process.env.NODE_ENV
        }
    };

    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not defined in environment variables");
        }

        // Test Connection
        await prisma.$connect();

        // Simple query to verify
        const count = await prisma.lead.count();

        status.database = 'Connected';
        status.leadCount = count;

    } catch (error) {
        console.error("Health Check Failed:", error);
        status.database = 'Disconnected';
        status.error = String(error);
    }

    return NextResponse.json(status);
}
