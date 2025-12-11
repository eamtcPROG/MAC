interface PaginationControlsProps {
  page: number;
  totalPages: number;
  disabled: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function PaginationControls({
  page,
  totalPages,
  disabled,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="pagination">
      <button onClick={onPrev} disabled={page <= 1 || disabled}>
        Prev
      </button>
      <span style={{ margin: '0 0.5rem' }}>
        Page {page} / {totalPages}
      </span>
      <button onClick={onNext} disabled={page >= totalPages || disabled}>
        Next
      </button>
    </div>
  );
}


