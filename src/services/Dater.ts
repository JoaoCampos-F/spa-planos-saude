class Dater {
  Months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  private date = new Date();
  private formate = "dd/mm/yyyy";
  private dateContext: Record<string, string> = {};

  format(date: Date, formate = "dd/mm/yyyy") {
    this.date = new Date(date);
    this.formate = formate;
    this.getContext();
    return this.applyValues();
  }

  private applyValues() {
    let formattedString = this.formate;
    for (const [key, value] of Object.entries(this.dateContext)) {
      formattedString = formattedString.replace(new RegExp(key, "g"), value);
    }
    return formattedString;
  }

  private getContext() {
    const year = this.date.getFullYear().toString();
    const month = this.date.getMonth();
    const day = this.date.getDate();

    this.dateContext = {
      yyyy: year,
      yy: year.slice(-2),
      mmm: this.addZero(this.date.getMinutes()),
      mm: this.addZero(month + 1),
      MM: this.Months[month],
      dd: this.addZero(day),
      HH: this.addZero(this.date.getHours()),
      ss: this.addZero(this.date.getSeconds()),
    };
  }
  addZero(i: number): string {
    if (i < 10) {
      return "0" + i;
    }
    return i + "";
  }
}

export default () => new Dater();
