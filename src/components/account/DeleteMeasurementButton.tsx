"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteMeasurementProfile } from "@/lib/actions/account";

interface DeleteMeasurementButtonProps {
  profileId: string;
}

export function DeleteMeasurementButton({
  profileId,
}: DeleteMeasurementButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this measurement profile?")) return;

    setDeleting(true);
    try {
      const result = await deleteMeasurementProfile(profileId);

      if (result.success) {
        toast.success("Measurement profile deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete profile");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete profile");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-2 text-on-surface-variant hover:text-red-600 transition-colors disabled:opacity-50"
      title="Delete"
    >
      {deleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
