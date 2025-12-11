import type { CreateVmRequest } from '../../api/api';
import { Alert } from './Alert';

interface VmFormProps {
  form: CreateVmRequest;
  canSubmit: boolean;
  isSubmitting: boolean;
  error?: string | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function VmForm({
  form,
  canSubmit,
  isSubmitting,
  error,
  onChange,
  onSubmit,
}: VmFormProps) {
  return (
    <section>
      <h2>Create VM</h2>
      {error && <Alert message={error} variant="error" />}
      <form onSubmit={onSubmit} className="form-grid">
        <label className="small">
          Instance type
          <select
            name="instanceType"
            value={form.instanceType}
            onChange={onChange}
          >
            <option value="">Select instance type</option>
            <option value="t2.micro">t2.micro</option>
            <option value="t3.micro">t3.micro</option>
            <option value="t3.small">t3.small</option>
            <option value="t3.medium">t3.medium</option>
          </select>
        </label>
        <input
          name="ownerUsername"
          placeholder="Owner username"
          value={form.ownerUsername}
          onChange={onChange}
        />
        <input
          name="vmName"
          placeholder="VM name"
          value={form.vmName}
          onChange={onChange}
        />
        <label className="small">
          Region (optional)
          <select name="region" value={form.region ?? ''} onChange={onChange}>
            <option value="">Default (server)</option>
            <option value="us-east-1">us-east-1</option>
            <option value="us-east-2">us-east-2</option>
            <option value="us-west-2">us-west-2</option>
            <option value="eu-west-1">eu-west-1</option>
          </select>
        </label>
        <div className="dual-row">
          <label className="small" style={{ flex: 1 }}>
            Min count
            <select
              name="minCount"
              value={form.minCount?.toString() ?? ''}
              onChange={onChange}
            >
              <option value="">Default (1)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <label className="small" style={{ flex: 1 }}>
            Max count
            <select
              name="maxCount"
              value={form.maxCount?.toString() ?? ''}
              onChange={onChange}
            >
              <option value="">Default (1)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>
        <button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? 'Working...' : 'Create VM'}
        </button>
      </form>
    </section>
  );
}


