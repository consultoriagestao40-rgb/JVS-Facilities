import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { ResultadoSimulacao, UserData, BreakdownCustos } from '@/types/simulador';

// --- CONFIGURATION ---
const FONTS = {
    TITLE: 'helvetica',
    BODY: 'helvetica'
};

const COLORS = {
    PRIMARY: '#10B981',      // JVS Green (Emerald 500)
    DARK_GREEN: '#14532D',   // Dark Green for Table Headers
    DARK: '#000000',         // Black
    TEXT: '#333333',         // Dark Gray
    RED: '#DC2626',          // Red for discounts
    BG_GRAY: '#E5E7EB',      // Light Gray for subtotals
    BG_LIGHT: '#F9FAFB'      // Very Light Gray
};

// --- HELPERS ---
const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } else {
                reject(new Error('Canvas context failed'));
            }
        };
        img.onerror = reject;
    });
};

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

    // Logo (Top Left or just Text)
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(COLORS.PRIMARY);
    doc.text('JVS Facilities', margin, 30);

    // Main Title
    currentY = 90;
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(42);
    doc.setTextColor('#0F172A'); // Dark Slate
    doc.text('Proposta', margin, currentY);
    doc.text('Comercial', margin, currentY + 14);

    // Green Accent Line
    currentY += 25;
    doc.setDrawColor(COLORS.PRIMARY);
    doc.setLineWidth(2);
    doc.line(margin, currentY, margin + 25, currentY);

    // Client Info
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

    // Date/ID (Bottom)
    currentY = 220;
    doc.setFontSize(9);
    doc.setTextColor('#94A3B8');
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, currentY);
    doc.text(`Proposta #: ${resultado.id}`, margin, currentY + 5);


    // --- CONTENT PAGES ---
    doc.addPage();
    currentY = 25;

    // Helper: Add Section Title
    const addSectionTitle = (title: string, newPage = false) => {
        if (newPage || currentY > 250) {
            if (newPage) doc.addPage();
            currentY = 25;
        }

        doc.setFont(FONTS.TITLE, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(COLORS.PRIMARY); // Green Title
        doc.text(title.toUpperCase(), margin, currentY);

        currentY += 10;
    };

    // Helper: Add Paragraph
    const addParagraph = (text: string) => {
        doc.setFont(FONTS.BODY, 'normal');
        doc.setFontSize(10); // Standard text size
        doc.setTextColor(COLORS.TEXT);
        const lines = doc.splitTextToSize(text, contentWidth);

        if (currentY + (lines.length * 4) > 270) { doc.addPage(); currentY = 25; }

        doc.text(lines, margin, currentY);
        currentY += (lines.length * 4) + 4;
    };

    // Helper: Add Bullets
    const addBullets = (items: string[]) => {
        doc.setFont(FONTS.BODY, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(COLORS.TEXT);

        items.forEach(item => {
            const prefix = '• ';
            const lines = doc.splitTextToSize(prefix + item, contentWidth);
            if (currentY + (lines.length * 4) > 270) { doc.addPage(); currentY = 25; }
            doc.text(lines, margin, currentY);
            currentY += (lines.length * 4) + 1;
        });
        currentY += 4;
    };


    // 1. RESUMO EXECUTIVO
    addSectionTitle('Resumo Executivo');
    addParagraph('Somos uma empresa com mais de 30 anos de atuação em Facilities, especializada em terceirização e execução de serviços de limpeza profissional e similares. Atendemos operações que exigem padronização, confiabilidade e continuidade.');

    // 2. QUEM SOMOS
    addSectionTitle('Quem Somos');
    addParagraph('Há mais de 30 anos no mercado de Facilities, atuamos com excelência na terceirização. Nosso foco é garantir continuidade operacional e padronização.');

    // 3. SEU INVESTIMENTO
    // Just a clean table summary before the details
    addSectionTitle('Resumo do Investimento');

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
        headStyles: { fillColor: COLORS.PRIMARY, textColor: '#FFFFFF', fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 3 }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;


    // 4. DETALHAMENTO DE CUSTOS (The Specific Table)
    if (currentY > 200) { doc.addPage(); currentY = 25; }

    // Loop through each service and create a FULL PAGE table
    resultado.servicos.forEach((item, index) => {
        doc.addPage(); // Start each detailed table on a new page for clarity
        currentY = 20;

        const config = item.config;
        const cargo = config.cargo || config.funcao || `Item ${index + 1}`;

        // Header for the Table Page
        doc.setFont(FONTS.TITLE, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(COLORS.DARK);
        doc.text('Extrato de Custos Detalhado', margin, currentY);

        // Tag for Cargo
        doc.setFillColor(COLORS.BG_GRAY);
        doc.roundedRect(margin + 70, currentY - 5, 50, 7, 1, 1, 'F');
        doc.setFontSize(9);
        doc.text(cargo.toUpperCase(), margin + 72, currentY - 1);

        currentY += 10;

        const det = item.detalhamento;

        // --- CONSTRUCT THE TABLE ROWS ---
        // We use specific styling for headers (Green BG) and totals (Black/Gray BG)

        const body: RowInput[] = [];

        // Montante A
        body.push([{ content: "MONTANTE 'A' - MÃO-DE-OBRA", colSpan: 2, styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold' } }, { content: formatCurrency(det.salarioBase + det.encargos + det.provisoes.total), styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', halign: 'right' } }]);
        body.push(['1) Salário Base / Piso', '', { content: formatCurrency(det.salarioBase), styles: { halign: 'right' } }]);
        body.push(['Gratificações / Função', '', { content: formatCurrency(det.gratificacoes || 0), styles: { halign: 'right' } }]);
        body.push(['Adicionais (Insalubridade/Peric./Noturno)', '', { content: formatCurrency(det.adicionais.total), styles: { halign: 'right' } }]);
        // Encargos & Provisões (Grouped for brevity to fit, or expanded if preferred. Expanding as per screenshot request usually means detail)
        body.push([{ content: "Encargos & Provisões", colSpan: 3, styles: { fontStyle: 'bold', fillColor: COLORS.BG_LIGHT } }]);
        body.push(['2) Encargos Sociais (INSS, FGTS, RAT...)', '', { content: formatCurrency(det.encargos), styles: { halign: 'right' } }]);
        body.push(['3) Provisão Férias + 1/3', '', { content: formatCurrency(det.provisoes.ferias), styles: { halign: 'right' } }]);
        body.push(['4) Provisão 13º Salário', '', { content: formatCurrency(det.provisoes.decimoTerceiro), styles: { halign: 'right' } }]);
        body.push(['5) Provisão Rescisão', '', { content: formatCurrency(det.provisoes.rescisao), styles: { halign: 'right' } }]);

        // Montante B
        body.push([{ content: "MONTANTE 'B' - INSUMOS & OPERACIONAIS", colSpan: 2, styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold' } }, { content: formatCurrency(det.insumos + det.custosOperacionais.total), styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', halign: 'right' } }]);
        body.push(['1) Materiais e Equipamentos', '', { content: formatCurrency(det.insumos), styles: { halign: 'right' } }]);
        body.push(['2) Exames Médicos / EPIs', '', { content: formatCurrency(det.custosOperacionais.total), styles: { halign: 'right' } }]);

        // Montante C
        body.push([{ content: "MONTANTE 'C' - BENEFÍCIOS", colSpan: 2, styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold' } }, { content: formatCurrency(det.beneficios.total), styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', halign: 'right' } }]);
        body.push(['1) Vale Alimentação / Refeição', '', { content: formatCurrency(det.beneficios.valeRefeicao), styles: { halign: 'right' } }]);
        body.push(['2) Vale Transporte', '', { content: formatCurrency(det.beneficios.valeTransporte), styles: { halign: 'right' } }]);
        body.push(['3) Cesta Básica', '', { content: formatCurrency(det.beneficios.cestaBasica), styles: { halign: 'right' } }]);
        body.push(['4) Uniformes', '', { content: formatCurrency(det.beneficios.uniforme), styles: { halign: 'right' } }]);
        // Discounts (Red)
        if (det.beneficios.descontoVA < 0) {
            body.push([{ content: '(-) Desconto VA', styles: { textColor: COLORS.RED } }, '', { content: formatCurrency(det.beneficios.descontoVA), styles: { textColor: COLORS.RED, halign: 'right' } }]);
        }
        if (det.beneficios.descontoVT < 0) {
            body.push([{ content: '(-) Desconto VT', styles: { textColor: COLORS.RED } }, '', { content: formatCurrency(det.beneficios.descontoVT), styles: { textColor: COLORS.RED, halign: 'right' } }]);
        }

        // Partial Total
        const partialTotal = det.salarioBase + det.encargos + det.provisoes.total + det.insumos + det.custosOperacionais.total + det.beneficios.total;
        body.push([{ content: "TOTAL PARCIAL (A + B + C)", colSpan: 2, styles: { fillColor: COLORS.BG_GRAY, fontStyle: 'bold' } }, { content: formatCurrency(partialTotal), styles: { fillColor: COLORS.BG_GRAY, fontStyle: 'bold', halign: 'right' } }]);

        // Montante D (Margin)
        body.push([{ content: "MONTANTE 'D' - MARGEM / LUCRO", colSpan: 2, styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold' } }, { content: formatCurrency(det.lucro), styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', halign: 'right' } }]);
        body.push(['1) Margem Estimada', '', { content: formatCurrency(det.lucro), styles: { halign: 'right' } }]);

        // Taxes
        body.push([{ content: "IMPOSTOS INDIRETOS (PIS/COFINS/ISS)", colSpan: 2, styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold' } }, { content: formatCurrency(det.tributos), styles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', halign: 'right' } }]);
        body.push(['Tributos sobre Faturamento', '', { content: formatCurrency(det.tributos), styles: { halign: 'right' } }]);

        // FINAL TOTAL (Black)
        body.push([
            { content: "PREÇO TOTAL UNITÁRIO", colSpan: 2, styles: { fillColor: COLORS.DARK, textColor: '#FFFFFF', fontStyle: 'bold', fontSize: 11, minCellHeight: 12, valign: 'middle' } },
            { content: formatCurrency(item.custoUnitario), styles: { fillColor: COLORS.DARK, textColor: '#FFFFFF', fontStyle: 'bold', fontSize: 11, halign: 'right', valign: 'middle' } }
        ]);

        // Monthly Total (Gray)
        body.push([
            { content: "MENSAL TOTAL (1X)", colSpan: 2, styles: { fillColor: COLORS.BG_GRAY, fontStyle: 'bold', halign: 'right' } },
            { content: formatCurrency(item.custoTotal), styles: { fillColor: COLORS.BG_GRAY, fontStyle: 'bold', halign: 'right' } }
        ]);


        // Generate Table
        autoTable(doc, {
            startY: currentY,
            head: [['DISCRIMINAÇÃO', '% REF.', 'VALOR (R$)']],
            body: body,
            theme: 'grid',
            headStyles: { fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', fontStyle: 'bold', fontSize: 9 },
            styles: { fontSize: 8, cellPadding: 2, lineColor: '#E5E7EB', lineWidth: 0.1 },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 35, halign: 'right' }
            }
        });

    });


    // 6. NOSSOS DIFERENCIAIS And FINAL CONTACTS
    if (doc.getNumberOfPages() % 2 !== 0) doc.addPage(); // Ensure start on new page if needed or just add page
    doc.addPage();
    currentY = 25;

    addSectionTitle('Diferenciais & Encerramento');
    addParagraph('Estamos à disposição para apresentar detalhadamente esta proposta.');

    currentY += 10;
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(12);
    doc.text('Entre em contato:', margin, currentY);
    currentY += 6;
    doc.setFont(FONTS.BODY, 'normal');
    doc.text('comercial@jvsfacilities.com.br', margin, currentY);

    // Save
    doc.save(`Proposta_JVS_V62_${resultado.id}.pdf`);
};
