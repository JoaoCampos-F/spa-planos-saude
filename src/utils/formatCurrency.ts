export default function formatCurrency() {
  function brazilianCurrency(value) {
    if (typeof value == "string") {
      value = value.trim().replaceAll(",", "");
    }

    if (value == null) return "R$ 0,00";
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formatter.format(parseFloat(value)) || "0";
  }

  return {
    brazilianCurrency,
  };
}
