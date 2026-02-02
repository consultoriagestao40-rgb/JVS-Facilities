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

// 1. QUEM SOMOS (Fixed Content - Facilities Focus)
export const renderQuemSomos = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();

    // Background (Slate 900)
    doc.setFillColor(COLORS.BG_DARK);
    doc.rect(0, 0, width, height, 'F');

    // Decoration (Subtle Curve)
    doc.setFillColor(COLORS.BG_CARD);
    doc.circle(width, 0, 140, 'F');

    // HEADER
    const margin = 20;
    drawSectionTitle(doc, 'Quem Somos', 'Excelência em Facilities e Gestão.', margin, 30, true);

    // MAIN TEXT - Left Side
    const textY = 60;
    doc.setTextColor(COLORS.TEXT_LIGHT); // Brighter text for contrast
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Using generic Facilities text requested by user
    const paragraphs = [
        'Somos especialistas em Facilities, focados em entregar qualidade superior,',
        'otimização de custos e tranquilidade operacional para seu negócio.',
        '',
        '• Mais de 30 anos de experiência em gestão de pessoas;',
        '• Foco total na eficiência operacional e redução de custos;',
        '• Cultura voltada para o desenvolvimento humano e bem-estar;',
        '• Gestão personalizada rigorosa de acordo com cada contrato.'
    ];
    doc.text(paragraphs, margin, textY);

    // Right Side: Clean Visuals (Removed specific "Cleaning" stats)
    const cardW = 90;
    const cardH = 40;
    const cardX = width - cardW - margin;

    // Card 1
    let cy = 70;
    drawCard(doc, cardX, cy, cardW, cardH, COLORS.BG_CARD, COLORS.PRIMARY);
    doc.setTextColor(COLORS.PRIMARY);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('30 Anos', cardX + 10, cy + 15);
    doc.setTextColor(COLORS.WHITE);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('de experiência no mercado.', cardX + 10, cy + 28);

    // Card 2
    cy += 50;
    drawCard(doc, cardX, cy, cardW, cardH, COLORS.BG_CARD, COLORS.SECONDARY);
    doc.setTextColor(COLORS.SECONDARY);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Gestão Total', cardX + 10, cy + 15);
    doc.setTextColor(COLORS.WHITE);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Foco em eficiência e resultados.', cardX + 10, cy + 28);
};

// 2. VALORES (Restored Full Text - Clean Layout)
export const renderValores = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.WHITE); // White Background for readability
    doc.rect(0, 0, width, height, 'F');

    // Header
    drawSectionTitle(doc, 'Nossos Valores', 'Pilares que sustentam nossa operação.', 20, 30, false);

    // Full Text Block (From User Screenshot)
    doc.setTextColor(COLORS.TEXT_DARK);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const fullText =
        "Nosso compromisso é guiado por princípios sólidos: agimos com ética, mantendo a integridade acima de benefícios momentâneos. " +
        "Buscamos agilidade, eficiência e excelência através do aprimoramento contínuo de processos e sistemas. " +
        "Valorizamos nossas pessoas, promovendo um ambiente humanizado e soluções que garantem a satisfação e a permanência dos colaboradores. " +
        "Somos comprometidos com a entrega dos nossos acordos, mesmo diante de desafios. " +
        "Além disso, investimos em inovação e tecnologia para otimizar a automação, produtividade e eficiência.";

    const splitText = doc.splitTextToSize(fullText, width - 40);
    doc.text(splitText, 20, 50);

    // Visual Pillars (Below Text - Smaller)
    const startY = 110;
    const cardW = 60;
    const cardH = 50;
    const gap = 15;
    let x = (width - ((cardW * 3) + (gap * 2))) / 2;

    const drawValueCard = (title: string, iconChar: string, accent: string) => {
        // Card
        drawCard(doc, x, startY, cardW, cardH, COLORS.BG_LIGHT, COLORS.BORDER_LIGHT);

        // Icon
        drawIcon(doc, x + cardW / 2, startY + 20, accent, iconChar);

        // Title
        doc.setTextColor(COLORS.TEXT_DARK);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, x + cardW / 2, startY + 40, { align: 'center' });

        x += cardW + gap;
    };

    drawValueCard('Ética', 'E', COLORS.PRIMARY);
    drawValueCard('Eficiência', 'E', COLORS.SECONDARY);
    drawValueCard('Pessoas', 'P', COLORS.BG_DARK);
};

// 3. SERVIÇOS (Improved Spacing)
export const renderServicos = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.BG_LIGHT);
    doc.rect(0, 0, width, height, 'F');

    drawSectionTitle(doc, 'Principais Serviços', 'Soluções completas para sua empresa.', 20, 30, false);

    const startY = 50;
    const cardW = 85;
    const cardH = 40; // Taller cards to prevent text cut-off
    const gapX = 10;
    const gapY = 15;

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
        doc.setFillColor(COLORS.WHITE);
        doc.roundedRect(cx, cy, cardW, cardH, 3, 3, 'F');
        doc.setDrawColor(COLORS.BORDER_LIGHT);
        doc.roundedRect(cx, cy, cardW, cardH, 3, 3, 'S');

        // Icon Box (Left)
        doc.setFillColor(COLORS.BG_LIGHT);
        doc.roundedRect(cx + 5, cy + 8, 14, 14, 3, 3, 'F');
        doc.setTextColor(COLORS.PRIMARY);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(item.icon, cx + 12, cy + 17, { align: 'center' });

        // Text
        doc.setTextColor(COLORS.TEXT_DARK);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(item.title, cx + 25, cy + 15);

        doc.setTextColor(COLORS.TEXT_MUTED);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(item.desc, cx + 25, cy + 22);

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

