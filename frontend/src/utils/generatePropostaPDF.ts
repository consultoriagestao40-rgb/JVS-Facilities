import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResultadoSimulacao, UserData } from '@/types/simulador';

// --- CONFIGURATION ---
const FONTS = {
    TITLE: 'helvetica',
    BODY: 'helvetica'
};

const COLORS = {
    PRIMARY: '#10B981',      // JVS Emerald
    SECONDARY: '#064E3B',    // Dark Emerald
    ACCENT: '#34D399',       // Light Emerald
    DARK: '#111827',         // Slate 900
    TEXT: '#374151',         // Slate 700
    LIGHT_TEXT: '#6B7280',   // Slate 500
    BG_HEADER: '#065F46',    // Deep Teal
    BG_ROW_GRAY: '#F9FAFB',  // Very Light Gray
    BORDER: '#E5E7EB',       // Light Gray Border
    WARNING_BG: '#FFF7ED',   // Orange/Yellow Tint for Disclaimer
    WARNING_TEXT: '#9A3412'  // Dark Orange for Disclaimer Text
};

// --- HELPERS ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const generatePropostaPDF = async (resultado: ResultadoSimulacao, client: UserData) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.width; // 210mm
    const pageHeight = doc.internal.pageSize.height; // 297mm
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let currentY = 20;

    // --- REUSABLE COMPONENTS ---
    const addHeaderFooter = (pageNumber: number, totalPages: number) => {
        // Header
        doc.setFillColor(COLORS.PRIMARY);
        doc.rect(0, 0, pageWidth, 2, 'F');

        doc.setFontSize(8);
        doc.setTextColor(COLORS.LIGHT_TEXT);
        doc.text(`Simulação #${resultado.id || 'N/A'} - JVS Facilities`, margin, 10);

        doc.setTextColor(COLORS.LIGHT_TEXT);
        doc.text(new Date().toLocaleDateString('pt-BR'), pageWidth - margin, 10, { align: 'right' });

        // Footer
        const footerY = pageHeight - 10;
        doc.setDrawColor(COLORS.BORDER);
        doc.setLineWidth(0.1);
        doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

        doc.setFontSize(8);
        doc.setTextColor(COLORS.LIGHT_TEXT);
        doc.text('www.grupojvsserv.com.br', margin, footerY);
        doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
    };

    const checkSpace = (heightNeeded: number) => {
        if (currentY + heightNeeded > pageHeight - 20) {
            doc.addPage();
            currentY = 25;
            return true;
        }
        return false;
    };

    const addSectionTitle = (title: string, subtitle?: string) => {
        checkSpace(25); // More space check
        currentY += 10; // Extra breathing room before title

        doc.setFillColor(COLORS.PRIMARY);
        doc.rect(margin, currentY, 1.5, 6, 'F');

        doc.setFont(FONTS.TITLE, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(COLORS.SECONDARY);
        doc.text(title.toUpperCase(), margin + 4, currentY + 4.5);

        currentY += 12; // Increased from 8 to 12 for better separation from content

        if (subtitle) {
            doc.setFont(FONTS.BODY, 'normal');
            doc.setFontSize(10);
            doc.setTextColor(COLORS.LIGHT_TEXT);
            doc.text(subtitle, margin, currentY);
            currentY += 8; // Increased from 6
        }
    };

    const addParagraph = (text: string, fontSize = 10, isBold = false) => {
        doc.setFont(FONTS.BODY, isBold ? 'bold' : 'normal');
        doc.setFontSize(fontSize);
        doc.setTextColor(COLORS.TEXT);

        const lines = doc.splitTextToSize(text, contentWidth);
        const heightNeeded = (lines.length * 5) + 4; // Increased spacing

        checkSpace(heightNeeded);

        doc.text(lines, margin, currentY);
        currentY += heightNeeded;
    };

    const addBullet = (text: string) => {
        doc.setFont(FONTS.BODY, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(COLORS.TEXT);

        const bulletPrefix = '•';
        const indent = 5;
        const textWidth = contentWidth - indent;

        const lines = doc.splitTextToSize(text, textWidth);
        const heightNeeded = (lines.length * 5) + 3; // Increased spacing

        checkSpace(heightNeeded);

        doc.text(bulletPrefix, margin, currentY);
        doc.text(lines, margin + indent, currentY);
        currentY += heightNeeded;
    };


    // ==========================================
    // 1. COVER PAGE
    // ==========================================
    doc.setFillColor(COLORS.DARK);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Artwork
    doc.setFillColor(COLORS.PRIMARY);
    doc.circle(pageWidth, 0, 80, 'F');
    doc.setFillColor(COLORS.SECONDARY);
    doc.circle(0, pageHeight, 100, 'F');

    // Box
    doc.setFillColor('#FFFFFF');
    doc.roundedRect(margin, 70, pageWidth - (margin * 2), 150, 2, 2, 'F');

    let coverY = 100;

    // "Tagline" changed to Simulation
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.LIGHT_TEXT);
    doc.text('SIMULAÇÃO PRELIMINAR', pageWidth / 2, coverY - 15, { align: 'center' });

    doc.setFontSize(36);
    doc.setTextColor(COLORS.DARK);
    doc.text('PROPOSTA', pageWidth / 2, coverY, { align: 'center' });
    doc.text('COMERCIAL', pageWidth / 2, coverY + 12, { align: 'center' });

    coverY += 30;
    doc.setDrawColor(COLORS.BORDER);
    doc.line(pageWidth / 2 - 20, coverY, pageWidth / 2 + 20, coverY);

    coverY += 20;
    doc.setFontSize(10);
    doc.setTextColor(COLORS.LIGHT_TEXT);
    doc.text('PREPARADO PARA:', pageWidth / 2, coverY, { align: 'center' });

    coverY += 6;
    doc.setFontSize(16);
    doc.setTextColor(COLORS.SECONDARY);
    doc.text((client.empresa || client.nome).toUpperCase(), pageWidth / 2, coverY, { align: 'center' });

    coverY += 15;

    // Contact Info Block
    doc.setFontSize(10);
    doc.setTextColor(COLORS.TEXT);
    doc.text(`A/C: ${client.nome}`, pageWidth / 2, coverY, { align: 'center' });

    const contactInfo = [client.email, client.whatsapp].filter(Boolean).join('  |  ');
    doc.text(contactInfo, pageWidth / 2, coverY + 5, { align: 'center' });

    coverY += 25;
    // Sim ID and Date
    doc.setFontSize(9);
    doc.setTextColor(COLORS.LIGHT_TEXT);
    doc.text(`Simulação Nº: ${resultado.id || 'Nova'}`, pageWidth / 2, coverY, { align: 'center' });
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, coverY + 5, { align: 'center' });


    // ==========================================
    // 2. INTERNAL PAGES
    // ==========================================
    doc.addPage();
    currentY = 25;

    // --- RESUMO EXECUTIVO ---
    addSectionTitle('Resumo Executivo');
    addParagraph('Somos uma empresa com mais de 30 anos de atuação em Facilities, especializada em terceirização e execução de serviços de limpeza profissional e similares.');
    addParagraph('Atendemos operações que exigem padronização, confiabilidade e continuidade, com foco em eficiência e segurança no dia a dia. Nossa entrega combina equipe dimensionada conforme a necessidade, gestão próxima e processos em evolução contínua, garantindo qualidade percebida e previsibilidade para o cliente.');
    currentY += 5; // Extra separation

    // --- QUEM SOMOS ---
    addSectionTitle('Quem Somos');
    addParagraph('Há mais de 30 anos no mercado de Facilities, atuamos com excelência na terceirização e na execução de serviços de limpeza profissional e soluções correlatas. Nosso foco é garantir continuidade operacional, padronização e tranquilidade na gestão, para que o cliente concentre energia no seu core business.');
    currentY += 4;
    addBullet('30 anos de experiência em terceirização de equipes;');
    addBullet('Execução de tratamento de pisos em mais de 500.000m²;');
    addBullet('Mais de 100.000m² de limpeza em altura efetuada;');
    addBullet('Cultura de desenvolvimento voltada às pessoas e à qualidade;');
    addBullet('Dimensionamento personalizado conforme a necessidade de cada operação.');
    currentY += 8; // Section break

    // --- PRINCIPAIS SERVIÇOS ---
    addSectionTitle('Principais Serviços Prestados');
    addParagraph('Terceirização de Serviços de Facilities', 11, true);
    addParagraph('Atuamos na gestão e execução de rotinas essenciais — como limpeza, manutenção e segurança — garantindo um ambiente organizado, seguro e eficiente. Assumimos a operação com responsabilidade e padronização, reduzindo falhas e aumentando a previsibilidade do serviço.');
    currentY += 5;

    addParagraph('Limpeza em Altura', 11, true);
    addParagraph('Serviço especializado para áreas de difícil acesso (fachadas, janelas externas e estruturas elevadas), com uso de equipamentos adequados e técnicas seguras. Entregamos limpeza com precisão, segurança e qualidade visual, preservando a estética do patrimônio e mitigando riscos operacionais.');
    currentY += 8;

    // ==========================================
    // 3. FINANCEIRO
    // ==========================================
    checkSpace(60);
    addSectionTitle('Proposta Financeira', 'Dimensionamento e Investimento Mensal Estimado.');

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
        headStyles: {
            fillColor: COLORS.PRIMARY,
            textColor: '#FFFFFF',
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'left'
        },
        bodyStyles: {
            fontSize: 10,
            textColor: COLORS.TEXT,
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            3: { halign: 'right', fontStyle: 'bold', cellWidth: 40 }
        },
        margin: { left: margin, right: margin },
        tableWidth: 'auto'
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 20;

    // Detailed Tables
    resultado.servicos.forEach((item, index) => {
        checkSpace(80);

        doc.setFontSize(11);
        doc.setFont(FONTS.TITLE, 'bold');
        doc.setTextColor(COLORS.SECONDARY);
        doc.text(`Detalhamento: ${item.config.funcao} (${item.config.quantidade}x)`, margin, currentY);
        currentY += 8; // More space before table matches title

        const det = item.detalhamento;

        const bodyRows = [
            [{ content: "A. MÃO DE OBRA DIRETA", colSpan: 2, styles: { fillColor: COLORS.BG_ROW_GRAY, fontStyle: 'bold' } }],
            ['Salário Base / Piso', formatCurrency(det.salarioBase)],
            ['Gratificações / Função', formatCurrency(det.gratificacoes || 0)],
            ['Adicionais (Insalubridade/Peric./Noturno)', formatCurrency(det.adicionais.total)],
            ['Encargos Sociais (Subtotal)', formatCurrency(det.encargos)],
            ['Provisões (Férias, 13º, Rescisão)', formatCurrency(det.provisoes.total)],

            [{ content: "B. BENEFÍCIOS", colSpan: 2, styles: { fillColor: COLORS.BG_ROW_GRAY, fontStyle: 'bold' } }],
            ['Total Benefícios (VR, VT, Cesta, etc.)', formatCurrency(det.beneficios.total)],

            [{ content: "C. INSUMOS E OPERACIONAIS", colSpan: 2, styles: { fillColor: COLORS.BG_ROW_GRAY, fontStyle: 'bold' } }],
            ['Materiais / Equipamentos', formatCurrency(det.insumos)],
            ['Custos Operacionais (Exames / EPIs)', formatCurrency(det.custosOperacionais.total)],

            [{ content: "D. TRIBUTOS E MARGEM", colSpan: 2, styles: { fillColor: COLORS.BG_ROW_GRAY, fontStyle: 'bold' } }],
            ['Tributos Indiretos', formatCurrency(det.tributos)],
            ['Margem / Lucro Estimado', formatCurrency(det.lucro)],

            [{ content: 'VALOR MENSAL UNITÁRIO', styles: { fontStyle: 'bold', fillColor: COLORS.SECONDARY, textColor: '#FFFFFF' } as any }, { content: formatCurrency(item.custoUnitario), styles: { fontStyle: 'bold', fillColor: COLORS.SECONDARY, textColor: '#FFFFFF', halign: 'right' } as any }]
        ];

        autoTable(doc, {
            startY: currentY,
            head: [['Item de Custo', 'Valor (R$)']],
            body: bodyRows as any[],
            theme: 'plain',
            styles: {
                fontSize: 9,
                cellPadding: 3,
                lineColor: COLORS.BORDER,
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: COLORS.SECONDARY,
                textColor: '#FFFFFF',
                fontStyle: 'bold',
                halign: 'left'
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { halign: 'right', cellWidth: 50 }
            },
            margin: { left: margin, right: margin },
            tableWidth: 'auto'
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 15;
    });


    // ==========================================
    // 4. FINAL TEXTS
    // ==========================================

    // --- DIFERENCIAIS ---
    addSectionTitle('Nossos Diferenciais');
    addParagraph('Abordagem Estratégica e Personalizada', 11, true);
    addParagraph('Entendemos o cenário de cada cliente e estruturamos a operação com uma abordagem personalizada, focada em eficiência, previsibilidade e alinhamento com os objetivos do contrato.');
    currentY += 6;

    addParagraph('Experiência', 11, true);
    addParagraph('Nosso time é composto por gestores experientes em Facilities, do setor de operações à diretoria, com mais de 20 anos de atuação contínua no mercado de prestação de serviços.');
    currentY += 6;

    addParagraph('Padronização de Processos e Indicadores', 11, true);
    addParagraph('Aprimoramos continuamente nossos processos internos e evoluímos junto à tecnologia para aumentar controle, gestão e desempenho. Isso nos permite acompanhar metas, indicadores e resultados com consistência, garantindo qualidade e transparência ao cliente.');
    currentY += 6;

    // --- CONDIÇÕES ---
    addSectionTitle('Condições Comerciais');
    addBullet('Faturamento dos serviços entre os dias 25 e 30 do mês da prestação dos serviços, com vencimento no 3º dia útil do mês subsequente;');
    addBullet('Reajuste anual, automático e equivalente ao dissídio da categoria no mês de referência citado em CCT de cada ano subsequente;');
    addBullet('Próximo reajuste: Janeiro/2026.');


    // ==========================================
    // 5. BACK COVER (Disclaimer + Thanks)
    // ==========================================
    doc.addPage();
    doc.setFillColor(COLORS.DARK);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    // --- DISCLAIMER (Important) ---
    // Yellow box
    doc.setFillColor(COLORS.WARNING_BG);
    doc.roundedRect(margin, centerY - 80, pageWidth - (margin * 2), 40, 2, 2, 'F');

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.WARNING_TEXT);
    doc.text('AVISO IMPORTANTE', centerX, centerY - 70, { align: 'center' });

    doc.setFont(FONTS.BODY, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.WARNING_TEXT);
    const disclaimerText = [
        'Este documento trata-se de uma PROPOSTA DE SIMULAÇÃO DE CUSTOS prévia.',
        'Caso haja interesse em formalizar o contrato, o solicitante deve entrar em contato',
        'conosco para revisão técnica do escopo, oficialização da proposta e elaboração da minuta contratual.'
    ];
    doc.text(disclaimerText, centerX, centerY - 60, { align: 'center', lineHeightFactor: 1.5 });


    // --- THANKS ---
    // CIRCLE REMOVED HERE AS REQUESTED

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(32);
    doc.setTextColor(COLORS.PRIMARY);
    doc.text('OBRIGADO!', centerX, centerY + 10, { align: 'center' }); // Moved up slightly

    doc.setFontSize(12);
    doc.setTextColor('#E5E7EB');
    doc.text('Estamos à disposição para iniciarmos esta parceria.', centerX, centerY + 30, { align: 'center' });

    // Contacts
    const contactY = centerY + 60;
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(11);
    doc.text('Av. Maringá, 1273 - Pinhais - PR', centerX, contactY, { align: 'center' });
    doc.text('(41) 3505-0020  |  comercial@grupojvsserv.com.br', centerX, contactY + 8, { align: 'center' });

    doc.setTextColor(COLORS.PRIMARY);
    doc.text('www.grupojvsserv.com.br', centerX, contactY + 18, { align: 'center' });


    // ==========================================
    // 6. APPLY HEADER/FOOTER
    // ==========================================
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        if (i > 1 && i < totalPages) {
            addHeaderFooter(i, totalPages);
        }
    }

    // Save
    doc.save(`Proposta_JVS_Facilities_${client.empresa.replace(/\s+/g, '_')}_${resultado.id || 'Sim'}.pdf`);
};
