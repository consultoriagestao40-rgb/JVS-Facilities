import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResultadoSimulacao, UserData } from '@/types/simulador';

// --- CONFIGURATION ---
const FONTS = {
    TITLE: 'helvetica',
    BODY: 'helvetica'
};

const COLORS = {
    PRIMARY: '#10B981',      // JVS Green
    DARK_GREEN: '#14532D',   // Dark Green
    DARK: '#000000',         // Black
    TEXT: '#333333',         // Dark Gray
    RED: '#DC2626',          // Red
    BG_GRAY: '#E5E7EB',      // Light Gray
    BG_LIGHT: '#F9FAFB',     // Very Light Gray
    NAVY_BG: '#111827',      // Dark Blue
    WHITE: '#FFFFFF'         // White
};

// --- HELPERS ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const generatePropostaPDF = async (resultado: ResultadoSimulacao, client: UserData) => {
    // Initialize Portrait PDF (A4)
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.width; // 210mm
    const pageHeight = doc.internal.pageSize.height; // 297mm
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    let currentY = 20;

    // --- COVER PAGE ---
    // Background
    doc.setFillColor(COLORS.NAVY_BG);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Logo Area (White Box)
    doc.setFillColor('#FFFFFF');
    doc.rect(margin, 80, pageWidth - (margin * 2), 60, 'F');

    // Title
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(32);
    doc.setTextColor(COLORS.PRIMARY);
    doc.text('PROPOSTA', pageWidth / 2, 110, { align: 'center' });
    doc.setTextColor(COLORS.DARK);
    doc.text('COMERCIAL', pageWidth / 2, 125, { align: 'center' });

    // Client Info
    doc.setFontSize(14);
    doc.setTextColor('#FFFFFF');
    doc.text(`Preparado para: ${(client.empresa || client.nome).toUpperCase()}`, pageWidth / 2, 170, { align: 'center' });

    // Date
    doc.setFontSize(10);
    doc.setTextColor('#94A3B8');
    doc.text(`${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 280, { align: 'center' });

    // --- RESUMO EXECUTIVO ---
    doc.addPage();
    doc.setFillColor(COLORS.WHITE);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    currentY = 20;

    const addHeader = (title: string) => {
        doc.setFont(FONTS.TITLE, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(COLORS.PRIMARY);
        doc.text(title.toUpperCase(), margin, currentY);
        doc.setLineWidth(0.5);
        doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
        currentY += 15;
    };

    addHeader('Escopo e Investimento');

    const tableDataResumo = resultado.servicos.map(item => {
        const config = item.config;
        const cargo = config.cargo || config.funcao || 'Serviço';
        return [cargo, config.quantidade || 1, 'MENSAL', formatCurrency(item.custoTotal)];
    });

    tableDataResumo.push(['', '', 'TOTAL MENSAL', formatCurrency(resultado.resumo.custoMensalTotal)]);

    autoTable(doc, {
        startY: currentY,
        head: [['Cargo / Função', 'Qtd', 'Frequência', 'Valor Mensal']],
        body: tableDataResumo,
        theme: 'grid',
        headStyles: { fillColor: COLORS.PRIMARY, textColor: '#FFFFFF', fontStyle: 'bold' },
        columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
        styles: { fontSize: 10, cellPadding: 3 }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 20;

    // --- DETALHAMENTO ---
    resultado.servicos.forEach((item, index) => {
        if (currentY > 200) { doc.addPage(); currentY = 20; }

        addHeader(`Detalhamento: ${item.config.funcao} (${index + 1})`);

        const det = item.detalhamento;
        const detailsData = [
            ['Salário Base', formatCurrency(det.salarioBase)],
            ['Benefícios (VR, VT, Cesta, etc)', formatCurrency(det.beneficios.total)],
            ['Encargos Sociais', formatCurrency(det.encargos)],
            ['Provisões (Férias, 13º)', formatCurrency(det.provisoes.total)],
            ['Insumos & Equipamentos', formatCurrency(det.insumos)],
            ['Custos Operacionais (Exames, EPIs)', formatCurrency(det.custosOperacionais.total)],
            ['Tributos Indiretos', formatCurrency(det.tributos)],
            ['Margem / Lucro', formatCurrency(det.lucro)],
            [{ content: 'PREÇO FINAL UNITÁRIO', styles: { fontStyle: 'bold', fillColor: '#E5E7EB' } }, { content: formatCurrency(item.custoUnitario), styles: { fontStyle: 'bold', fillColor: '#E5E7EB' } }]
        ];

        autoTable(doc, {
            startY: currentY,
            head: [['Item de Custo', 'Valor']],
            body: detailsData,
            theme: 'grid',
            headStyles: { fillColor: '#374151', textColor: '#FFFFFF' },
            columnStyles: { 1: { halign: 'right' } },
            margin: { left: margin, right: pageWidth / 2 } // Half width to be compact
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 15;
    });

    // Save
    doc.save(`Proposta_JVS_V79_${client.empresa || 'Cliente'}.pdf`);
};
