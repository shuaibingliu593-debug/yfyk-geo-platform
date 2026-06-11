export async function GET() {
  const response = await fetch(`${apiInternalBaseUrl}/llms.txt`, { cache: "no-store" });
  const text = await response.text();

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    },
    status: response.status
  });
}

const apiInternalBaseUrl = process.env.API_INTERNAL_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
