export class TokenEncoded {
  private readonly state?: string;

  constructor(data?: string) {
    this.state = data;
  }

  public isValid(): boolean {
    return this.state !== undefined;
  }
}

new TokenEncoded(undefined);
