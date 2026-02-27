/**
 * Formats a number as Brazilian Real (BRL) currency.
 * @param value The number to format
 * @returns A string in the format "R$ 0,00"
 */
export const formatBRL = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

/**
 * Formats a date string to the Brazilian format (DD/MM/YYYY).
 * @param dateString The ISO date string
 * @returns A formatted date string
 */
export const formatDateBR = (dateString: string): string => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    } catch {
        return dateString;
    }
};
