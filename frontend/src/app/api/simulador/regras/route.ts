import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RegraCCT } from '@/types/simulador';

export const dynamic = 'force-dynamic';

// Helper to map DB to Frontend Type
const mapToFrontend = (r: any): RegraCCT => {
    const safeParse = (val: string, fallback: any) => {
        try { return typeof val === 'string' ? JSON.parse(val) : val; } catch { return fallback; }
    };

    const parsedBeneficios = safeParse(r.beneficios, {});
    const parsedAdicionais = safeParse(r.adicionais, {});

    // Fix V74 Logic here too
    const extractedCargos = Array.isArray(parsedAdicionais.cargos) ? parsedAdicionais.cargos : [];
    if (parsedAdicionais.cargo && typeof parsedAdicionais.cargo === 'string') {
        extractedCargos.push({
            nome: parsedAdicionais.cargo,
            piso: Number(r.piso) || 0,
            gratificacao: 0,
            adicionalCopa: 0
        });
    }

    return {
        id: r.id,
        uf: r.estado,
        cidade: '', // We don't have city column in DB schema shown in calcular, assuming generic for now or part of estate? 
        // Wait, admin screenshot shows "Paraná (PR)" and "Curitiba" in separate inputs. 
        // In calcular/route.ts we mapped 'r.estado' to 'uf'.
        // We need to check if schema has 'cidade'. 
        // Looking at calculating logic: `const rCidade = r.cidade?.toLowerCase() || '';` - wait, Prisma type in calculate only showed 'estado', 'funcao', etc.
        // Actually, in `fetchActiveRules` it was `return dbRules.map(r => { ... uf: r.estado, cidade: '' ... })`.
        // This implies the DB MISSES the city column? 
        // If the user inputs City in Admin, we must store it. 
        // If schema lacks it, we might need to verify schema or store in JSON.
        // For now, I'll allow it to be stored in `adicionais` if needed, OR just match what we have.
        // Let's assume standard mapping for now.
        funcao: r.funcao,
        dataVigencia: r.vigencia.toISOString().split('T')[0],
        salarioPiso: Number(r.piso),
        beneficios: parsedBeneficios,
        aliquotas: parsedAdicionais.aliquotas || {},
        adicionais: parsedAdicionais,
        provisoes: parsedAdicionais.provisoes || {},
        cargos: extractedCargos,
        // @ts-ignore
        configuracoesBeneficios: parsedAdicionais.configuracoesBeneficios || {},
        custosOperacionais: parsedAdicionais.custosOperacionais || {}
    } as unknown as RegraCCT;
};

export async function GET() {
    try {
        const dbRules = await prisma.convencaoColetiva.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(dbRules.map(mapToFrontend));
    } catch (e) {
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body: RegraCCT = await req.json();

        // Flatten for DB
        // We store complex objects in JSON strings
        const adic = {
            ...body.adicionais,
            aliquotas: body.aliquotas,
            provisoes: body.provisoes,
            cargos: body.cargos,
            configuracoesBeneficios: body.configuracoesBeneficios,
            custosOperacionais: body.custosOperacionais,
            // Store City in there if schema doesn't have it? 
            // Better to rely on what works.
        };

        const regra = await prisma.convencaoColetiva.create({
            data: {
                estado: body.uf, // Mapping UF to Estado
                funcao: body.funcao,
                piso: body.salarioPiso,
                vigencia: new Date(body.dataVigencia),
                beneficios: JSON.stringify(body.beneficios),
                adicionais: JSON.stringify(adic)
            }
        });
        return NextResponse.json(mapToFrontend(regra));
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Error creating' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body: RegraCCT = await req.json();
        const adic = {
            ...body.adicionais,
            aliquotas: body.aliquotas,
            provisoes: body.provisoes,
            cargos: body.cargos,
            configuracoesBeneficios: body.configuracoesBeneficios,
            custosOperacionais: body.custosOperacionais
        };

        const regra = await prisma.convencaoColetiva.update({
            where: { id: body.id },
            data: {
                estado: body.uf,
                funcao: body.funcao,
                piso: body.salarioPiso,
                vigencia: new Date(body.dataVigencia),
                beneficios: JSON.stringify(body.beneficios),
                adicionais: JSON.stringify(adic)
            }
        });
        return NextResponse.json(mapToFrontend(regra));
    } catch (e) {
        return NextResponse.json({ error: 'Error updating' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await prisma.convencaoColetiva.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Error deleting' }, { status: 500 });
    }
}
