import * as React from "react";
import { Certification } from "@resumeai/shared";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface CertificationsSectionProps {
  value: Certification[];
  onChange: (value: Certification[]) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function CertificationsSection({
  value,
  onChange,
}: CertificationsSectionProps) {
  const addCertification = () => {
    onChange([
      ...value,
      {
        id: generateId(),
        name: "",
        issuer: "",
        issueDate: "",
        expirationDate: "",
        credentialId: "",
        credentialUrl: "",
      },
    ]);
  };

  const updateCertification = (
    index: number,
    updates: Partial<Certification>,
  ) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeCertification = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveCertification = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {value.map((cert, index) => (
        <Card
          key={cert.id || index}
          className="p-4 space-y-3 border border-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                #{index + 1}
              </span>
              <span className="font-medium text-sm text-foreground">
                {cert.name || "New Certification"}{" "}
                {cert.issuer ? `(${cert.issuer})` : ""}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === 0}
                onClick={() => moveCertification(index, index - 1)}
                title="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === value.length - 1}
                onClick={() => moveCertification(index, index + 1)}
                title="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => removeCertification(index)}
                title="Delete certification"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Certification Name *"
              placeholder="e.g. AWS Certified Solutions Architect"
              value={cert.name || ""}
              onChange={(e) =>
                updateCertification(index, { name: e.target.value })
              }
            />
            <Input
              label="Issuing Organization *"
              placeholder="e.g. Amazon Web Services"
              value={cert.issuer || ""}
              onChange={(e) =>
                updateCertification(index, { issuer: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Issue Date"
              placeholder="e.g. 2023-05"
              value={cert.issueDate || ""}
              onChange={(e) =>
                updateCertification(index, { issueDate: e.target.value })
              }
            />
            <Input
              label="Expiration Date (if applicable)"
              placeholder="e.g. 2026-05"
              value={cert.expirationDate || ""}
              onChange={(e) =>
                updateCertification(index, { expirationDate: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Credential ID / License Number"
              placeholder="e.g. AWS-PSA-12345"
              value={cert.credentialId || ""}
              onChange={(e) =>
                updateCertification(index, { credentialId: e.target.value })
              }
            />
            <Input
              label="Verification URL"
              placeholder="e.g. https://aws.amazon.com/verify/..."
              value={cert.credentialUrl || ""}
              onChange={(e) =>
                updateCertification(index, { credentialUrl: e.target.value })
              }
            />
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed py-4 text-sm"
        onClick={addCertification}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
}
