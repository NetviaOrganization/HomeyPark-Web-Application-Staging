/**
 * Formats a number as Peruvian currency (PEN)
 * @param amount - The amount to format
 * @param options - Optional Intl.NumberFormatOptions
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  options?: Intl.NumberFormatOptions
): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }

  return new Intl.NumberFormat('es-PE', defaultOptions).format(amount)
}

// Example usage:
// formatPeruCurrency(125.50) => "S/ 125.50"
// formatPeruCurrency(1234.56) => "S/ 1,234.56"
