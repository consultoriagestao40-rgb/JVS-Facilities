import jsPDF from 'jspdf';

// --- DESIGN TOKENS (Extracted from Landing Page) ---
const COLORS = {
    // Brand Colors
    PRIMARY: '#10B981',    // Emerald 500 (Hero Button / Highlights)
    SECONDARY: '#3B82F6',  // Blue 500 (Accents)

    // Backgrounds
    BG_DARK: '#0F172A',    // Slate 900 (Hero Background)
    BG_CARD: '#1E293B',    // Slate 800 (Cards on Dark)
    BG_LIGHT: '#F9FAFB',   // Gray 50 (Light Section BG)

    // Text
    TEXT_DARK: '#111827',  // Gray 900 (Headings on Light)
    TEXT_MUTED: '#6B7280', // Gray 500 (Body text on Light)
    TEXT_LIGHT: '#F3F4F6', // Gray 100 (Headings on Dark)
    TEXT_GRAY: '#9CA3AF',  // Gray 400 (Body text on Dark)

    WHITE: '#FFFFFF',
    BORDER_LIGHT: '#E5E7EB' // Gray 200
};

// --- HELPER FUNCTIONS ---

// Draw a "Modern Card" (Rounded Rect with optional border/shadow feel)
const drawCard = (doc: jsPDF, x: number, y: number, w: number, h: number, fillColor: string, borderColor?: string) => {
    doc.setFillColor(fillColor);
    doc.roundedRect(x, y, w, h, 3, 3, 'F'); // 3mm radius

    if (borderColor) {
        doc.setDrawColor(borderColor);
        doc.setLineWidth(0.1);
        doc.roundedRect(x, y, w, h, 3, 3, 'S');
    }
};

// Draw a circular icon placeholder (until we have real SVGs)
const drawIcon = (doc: jsPDF, x: number, y: number, color: string, label?: string) => {
    doc.setFillColor(color);
    doc.circle(x, y, 8, 'F');
    if (label) {
        doc.setTextColor(COLORS.WHITE);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(label.charAt(0).toUpperCase(), x, y + 2, { align: 'center' });
    }
};

const drawSectionTitle = (doc: jsPDF, title: string, subtitle: string, x: number, y: number, isDark = false) => {
    // Tiny Accent Line
    doc.setDrawColor(COLORS.PRIMARY);
    doc.setLineWidth(1);
    doc.line(x, y - 5, x + 20, y - 5);

    // Title
    doc.setTextColor(isDark ? COLORS.WHITE : COLORS.TEXT_DARK);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), x, y + 5);

    // Subtitle
    if (subtitle) {
        doc.setTextColor(isDark ? COLORS.TEXT_GRAY : COLORS.TEXT_MUTED);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(subtitle, x, y + 12);
    }
};


// --- SLIDE RENDERERS ---

// 1. QUEM SOMOS (Dark Theme - Inspired by Hero)
export const renderQuemSomos = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();

    // Background (Slate 900)
    doc.setFillColor(COLORS.BG_DARK);
    doc.rect(0, 0, width, height, 'F');

    // Decoration (Glow effect simulation - Top Right)
    doc.setFillColor(COLORS.BG_CARD);
    doc.circle(width, 0, 100, 'F');

    // Content Container (Left)
    const margin = 20;
    drawSectionTitle(doc, 'Quem Somos', 'Excelência em Facilities há mais de 30 anos.', margin, 40, true);

    const textY = 70;
    doc.setTextColor(COLORS.TEXT_GRAY);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const paragraphs = [
        'Especialistas em prestação de serviços de limpeza profissional e facilities.',
        'Nosso foco é entregar qualidade superior, otimização de custos e tranquilidade operacional.',
        '',
        '• 30+ anos de experiência em terceirização',
        '• 500.000m² de pisos tratados com excelência',
        '• Cultura voltada para o desenvolvimento humano',
        '• Gestão personalizada para cada cliente'
    ];
    doc.text(paragraphs, margin, textY);

    // Right Side: Staggered "Cards" Visual (Stats)
    const cardW = 90;
    const cardH = 35;
    const cardX = width - cardW - margin - 20;

    // Card 1
    let cy = 60;
    drawCard(doc, cardX, cy, cardW, cardH, COLORS.BG_CARD, COLORS.PRIMARY);
    doc.setTextColor(COLORS.PRIMARY);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('30 Anos', cardX + 10, cy + 12);
    doc.setTextColor(COLORS.WHITE);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('de experiência no mercado.', cardX + 10, cy + 22);

    // Card 2
    cy += 45;
    drawCard(doc, cardX + 10, cy, cardW, cardH, COLORS.BG_CARD, COLORS.SECONDARY); // Offset right
    doc.setTextColor(COLORS.SECONDARY);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('100.000m²', cardX + 20, cy + 12);
    doc.setTextColor(COLORS.WHITE);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('de limpeza em altura executada.', cardX + 20, cy + 22);

    // Card 3
    cy += 45;
    drawCard(doc, cardX, cy, cardW, cardH, COLORS.BG_CARD, COLORS.WHITE);
    doc.setTextColor(COLORS.WHITE);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('500.000m²', cardX + 10, cy + 12);
    doc.setTextColor(COLORS.TEXT_GRAY);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('de tratamento de pisos.', cardX + 10, cy + 22);
};

