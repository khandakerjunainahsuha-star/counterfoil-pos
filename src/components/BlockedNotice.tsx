export function BlockedNotice({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-3">
      <span className="text-amber-500 shrink-0 mt-0.5">⚠</span>
      <p className="text-xs text-amber-800 flex-1 leading-relaxed">{message}</p>
      <button
        onClick={onDismiss}
        className="text-amber-400 hover:text-amber-600 text-xs shrink-0 ml-1"
      >
        ✕
      </button>
    </div>
  );
}
