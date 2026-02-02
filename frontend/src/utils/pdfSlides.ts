import jsPDF from 'jspdf';

const BLUE_DARK = '#2C3E50'; // Approximate Navy Blue
const BLUE_LIGHT = '#34495E';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F3F4F6';

// Helper to draw a circle with text
const drawCircleItem = (doc: jsPDF, x: number, y: number, r: number, title: string, iconChar: string) => {
    doc.setFillColor(BLUE_DARK);
    doc.circle(x, y, r, 'F');

    doc.setTextColor(WHITE);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(iconChar, x, y + 2, { align: 'center' }); // Simple "Icon"

    doc.setTextColor(BLUE_DARK);
    doc.setFontSize(10);
    doc.text(title, x, y + r + 8, { align: 'center' });
};

export const renderQuemSomos = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();

    // Split Layout: White Left, Blue Right
    const splitX = width * 0.45;

    // Blue Right Side
    doc.setFillColor(BLUE_DARK);
    doc.rect(splitX, 0, width - splitX, height, 'F');

    // Left Content
    doc.setTextColor(BLUE_DARK);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('QUEM SOMOS', 20, 30);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const text = [
        'Há mais de 30 anos no mercado de Facilities, somos especialistas em',
        'prestações de serviços de limpeza profissional e similares.',
        '',
        '• 30 anos de experiência em terceirização de funcionários;',
        '• Execução de tratamento de pisos em mais de 500.000m²;',
        '• Mais de 100.000m² de limpeza em altura efetuada;',
        '• Anos de cultura e desenvolvimento voltado as pessoas;',
        '• Dimensionamento personalizado para cliente de acordo com cada necessidade.'
    ];
    doc.text(text, 20, 50);

    // Right Content (Visual Placeholder)
    doc.setDrawColor(WHITE);
    doc.setLineWidth(1);
    doc.circle(splitX + (width - splitX) / 2, height / 2, 40, 'S'); // Abstract Graphic
    doc.text('Excelência em', splitX + (width - splitX) / 2, height / 2 - 5, { align: 'center' });
    doc.text('Facilities', splitX + (width - splitX) / 2, height / 2 + 5, { align: 'center' });
};

export const renderValores = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();

    // Header
    doc.setTextColor(BLUE_DARK);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('NOSSOS', 20, 30);
    doc.text('VALORES', 20, 42);

    // Text Content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const intro = doc.splitTextToSize(
        'Nosso compromisso é guiado por princípios sólidos: agimos com ética, mantendo a integridade acima de benefícios momentâneos. Buscamos agilidade, eficiência e excelência através do aprimoramento contínuo.',
        100
    );
    doc.text(intro, 20, 60);

    // Visual Circles (Right Side)
    const cx = width * 0.7;
    const cy = height / 2;

    drawCircleItem(doc, cx, cy - 40, 18, 'Ética', 'E');
    drawCircleItem(doc, cx - 40, cy + 20, 18, 'Inovação', 'I');
    drawCircleItem(doc, cx + 40, cy + 20, 18, 'Pessoas', 'P');
};

export const renderServicos = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();

    doc.setTextColor(BLUE_DARK);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('PRINCIPAIS', 20, 30);
    doc.text('SERVIÇOS PRESTADOS', 20, 42);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Gestão e execução de serviços essenciais como limpeza, manutenção e segurança.', 20, 55);

    // Grid of Services
    const startY = 80;
    const gap = 50;
    const startX = 40;

    drawCircleItem(doc, startX, startY, 15, 'Limpeza', 'L');
    drawCircleItem(doc, startX + gap, startY, 15, 'Portaria', 'P');
    drawCircleItem(doc, startX + gap * 2, startY, 15, 'Recepção', 'R');
    drawCircleItem(doc, startX + gap * 3, startY, 15, 'Manutenção', 'M');
    drawCircleItem(doc, startX + gap * 4, startY, 15, 'Jardinagem', 'J');
};

