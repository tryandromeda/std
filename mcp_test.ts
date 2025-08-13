const BASE_URL = "https://std.load1n9.deno.net/mcp";
// const BASE_URL = "http://localhost:8000/mcp";

async function post(endpoint: string, body: object) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  return data;
}

await post("prompts", {
  jsonrpc: "2.0",
  method: "prompts/list",
  id: 1,
});

await post("resources", {
  jsonrpc: "2.0",
  method: "resources/list",
  id: 2,
});

await post("resources", {
  jsonrpc: "2.0",
  method: "resources/read",
  params: { uri: "file:///collections/mod.ts" },
  id: 3,
});

await post("prompts", {
  jsonrpc: "2.0",
  method: "prompts/get",
  params: {
    name: "code_review",
    arguments: {
      code: "export function add(a, b) { return a + b; }",
    },
  },
  id: 4,
});

const readme = await post("resources", {
  jsonrpc: "2.0",
  method: "resources/read",
  params: { uri: "file:///README.md" },
  id: 5,
});
const readmeText = readme.result?.contents?.[0]?.text ?? "";

await post("prompts", {
  jsonrpc: "2.0",
  method: "prompts/get",
  params: {
    name: "doc_summary",
    arguments: {
      doc: readmeText,
    },
  },
  id: 6,
});
