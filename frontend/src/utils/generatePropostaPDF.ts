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

    // Footer
    doc.setFontSize(8);
    doc.setTextColor('#9CA3AF');
    const pageHeight = doc.internal.pageSize.height;
    doc.text('Grupo JVS Facilities - www.grupojvsserv.com.br', 14, pageHeight - 10);
    doc.text('Av. Maringá, 1273 - Pinhais/PR - (41) 3505-0020', 14, pageHeight - 6);

    // Save
    doc.save(`Proposta_JVS_Facilities_${resultado.id}.pdf`);
};