export const renderSetores = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(BLUE_DARK);
    doc.rect(0, 0, width, height, 'F');

    doc.setTextColor(WHITE);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('SETORES', 20, 30);
    doc.text('ATENDIDOS', 20, 42);

    // White Icons Row
    const y = 140;
    const gap = 50;
    const x = 40;

    const drawWhiteIcon = (tx: number, title: string) => {
        doc.setDrawColor(WHITE);
        doc.setLineWidth(1);
        doc.circle(tx, y, 18, 'S');
        doc.setFontSize(10);
        doc.text(title.split(' '), tx, y + 25, { align: 'center' });
    };

    drawWhiteIcon(x, 'Transporte');
    drawWhiteIcon(x + gap, 'Condomínios');
    drawWhiteIcon(x + gap * 2, 'Hospitais');
    drawWhiteIcon(x + gap * 3, 'Shoppings');
    drawWhiteIcon(x + gap * 4, 'Educação');
};

export const renderDiferenciais = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();

    doc.setTextColor(BLUE_DARK);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('NOSSOS DIFERENCIAIS', 20, 30);

    // Timelineish Flow
    const y = 70;
    doc.setFillColor(BLUE_DARK);
    doc.rect(20, y, width - 40, 15, 'F'); // Bar

    doc.setTextColor(WHITE);
    doc.setFontSize(12);
    doc.text('CONTATO COM CLIENTE', 40, y + 10);
    doc.text('PROCESSOS DE QUALIDADE', 120, y + 10);
    doc.text('CLIENTIVIDADE', 220, y + 10);

    // Details below
    doc.setTextColor(BLUE_DARK);
    doc.setFontSize(14);
    doc.text('01 Abordagem Estratégica', 20, y + 35);
    doc.text('02 Experiência', 110, y + 35);
    doc.text('03 Padronização', 200, y + 35);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize('Nossa equipe utiliza uma abordagem estratégica e personalizada.', 80), 20, y + 45);
    doc.text(doc.splitTextToSize('Gestores experientes da área de Facilities.', 80), 110, y + 45);
    doc.text(doc.splitTextToSize('Padronização de processos e indicadores e tecnologias.', 80), 200, y + 45);
};

export const renderResponsabilidades = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();
    doc.setFillColor(BLUE_DARK);
    doc.rect(0, 0, width, height, 'F');

    doc.setTextColor(WHITE);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPOSTA RESPONSABILIDADES', 20, 30);

    const y = 90;
    const gap = 90;

    const item = (x: number, title: string, desc: string) => {
        doc.setDrawColor(WHITE);
        doc.circle(x, y, 20, 'S');
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, x + 30, y - 5);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(doc.splitTextToSize(desc, 60), x + 30, y + 5);
    };

    item(40, 'TRANSPARÊNCIA', 'Mensalmente todos clientes recebem todos documentos referentes a impostos e encargos.');
    item(140, 'RESPONSABILIDADE SOCIAL', 'Apoio e participação mensal em ações sociais.');
    item(240, 'AMBIENTAL', 'Treinamento visando descarte e manipulação correta.');
};

export const renderFerramentas = (doc: jsPDF, width: number, height: number) => {
    doc.addPage();

    doc.setTextColor(BLUE_DARK);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('PRINCIPAIS', 20, 30);
    doc.text('FERRAMENTAS', 20, 42);

    // Split
    doc.setFillColor(BLUE_DARK);
    doc.rect(width / 2, 0, width / 2, height, 'F');

    // Left (Tools List)
    doc.setFontSize(16);
    doc.text('BITRIX24', 50, 80);
    doc.text('SECULLUM', 50, 110);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('CRM e Gestão', 50, 85);
    doc.text('Ponto Digital', 50, 115);

    // Right (Tools List)
    doc.setTextColor(WHITE);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);

    const rx = width / 2 + 30;
    doc.text('ONVIO', rx, 80);
    doc.text('CHECK-LIST FÁCIL', rx, 110);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Gestão de Documentos', rx, 85);
    doc.text('Processos Internos', rx, 115);
};
