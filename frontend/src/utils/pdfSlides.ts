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
    // Force Deploy Checkpoint: Final Release V36 (History and Indicators)

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
        '• Mais de 15 anos de experiência em gestão de pessoas;',
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

// --- VECTOR ICONS ---
// --- VECTOR ICONS (PREMIUM) ---
// --- VECTOR ICONS (PREMIUM - WEBSITE MATCH) ---
const drawVectorIcon = (doc: jsPDF, x: number, y: number, type: string, color: string) => {
    doc.setFillColor(color);
    doc.setDrawColor(color);
    doc.setLineWidth(0.7);

    switch (type) {
        // --- SERVICES (UPGRADED TO PREMIUM) ---
        case 'Sparkle': // Limpeza (Shinier Sparkles)
            doc.setFillColor(color);
            // Main star
            doc.path([
                { op: 'm', c: [x, y - 9] }, // Top
                { op: 'c', c: [x + 1, y - 1, x + 9, y, x + 9, y] }, // Right
                { op: 'c', c: [x + 1, y + 1, x, y + 9, x, y + 9] }, // Bottom
                { op: 'c', c: [x - 1, y + 1, x - 9, y, x - 9, y] }, // Left
                { op: 'c', c: [x - 1, y - 1, x, y - 9, x, y - 9] } // Back to Top
            ], 'F');
            // Small star top-right
            doc.circle(x + 6, y - 6, 2, 'F');
            // Small star bottom-left
            doc.circle(x - 5, y + 5, 1.5, 'F');
            break;

        case 'Shield': // Portaria/Segurança (Primitives)
            doc.setFillColor(color);
            // Top block
            doc.rect(x - 7, y - 7, 14, 7, 'F');
            // Bottom point (Triangle)
            doc.triangle(x - 7, y, x + 7, y, x, y + 9, 'F');

            // Star Badge center
            doc.setFillColor(COLORS.WHITE);
            doc.circle(x, y, 2.5, 'F');
            break;

        case 'Leaf': // Jardinagem (Primitives)
            doc.setFillColor(color);

            // Stem
            doc.setDrawColor(color);
            doc.setLineWidth(2);
            doc.line(x, y + 6, x, y - 2);

            // Leaf (Diamond Shape composed of two triangles)
            // Left Triangle
            doc.triangle(x, y - 10, x - 6, y - 4, x, y + 2, 'F');
            // Right Triangle
            doc.triangle(x, y - 10, x + 6, y - 4, x, y + 2, 'F');
            break;
        case 'Wrench': // Manutenção (Crossed Tools)
            doc.setFillColor(color);
            doc.setDrawColor(color);
            doc.setLineWidth(2);
            // Wrench (Diagonal \ )
            doc.saveGraphicsState();
            doc.line(x - 5, y - 5, x + 5, y + 5); // Handle
            doc.circle(x - 6, y - 6, 3, 'F'); // Head
            doc.restoreGraphicsState();

            // Screwdriver (Diagonal / ) - Simplified appearance
            doc.setLineWidth(2.5);
            doc.line(x + 5, y - 5, x - 5, y + 5);
            doc.rect(x + 4, y - 6, 2, 2, 'F'); // Handle Tip
            break;

        case 'Leaf': // Jardinagem (Sprout)
            doc.setFillColor(color);
            // Stem
            // Stem
            doc.setDrawColor(color);
            doc.setLineWidth(2);
            // Replaced curve with path (cubic bezier)
            doc.path([
                { op: 'm', c: [x, y + 8] },
                { op: 'c', c: [x - 2, y + 2, x - 2, y, x, y - 2] },
                { op: 's', c: [x, y - 2, x, y - 2] }
            ], 'S');
            // Leaf Left
            doc.path([
                { op: 'm', c: [x, y - 2] },
                { op: 'c', c: [x - 6, y - 4, x - 8, y - 8, x - 10, y - 2] }, // Top curve
                { op: 'c', c: [x - 10, y - 2, x - 6, y + 2, x, y - 2] } // Bottom curve
            ], 'F');
            // Leaf Right (Higher)
            doc.path([
                { op: 'm', c: [x, y - 4] },
                { op: 'c', c: [x + 6, y - 6, x + 8, y - 10, x + 10, y - 4] },
                { op: 'c', c: [x + 10, y - 4, x + 6, y, x, y - 4] }
            ], 'F');
            break;

        case 'Office': // Facilities (Modern Building)
            doc.setFillColor(color);
            doc.rect(x - 5, y - 10, 10, 20, 'F'); // Main Tower
            doc.triangle(x - 5, y - 10, x + 5, y - 10, x, y - 14, 'F'); // Spire
            // Glass Reflection Lines (White)
            doc.setDrawColor(COLORS.WHITE);
            doc.setLineWidth(0.5);
            doc.line(x - 3, y - 6, x + 3, y - 2);
            doc.line(x - 3, y, x + 3, y + 4);
            doc.line(x - 3, y + 6, x + 3, y + 10);
            break;

        // --- NEW PREMIUM SECTOR ICONS (MATCHING WEBSITE) ---

        case 'Bag': // Shoppings (Shopping Bag)
            doc.setFillColor(color);
            // Handle
            doc.setDrawColor(color);
            doc.setLineWidth(1.5);
            doc.path([
                { op: 'm', c: [x - 4, y - 6] },
                { op: 'c', c: [x - 4, y - 10, x + 4, y - 10, x + 4, y - 6] },
                { op: 's', c: [x + 4, y - 6, x + 4, y - 6] }
            ], 'S');
            // Bag Body
            doc.path([
                { op: 'm', c: [x - 7, y - 6] },
                { op: 'l', c: [x + 7, y - 6] },
                { op: 'l', c: [x + 8, y + 8] }, // slight taper
                { op: 'l', c: [x - 8, y + 8] },
                { op: 'l', c: [x - 7, y - 6] }
            ], 'F');
            // Lock/Detail
            doc.setFillColor(COLORS.WHITE);
            doc.circle(x, y - 1, 1.5, 'F');
            break;

        case 'Cart': // Supermercados/Varejo (Shopping Cart)
            doc.setFillColor(color);
            doc.setDrawColor(color);
            doc.setLineWidth(1.5);
            doc.line(x - 9, y - 5, x - 7, y - 5); // Handle start
            doc.line(x - 7, y - 5, x - 5, y + 3); // Back
            doc.line(x - 5, y + 3, x + 6, y + 3); // Bottom
            doc.line(x + 6, y + 3, x + 8, y - 5); // Front
            doc.line(x - 7, y - 5, x + 8, y - 5); // Top
            // Wheels
            doc.circle(x - 4, y + 6, 1.5, 'F');
            doc.circle(x + 5, y + 6, 1.5, 'F');
            break;

        case 'Hospital': // Hospitais (Building with Cross)
            doc.setFillColor(color);
            doc.rect(x - 9, y - 8, 18, 16, 'F'); // Main block
            doc.triangle(x - 10, y - 8, x + 10, y - 8, x, y - 13, 'F'); // Roof
            // Cross (White)
            doc.setFillColor(COLORS.WHITE);
            doc.rect(x - 2.5, y - 4, 5, 1.5, 'F'); // Horz
            doc.rect(x - 0.75, y - 5.75, 1.5, 5, 'F'); // Vert
            // Windows
            doc.rect(x - 6, y + 2, 2, 2, 'F');
            doc.rect(x - 2, y + 2, 4, 3, 'F'); // Door
            doc.rect(x + 4, y + 2, 2, 2, 'F');
            break;

        case 'Gears': // Indústria (3 Gears Cluster)
            doc.setFillColor(color);
            // Main Gear
            doc.circle(x - 4, y, 5, 'F');
            doc.setDrawColor(COLORS.WHITE);
            doc.setLineWidth(1.5);
            doc.circle(x - 4, y, 2, 'S'); // Hole
            // Small Gear Top Right
            doc.setFillColor(color);
            doc.circle(x + 4, y - 5, 3.5, 'F');
            doc.setDrawColor(COLORS.WHITE);
            doc.circle(x + 4, y - 5, 1.5, 'S');
            // Small Gear Bottom Right
            doc.setFillColor(color);
            doc.circle(x + 4, y + 4, 3.5, 'F');
            doc.setDrawColor(COLORS.WHITE);
            doc.circle(x + 4, y + 4, 1.5, 'S');
            break;

        case 'Home': // Condomínios (Residential Tower)
            doc.setFillColor(color);
            doc.rect(x - 6, y - 10, 12, 18, 'F'); // Tall Building
            // Windows Grid
            doc.setFillColor(COLORS.WHITE);
            doc.rect(x - 3, y - 7, 2, 2, 'F');
            doc.rect(x + 1, y - 7, 2, 2, 'F');
            doc.rect(x - 3, y - 3, 2, 2, 'F');
            doc.rect(x + 1, y - 3, 2, 2, 'F');
            doc.rect(x - 3, y + 1, 2, 2, 'F');
            doc.rect(x + 1, y + 1, 2, 2, 'F');
            break;

        case 'Graduation': // Escolas (Cap)
            doc.setFillColor(color);
            doc.path([
                { op: 'm', c: [x - 9, y - 2] },
                { op: 'l', c: [x, y - 6] },
                { op: 'l', c: [x + 9, y - 2] },
                { op: 'l', c: [x, y + 2] },
                { op: 'l', c: [x - 9, y - 2] }
            ], 'F');
            doc.rect(x - 9, y - 2, 20, 1, 'F'); // Line fix
            doc.setDrawColor(color);
            doc.line(x + 9, y - 2, x + 9, y + 5); // Tassel line
            doc.circle(x + 9, y + 5, 1, 'F');
            break;

        case 'Check': // Keep legacy check just in case
            doc.circle(x, y, 12, 'F');
            doc.setDrawColor(COLORS.WHITE);
            doc.setLineWidth(2);
            doc.lines([[5, 5], [-10, -5]], x - 2, y - 1, [1, 1], 'S', true);
            break;

        default:
            doc.circle(x, y, 5, 'F');
            doc.setDrawColor(COLORS.WHITE);
            doc.text(type.charAt(0), x, y + 2, { align: 'center' });
    }
};