// 4. SETORES (Clean Grid - No more "Timeline")
export const renderSetores = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.BG_DARK);
    doc.rect(0, 0, width, height, 'F');
    // Force Deploy Checkpoint: Final Release V2

    drawSectionTitle(doc, 'Setores Atendidos', 'Expertise adaptada ao seu negócio.', 20, 30, true);

    const sectors = [
        { name: 'Condomínios', icon: 'C' },
        { name: 'Escolas', icon: 'E' },
        { name: 'Hospitais', icon: 'H' },
        { name: 'Indústrias', icon: 'I' },
        { name: 'Shoppings', icon: 'S' },
        { name: 'Varejo', icon: 'V' }
    ];

    // Grid 3x2 (3 Columns, 2 Rows) for maximum impact
    const cardW = 80;
    const cardH = 50; // Large comfortable touch targets
    const gapX = 15;
    const gapY = 15;

    // Calculate centered start position
    const totalW = (cardW * 3) + (gapX * 2);
    const startX = (width - totalW) / 2;
    const startY = 60;

    let cx = startX;
    let cy = startY;

    sectors.forEach((sector, i) => {
        // Card Background (Dark Card on Darker BG)
        doc.setFillColor(COLORS.BG_CARD);
        doc.roundedRect(cx, cy, cardW, cardH, 3, 3, 'F');
        doc.setDrawColor(COLORS.PRIMARY);
        doc.setLineWidth(0.5);
        doc.roundedRect(cx, cy, cardW, cardH, 3, 3, 'S');

        // Large Icon Circle
        doc.setFillColor(COLORS.PRIMARY);
        doc.circle(cx + cardW / 2, cy + 20, 10, 'F');
        doc.setTextColor(COLORS.WHITE);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(sector.icon, cx + cardW / 2, cy + 22, { align: 'center' });

        // Label
        doc.setTextColor(COLORS.WHITE);
        doc.setFontSize(14);
        doc.text(sector.name, cx + cardW / 2, cy + 40, { align: 'center' });

        // Grid Logic
        cx += cardW + gapX;
        if ((i + 1) % 3 === 0) {
            cx = startX;
            cy += cardH + gapY;
        }
    });
};

// 5. DIFERENCIAIS (Clean Vertical List - No "Timeline" lines)
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
    const x = 30; // Left aligned for better reading

    items.forEach((item, i) => {
        // Number Badge (Large and Clear)
        doc.setFillColor(COLORS.PRIMARY);
        doc.circle(x, y + 5, 12, 'F');
        doc.setTextColor(COLORS.WHITE);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text((i + 1).toString(), x, y + 9, { align: 'center' });

        // Content
        doc.setTextColor(COLORS.TEXT_DARK);
        doc.setFontSize(16); // Larger Title
        doc.text(item.title, x + 25, y + 5);

        doc.setTextColor(COLORS.TEXT_MUTED);
        doc.setFontSize(12); // Larger Body
        doc.setFont('helvetica', 'normal');
        doc.text(item.desc, x + 25, y + 15);

        y += 45; // More spacing
    });
};

// 6. RESPONSABILIDADES (Clean 3-Column Layout)
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
    const w = (width - 50) / 3;
    const h = 80; // Taller for vertical centering

    items.forEach((item, i) => {
        const bg = COLORS.WHITE;
        const txt = COLORS.TEXT_DARK;
        const border = COLORS.PRIMARY;

        // Card
        doc.setFillColor(bg);
        doc.roundedRect(x, y, w, h, 3, 3, 'F');
        // Top Border Accent
        doc.setFillColor(border);
        doc.rect(x, y, w, 4, 'F'); // Top Bar

        // Title
        doc.setTextColor(txt);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(item.label, x + w / 2, y + 30, { align: 'center' });

        // Desc
        doc.setTextColor(COLORS.TEXT_MUTED);
        doc.setFontSize(11); // Readable size
        doc.setFont('helvetica', 'normal');
        doc.text(doc.splitTextToSize(item.desc, w - 10), x + w / 2, y + 50, { align: 'center' });

        x += w + 10;
    });
};

// 7. FERRAMENTAS (Clean 2-Column List)
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

    // Simple Vertical List with Cards
    let y = 60;
    const cardH = 25;
    const cardW = 120;
    const centerX = width / 2;

    tools.forEach((tool) => {
        // Card Container
        doc.setFillColor(COLORS.BG_CARD);
        doc.roundedRect(centerX - (cardW / 2), y, cardW, cardH, 3, 3, 'F');

        // Name (Left)
        doc.setTextColor(COLORS.WHITE);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(tool.name, centerX - (cardW / 2) + 10, y + 16);

        // Type (Right)
        doc.setTextColor(COLORS.PRIMARY);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(tool.type, centerX + (cardW / 2) - 10, y + 16, { align: 'right' });

        y += cardH + 10;
    });
};
