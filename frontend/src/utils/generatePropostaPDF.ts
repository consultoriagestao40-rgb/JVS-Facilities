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
    DARK_GREEN: '#064E3B',   // Darker Green for Text/Headers
    DARK: '#111827',         // Slate 900
    TEXT: '#374151',         // Slate 700
    LIGHT_TEXT: '#6B7280',   // Slate 500
    BG_HEADER: '#065F46',    // Deep Teal for Table Headers
    BG_ROW_GRAY: '#F3F4F6'   // Light Gray for rows
};

// --- HELPERS ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const generatePropostaPDF = async (resultado: ResultadoSimulacao, client: UserData) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.width; // 210mm
    const pageHeight = doc.internal.pageSize.height; // 297mm
    const margin = 20; // Enterprise standard margin
    const contentWidth = pageWidth - (margin * 2);

    let currentY = 20;

    // --- HELPER: TEXT LAYOUT ---
    const addSectionTitle = (title: string, marginTop = 10) => {
        if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }

        currentY += marginTop;
        doc.setFont(FONTS.TITLE, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(COLORS.DARK_GREEN);
        doc.text(title.toUpperCase(), margin, currentY);

        // Underline
        doc.setDrawColor(COLORS.PRIMARY);
        doc.setLineWidth(0.5);
        doc.line(margin, currentY + 2, margin + 20, currentY + 2); // Short underline

        currentY += 10;
    };

    const addParagraph = (text: string, fontSize = 10, isBold = false) => {
        doc.setFont(FONTS.BODY, isBold ? 'bold' : 'normal');
        doc.setFontSize(fontSize);
        doc.setTextColor(COLORS.TEXT);

        const lines = doc.splitTextToSize(text, contentWidth);

        if (currentY + (lines.length * 5) > pageHeight - 20) { doc.addPage(); currentY = 20; }

        doc.text(lines, margin, currentY);
        currentY += (lines.length * 5) + 2;
    };

    const addBullet = (text: string) => {
        doc.setFont(FONTS.BODY, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(COLORS.TEXT);

        const lines = doc.splitTextToSize(`• ${text}`, contentWidth);

        if (currentY + (lines.length * 5) > pageHeight - 20) { doc.addPage(); currentY = 20; }

        doc.text(lines, margin, currentY);
        currentY += (lines.length * 5) + 1;
    };

    // ==========================================
    // 1. COVER PAGE
    // ==========================================
    // Clean, White Background with Logo area
    doc.setFillColor('#FFFFFF');
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Top Bar
    doc.setFillColor(COLORS.DARK_GREEN);
    doc.rect(0, 0, pageWidth, 5, 'F');

    // Content Vertical Center approx
    let coverY = 80;

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(36);
    doc.setTextColor(COLORS.DARK_GREEN);
    doc.text('PROPOSTA', margin, coverY);
    doc.setTextColor(COLORS.PRIMARY);
    doc.text('COMERCIAL', margin, coverY + 15);

    coverY += 40;
    doc.setDrawColor(COLORS.TEXT);
    doc.setLineWidth(0.5);
    doc.line(margin, coverY, pageWidth - margin, coverY);

    coverY += 20;
    doc.setFontSize(12);
    doc.setTextColor(COLORS.LIGHT_TEXT);
    doc.text('PREPARADO EXCLUSIVAMENTE PARA:', margin, coverY);

    coverY += 10;
    doc.setFontSize(22);
    doc.setTextColor(COLORS.DARK);
    doc.text((client.empresa || client.nome).toUpperCase(), margin, coverY);

    coverY += 60;
    doc.setFontSize(10);
    doc.setTextColor(COLORS.LIGHT_TEXT);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, margin, coverY);
    doc.text(`Validade: 10 dias`, margin, coverY + 5);

    // ==========================================
    // 2. CONTENT FLOW
    // ==========================================
    doc.addPage();
    currentY = 20;

    // --- RESUMO EXECUTIVO ---
    addSectionTitle('Resumo Executivo', 0);
    addParagraph('Somos uma empresa com mais de 30 anos de atuação em Facilities, especializada em terceirização e execução de serviços de limpeza profissional e similares.');
    addParagraph('Atendemos operações que exigem padronização, confiabilidade e continuidade, com foco em eficiência e segurança no dia a dia. Nossa entrega combina equipe dimensionada conforme a necessidade, gestão próxima e processos em evolução contínua, garantindo qualidade percebida e previsibilidade para o cliente.');

    // --- QUEM SOMOS ---
    addSectionTitle('Quem Somos');
    addParagraph('Há mais de 30 anos no mercado de Facilities, atuamos com excelência na terceirização e na execução de serviços de limpeza profissional e soluções correlatas. Nosso foco é garantir continuidade operacional, padronização e tranquilidade na gestão, para que o cliente concentre energia no seu core business.');

    currentY += 2;
    addBullet('30 anos de experiência em terceirização de equipes;');
    addBullet('Execução de tratamento de pisos em mais de 500.000m²;');
    addBullet('Mais de 100.000m² de limpeza em altura efetuada;');
    addBullet('Cultura de desenvolvimento voltada às pessoas e à qualidade;');
    addBullet('Dimensionamento personalizado conforme a necessidade de cada operação.');

    // --- PRINCIPAIS SERVIÇOS PRESTADOS ---
    addSectionTitle('Principais Serviços Prestados');

    addParagraph('Terceirização de Serviços de Facilities', 11, true);
    addParagraph('Atuamos na gestão e execução de rotinas essenciais — como limpeza, manutenção e segurança — garantindo um ambiente organizado, seguro e eficiente. Assumimos a operação com responsabilidade e padronização, reduzindo falhas e aumentando a previsibilidade do serviço.');

    currentY += 4;
    addParagraph('Limpeza em Altura', 11, true);
    addParagraph('Serviço especializado para áreas de difícil acesso (fachadas, janelas externas e estruturas elevadas), com uso de equipamentos adequados e técnicas seguras. Entregamos limpeza com precisão, segurança e qualidade visual, preservando a estética do patrimônio e mitigando riscos operacionais.');

    // ==========================================
    // 3. FINANCIALS (TABELAS DE CUSTOS)
    // ==========================================

    // Check space for Summary Table
    if (currentY > pageHeight - 80) { doc.addPage(); currentY = 20; }

    addSectionTitle('Proposta Financeira');
    addParagraph('Abaixo apresentamos o dimensionamento e investimento mensal estimado para a operação.');

    // Tabela Resumo
    const summaryData = resultado.servicos.map(item => [
        item.config.funcao + (item.config.cargo ? ` - ${item.config.cargo}` : ''),
        item.config.quantidade,
        'MENSAL',
        formatCurrency(item.custoTotal)
    ]);
    summaryData.push(['TOTAL MENSAL', '', '', formatCurrency(resultado.resumo.custoMensalTotal)]);

    autoTable(doc, {
        startY: currentY,
        head: [['Serviço / Cargo', 'Qtd', 'Frequência', 'Valor Total']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: COLORS.BG_HEADER, textColor: '#FFFFFF', fontStyle: 'bold', fontSize: 10 },
        columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
        styles: { fontSize: 10, cellPadding: 3, textColor: COLORS.TEXT }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;

    // Tabelas Detalhadas (Abertas)
    // "Deve ter a tabela dos custos aberta idêntica a que o sistema gera no simulador"
    resultado.servicos.forEach((item, index) => {
        if (currentY > pageHeight - 120) { doc.addPage(); currentY = 20; }

        doc.setFontSize(11);
        doc.setFont(FONTS.TITLE, 'bold');
        doc.setTextColor(COLORS.DARK);
        doc.text(`Detalhamento: ${item.config.funcao} (${item.config.quantidade}x)`, margin, currentY);
        currentY += 6;

        const det = item.detalhamento;

        // Structure matches the "ComposicaoCustos" logic / breakdown
        const bodyCols = [
            [{ content: "A. MÃO DE OBRA DIRETA", colSpan: 2, styles: { fillColor: '#E5E7EB', fontStyle: 'bold' } as any }],
            ['Salário Base / Piso', formatCurrency(det.salarioBase)],
            ['Gratificações / Função', formatCurrency(det.gratificacoes || 0)],
            ['Adicionais (Insalubridade/Peric./Outros)', formatCurrency(det.adicionais.total)],
            ['Encargos Sociais (Subtotal)', formatCurrency(det.encargos)],
            ['Provisões (Férias, 13º, Rescisão)', formatCurrency(det.provisoes.total)],

            [{ content: "B. BENEFÍCIOS", colSpan: 2, styles: { fillColor: '#E5E7EB', fontStyle: 'bold' } as any }],
            ['Total Benefícios (VR, VT, Cesta, etc.)', formatCurrency(det.beneficios.total)],

            [{ content: "C. INSUMOS E OPERACIONAIS", colSpan: 2, styles: { fillColor: '#E5E7EB', fontStyle: 'bold' } as any }],
            ['Materiais / Equipamentos', formatCurrency(det.insumos)],
            ['Custos Operacionais (Exames/EPIs/Outros)', formatCurrency(det.custosOperacionais.total)],

            [{ content: "D. TRIBUTOS E MARGEM", colSpan: 2, styles: { fillColor: '#E5E7EB', fontStyle: 'bold' } as any }],
            ['Tributos Indiretos', formatCurrency(det.tributos)],
            ['Margem / Lucro Estimado', formatCurrency(det.lucro)],

            [{ content: 'VALOR MENSAL UNITÁRIO', styles: { fontStyle: 'bold', fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', halign: 'left' } as any }, { content: formatCurrency(item.custoUnitario), styles: { fontStyle: 'bold', fillColor: COLORS.DARK_GREEN, textColor: '#FFFFFF', halign: 'right' } as any }]
        ];

        autoTable(doc, {
            startY: currentY,
            head: [['Item de Custo', 'Valor (R$)']],
            body: bodyCols,
            theme: 'plain', // Clean look
            styles: { fontSize: 9, cellPadding: 2, lineColor: '#E5E7EB', lineWidth: 0.1 },
            headStyles: { fillColor: COLORS.BG_HEADER, textColor: '#FFFFFF', fontStyle: 'bold' },
            columnStyles: { 1: { halign: 'right', cellWidth: 40 } },
            // Make it compact width
            margin: { left: margin, right: pageWidth - (margin + 120) }
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 15;
    });


    // ==========================================
    // 4. CLOSING TEXTS
    // ==========================================

    // --- NOSSOS DIFERENCIAIS ---
    addSectionTitle('Nossos Diferenciais');

    addParagraph('Abordagem Estratégica e Personalizada', 11, true);
    addParagraph('Entendemos o cenário de cada cliente e estruturamos a operação com uma abordagem personalizada, focada em eficiência, previsibilidade e alinhamento com os objetivos do contrato.');
    currentY += 4;

    addParagraph('Experiência', 11, true);
    addParagraph('Nosso time é composto por gestores experientes em Facilities, do setor de operações à diretoria, com mais de 20 anos de atuação contínua no mercado de prestação de serviços.');
    currentY += 4;

    addParagraph('Padronização de Processos e Indicadores', 11, true);
    addParagraph('Aprimoramos continuamente nossos processos internos e evoluímos junto à tecnologia para aumentar controle, gestão e desempenho. Isso nos permite acompanhar metas, indicadores e resultados com consistência, garantindo qualidade e transparência ao cliente.');

    // --- CONDIÇÕES COMERCIAIS ---
    addSectionTitle('Condições Comerciais');
    addBullet('Faturamento dos serviços entre os dias 25 e 30 do mês da prestação dos serviços, com vencimento no 3º dia útil do mês subsequente;');
    addBullet('Reajuste anual, automático e equivalente ao dissídio da categoria no mês de referência citado em CCT de cada ano subsequente;');
    addBullet('Próximo reajuste: Janeiro/2026.');

    // ==========================================
    // 5. OBRIGADO (Back Cover)
    // ==========================================
    doc.addPage();
    doc.setFillColor(COLORS.DARK);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(32);
    doc.setTextColor(COLORS.PRIMARY);
    doc.text('OBRIGADO!', centerX, centerY - 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor('#E5E7EB');
    doc.text('Estamos à disposição para iniciarmos esta parceria.', centerX, centerY, { align: 'center' });

    doc.setDrawColor(COLORS.PRIMARY);
    doc.line(centerX - 30, centerY + 10, centerX + 30, centerY + 10);

    // Contatos
    const contactY = centerY + 30;
    doc.setFontSize(11);
    doc.text('Av. Maringá, 1273 - Pinhais - PR', centerX, contactY, { align: 'center' });
    doc.text('(41) 3505-0020  |  comercial@grupojvsserv.com.br', centerX, contactY + 8, { align: 'center' });
    doc.setTextColor(COLORS.PRIMARY);
    doc.text('www.grupojvsserv.com.br', centerX, contactY + 16, { align: 'center' });

    // Save
    doc.save(`Proposta_JVS_Facilities_${client.empresa.replace(/\s+/g, '_')}.pdf`);
};
