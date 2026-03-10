import { Loader2, Check, Circle } from "lucide-react";

interface StatusIndicatorProps {
  status: string;
}

const StatusIndication = ({ status }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 text-base mt-3">
      {status === "Typing" && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-yellow-500-10)] text-[var(--color-yellow-400)]">
          <Circle size={12} />
          Typing
        </div>
      )}

      {status === "Saving" && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-blue-500-10)] text-[var(--color-blue-400)">
          <Loader2 size={12} className="animate-spin" />
          Saving...
        </div>
      )}

      {status === "Saved" && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-green-500-10)] text-[var(--color-green-400)]">
          <Check size={12} />
          Saved
        </div>
      )}

      {status === "Idle" && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-gray-500-10)] text-[var(--color-gray-400)]">
          <Circle size={10} />
          Idle
        </div>
      )}
    </div>
  );
};

export default StatusIndication;
