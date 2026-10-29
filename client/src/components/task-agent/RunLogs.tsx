import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FinalView, InterruptView } from "@/lib/types";

type RunLogsProps = {
  interrupt: InterruptView | null;
  final: FinalView | null;
  loading: boolean;
  onApprove: () => void | Promise<void>;
  onReject: () => void | Promise<void>;
};

export default function RunLogs({
  interrupt,
  final,
  loading,
  onApprove,
  onReject,
}: RunLogsProps) {
  if (loading) {
    return (
      <p className="text-center text-muted-foreground" role="status">
        Working on your task…
      </p>
    );
  }

  if (interrupt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review the plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{interrupt.prompt}</p>
          <ol className="list-decimal space-y-2 pl-6">
            {interrupt.steps.map((step, index) => (
              <li key={`${index}-${step}`}>{step}</li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void onApprove()}>Approve and execute</Button>
            <Button
              variant="outline"
              onClick={() => void onReject()}
            >
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!final) return null;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Run result</CardTitle>
        <Badge variant={final.status === "done" ? "default" : "secondary"}>
          {final.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {final.message && (
          <Alert variant={final.status === "cancelled" ? "destructive" : "default"}>
            <AlertTitle>
              {final.status === "cancelled" ? "Run stopped" : "Agent update"}
            </AlertTitle>
            <AlertDescription>{final.message}</AlertDescription>
          </Alert>
        )}
        {final.steps && final.steps.length > 0 && (
          <div>
            <h3 className="mb-2 font-medium">Plan</h3>
            <ol className="list-decimal space-y-1 pl-6">
              {final.steps.map((step, index) => (
                <li key={`${index}-${step}`}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        {final.results && final.results.length > 0 && (
          <div>
            <h3 className="mb-2 font-medium">Results</h3>
            <ul className="space-y-3">
              {final.results.map((result, index) => (
                <li
                  className="rounded-md border p-3"
                  key={`${index}-${result.step}`}
                >
                  <p className="font-medium">{result.step}</p>
                  <p className="text-sm text-muted-foreground">{result.note}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