// 2. VALORES (Light Theme - Clean)
export const renderValores = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.BG_LIGHT);
    doc.rect(0, 0, width, height, 'F'); // Background

    drawSectionTitle(doc, 'Nossos Valores', 'Pilares que sustentam nossa operação.', 20, 30, false);

    const startY = 60;
    const cardW = 75;
    const cardH = 90;
    const gap = 15;
    let x = (width - ((cardW * 3) + (gap * 2))) / 2; // Center row

    const drawValueCard = (title: string, desc: string, iconChar: string, accent: string) => {
        // Shadow/Border (Simulated)
        doc.setFillColor(COLORS.WHITE);
        doc.roundedRect(x, startY, cardW, cardH, 3, 3, 'F');
        doc.setDrawColor(COLORS.BORDER_LIGHT);
        doc.roundedRect(x, startY, cardW, cardH, 3, 3, 'S');

        // Top Accent Bar
        doc.setFillColor(accent);
        doc.rect(x, startY, cardW, 2, 'F');

        // Icon Circle
        drawIcon(doc, x + cardW / 2, startY + 25, accent, iconChar);

        // Text
        doc.setTextColor(COLORS.TEXT_DARK);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, x + cardW / 2, startY + 50, { align: 'center' });

        doc.setTextColor(COLORS.TEXT_MUTED);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(doc.splitTextToSize(desc, cardW - 10), x + cardW / 2, startY + 65, { align: 'center' });

        x += cardW + gap;
    };

    drawValueCard('Ética', 'Agimos com integridade e transparência em todas as negociações.', 'E', COLORS.PRIMARY);
    drawValueCard('Inovação', 'Buscamos constantemente novas tecnologias e processos.', 'I', COLORS.SECONDARY);
    drawValueCard('Pessoas', 'Valorizamos e desenvolvemos nossos talentos humanos.', 'P', COLORS.BG_DARK);
};

// 3. SERVIÇOS (Grid Layout - Matches Website)
export const renderServicos = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.WHITE);
    doc.rect(0, 0, width, height, 'F');

    drawSectionTitle(doc, 'Principais Serviços', 'Soluções completas para sua empresa.', 20, 30, false);

    const startY = 55;
    const cardW = 80;
    const cardH = 35;
    const gapX = 15;
    const gapY = 15;

    // Grid 2x3 (3 Columns, 2 Rows)
    const startX = (width - ((cardW * 3) + (gapX * 2))) / 2;

    const servicesList = [
        { title: 'Limpeza', desc: 'Técnica, hospitalar e comercial.', icon: 'L' },
        { title: 'Portaria', desc: 'Controle de acesso qualificado.', icon: 'P' },
        { title: 'Recepção', desc: 'Atendimento de excelência.', icon: 'R' },
        { title: 'Manutenção', desc: 'Elétrica e hidráulica preventiva.', icon: 'M' },
        { title: 'Jardinagem', desc: 'Paisagismo e conservação verde.', icon: 'J' },
        { title: 'Facilities', desc: 'Gestão integrada completa.', icon: 'F' }
    ];

    let cx = startX;
    let cy = startY;

    servicesList.forEach((item, i) => {
        // Card Body
        doc.setFillColor(COLORS.BG_LIGHT);
        doc.roundedRect(cx, cy, cardW, cardH, 2, 2, 'F');
        doc.setDrawColor(COLORS.BORDER_LIGHT);
        doc.roundedRect(cx, cy, cardW, cardH, 2, 2, 'S');

        // Icon Box (Left)
        doc.setFillColor(COLORS.WHITE);
        doc.roundedRect(cx + 4, cy + 4, 12, 12, 2, 2, 'F');
        doc.setTextColor(COLORS.PRIMARY);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(item.icon, cx + 10, cy + 11.5, { align: 'center' });

        // Text
        doc.setTextColor(COLORS.TEXT_DARK);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(item.title, cx + 22, cy + 10);

        doc.setTextColor(COLORS.TEXT_MUTED);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(item.desc, cx + 22, cy + 16);

        // Move Grid
        cx += cardW + gapX;
        if ((i + 1) % 3 === 0) {
            cx = startX;
            cy += cardH + gapY;
        }
    });

    // Disclaimer
    doc.setTextColor(COLORS.TEXT_MUTED);
    doc.setFontSize(8);
    doc.text('* Consulte nosso catálogo completo para mais detalhes técnicos.', width / 2, height - 10, { align: 'center' });
};

