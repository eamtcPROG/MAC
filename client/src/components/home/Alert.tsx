interface AlertProps {
  message: string;
  variant?: 'error' | 'info';
}

export function Alert({ message, variant = 'info' }: AlertProps) {
  const cls = variant === 'error' ? 'alert alert-error' : 'alert alert-info';
  return <div className={cls}>{message}</div>;
}


