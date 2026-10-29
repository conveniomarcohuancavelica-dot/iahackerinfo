"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type AgentFormProps = {
  disabled: boolean;
  onStart: (input: string) => void | Promise<void>;
};

export default function AgentForm({ disabled, onStart }: AgentFormProps) {
  const [input, setInput] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const task = input.trim();
    if (!task || disabled) return;
    void onStart(task);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Describe a task</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="agent-input">
            Task description
          </label>
          <Textarea
            id="agent-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="What would you like the agent to plan?"
            rows={4}
            required
            disabled={disabled}
          />
          <Button type="submit" disabled={disabled || input.trim().length === 0}>
            Create plan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
