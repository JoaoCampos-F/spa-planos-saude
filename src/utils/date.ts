function diffInSeconds(date1: Date, date2: Date): number {
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
  const diffInSeconds = diffInMilliseconds / 1000;
  return diffInSeconds;
}

function months() {
    const meses = [
      { title: "JAN", value: "01" },
      { title: "FEV", value: "02" },
      { title: "MAR", value: "03" },
      { title: "ABR", value: "04" },
      { title: "MAI", value: "05" },
      { title: "JUN", value: "06" },
      { title: "JUL", value: "07" },
      { title: "AGO", value: "08" },
      { title: "SET", value: "09" },
      { title: "OUT", value: "10" },
      { title: "NOV", value: "11" },
      { title: "DEZ", value: "12" },
    ];
    return meses;
}

  function yearsSince(startYear: number): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];

    for (let i = currentYear; i >= startYear; i--) {
      years.push(i);
    }

    return years;
  }


export { diffInSeconds, months, yearsSince };
