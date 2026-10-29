import { proxyAgentRequest } from "../../_lib/proxy-agent";

export const runtime = "nodejs";

export function POST(request: Request) {
  return proxyAgentRequest(request, "/agent/approve");
}
