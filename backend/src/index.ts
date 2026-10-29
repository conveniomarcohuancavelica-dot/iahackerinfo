import express from "express";
import cors from "cors";
import { timingSafeEqual } from "node:crypto";
import AgentRouter from "./routes/graph";
import { env } from "./utils/env";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/agent", (req, res, next) => {
  const expected = Buffer.from(`Bearer ${env.API_SHARED_SECRET}`);
  const provided = Buffer.from(req.get("authorization") ?? "");

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized",
    });
  }

  next();
});

app.use(express.json());
app.use("/agent", AgentRouter);

app.listen(env.PORT, () => {
  console.log(`Server is now running on port: ${env.PORT}`);
});
