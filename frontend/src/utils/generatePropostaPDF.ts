import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResultadoSimulacao, UserData } from '@/types/simulador';
import {
    renderQuemSomos,
    renderValores,
    renderServicos,
    renderSetores,
    renderDiferenciais,
    renderResponsabilidades,
    renderFerramentas,
    renderObrigado
} from './pdfSlides';

// Helper to load image as Base64
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

export const generatePropostaPDF = async (resultado: ResultadoSimulacao, client: UserData) => {
    // 1. Initialize Landscape PDF (A4 Landscape: 297mm x 210mm)
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const primaryColor = '#10B981'; // Green
    const secondaryColor = '#1F2937'; // Slate 800
    const pageWidth = doc.internal.pageSize.width; // ~297mm
    const pageHeight = doc.internal.pageSize.height; // ~210mm

    // --- SLIDE 1: COVER (Dynamic) ---
    // Header Logo (Top Left)
    try {
        const logoData = await loadImage('/logo-jvs.png');
        // Aspect ratio for "logo-branco-200px.png" (approx 200x50 usually, but let's assume a safe width)
        // Drawing logo...
        doc.addImage(logoData, 'PNG', 20, 20, 50, 15); // x, y, w, h
    } catch (e) {
        console.error('Error loading logo:', e);
        // Fallback: Do NOTHING (to avoid "Loose S" bug).
        // If logo fails, we prefer a clean sidebar over broken text.
    }
    // doc.text('Proposta Comercial Personalizada', 20, 40);
    // doc.text(`PROPOSTA #${resultado.id}`, 20, 50);

    // Main Cover Box
    doc.setFillColor(secondaryColor);
    doc.rect(0, 0, 80, pageHeight, 'F'); // Left sidebar

    // Sidebar Content
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('Proposta', 10, 80);
    doc.text('Comercial', 10, 92);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`ID: ${resultado.id}`, 10, 110);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 10, 116);

    // Client Info (Right Side)
    doc.setTextColor(secondaryColor);
    doc.setFontSize(12);
    doc.text('PREPARADO PARA:', 100, 80);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(client.empresa || client.nome, 100, 92);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(client.nome, 100, 102);
    doc.text(client.email, 100, 110);
    if (client.whatsapp) doc.text(client.whatsapp, 100, 118);

    // Totals Box (Bottom Right)
    doc.setFillColor('#F3F4F6');
    doc.rect(100, 140, 180, 50, 'F');

    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    doc.text('INVESTIMENTO MENSAL', 110, 155);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    const valorMensal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.resumo.custoMensalTotal);
    doc.text(valorMensal, 110, 172);

    doc.setFontSize(12);
    doc.setTextColor(secondaryColor);
    doc.text('Anual:', 220, 155);
    doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.resumo.custoAnualTotal), 220, 172);


    // --- SLIDES 2-8: INSTITUTIONAL (NATIVE VECTORS) ---
    renderQuemSomos(doc, pageWidth, pageHeight);
    renderValores(doc, pageWidth, pageHeight);
    renderServicos(doc, pageWidth, pageHeight);
    renderSetores(doc, pageWidth, pageHeight);
    renderDiferenciais(doc, pageWidth, pageHeight);
    renderResponsabilidades(doc, pageWidth, pageHeight);
    renderFerramentas(doc, pageWidth, pageHeight);


    // --- SLIDE 9+: COST TABLES ---
    // Services Summary Table
    doc.addPage();
    doc.setTextColor(secondaryColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhamento dos Serviços Contratados', 20, 20);

    const tableData = resultado.servicos.map(item => [
        item.config.cargo ? `${item.config.funcao.toUpperCase()} - ${item.config.cargo.toUpperCase()}` : item.config.funcao.toUpperCase(),
        `${item.config.quantidade}`,
        `${item.config.dias.join(', ')} - ${item.config.horarioEntrada} às ${item.config.horarioSaida}`,
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.custoTotal)
    ]);

    autoTable(doc, {
        startY: 30,
        head: [['Serviço / Cargo', 'Qtd', 'Escala / Horário', 'Valor Mensal Total']],
        body: tableData,
        headStyles: { fillColor: primaryColor, fontSize: 12 },
        styles: { fontSize: 11, cellPadding: 3 },
        columnStyles: {
            3: { halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 20, right: 20 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Nota: Esta proposta tem validade de 10 dias.', 20, finalY);


    // --- DETAILED BREAKDOWN (One per Page/Slide) ---
    resultado.servicos.forEach((item, index) => {
        doc.addPage();
        const d = item.detalhamento;

        // Header Strip
        doc.setFillColor(secondaryColor);
        doc.rect(0, 0, pageWidth, 25, 'F');
        doc.setTextColor('#FFFFFF');
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        const roleTitle = item.config.cargo ? `${item.config.funcao} - ${item.config.cargo}` : item.config.funcao;
        doc.text(`EXTRATO DE CUSTOS: ${roleTitle}`, 20, 16);

        const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

        // Layout: 2 Columns for Data Tables (A/B Left, C/D Right) to use Landscape width
        const leftColX = 20;
        const rightColX = pageWidth / 2 + 10;
        const colWidth = (pageWidth / 2) - 30;

        // --- LEFT COLUMN ---

        // Group A: Labor
        const totalAdicionais = d.adicionais.total;
        const totalProvisoes = d.provisoes.total;
        const totalEncargos = d.encargos;
        const montanteA = d.salarioBase + (d.gratificacoes || 0) + totalAdicionais + totalEncargos + totalProvisoes;

        const bodyA = [
            ['Salário Base / Piso', fmt(d.salarioBase)],
            ...(d.gratificacoes ? [['Gratificações', fmt(d.gratificacoes)]] : []),
            ...(d.adicionais.copa ? [['Adicional Copa', fmt(d.adicionais.copa)]] : []),
            ...(d.adicionais.insalubridade ? [['Adic. Insalubridade', fmt(d.adicionais.insalubridade)]] : []),
            ...(d.adicionais.periculosidade ? [['Adic. Periculosidade', fmt(d.adicionais.periculosidade)]] : []),
            ...(d.adicionais.noturno ? [['Adic. Noturno', fmt(d.adicionais.noturno)]] : []),
            ...(d.adicionais.intrajornada ? [['Intrajornada', fmt(d.adicionais.intrajornada)]] : []),
            ...(d.adicionais.dsr ? [['DSR', fmt(d.adicionais.dsr)]] : []),
            ['Encargos Sociais', fmt(d.encargos)],
            ['Provisão Férias+1/3', fmt(d.provisoes.ferias)],
            ['Provisão 13º Salário', fmt(d.provisoes.decimoTerceiro)],
            ['Provisão Rescisão', fmt(d.provisoes.rescisao)]
        ];

        autoTable(doc, {
            startY: 40,
            margin: { left: leftColX },
            tableWidth: colWidth,
            head: [['Montante "A" - Mão-de-obra', fmt(montanteA)]],
            body: bodyA,
            theme: 'striped',
            headStyles: { fillColor: '#059669', fontSize: 10 },
            styles: { fontSize: 9, cellPadding: 1.5 },
            columnStyles: { 1: { halign: 'right' } }
        });

        // Group B: Inputs
        const montanteB = d.insumos + (d.custosOperacionais?.total || 0);
        const bodyB = [
            ['Materiais / Equip.', fmt(d.insumos)],
            ['Exames (PCMSO)', fmt(d.custosOperacionais?.examesMedicos || 0)]
        ];

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 5,
            margin: { left: leftColX },
            tableWidth: colWidth,
            head: [['Montante "B" - Insumos', fmt(montanteB)]],
            body: bodyB,
            theme: 'striped',
            headStyles: { fillColor: '#059669', fontSize: 10 },
            styles: { fontSize: 9, cellPadding: 1.5 },
            columnStyles: { 1: { halign: 'right' } }
        });

        // --- RIGHT COLUMN ---

        // Group C: Benefits
        const montanteC = d.beneficios.total;
        const bodyC = [
            ['Vale Refeição', fmt(d.beneficios.valeRefeicao)],
            ['Vale Transporte', fmt(d.beneficios.valeTransporte)],
            ['Cesta Básica', fmt(d.beneficios.cestaBasica)],
            ['Uniformes / EPIs', fmt(d.beneficios.uniforme)],
            ...(d.beneficios.vaSobreFerias ? [['Prov. VA Férias', fmt(d.beneficios.vaSobreFerias)]] : []),
            ...(d.beneficios.descontoVA < 0 ? [['(-) Desc. VA', fmt(d.beneficios.descontoVA)]] : []),
            ...(d.beneficios.descontoVT < 0 ? [['(-) Desc. VT', fmt(d.beneficios.descontoVT)]] : [])
        ];

        autoTable(doc, {
            startY: 40,
            margin: { left: rightColX },
            tableWidth: colWidth,
            head: [['Montante "C" - Benefícios', fmt(montanteC)]],
            body: bodyC,
            theme: 'striped',
            headStyles: { fillColor: '#059669', fontSize: 10 },
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: { 1: { halign: 'right' } }
        });

        // Subtotal + Margin + Taxes Box (Right Side, Below Group C)
        const subtotal = montanteA + montanteB + montanteC;
        const currentY = (doc as any).lastAutoTable.finalY + 10;

        doc.setFillColor('#F3F4F6');
        doc.rect(rightColX, currentY, colWidth, 60, 'F');

        let y = currentY + 10;
        doc.setTextColor(secondaryColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Custom Table-like drawing for totals
        const row = (label: string, val: string, bold = false) => {
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            doc.text(label, rightColX + 5, y);
            doc.text(val, rightColX + colWidth - 5, y, { align: 'right' });
            y += 7;
        };

        row('Custo Operacional:', fmt(subtotal));
        row('Margem / Lucro:', fmt(d.lucro));
        row('Impostos (16,25%):', fmt(d.tributos));
        y += 5;
        doc.setDrawColor('#E5E7EB');
        doc.line(rightColX + 5, y - 5, rightColX + colWidth - 5, y - 5);

        doc.setTextColor(primaryColor);
        doc.setFontSize(14);
        row('PREÇO UNITÁRIO:', fmt(item.custoTotal / item.config.quantidade), true);

        doc.setFillColor(primaryColor);
        doc.rect(rightColX, y + 2, colWidth, 15, 'F');
        doc.setTextColor('#FFFFFF');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`TOTAL MENSAL (${item.config.quantidade}x): ${fmt(item.custoTotal)}`, rightColX + colWidth / 2, y + 12, { align: 'center' });

    });

    // --- SLIDE FINAL: OBRIGADO ---
    renderObrigado(doc, pageWidth, pageHeight, logoData);

    // Footer
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor('#9CA3AF');
        doc.text('Grupo JVS Facilities - www.grupojvsserv.com.br', 20, pageHeight - 10);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
    }

    doc.save(`Proposta_JVS_${client.empresa || 'Cliente'}.pdf`);
};
