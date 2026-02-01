import { NextResponse } from 'next/server';
import { MOCK_REGRAS } from '@/data/regrasCCT';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(MOCK_REGRAS);
}
