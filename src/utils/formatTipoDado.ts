export default function formatTipoDado() {
  function formatDescription(tipo: string) {
    const tipoDado: { [key: string]: string } = {
      A: "Anual",
      B: "Bimestral",
      C: "Semanal",
      M: "Mês Ref. 26 a 25",
      P: "PPLR",
      R: "Mês Fechado",
      S: "Semestral",
      T: "Trimestral",
      X: "Personalizado",
    };
    return tipoDado[tipo];
  }

  return { formatDescription };
}
