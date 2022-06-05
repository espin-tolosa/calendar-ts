import { Credentials } from "@/entities/secure-login/read-headers";

/**
 * A class intended to be used in presentation layer,
 * it provides status login and text nodes to render as children in components.
 */
export class LoginStatus {
  private readonly source: Credentials;

  constructor() {
    this.source = new Credentials();
  }

  public isUserLoggedIn(): boolean {
    return (
      this.source.isValid() &&
      (this.source.isAuth("rw") || this.source.isAuth("r"))
    );
  }

  public renderTextNodes(property: "user-name" | "login-status") {
    switch (property) {
      case "user-name": {
        const name = this.source.showUser();
        return name !== undefined ? `user: ${name}` : "invited"; // user: name | invited
      }
      case "login-status": {
        return this.source.isValid() ? "Logout" : "Sign-in";
      }
    }
  }
}

//! Testing
export default {
  loginstatus: () => new LoginStatus(),
};