// 4. SETORES (Horizontal "Pills" Layout)
export const renderSetores = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.BG_DARK);
    doc.rect(0, 0, width, height, 'F');

    drawSectionTitle(doc, 'Setores Atendidos', 'Expertise adaptada ao seu negócio.', 20, 30, true);

    const sectors = ['Condomínios', 'Escolas', 'Hospitais', 'Indústrias', 'Shoppings', 'Varejo'];

    // Central Flow Line
    const lineY = height / 2;
    doc.setDrawColor(COLORS.PRIMARY);
    doc.setLineWidth(0.5);
    doc.line(20, lineY, width - 20, lineY);

    const gap = (width - 40) / sectors.length;
    let x = 40; // Start offset

    sectors.forEach((sector) => {
        // Circle Node
        doc.setFillColor(COLORS.BG_CARD);
        doc.setDrawColor(COLORS.PRIMARY);
        doc.setLineWidth(1);
        doc.circle(x, lineY, 12, 'FD');

        // Inner Dot
        doc.setFillColor(COLORS.PRIMARY);
        doc.circle(x, lineY, 3, 'F');

        // Label
        doc.setTextColor(COLORS.WHITE);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(sector, x, lineY + 25, { align: 'center' });

        x += gap;
    });
};

// 5. DIFERENCIAIS (Timeline Vertical Clean)
export const renderDiferenciais = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.WHITE);
    doc.rect(0, 0, width, height, 'F');

    drawSectionTitle(doc, 'Diferenciais', 'Por que somos a melhor escolha.', 20, 30, false);

    const items = [
        { title: 'Abordagem Estratégica', desc: 'Análise detalhada das necessidades para maximizar eficiência.' },
        { title: 'Equipe Experiente', desc: 'Supervisores com anos de mercado garantem a execução perfeita.' },
        { title: 'Tecnologia Aplicada', desc: 'Sistemas inteligentes de gestão e monitoramento em tempo real.' }
    ];

    let y = 60;
    const x = 50;

    items.forEach((item, i) => {
        // Number Badge
        doc.setFillColor(COLORS.PRIMARY);
        doc.circle(x, y, 10, 'F');
        doc.setTextColor(COLORS.WHITE);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text((i + 1).toString(), x, y + 3, { align: 'center' });

        // Content
        doc.setTextColor(COLORS.TEXT_DARK);
        doc.setFontSize(14);
        doc.text(item.title, x + 20, y - 2);

        doc.setTextColor(COLORS.TEXT_MUTED);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(item.desc, x + 20, y + 5);

        // Vertical Connector
        if (i < items.length - 1) {
            doc.setDrawColor(COLORS.BORDER_LIGHT);
            doc.setLineWidth(2);
            doc.line(x, y + 15, x, y + 35);
        }

        y += 40;
    });
};

