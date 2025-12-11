interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p style={{ margin: '0.5rem 0', color: '#4b5563' }}>
      {message}
    </p>
  );
}


