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
    <section className="vm-form-section">
      <div className="form-header">
        <h2>Create VM</h2>
        <p className="form-subtitle">Configure and deploy a new virtual machine</p>
      </div>
      
      {error && <Alert message={error} variant="error" />}
      
      <form onSubmit={onSubmit} className="vm-form">
        <div className="form-group">
          <label className="form-label required">
            Instance Type
            <select
              name="instanceType"
              value={form.instanceType}
              onChange={onChange}
              className="form-select"
              required
            >
              <option value="">Select instance type</option>
              <option value="t2.micro">t2.micro</option>
              <option value="t3.micro">t3.micro</option>
              <option value="t3.small">t3.small</option>
              <option value="t3.medium">t3.medium</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label className="form-label required">
            Owner Username
            <input
              name="ownerUsername"
              type="text"
              placeholder="Enter owner username"
              value={form.ownerUsername}
              onChange={onChange}
              className="form-input"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label required">
            VM Name
            <input
              name="vmName"
              type="text"
              placeholder="Enter VM name"
              value={form.vmName}
              onChange={onChange}
              className="form-input"
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label required">
            Region
            <select 
              name="region" 
              value={form.region ?? ''} 
              onChange={onChange}
              className="form-select"
              required
            >
              <option value="">Select region</option>
              <option value="us-east-1">us-east-1</option>
              <option value="us-east-2">us-east-2</option>
              <option value="us-west-2">us-west-2</option>
              <option value="eu-west-1">eu-west-1</option>
            </select>
          </label>
        </div>

        <div className="form-group form-group-inline">
          <label className="form-label">
            Min Count
            <select
              name="minCount"
              value={form.minCount?.toString() ?? ''}
              onChange={onChange}
              className="form-select"
            >
              <option value="">Default (1)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          
          <label className="form-label">
            Max Count
            <select
              name="maxCount"
              value={form.maxCount?.toString() ?? ''}
              onChange={onChange}
              className="form-select"
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

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="button-spinner"></span>
                Creating...
              </>
            ) : (
              'Create VM'
            )}
          </button>
        </div>
      </form>
    </section>
  );
}


