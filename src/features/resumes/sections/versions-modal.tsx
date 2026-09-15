import * as React from "react";
import {
  ResumeVersionSummary,
  resumesService,
} from "../../../services/resumes.service";
import { ResumeData } from "@resumeai/shared";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { History, Plus, RotateCcw, Calendar, CheckCircle2 } from "lucide-react";

interface VersionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
  currentVersionNumber?: number;
  onRestoreVersion: (resumeData: ResumeData) => void;
}

export function VersionsModal({
  open,
  onOpenChange,
  resumeId,
  currentVersionNumber,
  onRestoreVersion,
}: VersionsModalProps) {
  const [versions, setVersions] = React.useState<ResumeVersionSummary[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [restoring, setRestoring] = React.useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [checkpointSummary, setCheckpointSummary] = React.useState("");
  const [creatingCheckpoint, setCreatingCheckpoint] = React.useState(false);

  const fetchVersions = React.useCallback(async () => {
    if (!resumeId) return;
    setLoading(true);
    try {
      const items = await resumesService.listVersions(resumeId);
      setVersions(items);
    } catch (err) {
      console.error("Failed to load versions", err);
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  React.useEffect(() => {
    if (open) {
      fetchVersions();
    }
  }, [open, fetchVersions]);

  const handleCreateCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkpointSummary.trim()) return;
    setCreatingCheckpoint(true);
    try {
      await resumesService.createVersion(resumeId, checkpointSummary.trim());
      setCheckpointSummary("");
      setShowCreateForm(false);
      await fetchVersions();
    } catch (err) {
      console.error("Failed to create version checkpoint", err);
    } finally {
      setCreatingCheckpoint(false);
    }
  };

  const handleRestore = async (versionNumber: number) => {
    setRestoring(versionNumber);
    try {
      const detail = await resumesService.getVersion(resumeId, versionNumber);
      if (detail.resumeData) {
        onRestoreVersion(detail.resumeData);
        onOpenChange(false);
      }
    } catch (err) {
      console.error("Failed to restore version", err);
    } finally {
      setRestoring(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <History className="h-5 w-5 text-primary" />
          <span>Version History & Checkpoints</span>
        </DialogTitle>
        <DialogDescription>
          Browse saved versions and milestones or create an explicit snapshot of
          your current resume.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {showCreateForm ? (
          <form
            onSubmit={handleCreateCheckpoint}
            className="p-3.5 bg-muted/40 rounded-lg border border-border space-y-3"
          >
            <Input
              label="Checkpoint Description"
              placeholder="e.g. Tailored for Lead Architect position at Stripe"
              value={checkpointSummary}
              onChange={(e) => setCheckpointSummary(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!checkpointSummary.trim() || creatingCheckpoint}
              >
                {creatingCheckpoint ? "Creating..." : "Save Snapshot"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground">
              {versions.length} {versions.length === 1 ? "Version" : "Versions"}{" "}
              recorded
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Checkpoint
            </Button>
          </div>
        )}

        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {loading && (
            <div className="text-center py-6 text-xs text-muted-foreground">
              Loading versions...
            </div>
          )}

          {!loading && versions.length === 0 && (
            <div className="text-center py-6 text-xs text-muted-foreground">
              No version snapshots recorded yet.
            </div>
          )}

          {!loading &&
            versions.map((ver) => (
              <div
                key={ver.id}
                className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-foreground">
                      Version {ver.versionNumber}
                    </span>
                    {ver.versionNumber === currentVersionNumber && (
                      <span className="inline-flex items-center text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/80">
                    {ver.changeSummary || ver.title}
                  </p>
                  <div className="flex items-center text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(ver.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs ml-3"
                  disabled={restoring === ver.versionNumber}
                  onClick={() => handleRestore(ver.versionNumber)}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  {restoring === ver.versionNumber ? "Restoring..." : "Restore"}
                </Button>
              </div>
            ))}
        </div>
      </div>

      <DialogFooter className="pt-3 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
