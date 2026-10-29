export async function proxyAgentRequest(
  request: Request,
  endpoint: "/agent" | "/agent/approve"
) {
  const backendUrl = process.env.BACKEND_API_URL;
  const apiToken = process.env.BACKEND_API_TOKEN;

  if (!backendUrl || !apiToken) {
    console.error("Backend API proxy is missing its server-side configuration.");
    return Response.json(
      { status: "error", error: "Backend API is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(new URL(endpoint, backendUrl), {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiToken}`,
        "content-type": "application/json",
      },
      body: await request.text(),
      cache: "no-store",
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Backend API proxy request failed.", error);
    return Response.json(
      { status: "error", error: "Backend API is unavailable" },
      { status: 502 }
    );
  }
}
