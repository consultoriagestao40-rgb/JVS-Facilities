import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure no caching for admin data

export async function GET() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                propostas: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        custoMensal: true,
                        status: true,
                        servicos: true // Include JSON string
                    }
                }
            }
        });

        return NextResponse.json(leads);
    } catch (error) {
        console.error("Erro ao buscar leads:", error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
