export function report(output: "local" | "console", message: string) {
  if (output === "local") {
    //console.warn("Local output not implemented")
  } else {
    console.log(message);
  }
}
