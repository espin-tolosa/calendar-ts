interface PlainMembers {
  success: StatusState;
  data?: string;
}

type StatusState = "defined" | "undefined";
type Defined = { successCookiesRead: "defined"; data: string };
type Undefined = { successCookiesRead: "undefined"; data: undefined };

export class TokenEncoded {
  private state: Defined | Undefined;

  /**
   * Both parameters are mandatories because, even if internally data won't
   * bind this.data. The decission has nothing to do with data value but just
   * with "valid" parameter. If I let pass data as optional, sometime I will
   * think the following code is equivalent:
   *
   *! constructor(valid: boolean, data?: string)
   *! {
   *! 		this.successCookiesRead = valid;
   *! 		this.data = data;
   *! }
   *
   * and the compiler will accept it. But then I would do calls such as:
   *
   *! const state = new TokenEncoded(true);
   *
   * ending up with an internal state:
   *
   *! {valid: true, data: undefined}
   *
   * that will break somewhere at run-time
   *
   *! An alternative solution is given in Impl[check-all-before-assign]
   */
  constructor(valid: StatusState, data?: string) {
    // !Impl[check-all-before-assign]: with this branched code I could deal
    // !optional parameters without worry about ending up with invalid states.
    // Conditions must be checked to decide wether input values leads to
    // defined or undefined state

    // Defined or valid usable state
    if (this.checkStateIsValid(valid, data) && data) {
      this.state = Object.freeze({
        successCookiesRead: "defined",
        data,
      });
      // Undefined
    } else {
      this.state = Object.freeze({
        successCookiesRead: "undefined",
        data: undefined,
      });
    }
  }

  /**
   * Checks whether the internal state is defined or undefined
   * @returns isUndefined(): boolean
   */
  public isUndefined(): boolean {
    return !this.checkStateIsValid(
      this.state.successCookiesRead,
      this.state.data
    );
  }

  //Internal evaluation to branching always toward valid is states, either:
  // - fulfilled
  // - null / undefined
  private checkStateIsValid(valid: StatusState, data?: string): boolean {
    return valid !== "undefined" && data !== undefined;
  }
}

new TokenEncoded("defined");
