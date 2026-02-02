import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResultadoSimulacao, UserData } from '@/types/simulador';

export const generatePropostaPDF = (resultado: ResultadoSimulacao, client: UserData) => {
    const doc = new jsPDF();
    const primaryColor = '#10B981'; // Green
    const secondaryColor = '#1F2937'; // Slate 800

    // Header
    // Add Logo placeholder or text
    doc.setTextColor(secondaryColor);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('JVS Facilities', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Proposta Comercial Personalizada', 14, 26);
    doc.text(`ID: ${resultado.id}`, 14, 30);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 34);

    // Client Info Box
    doc.setFillColor('#F3F4F6'); // Gray 100
    doc.rect(120, 15, 76, 25, 'F');
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor);
    doc.text('PREPARADO PARA:', 124, 20);
    doc.setFont('helvetica', 'bold');
    doc.text(client.empresa || client.nome, 124, 25);
    doc.setFont('helvetica', 'normal');
    doc.text(client.nome.split(' ')[0], 124, 29);
    doc.text(client.email, 124, 33);
    if (client.whatsapp) doc.text(client.whatsapp, 124, 37);

    // Summary Box
    doc.setFillColor(secondaryColor);
    doc.rect(14, 45, 182, 30, 'F');

    doc.setTextColor('#10B981'); // Primary
    doc.setFontSize(12);
    doc.text('INVESTIMENTO MENSAL', 20, 55);

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    const valorMensal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.resumo.custoMensalTotal);
    doc.text(valorMensal, 20, 68);

    doc.setTextColor('#FFFFFF');
    doc.setFontSize(10);
    doc.text('Investimento Anual:', 120, 55);
    doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.resumo.custoAnualTotal), 120, 68);

    // Services Table
    doc.setTextColor(secondaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhamento dos Serviços', 14, 90);

    const tableData = resultado.servicos.map(item => [
        item.config.cargo ? `${item.config.funcao.toUpperCase()} - ${item.config.cargo.toUpperCase()}` : item.config.funcao.toUpperCase(),
        `${item.config.quantidade} profissional(is)`,
        `${item.config.dias.join(', ')} - ${item.config.horarioEntrada} às ${item.config.horarioSaida}`,
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.custoTotal)
    ]);

    autoTable(doc, {
        startY: 95,
        head: [['Serviço', 'Quantidade', 'Escala', 'Valor Mensal']],
        body: tableData,
        headStyles: { fillColor: primaryColor },
        styles: { fontSize: 10 },
        columnStyles: {
            3: { halign: 'right', fontStyle: 'bold' }
        }
    });

    // Breakdown (Simplified for Client)
    const finalY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(12);
    doc.text('Transparência de Custos (Composição Estimada)', 14, finalY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Nossa proposta respeita rigorosamente todas as convenções coletivas e legislação trabalhista.', 14, finalY + 6);
    doc.text('Inclui: Salários, Encargos (INSS, FGTS), Benefícios (VR, VT, Cesta), Uniformes e Equipamentos.', 14, finalY + 11);

    // ... (Existing Summary Table Code) ...

    // --- DETAILED BREAKDOWN PAGES ---
    resultado.servicos.forEach((item, index) => {
        doc.addPage();
        const d = item.detalhamento;

        // Header: Function - Role
        doc.setFillColor(secondaryColor);
        doc.rect(0, 0, 210, 20, 'F');
        doc.setTextColor('#FFFFFF');
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        const roleTitle = item.config.cargo ? `${item.config.funcao} - ${item.config.cargo}` : item.config.funcao;
        doc.text(`Extrato de Custos: ${roleTitle}`, 14, 13);

        // Helper for Currency
        const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

        // Group A: Labor
        // Copied Logic from PlanilhaCustos.tsx:
        // Montante A = Base + Gratificacoes + Copa (Adicional) + Adicionais (Insalub/Peric/Noturno/DSR) + Encargos + Provisoes
        // Copa is in d.adicionais.copa
        const totalAdicionais = d.adicionais.total;
        const totalProvisoes = d.provisoes.total;
        const totalEncargos = d.encargos;
        const montanteA = d.salarioBase + (d.gratificacoes || 0) + totalAdicionais + totalEncargos + totalProvisoes;

        const bodyA = [
            ['1) Salário Base / Piso', fmt(d.salarioBase)],
            ...(d.gratificacoes ? [['Gratificações / Função', fmt(d.gratificacoes)]] : []),
            ...(d.adicionais.copa ? [['Adicional de Copa (Acúmulo Função)', fmt(d.adicionais.copa)]] : []), // COPA IN GROUP A
            ...(d.adicionais.insalubridade ? [['Adicional Insalubridade', fmt(d.adicionais.insalubridade)]] : []),
            ...(d.adicionais.periculosidade ? [['Adicional Periculosidade', fmt(d.adicionais.periculosidade)]] : []),
            ...(d.adicionais.noturno ? [['Adicional Noturno', fmt(d.adicionais.noturno)]] : []),
            ...(d.adicionais.intrajornada ? [['H.E. Intrajornada', fmt(d.adicionais.intrajornada)]] : []),
            ...(d.adicionais.dsr ? [['Reflexo DSR', fmt(d.adicionais.dsr)]] : []),
            ['2) Encargos Sociais (INSS, FGTS...)', fmt(d.encargos)],
            ['3) Provisão Férias + 1/3', fmt(d.provisoes.ferias)],
            ['4) Provisão 13º Salário', fmt(d.provisoes.decimoTerceiro)],
            ['5) Provisão Rescisão', fmt(d.provisoes.rescisao)]
        ];

        autoTable(doc, {
            startY: 25,
            head: [['Montante "A" - Mão-de-obra', fmt(montanteA)]],
            body: bodyA,
            theme: 'striped',
            headStyles: { fillColor: '#064E3B' }, // Dark Green
            columnStyles: { 1: { halign: 'right' } }
        });

        // Group B: Inputs
        const montanteB = d.insumos + (d.custosOperacionais?.total || 0);
        const bodyB = [
            ['1) Materiais e Equipamentos', fmt(d.insumos)],
            ['2) Exames Médicos (PCMSO/ASO)', fmt(d.custosOperacionais?.examesMedicos || 0)]
        ];

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 5,
            head: [['Montante "B" - Insumos & Operacionais', fmt(montanteB)]],
            body: bodyB,
            theme: 'striped',
            headStyles: { fillColor: '#064E3B' },
            columnStyles: { 1: { halign: 'right' } }
        });

        // Group C: Benefits
        const montanteC = d.beneficios.total;
        const bodyC = [
            ['1) Vale Alimentação / Refeição', fmt(d.beneficios.valeRefeicao)],
            ['2) Vale Transporte', fmt(d.beneficios.valeTransporte)],
            ['3) Cesta Básica', fmt(d.beneficios.cestaBasica)],
            ['4) Uniformes / EPIs (Mensal)', fmt(d.beneficios.uniforme)],
            ...(d.beneficios.vaSobreFerias ? [['5) Provisão VA nas Férias', fmt(d.beneficios.vaSobreFerias)]] : []),
            // Discounts
            ...(d.beneficios.descontoVA < 0 ? [['(-) Desconto VA', fmt(d.beneficios.descontoVA)]] : []),
            ...(d.beneficios.descontoVT < 0 ? [['(-) Desconto VT', fmt(d.beneficios.descontoVT)]] : [])
        ];

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 5,
            head: [['Montante "C" - Benefícios', fmt(montanteC)]],
            body: bodyC,
            theme: 'striped',
            headStyles: { fillColor: '#064E3B' },
            columnStyles: { 1: { halign: 'right' } }
        });

        // Subtotal (A+B+C)
        const subtotal = montanteA + montanteB + montanteC;
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 2,
            body: [['TOTAL PARCIAL (A + B + C)', fmt(subtotal)]],
            theme: 'plain',
            styles: { fontStyle: 'bold', fillColor: '#E5E7EB' },
            columnStyles: { 1: { halign: 'right' } }
        });

        // Group D: Margin
        const montanteD = d.lucro;
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 5,
            head: [['Montante "D" - Margem / Lucro', fmt(montanteD)]],
            body: [['1) Margem de Lucro Estimada', fmt(d.lucro)]],
            theme: 'striped',
            headStyles: { fillColor: '#064E3B' },
            columnStyles: { 1: { halign: 'right' } }
        });

        // Taxes
        const impostos = d.tributos;
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 5,
            head: [['Impostos Indiretos (PIS/COFINS/ISS)', fmt(impostos)]],
            body: [['Tributos sobre Faturamento', fmt(impostos)]],
            theme: 'striped',
            headStyles: { fillColor: '#064E3B' },
            columnStyles: { 1: { halign: 'right' } }
        });

        // Final Total
        // Unitary
        const unitario = item.custoTotal / item.config.quantidade;
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 5,
            body: [
                ['PREÇO TOTAL UNITÁRIO', fmt(unitario)],
                [`MENSAL TOTAL (${item.config.quantidade}x)`, fmt(item.custoTotal)]
            ],
            theme: 'grid',
            styles: { fontSize: 12, fontStyle: 'bold' },
            headStyles: { fillColor: '#000000', textColor: '#FFFFFF' },
            columnStyles: { 1: { halign: 'right' } }
        });
    });


    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor('#9CA3AF');
        const pageHeight = doc.internal.pageSize.height;
        doc.text('Grupo JVS Facilities - www.grupojvsserv.com.br', 14, pageHeight - 10);
        doc.text('Av. Maringá, 1273 - Pinhais/PR - (41) 3505-0020', 14, pageHeight - 6);
        doc.text(`Página ${i} de ${totalPages}`, 190, pageHeight - 10, { align: 'right' });
    }

    // Save
    doc.save(`Proposta_JVS_Facilities_${resultado.id}.pdf`);
};
