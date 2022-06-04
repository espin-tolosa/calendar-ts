//Tested on describe: "Testing window api read encoded tokens"
export namespace DocumentIO {
  export function readCookiesName() {
    return window.document.cookie
      .split(";")
      .filter((cookie) => cookie !== "")
      .map((cookie) => cookie.split("=")[0]);
  }

  export function deleteAllCookies() {
    const cookiesName = DocumentIO.readCookiesName();
    cookiesName.map((name) => DocumentIO.deleteCookie(name));
  }

  export function deleteCookie(name: string) {
    //! TL;DR
    //	https://stackoverflow.com/questions/2959010/how-to-get-the-domain-value-for-a-cookie-in-javascript
    //	The cookie metadata like path, domain and expires are not visible to site code (neither to JavaScript nor to the server-side).
    //	You can only access cookies from the same domain (this includes subdomains). Obviously doing otherwise would be a security concern.
    //	To only remove a cookie at any subdomain level, what you could do is try to remove the cookie at every possible level of specificity, eg:

    //	Blank spaces left just for readability in this example:

    //	document.cookie= 'foo=;domain=           example.com;expires=Sat, 01-Jan-2000 00:00:00 GMT';
    //	document.cookie= 'foo=;domain=    domain.example.com;expires=Sat, 01-Jan-2000 00:00:00 GMT';
    //	document.cookie= 'foo=;domain=sub.domain.example.com;expires=Sat, 01-Jan-2000 00:00:00 GMT';

    //! Note about legacy:
    //	in production env (https://jhdiary.com), the backend emitts the following cookies:
    //
    //	- PHPSESSID: Domain=jhdiary.com
    //	- TOKENHASH: Domain=.jhdiary.com
    //
    //	so in order to delete all cookies I've tried to just delete them by preceding a dot before domain name
    //	it seems to work in development env so I presume it will also work in production env
    const legacy = ".";

    const location = legacy + window.document.location.host.split(":")[0];

    window.document.cookie = `${name}=; Domain=${location}; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
}
