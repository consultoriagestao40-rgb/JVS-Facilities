import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { ResultadoSimulacao, UserData, BreakdownCustos } from '@/types/simulador';

// --- CONFIGURATION ---
const FONTS = {
    TITLE: 'helvetica',
    BODY: 'helvetica'
};

const COLORS = {
    PRIMARY: '#10B981',      // JVS Green
    DARK_GREEN: '#14532D',   // Dark Green for Table Headers
    DARK: '#000000',         // Black
    TEXT: '#333333',         // Dark Gray
    RED: '#DC2626',          // Red for discounts
    BG_GRAY: '#E5E7EB',      // Light Gray for subtotals
    BG_LIGHT: '#F9FAFB',     // Very Light Gray
    NAVY_BG: '#111827'       // Dark Blue/Slate for End Page
};

// --- HELPERS ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const generatePropostaPDF = async (resultado: ResultadoSimulacao, client: UserData) => {
    // 1. Initialize Portrait PDF (A4)
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.width; // 210mm
    const pageHeight = doc.internal.pageSize.height; // 297mm
    const margin = 15; // Slightly smaller margin to fit table
    const contentWidth = pageWidth - (margin * 2);

    let currentY = 20;

    // --- COVER PAGE (Clean "Proposta Comercial" Layout) ---
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(COLORS.PRIMARY);
    doc.text('JVS Facilities', margin, 30);

    currentY = 90;
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(42);
    doc.setTextColor('#0F172A'); // Dark Slate
    doc.text('Proposta', margin, currentY);
    doc.text('Comercial', margin, currentY + 14);

    currentY += 25;
    doc.setDrawColor(COLORS.PRIMARY);
    doc.setLineWidth(2);
    doc.line(margin, currentY, margin + 25, currentY);

    currentY += 40;
    doc.setFontSize(10);
    doc.setTextColor('#64748B'); // Gray
    doc.text('PREPARADO PARA:', margin, currentY);

    currentY += 8;
    doc.setFontSize(16);
    doc.setTextColor('#0F172A'); // Dark
    doc.text((client.empresa || client.nome).toUpperCase(), margin, currentY);

    currentY += 8;
    doc.setFontSize(11);
    doc.setTextColor('#334155');
    doc.text(client.email, margin, currentY);
    if (client.whatsapp) {
        currentY += 6;
        doc.text(client.whatsapp, margin, currentY);
    }

    currentY = 220;
    doc.setFontSize(9);
    doc.setTextColor('#94A3B8');
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, currentY);
    doc.text(`Proposta #: ${resultado.id}`, margin, currentY + 5);


    // --- CONTENT PAGES ---
    doc.addPage();
    currentY = 20; // Start higher

    // Helper: Add Section Title
    const addSectionTitle = (title: string, newPage = false) => {
        // Optimized check: If < 50mm left, force page break, unless generic
        if (newPage || currentY > 265) {
            if (newPage) doc.addPage();
            currentY = 20;
        }

        doc.setFont(FONTS.TITLE, 'bold');
        doc.setFontSize(12);
        doc.setTextColor(COLORS.PRIMARY);
        doc.text(title.toUpperCase(), margin, currentY);

        doc.setDrawColor(COLORS.PRIMARY);
        doc.setLineWidth(0.5);
        doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

        currentY += 8;
    };

    const addParagraph = (text: string) => {
        doc.setFont(FONTS.BODY, 'normal');
        doc.setFontSize(9); // Optimized Size
        doc.setTextColor(COLORS.TEXT);
        const lines = doc.splitTextToSize(text, contentWidth);

        if (currentY + (lines.length * 4) > 280) { doc.addPage(); currentY = 20; }

        doc.text(lines, margin, currentY);
        currentY += (lines.length * 4) + 4;
    };

    const addBullets = (items: string[]) => {
        doc.setFont(FONTS.BODY, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(COLORS.TEXT);

        items.forEach(item => {
            const prefix = '• ';
            const lines = doc.splitTextToSize(prefix + item, contentWidth);
            if (currentY + (lines.length * 4) > 280) { doc.addPage(); currentY = 20; }
            doc.text(lines, margin, currentY);
            currentY += (lines.length * 4) + 1;
        });
        currentY += 3;
    };


    // 1. RESUMO EXECUTIVO
    addSectionTitle('Resumo Executivo');
    addParagraph('Somos uma empresa com mais de 30 anos de atuação em Facilities, especializada em terceirização e execução de serviços.');
    addParagraph('Nossa entrega combina equipe dimensionada conforme a necessidade, gestão próxima e processos em evolução contínua.');

    // 2. QUEM SOMOS
    addSectionTitle('Quem Somos');
    addParagraph('Atuamos com excelência na terceirização e na execução de serviços de limpeza profissional e soluções correlatas.');
    addBullets([
        '30 anos de experiência em terceirização;',
        'Execução de tratamento de pisos em mais de 500.000m²'
    ]);

    // 3. PRINCIPAIS SERVIÇOS
    addSectionTitle('Principais Serviços');

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.DARK);
    doc.text('Terceirização de Facilities', margin, currentY);
    currentY += 4;
    addParagraph('Limpeza e Manutenção Predial.');

    // 4. ESCOPO PROPOSTO E INVESTIMENTO
    if (currentY > 230) { doc.addPage(); currentY = 20; }
    addSectionTitle('Escopo Proposto e Investimento');

    const tableDataResumo = resultado.servicos.map(item => {
        const config = item.config;
        const cargo = config.cargo || config.funcao || 'Serviço';
        return [cargo, config.quantidade || 1, Array.isArray(config.dias) ? config.dias.join(', ') : 'Diário', formatCurrency(item.custoTotal)];
    });

    autoTable(doc, {
        startY: currentY,
        head: [['Cargo', 'Qtd', 'Escala', 'Valor Mensal']],
        body: tableDataResumo,
        theme: 'grid',
        headStyles: { fillColor: COLORS.PRIMARY, textColor: '#FFFFFF', fontStyle: 'bold', fontSize: 9 },
        styles: { fontSize: 8, cellPadding: 2 }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 8;

    // Total
    if (currentY > 270) { doc.addPage(); currentY = 20; }
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.DARK);
    doc.text('INVESTIMENTO MENSAL TOTAL:', margin, currentY);

    doc.setFontSize(12);
    doc.setTextColor(COLORS.PRIMARY);
    doc.text(
        formatCurrency(resultado.resumo.custoMensalTotal),
        pageWidth - margin,
        currentY,
        { align: 'right' }
    );
    currentY += 15;


    // 5. DETALHAMENTO DE CUSTOS (Pages 3, 4...)
    resultado.servicos.forEach((item, index) => {
        doc.addPage(); // Start new page for table
        currentY = 20;

        const config = item.config;
        const cargo = config.cargo || config.funcao || `Item ${index + 1}`;

        doc.setFont(FONTS.TITLE, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(COLORS.DARK);
        doc.text('Extrato de Custos Detalhado', margin, currentY);

        doc.setFillColor(COLORS.BG_GRAY);
        doc.roundedRect(margin + 70, currentY - 5, 50, 7, 1, 1, 'F');
        doc.setFontSize(9);
        doc.text(cargo.toUpperCase(), margin + 72, currentY - 1);
        currentY += 10;

        const det = item.detalhamento;
        const body: RowInput[] = [];

        // Simplified construction (same logic, just dense)
        body.push([{ content: "MONTANTE 'A' - MÃO-DE-OBRA", colSpan: 2, styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold' } }, { content: formatCurrency(det.salarioBase + det.encargos + det.provisoes.total), styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', halign: 'right' } }]);
        body.push(['1) Salário Base / Piso', '', { content: formatCurrency(det.salarioBase), styles: { halign: 'right' } }]);
        body.push(['Gratificações / Função', '', { content: formatCurrency(det.gratificacoes || 0), styles: { halign: 'right' } }]);
        body.push(['Adicionais (Insalubridade/Peric./Noturno)', '', { content: formatCurrency(det.adicionais.total), styles: { halign: 'right' } }]);

        body.push([{ content: "Encargos & Provisões", colSpan: 3, styles: { fontStyle: 'bold', fillColor: COLORS.BG_LIGHT } }]);
        body.push(['2) Encargos Sociais', '', { content: formatCurrency(det.encargos), styles: { halign: 'right' } }]);
        body.push(['3) Provisões (Férias/13º/Rescisão)', '', { content: formatCurrency(det.provisoes.total), styles: { halign: 'right' } }]);

        body.push([{ content: "MONTANTE 'B' - INSUMOS & OPERACIONAIS", colSpan: 2, styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold' } }, { content: formatCurrency(det.insumos + det.custosOperacionais.total), styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', halign: 'right' } }]);
        body.push(['1) Materiais e Equipamentos', '', { content: formatCurrency(det.insumos), styles: { halign: 'right' } }]);
        body.push(['2) Exames / EPIs', '', { content: formatCurrency(det.custosOperacionais.total), styles: { halign: 'right' } }]);

        body.push([{ content: "MONTANTE 'C' - BENEFÍCIOS", colSpan: 2, styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold' } }, { content: formatCurrency(det.beneficios.total), styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', halign: 'right' } }]);
        body.push(['1) Benefícios (VA, VT, Cesta, Uniforme)', '', { content: formatCurrency(det.beneficios.total), styles: { halign: 'right' } }]);
        if (det.beneficios.descontoVA < 0) body.push([{ content: '(-) Descontos (VA/VT)', styles: { textColor: COLORS.RED } }, '', { content: formatCurrency(det.beneficios.descontoVA + det.beneficios.descontoVT), styles: { textColor: COLORS.RED, halign: 'right' } }]);

        const partialTotal = det.salarioBase + det.encargos + det.provisoes.total + det.insumos + det.custosOperacionais.total + det.beneficios.total;
        body.push([{ content: "TOTAL PARCIAL (A + B + C)", colSpan: 2, styles: { fillColor: COLORS.BG_GRAY, fontStyle: 'bold' } }, { content: formatCurrency(partialTotal), styles: { fillColor: COLORS.BG_GRAY, fontStyle: 'bold', halign: 'right' } }]);

        body.push([{ content: "MONTANTE 'D' - MARGEM / LUCRO", colSpan: 2, styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold' } }, { content: formatCurrency(det.lucro), styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', halign: 'right' } }]);
        body.push(['1) Margem Estimada', '', { content: formatCurrency(det.lucro), styles: { halign: 'right' } }]);

        body.push([{ content: "IMPOSTOS INDIRETOS", colSpan: 2, styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold' } }, { content: formatCurrency(det.tributos), styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', halign: 'right' } }]);

        body.push([
            { content: "PREÇO TOTAL UNITÁRIO", colSpan: 2, styles: { fillColor: COLORS.DARK, textColor: '#FFFFFF', fontStyle: 'bold', fontSize: 10 } },
            { content: formatCurrency(item.custoUnitario), styles: { fillColor: COLORS.DARK, textColor: '#FFFFFF', fontStyle: 'bold', fontSize: 10, halign: 'right' } }
        ]);
        body.push([
            { content: "MENSAL TOTAL (1X)", colSpan: 2, styles: { fillColor: COLORS.BG_GRAY, fontStyle: 'bold', halign: 'right' } },
            { content: formatCurrency(item.custoTotal), styles: { fillColor: COLORS.BG_GRAY, fontStyle: 'bold', halign: 'right' } }
        ]);

        autoTable(doc, {
            startY: currentY,
            head: [['DISCRIMINAÇÃO', '%', 'VALOR (R$)']],
            body: body,
            theme: 'grid',
            headStyles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', fontSize: 8 },
            styles: { fontSize: 7, cellPadding: 1.5, lineColor: '#E5E7EB', lineWidth: 0.1 },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 10, halign: 'center' },
                2: { cellWidth: 30, halign: 'right' }
            }
        });
    });


    // 6. DIFERENCIAIS + CONDICOES
    if (doc.getNumberOfPages() % 2 !== 0) doc.addPage();
    doc.addPage();
    currentY = 20;

    addSectionTitle('Diferenciais & Condições', false);
    addParagraph('Abordagem Estratégica e Personalizada com Gestão Experiente.');
    addBullets([
        'Reajuste anual automático (CCT);',
        'Faturamento 25-30, Vencimento 3º dia útil;'
    ]);


    // FINAL PAGE: "Obrigado"
    doc.addPage();
    doc.setFillColor(COLORS.NAVY_BG);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    const centerX = pageWidth / 2;
    let centerY = pageHeight / 3;

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(24);
    doc.setTextColor('#FFFFFF');
    doc.text('JVS Facilities', centerX, centerY, { align: 'center' });
    centerY += 25;

    doc.setFontSize(48);
    doc.setTextColor(COLORS.PRIMARY);
    doc.text('Obrigado!', centerX, centerY, { align: 'center' });
    centerY += 20;

    doc.setFont(FONTS.BODY, 'normal');
    doc.setFontSize(14);
    doc.setTextColor('#94A3B8');
    doc.text('Estamos prontos para atender sua empresa.', centerX, centerY, { align: 'center' });
    centerY += 40;

    doc.setDrawColor('#334155');
    doc.line(centerX - 40, centerY, centerX + 40, centerY);
    centerY += 25;

    doc.setFontSize(11);
    doc.setTextColor('#E2E8F0');
    doc.text('Av. Maringá, 1273 - Pinhais - PR', centerX, centerY, { align: 'center' });
    centerY += 10;
    doc.text('(41) 99225-2968  |  comercial@grupojvsserv.com.br', centerX, centerY, { align: 'center' });
    centerY += 12;
    doc.setTextColor(COLORS.PRIMARY);
    doc.text('www.grupojvsserv.com.br', centerX, centerY, { align: 'center' });


    doc.save(`Proposta_JVS_V66_${client.empresa || 'Comercial'}.pdf`);
};
