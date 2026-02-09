import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResultadoSimulacao, UserData } from '@/types/simulador';

// --- CONFIGURATION ---
const FONTS = {
    TITLE: 'helvetica',
    BODY: 'helvetica'
};

const COLORS = {
    PRIMARY: '#10B981',    // Emerald 500
    DARK: '#111827',       // Gray 900
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

export const generatePropostaPDF = async (resultado: ResultadoSimulacao, client: UserData) => {
    // 1. Initialize Portrait PDF (A4)
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.width; // 210mm
    const pageHeight = doc.internal.pageSize.height; // 297mm
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let currentY = 20;

    // --- COVER PAGE ---

    // Logo
    try {
        // Use a generic placeholder if logo fails, or try to load real logo
        const logoData = await loadImage('/logo-jvs.png');
        doc.addImage(logoData, 'PNG', margin, 20, 50, 15); // Adjust size as needed
    } catch (e) {
        // Fallback text if logo fails
        doc.setFontSize(20);
        doc.setTextColor(COLORS.PRIMARY);
        doc.text('JVS Facilities', margin, 32);
    }

    // Title
    currentY = 80;
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(36);
    doc.setTextColor(COLORS.DARK);
    doc.text('Proposta', margin, currentY);
    doc.text('Comercial', margin, currentY + 12);

    // Decorative Line
    currentY += 25;
    doc.setDrawColor(COLORS.PRIMARY);
    doc.setLineWidth(2);
    doc.line(margin, currentY, margin + 20, currentY);

    // Client Info
    currentY += 30;
    doc.setFont(FONTS.BODY, 'normal');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.TEXT);
    doc.text('PREPARADO PARA:', margin, currentY);

    currentY += 8;
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(COLORS.DARK);
    doc.text(client.empresa || client.nome, margin, currentY);

    currentY += 8;
    doc.setFont(FONTS.BODY, 'normal');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.TEXT);
    doc.text(client.email, margin, currentY);
    if (client.whatsapp) {
        currentY += 6;
        doc.text(client.whatsapp, margin, currentY);
    }

    // Date/ID
    currentY += 20;
    doc.setFontSize(10);
    doc.setTextColor('#9CA3AF'); // Gray 400
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, currentY);
    doc.text(`Proposta #: ${resultado.id}`, margin, currentY + 5);

    // Footer
    doc.setFontSize(9);
    doc.text('JVS Facilities • Soluções em Governança e Limpeza', margin, pageHeight - 15);


    // --- CONTENT PAGES ---
    doc.addPage();
    currentY = 25;

    // Helper to add Section Title
    const addSectionTitle = (title: string) => {
        if (currentY > 250) { doc.addPage(); currentY = 25; }

        doc.setFont(FONTS.TITLE, 'bold');
        doc.setFontSize(16);
        doc.setTextColor(COLORS.PRIMARY);
        doc.text(title.toUpperCase(), margin, currentY);

        // Line under title
        doc.setDrawColor(COLORS.PRIMARY);
        doc.setLineWidth(0.5);
        doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);

        currentY += 15;
    };

    // Helper to add Body Text
    const addParagraph = (text: string) => {
        doc.setFont(FONTS.BODY, 'normal');
        doc.setFontSize(11);
        doc.setTextColor(COLORS.TEXT);

        const lines = doc.splitTextToSize(text, contentWidth);

        if (currentY + (lines.length * 5) > 270) { doc.addPage(); currentY = 25; }

        doc.text(lines, margin, currentY);
        currentY += (lines.length * 5) + 6; // Line height + paragraph spacing
    };

    // Helper to add Bullet Points
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
        currentY += 4; // Spacing after list
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


    // --- PAGE BREAK if needed ---
    if (currentY > 200) { doc.addPage(); currentY = 25; }


    // 4. ESCOPO E INVESTIMENTO (Inserted dynamically based on simulation)
    addSectionTitle('Escopo Proposto e Investimento');

    const tableData = resultado.servicos.map(item => {
        // Extract details from config using explicit casting if needed or loose access
        const config = item.config;
        const cargo = config.cargo || config.funcao || 'Serviço';
        const quantidade = config.quantidade || 1;

        // Format scale (e.g. ['seg', 'ter'] -> "seg, ter" or "Diário")
        const escala = Array.isArray(config.dias) ? config.dias.join(', ') : (config.dias || 'Diário');

        return [
            cargo,
            quantidade,
            escala,
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.custoTotal)
        ];
    });

    autoTable(doc, {
        startY: currentY,
        head: [['Cargo / Função', 'Qtd', 'Escala', 'Valor Mensal Unit.']],
        body: tableData,
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
    currentY = doc.lastAutoTable.finalY + 10;

    // Total
    doc.setFont(FONTS.TITLE, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.DARK);
    doc.text('INVESTIMENTO MENSAL TOTAL:', margin, currentY);

    doc.setFontSize(16);
    doc.setTextColor(COLORS.PRIMARY);
    // Use correct 'resumo' field
    const totalMensal = resultado.resumo.custoMensalTotal;
    doc.text(
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMensal),
        pageWidth - margin,
        currentY,
        { align: 'right' }
    );
    currentY += 15;


    // 5. NOSSOS DIFERENCIAIS
    addSectionTitle('Nossos Diferenciais');

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
    addParagraph('Aprimoramos continuamente nossos processos internos e evoluímos junto à tecnologia para aumentar controle, gestão e desempenho. Isso nos permite acompanhar metas, indicadores e resultados com consistência, garantindo qualidade e transparência ao cliente.');


    // 6. CONDIÇÕES COMERCIAIS
    if (currentY > 220) { doc.addPage(); currentY = 25; }
    addSectionTitle('Condições Comerciais');
    addBullets([
        'Faturamento dos serviços entre os dias 25 e 30 do mês da prestação dos serviços, com vencimento no 3º dia útil do mês subsequente;',
        'Reajuste anual, automático e equivalente ao dissídio da categoria no mês de referência citado em CCT de cada ano subsequente;',
        'Próximo reajuste: Janeiro/2026.'
    ]);


    // Save JSON
    doc.save(`Proposta_JVS_${client.empresa || 'Comercial'}_${resultado.id}.pdf`);
};
