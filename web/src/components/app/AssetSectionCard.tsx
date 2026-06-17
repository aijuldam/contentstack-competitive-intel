"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";

interface AssetSectionCardProps {
  label: string;
  content: string;
  confidence: "verified" | "inferred";
  needsValidation?: boolean;
  sourceBlocks?: string[];
  className?: string;
  onSave?: (content: string) => void;
}

export function AssetSectionCard({
  label,
  content,
  confidence,
  needsValidation = false,
  sourceBlocks = [],
  className,
  onSave,
}: AssetSectionCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);

  function handleSave() {
    onSave?.(draft);
    setEditing(false);
  }

  function handleCancel() {
    setDraft(content);
    setEditing(false);
  }

  return (
    <Card
      className={cn(
        needsValidation && "ring-1 ring-amber-300 dark:ring-amber-700",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            {needsValidation && (
              <Badge variant="inferred" className="text-2xs">
                Review needed
              </Badge>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Badge variant={confidence === "verified" ? "verified" : "inferred"}>
              {confidence}
            </Badge>
            {!editing && (
              <Button
                size="icon-sm"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        {sourceBlocks.length > 0 && (
          <p className="text-2xs text-muted-foreground mt-0.5">
            From: {sourceBlocks.join(", ")}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={5}
              className="text-sm resize-none"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Check className="h-3.5 w-3.5" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {content}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
