export function runJavaScript(code) {
  const output = [];
  const fakeConsole = {
    log: (...args) => output.push(args.map(String).join(" ")),
    error: (...args) => output.push(`Error: ${args.map(String).join(" ")}`)
  };
  try {
    // Execute in Function scope with injected console.
    const fn = new Function("console", `"use strict";\n${code}`);
    fn(fakeConsole);
    return output.join("\n") || "Executed successfully with no output.";
  } catch (error) {
    return `Runtime error: ${error.message}`;
  }
}