// 6. RESPONSABILIDADES ("Cards" Split)
export const renderResponsabilidades = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.BG_LIGHT);
    doc.rect(0, 0, width, height, 'F');

    drawSectionTitle(doc, 'Nossas Responsabilidades', 'Tranquilidade total para o cliente.', 20, 30, false);

    const items = [
        { label: 'Fiscal & Trabalhista', desc: 'Recolhimento integral de impostos e encargos.' },
        { label: 'Social & Humano', desc: 'Benefícios, treinamentos e apoio ao colaborador.' },
        { label: 'Ambiental', desc: 'Descarte correto e produtos certificados.' }
    ];

    let x = 20;
    const y = 60;
    const w = (width - 60) / 3;
    const h = 50;

    items.forEach((item, i) => {
        const bg = i === 1 ? COLORS.PRIMARY : COLORS.WHITE;
        const txt = i === 1 ? COLORS.WHITE : COLORS.TEXT_DARK;
        const muted = i === 1 ? '#ECFDF5' : COLORS.TEXT_MUTED; // Light Green for center card text

        doc.setFillColor(bg);
        doc.roundedRect(x, y, w, h, 3, 3, 'F');
        if (i !== 1) {
            doc.setDrawColor(COLORS.BORDER_LIGHT);
            doc.roundedRect(x, y, w, h, 3, 3, 'S');
        } else {
            // Shadow for center card
            doc.setFillColor('rgba(16, 185, 129, 0.2)');
            doc.rect(x + 2, y + 2, w, h, 'F');
            doc.setFillColor(bg);
            doc.roundedRect(x, y, w, h, 3, 3, 'F');
        }

        doc.setTextColor(txt);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(item.label, x + w / 2, y + 20, { align: 'center' });

        doc.setTextColor(muted);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(doc.splitTextToSize(item.desc, w - 10), x + w / 2, y + 35, { align: 'center' });

        x += w + 10;
    });
};

// 7. FERRAMENTAS (Technical/Techy Look)
export const renderFerramentas = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.BG_DARK);
    doc.rect(0, 0, width, height, 'F');

    drawSectionTitle(doc, 'Ferramentas de Gestão', 'Tecnologia a favor da operação.', 20, 30, true);

    const tools = [
        { name: 'BITRIX24', type: 'CRM & Projetos' },
        { name: 'SECULLUM', type: 'Ponto Digital' },
        { name: 'ONVIO', type: 'Gestão de Documentos' },
        { name: 'CHECK-LIST FÁCIL', type: 'Auditoria Digital' }
    ];

    // Grid 2x2
    const centerX = width / 2;
    const centerY = (height / 2) + 10;
    const boxW = 100;
    const boxH = 25;
    const gap = 10;

    // Top Left
    drawCard(doc, centerX - boxW - gap, centerY - boxH - gap, boxW, boxH, COLORS.BG_CARD, COLORS.PRIMARY);
    doc.setTextColor(COLORS.WHITE);
    doc.setFontSize(12);
    doc.text(tools[0].name, centerX - boxW - gap + 10, centerY - boxH - gap + 15);
    doc.setFontSize(9);
    doc.setTextColor(COLORS.TEXT_GRAY);
    doc.text(tools[0].type, centerX - gap - 10, centerY - boxH - gap + 15, { align: 'right' });

    // Top Right
    drawCard(doc, centerX + gap, centerY - boxH - gap, boxW, boxH, COLORS.BG_CARD, COLORS.SECONDARY);
    doc.setTextColor(COLORS.WHITE);
    doc.setFontSize(12);
    doc.text(tools[1].name, centerX + gap + 10, centerY - boxH - gap + 15);
    doc.setFontSize(9);
    doc.setTextColor(COLORS.TEXT_GRAY);
    doc.text(tools[1].type, centerX + gap + boxW - 10, centerY - boxH - gap + 15, { align: 'right' });

    // Bottom Left
    drawCard(doc, centerX - boxW - gap, centerY + gap, boxW, boxH, COLORS.BG_CARD, COLORS.WHITE);
    doc.setTextColor(COLORS.WHITE);
    doc.setFontSize(12);
    doc.text(tools[2].name, centerX - boxW - gap + 10, centerY + gap + 15);
    doc.setFontSize(9);
    doc.setTextColor(COLORS.TEXT_GRAY);
    doc.text(tools[2].type, centerX - gap - 10, centerY + gap + 15, { align: 'right' });

    // Bottom Right
    drawCard(doc, centerX + gap, centerY + gap, boxW, boxH, COLORS.BG_CARD, COLORS.WHITE);
    doc.setTextColor(COLORS.WHITE);
    doc.setFontSize(12);
    doc.text(tools[3].name, centerX + gap + 10, centerY + gap + 15);
    doc.setFontSize(9);
    doc.setTextColor(COLORS.TEXT_GRAY);
    doc.text(tools[3].type, centerX + gap + boxW - 10, centerY + gap + 15, { align: 'right' });
};

