import { Plus, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  onNewTask?: () => void;
  newTaskLabel?: string;
  onSuggestions?: () => void;
  showSuggestions?: boolean;
  weekLabel?: string;
  onPrev?: () => void;
  onNext?: () => void;
  title?: string;
  subtitle?: string;
  onExport?: () => void;
  onImport?: (json: string) => void;
}

export function Toolbar({
  onNewTask,
  newTaskLabel = 'Nouvelle tâche',
  onSuggestions,
  showSuggestions = true,
  weekLabel,
  onPrev,
  onNext,
  title,
  subtitle,
  onExport,
  onImport,
}: Props) {
  return (
    <div className="flex items-center gap-3 mb-5 flex-wrap">
      {title && (
        <div className="mr-auto">
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <span className="text-xs text-[var(--txt2)]">{subtitle}</span>}
        </div>
      )}

      {onNewTask && (
        <button className="btn-primary" onClick={onNewTask}>
          <Plus size={16} /> {newTaskLabel}
        </button>
      )}

      {showSuggestions && onSuggestions && (
        <button className="btn-secondary" onClick={onSuggestions}>
          <Sparkles size={16} /> Suggestions
        </button>
      )}

      <div className="flex-1" />

      {weekLabel && (
        <>
          {onPrev && (
            <button className="icon-btn" onClick={onPrev}>
              <ChevronLeft size={16} />
            </button>
          )}
          <span className="text-sm font-semibold text-[var(--txt)] px-2">{weekLabel}</span>
          {onNext && (
            <button className="icon-btn" onClick={onNext}>
              <ChevronRight size={16} />
            </button>
          )}
        </>
      )}

      {/* Export / Import */}
      {onExport && (
        <button className="btn-ghost" onClick={onExport}>
          Exporter
        </button>
      )}
      {onImport && (
        <label className="btn-ghost cursor-pointer">
          Importer
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => {
                const text = String(reader.result || '');
                onImport(text);
              };
              reader.readAsText(f);
            }}
          />
        </label>
      )}
    </div>
  );
}