// 2. VALORES (Restored Full Text - Clean Layout)
export const renderValores = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.WHITE); // White Background for readability
    doc.rect(0, 0, width, height, 'F');

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

    const drawValueCard = (title: string, iconType: string, accent: string) => {
        drawCard(doc, x, startY, cardW, cardH, COLORS.BG_LIGHT, COLORS.BORDER_LIGHT);

        // Use Vector Icon
        drawVectorIcon(doc, x + cardW / 2, startY + 20, iconType, accent);

        doc.setTextColor(COLORS.TEXT_DARK);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, x + cardW / 2, startY + 40, { align: 'center' });

        x += cardW + gap;
    };

    // Updated icons for Values too
    drawValueCard('Ética', 'Check', COLORS.PRIMARY);
    drawValueCard('Eficiência', 'Sparkle', COLORS.SECONDARY);
    drawValueCard('Pessoas', 'Headset', COLORS.BG_DARK);
};

// 3. SERVIÇOS (Improved Spacing)
export const renderServicos = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.BG_LIGHT);
    doc.rect(0, 0, width, height, 'F');

    drawSectionTitle(doc, 'Principais Serviços', 'Soluções completas para sua empresa.', 20, 30, false);

    const startY = 50;
    const cardW = 85;
    const cardH = 40;
    const gapX = 10;
    const gapY = 15;

    const startX = (width - ((cardW * 3) + (gapX * 2))) / 2;

    const servicesList = [
        { title: 'Limpeza', desc: 'Técnica, hospitalar e comercial.', icon: 'Sparkle' },
        { title: 'Portaria', desc: 'Controle de acesso qualificado.', icon: 'Shield' },
        { title: 'Recepção', desc: 'Atendimento de excelência.', icon: 'Headset' },
        { title: 'Manutenção', desc: 'Elétrica e hidráulica.', icon: 'Wrench' },
        { title: 'Jardinagem', desc: 'Paisagismo e conservação.', icon: 'Leaf' },
        { title: 'Facilities', desc: 'Gestão integrada completa.', icon: 'Office' }
    ];

    let cx = startX;
    let cy = startY;

    servicesList.forEach((item, i) => {
        // Card Shadow (Light Gray offset)
        doc.setFillColor('#E5E7EB'); // Light Gray
        doc.roundedRect(cx + 1, cy + 1, cardW, cardH, 2, 2, 'F');

        // Card Body (White)
        doc.setFillColor(COLORS.WHITE);
        doc.roundedRect(cx, cy, cardW, cardH, 2, 2, 'F');

        // Border (Consistent Thin Line)
        doc.setDrawColor(COLORS.BORDER_LIGHT);
        doc.setLineWidth(0.5);
        doc.roundedRect(cx, cy, cardW, cardH, 2, 2, 'S');

        // Draw Icon Background
        doc.setFillColor(COLORS.BG_LIGHT);
        doc.circle(cx + 12, cy + 17.5, 9, 'F');

        // Draw Vector Icon
        drawVectorIcon(doc, cx + 12, cy + 17.5, item.icon, COLORS.PRIMARY);

        // Title
        doc.setTextColor(COLORS.TEXT_DARK);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(item.title, cx + 26, cy + 13);

        // Description
        doc.setTextColor(COLORS.TEXT_MUTED);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(item.desc, cx + 26, cy + 20);

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

// 4. SETORES (Grid with Icons)
export const renderSetores = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(COLORS.BG_DARK);
    doc.rect(0, 0, width, height, 'F');

    drawSectionTitle(doc, 'Setores Atendidos', 'Expertise adaptada ao seu negócio.', 20, 30, true);

    const sectors = [
        { name: 'Condomínios', icon: 'Home' },
        { name: 'Escolas', icon: 'Graduation' },
        { name: 'Hospitais', icon: 'Hospital' },
        { name: 'Indústrias', icon: 'Gears' },
        { name: 'Shoppings', icon: 'Bag' },
        { name: 'Varejo', icon: 'Cart' }
    ];

    // Grid 3x2
    const cardW = 80;
    const cardH = 50;
    const gapX = 15;
    const gapY = 15;

    const totalW = (cardW * 3) + (gapX * 2);
    const startX = (width - totalW) / 2;
    const startY = 60;

    let cx = startX;
    let cy = startY;

    sectors.forEach((sector, i) => {
        doc.setFillColor(COLORS.BG_CARD);
        doc.roundedRect(cx, cy, cardW, cardH, 3, 3, 'F');
        doc.setDrawColor(COLORS.PRIMARY);
        doc.setLineWidth(0.5);
        doc.roundedRect(cx, cy, cardW, cardH, 3, 3, 'S');

        // Central Icon Container
        doc.setFillColor(COLORS.BG_DARK); // Darker circle background for contrast
        doc.circle(cx + cardW / 2, cy + 20, 14, 'F');

        // Vector Icon
        drawVectorIcon(doc, cx + cardW / 2, cy + 20, sector.icon, COLORS.PRIMARY);

        doc.setTextColor(COLORS.WHITE);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold'); // Bold text
        doc.text(sector.name, cx + cardW / 2, cy + 42, { align: 'center' });

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

// 8. OBRIGADO (Final Slide)
export const renderObrigado = (doc: jsPDF, width: number, height: number, logoData: string | null) => {
    doc.addPage();
    doc.setFillColor(COLORS.BG_DARK);
    doc.rect(0, 0, width, height, 'F');

    // Centered Content Container
    const centerX = width / 2;
    const centerY = height / 2;

    // Logo (Centered)
    if (logoData) {
        // 200px equivalent width ~ 50mm
        doc.addImage(logoData, 'PNG', centerX - 25, centerY - 50, 50, 15);
    } else {
        doc.setTextColor(COLORS.WHITE);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('JVS Facilities', centerX, centerY - 40, { align: 'center' });
    }

    // "Obrigado"
    doc.setTextColor(COLORS.PRIMARY);
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.text('Obrigado!', centerX, centerY - 10, { align: 'center' });

    // Subtext
    doc.setTextColor(COLORS.TEXT_GRAY);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Estamos prontos para atender sua empresa.', centerX, centerY + 5, { align: 'center' });

    // Contacts Box
    const boxY = centerY + 25;
    doc.setDrawColor(COLORS.BG_CARD);
    doc.setLineWidth(0.5);
    doc.line(centerX - 60, boxY, centerX + 60, boxY); // Divider

    doc.setTextColor(COLORS.WHITE);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Address
    doc.text('Av. Maringá, 1273 - Pinhais - PR', centerX, boxY + 10, { align: 'center' });

    // Phone / Email / Site
    doc.setTextColor(COLORS.TEXT_LIGHT);
    doc.text('(41) 3505-0020  |  comercial@grupojvsserv.com.br', centerX, boxY + 20, { align: 'center' });

    doc.setTextColor(COLORS.PRIMARY);
    doc.text('www.grupojvsserv.com.br', centerX, boxY + 30, { align: 'center' });
};
