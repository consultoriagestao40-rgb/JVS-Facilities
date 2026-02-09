import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResultadoSimulacao, UserData, BreakdownCustos } from '@/types/simulador';

// --- CONFIGURATION ---
const FONTS = {
    TITLE: 'helvetica',
    BODY: 'helvetica'
};

const COLORS = {
    PRIMARY: '#10B981',    // Emerald 500 (Green for highlights)
    DARK: '#111827',       // Slate 900 (Dark Backgrounds)
    DARK_BLUE: '#1E293B',  // Slate 800 (Header/Footer areas)
    TEXT: '#374151',       // Gray 700
    LIGHT_BG: '#F3F4F6'    // Gray 100
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
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let currentY = 20;

    // --- COVER PAGE (Specific Layout) ---

    // 1. Header Left: Logo / Title
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(24);
    doc.setTextColor(COLORS.DARK_BLUE);
    doc.text('JVS Facilities', margin, 30);

    doc.setFont(FONTS.BODY, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.TEXT);
    doc.text('Proposta Comercial Personalizada', margin, 40);
    doc.text(`ID: ${resultado.id}`, margin, 45);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, 50);

    // 2. Header Right: Client Info Box (Light Gray Background)
    const boxWidth = 90;
    const boxX = pageWidth - margin - boxWidth;
    const boxY = 20;

    doc.setFillColor('#F8FAFC'); // very light gray
    doc.rect(boxX, boxY, boxWidth, 40, 'F');

    doc.setFontSize(8);
    doc.setTextColor('#64748B'); // Slate 500
    doc.text('PREPARADO PARA:', boxX + 5, boxY + 10);

    doc.setFontSize(11);
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setTextColor(COLORS.DARK_BLUE);
    doc.text((client.empresa || client.nome).toUpperCase(), boxX + 5, boxY + 18);

    doc.setFont(FONTS.BODY, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.TEXT);
    doc.text(client.nome, boxX + 5, boxY + 24);
    doc.text(client.email, boxX + 5, boxY + 30);
    if (client.whatsapp) {
        doc.text(client.whatsapp, boxX + 5, boxY + 36);
    }

    // 3. Bottom Hero Area: Investment Totals (Dark Box)
    // We place this at the bottom of the content area, or vertically centered if brief cover.
    // Let's place it around Y=150 or lower to give space. 
    // The user image showed it somewhat prominent. Let's put it at Y=120.
    const heroY = 120;
    const heroHeight = 50;

    doc.setFillColor(COLORS.DARK_BLUE);
    doc.rect(margin, heroY, contentWidth, heroHeight, 'F');

    // Left Side: Monthly Investment
    doc.setFontSize(10);
    doc.setTextColor(COLORS.PRIMARY); // Green Text Title
    doc.text('INVESTIMENTO MENSAL', margin + 10, heroY + 15);

    doc.setFontSize(28);
    doc.setFont(FONTS.TITLE, 'bold');
    doc.text(formatCurrency(resultado.resumo.custoMensalTotal), margin + 10, heroY + 35);

    // Right Side: Annual Investment
    // Align details to the right half
    const rightHeroX = pageWidth / 2 + 10;

    doc.setFontSize(10);
    doc.setTextColor(COLORS.LIGHT_BG); // White/Light Text Title
    doc.setFont(FONTS.BODY, 'bold');
    doc.text('Investimento Anual:', rightHeroX, heroY + 15);

    doc.setFontSize(14);
    doc.text(formatCurrency(resultado.resumo.custoAnualTotal), rightHeroX, heroY + 35);


    // Footer of Cover Page
    doc.setFontSize(8);
    doc.setTextColor('#9CA3AF');
    doc.text('Proposta válida por 10 dias.', margin, pageHeight - 15);


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
        doc.setFontSize(16);
        doc.setTextColor(COLORS.PRIMARY);
        doc.text(title.toUpperCase(), margin, currentY);

        doc.setDrawColor(COLORS.PRIMARY);
        doc.setLineWidth(0.5);
        doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);

        currentY += 15;
    };

    // Helper: Add Body Text
    const addParagraph = (text: string) => {
        doc.setFont(FONTS.BODY, 'normal');
        doc.setFontSize(11);
        doc.setTextColor(COLORS.TEXT);
        const lines = doc.splitTextToSize(text, contentWidth);

        if (currentY + (lines.length * 5) > 270) { doc.addPage(); currentY = 25; }

        doc.text(lines, margin, currentY);
        currentY += (lines.length * 5) + 6;
    };

    // Helper: Add Bullets
    const addBullets = (items: string[]) => {
        doc.setFont(FONTS.BODY, 'normal');
        doc.setFontSize(11);
        doc.setTextColor(COLORS.TEXT);

        items.forEach(item => {
            const prefix = '•  ';
            const lines = doc.splitTextToSize(prefix + item, contentWidth);
            if (currentY + (lines.length * 5) > 270) { doc.addPage(); currentY = 25; }
            doc.text(lines, margin, currentY);
            currentY += (lines.length * 5) + 2;
        });
        currentY += 4;
    };


    // 1. RESUMO EXECUTIVO
    addSectionTitle('Resumo Executivo');
    addParagraph('Somos uma empresa com mais de 30 anos de atuação em Facilities, especializada em terceirização e execução de serviços de limpeza profissional e similares. Atendemos operações que exigem padronização, confiabilidade e continuidade, com foco em eficiência e segurança no dia a dia.');
    addParagraph('Nossa entrega combina equipe dimensionada conforme a necessidade, gestão próxima e processos em evolução contínua, garantindo qualidade percebida e previsibilidade para o cliente.');

    // 2. QUEM SOMOS
    addSectionTitle('Quem Somos');
    addParagraph('Há mais de 30 anos no mercado de Facilities, atuamos com excelência na terceirização e na execução de serviços de limpeza profissional e soluções correlatas. Nosso foco é garantir continuidade operacional, padronização e tranquilidade na gestão, para que o cliente concentre energia no seu core business.');
    addBullets([
        '30 anos de experiência em terceirização de equipes;',
        'Execução de tratamento de pisos em mais de 500.000m²;',
        'Mais de 100.000m² de limpeza em altura efetuada;',
        'Cultura de desenvolvimento voltada às pessoas e à qualidade;',
        'Dimensionamento personalizado conforme a necessidade de cada operação.'
    ]);

    // 3. PRINCIPAIS SERVIÇOS PRESTADOS
    addSectionTitle('Principais Serviços Prestados');

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.DARK);
    doc.text('Terceirização de Serviços de Facilities', margin, currentY);
    currentY += 6;
    addParagraph('Atuamos na gestão e execução de rotinas essenciais — como limpeza, manutenção e segurança — garantindo um ambiente organizado, seguro e eficiente. Assumimos a operação com responsabilidade e padronização, reduzindo falhas e aumentando a previsibilidade do serviço.');

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.DARK);
    doc.text('Limpeza em Altura', margin, currentY);
    currentY += 6;
    addParagraph('Serviço especializado para áreas de difícil acesso (fachadas, janelas externas e estruturas elevadas), com uso de equipamentos adequados e técnicas seguras. Entregamos limpeza com precisão, segurança e qualidade visual, preservando a estética do patrimônio e mitigando riscos operacionais.');


    // 4. ESCOPO E INVESTIMENTO (Tabela Condensada)
    if (currentY > 200) { doc.addPage(); currentY = 25; }
    addSectionTitle('Escopo Proposto e Investimento');

    const tableDataResumo = resultado.servicos.map(item => {
        const config = item.config;
        const cargo = config.cargo || config.funcao || 'Serviço';
        const quantidade = config.quantidade || 1;
        const escala = Array.isArray(config.dias) ? config.dias.join(', ') : (config.dias || 'Diário');
        return [cargo, quantidade, escala, formatCurrency(item.custoTotal)];
    });

    autoTable(doc, {
        startY: currentY,
        head: [['Cargo / Função', 'Qtd', 'Escala', 'Valor Mensal Unit.']],
        body: tableDataResumo,
        theme: 'grid',
        headStyles: { fillColor: COLORS.PRIMARY, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 40, halign: 'center' },
            3: { cellWidth: 40, halign: 'right' }
        }
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;


    // 5. DETALHAMENTO DE CUSTOS (Open Tables)
    // New Section: One table per service item showing breakdown
    addSectionTitle('Detalhamento de Custos (Composição)', true);

    resultado.servicos.forEach((item, index) => {
        const config = item.config;
        const cargo = config.cargo || config.funcao || `Item ${index + 1}`;
        const quantidade = config.quantidade || 1;

        // Ensure space for table title + table
        if (currentY > 230) { doc.addPage(); currentY = 25; }

        doc.setFont(FONTS.TITLE, 'bold');
        doc.setFontSize(12);
        doc.setTextColor(COLORS.DARK_BLUE);
        doc.text(`Composição: ${cargo} (${quantidade}x)`, margin, currentY);
        currentY += 6;

        const det = item.detalhamento;

        // Structure Breakdown Data
        const breakdownData = [
            ['Salário Base', formatCurrency(det.salarioBase)],
            ['Encargos Sociais (INSS, FGTS...)', formatCurrency(det.encargos)],
            ['Benefícios (VA, VT, Cesta, etc)', formatCurrency(det.beneficios.total)],
            ['Provisões (Férias, 13º, Rescisão)', formatCurrency(det.provisoes.total)],
            ['Insumos / Equipamentos', formatCurrency(det.insumos)],
            ['Custos Operacionais / EPIs', formatCurrency(det.custosOperacionais.total)],
            ['Tributos e Margem', formatCurrency(det.tributos + det.lucro)],
            [
                { content: 'TOTAL UNITÁRIO', styles: { fontStyle: 'bold' as 'bold', fillColor: '#F0FDF4' } },
                { content: formatCurrency(item.custoUnitario), styles: { fontStyle: 'bold' as 'bold', fillColor: '#F0FDF4' } }
            ]
        ];

        autoTable(doc, {
            startY: currentY,
            head: [['Item de Custo', 'Valor']],
            body: breakdownData as any, // Cast body to any to avoid complex RowInput union mismatches
            theme: 'grid',
            headStyles: { fillColor: COLORS.DARK_BLUE, fontSize: 9 },
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 40, halign: 'right' }
            },
            margin: { left: margin, right: pageWidth - margin - 80 } // Keep table narrow (80mm width)
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;
    });


    // 6. NOSSOS DIFERENCIAIS
    addSectionTitle('Nossos Diferenciais', true);

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(11);
    doc.text('Abordagem Estratégica e Personalizada', margin, currentY);
    currentY += 5;
    addParagraph('Entendemos o cenário de cada cliente e estruturamos a operação com uma abordagem personalizada, focada em eficiência, previsibilidade e alinhamento com os objetivos do contrato.');

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(11);
    doc.text('Experiência', margin, currentY);
    currentY += 5;
    addParagraph('Nosso time é composto por gestores experientes em Facilities, do setor de operações à diretoria, com mais de 20 anos de atuação contínua no mercado de prestação de serviços.');

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(11);
    doc.text('Padronização de Processos e Indicadores', margin, currentY);
    currentY += 5;
    addParagraph('Aprimoramos continuamente nossos processos internos e evoluímos junto à tecnologia para aumentar controle, gestão e desempenho.');


    // 7. CONDIÇÕES COMERCIAIS
    if (currentY > 200) { doc.addPage(); currentY = 25; }
    addSectionTitle('Condições Comerciais');
    addBullets([
        'Faturamento dos serviços entre os dias 25 e 30 do mês da prestação dos serviços, com vencimento no 3º dia útil do mês subsequente;',
        'Reajuste anual, automático e equivalente ao dissídio da categoria no mês de referência citado em CCT de cada ano subsequente;',
        'Próximo reajuste: Janeiro/2026.'
    ]);

    // OBRIGADO + CONTATOS
    currentY += 20;
    doc.setFillColor(COLORS.LIGHT_BG);
    doc.rect(margin, currentY, contentWidth, 40, 'F');

    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(COLORS.DARK_BLUE);
    doc.text('Obrigado pela oportunidade!', margin + 10, currentY + 15);

    doc.setFontSize(10);
    doc.setFont(FONTS.BODY, 'normal');
    doc.text('Ficamos à disposição para esclarecimentos e ajustes nesta proposta.', margin + 10, currentY + 22);
    doc.text(`Contato: ${client.email}`, margin + 10, currentY + 30);
    // You might want to put JVS contact here ideally.
    // doc.text('Comercial JVS Facilities: (41) 99999-9999', margin + 10, currentY + 30);


    // Save JSON
    doc.save(`Proposta_JVS_${client.empresa || 'Comercial'}_${resultado.id}.pdf`);
};
