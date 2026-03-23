export function formatCurrency(value) {
    if (value === null || value === undefined) {
        return "Sin datos";
    }

    return new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(value);
}
