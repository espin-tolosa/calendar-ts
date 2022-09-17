export class DateCalendar {
  private value: Array<string>;

  constructor(date: string) {
    this.value = date.split("-");
  }
  private parse(date: string) {
    const value = date.split("-");
    const y: number = parseInt(value[0]);
    const m: number = parseInt(value[1]) - 1;
    const d: number = parseInt(value[2]);
    const dt = new Date(y, m, d);
    return dt.toDateString() === "Invalid Date" ? dt : "invalid date";
  }

  public toDB() {
    return `${this.value[0]}-${this.value[1]}-${this.value[2]}`;
  }
}
