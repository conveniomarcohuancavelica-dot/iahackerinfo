// Runtime validation coverage for Gemini-backed agent nodes.
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { makeInitialState } from "../types";

const provider = vi.hoisted(() => {
  const invoke = vi.fn();
  const withStructuredOutput = vi.fn(() => ({ invoke }));
  const ChatGoogleGenerativeAI = vi.fn(function ChatGoogleGenerativeAI() {
    return { withStructuredOutput };
  });

  return { invoke, withStructuredOutput, ChatGoogleGenerativeAI };
});

vi.mock("@langchain/google-genai", () => ({
  ChatGoogleGenerativeAI: provider.ChatGoogleGenerativeAI,
}));

let PlanNode: typeof import("./02_plan").PlanNode;
let executeNode: typeof import("./04_execute").executeNode;

beforeAll(async () => {
  vi.stubEnv("GEMINI_API_KEY", "validation-only-not-a-real-key");
  vi.stubEnv("API_SHARED_SECRET", "validation-only-shared-secret-long-enough");

  ({ PlanNode } = await import("./02_plan"));
  ({ executeNode } = await import("./04_execute"));
});

afterAll(() => {
  vi.unstubAllEnvs();
});

beforeEach(() => {
  provider.invoke.mockReset();
  provider.withStructuredOutput.mockClear();
  provider.ChatGoogleGenerativeAI.mockClear();
});

describe("Gemini-backed agent nodes", () => {
  it("uses the configured Gemini model to generate a plan", async () => {
    const steps = ["Review the goal", "Prepare a small plan"];
    provider.invoke.mockResolvedValueOnce({ steps });

    const result = await PlanNode(makeInitialState("Deploy the application"));

    expect(provider.ChatGoogleGenerativeAI).toHaveBeenCalledWith({
      apiKey: "validation-only-not-a-real-key",
      model: "gemini-2.5-flash",
      temperature: 0.2,
    });
    expect(result).toEqual({ steps, status: "planned" });
  });

  it("uses Gemini to create notes for approved steps", async () => {
    const steps = ["Review the goal", "Prepare a small plan"];
    provider.invoke.mockResolvedValueOnce({
      notes: ["Goal reviewed", "Plan prepared"],
    });

    const result = await executeNode({
      ...makeInitialState("Deploy the application"),
      approved: true,
      steps,
    });

    expect(provider.ChatGoogleGenerativeAI).toHaveBeenCalledWith({
      apiKey: "validation-only-not-a-real-key",
      model: "gemini-2.5-flash",
      temperature: 0.2,
    });
    expect(result).toEqual({
      results: [
        { step: steps[0], note: "Goal reviewed" },
        { step: steps[1], note: "Plan prepared" },
      ],
      status: "done",
      message: "Executed 2 step(s)",
    });
  });
});
