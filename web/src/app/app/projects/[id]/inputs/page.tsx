import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/db/server";
import { getLatestProjectSource } from "@/lib/db/queries/sources";
import { GenerateFoundationButton } from "./GenerateFoundationButton";

export const metadata: Metadata = { title: "Project inputs" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectInputsPage({ params }: PageProps) {
  const { id } = await params;
  const client = await createClient();
  const source = await getLatestProjectSource(client, id);

  if (!source) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <p className="text-sm text-muted-foreground">No intake data yet.</p>
      </div>
    );
  }

  const rawInput = source.raw_input;
  const normalized = source.normalized_json;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Project Inputs</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {normalized
              ? "Normalized intake from Stage 1. Review before regenerating."
              : "Raw inputs saved. Generate the Messaging Foundation when ready."}
          </p>
        </div>
        <GenerateFoundationButton projectId={id} />
      </div>

      {/* Raw inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Raw inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(rawInput).map(([key, val]) => (
            <div key={key} className="space-y-1">
              <p className="label-xs">{key.replace(/_/g, " ")}</p>
              <p className="text-sm text-foreground">{val}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {normalized && (
        <>
          {/* Parsed facts */}
          {Object.entries(normalized.parsed_facts).some(
            ([, v]) => Array.isArray(v) && (v as unknown[]).length > 0
          ) && (
            <Card>
              <CardHeader>
                <CardTitle>Parsed facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(normalized.parsed_facts)
                  .filter(([, v]) => Array.isArray(v) && (v as unknown[]).length > 0)
                  .map(([key, values]) => (
                    <div key={key}>
                      <p className="label-xs mb-1.5">{key.replace(/_/g, " ")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(values as string[]).map((v) => (
                          <Badge key={v} variant="secondary">{v}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Confidence notes */}
          {normalized.confidence_notes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Confidence notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {normalized.confidence_notes.map((note) => (
                    <li key={note} className="flex gap-2 text-sm">
                      <Badge variant="inferred" className="shrink-0 mt-0.5">Inferred</Badge>
                      <span className="text-muted-foreground">{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Missing fields */}
          {normalized.missing_but_important.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/40">
              <CardHeader>
                <CardTitle>Missing but important</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {normalized.missing_but_important.map((item) => (
                    <li key={item} className="text-sm text-amber-800 flex gap-2 items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
