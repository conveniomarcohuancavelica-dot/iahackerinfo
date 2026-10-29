import { Router } from "express";
import { z } from "zod";
import { resumeAgentRun, startAgentRun } from "../graph/graph";

const router = Router();

const StartSchema = z.object({
  input: z.string().min(1, "Input is needed"),
});

const ApproveSchema = z.object({
  threadId: z.string().min(1, "threadId is required"),
  approve: z.boolean(),
});

router.post("/", async (req, res) => {
  const parsed = StartSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      status: "error",
      error: "Error while parsing input",
    });
  }

  try {
    const result = await startAgentRun(parsed.data.input);

    if ("final" in result) {
      return res.json({
        status: "ok",
        data: {
          kind: "final",
          final: result.final,
        },
      });
    }

    if ("interrupt" in result) {
      return res.json({
        status: "ok",
        data: {
          kind: "needs_approval",
          interrupt: {
            threadId: result.interrupt.threadId,
            steps: result.interrupt.steps,
            prompt: "Approve the generated plan to execute or reject to calcel",
          },
        },
      });
    }

    return res.status(500).json({
      status: "error",
      error: "Some error occured",
    });
  } catch (error) {
    console.error("Agent run failed.", error);
    return res.status(500).json({
      status: "error",
      error: "Agent run failed. Check the backend logs for details.",
    });
  }
});

router.post("/approve", async (req, res) => {
  const parsed = ApproveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      status: "error",
      error: "Error while parsing input",
    });
  }

  try {
    const { threadId, approve } = parsed.data;

    const final = await resumeAgentRun({ threadId, approve });
    return res.json({ status: "ok", data: { kind: "final", final } });
  } catch (error) {
    console.error("Agent approval failed.", error);
    return res.status(500).json({
      status: "error",
      error: "Agent approval failed. Check the backend logs for details.",
    });
  }
});

export default router;
