import { ref } from "vue";

export default function formatDate() {
  function brazilianStandardDate(date) {
    if (!date) return "Não informado";
    const options = { year: "numeric", month: monthFormat, day: "numeric" };
    const newDate = new Date(date);

    return newDate.toLocaleDateString("pt-br", options);
  }

  function BrazilianStandardDateAndTime(date) {
    if (!date) return "Não informado";
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };

    const newDate = new Date(date);

    return new Intl.DateTimeFormat("pt-BR", options).format(newDate);
  }

  return { brazilianStandardDate, BrazilianStandardDateAndTime };
}
