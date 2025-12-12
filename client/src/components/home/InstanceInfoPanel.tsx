import type { InstanceInfoDto, VMDto } from '../../api/api';
import { Alert } from './Alert';

interface InstanceInfoPanelProps {
  info: InstanceInfoDto | null;
  error?: string | null;
  selectedVm: VMDto | null;
  isDescribing?: boolean;
  onDescribe?: () => void;
  onClear?: () => void;
  hasSelection?: boolean;
}

export function InstanceInfoPanel({ 
  info, 
  error, 
  selectedVm, 
  isDescribing, 
  onDescribe, 
  onClear, 
  hasSelection 
}: InstanceInfoPanelProps) {
  return (
    <section>
      <div className="section-header">
        <h2>Instance Info</h2>
        <div className="button-group">
          {selectedVm && onDescribe && (
            <button
              type="button"
              onClick={onDescribe}
              disabled={isDescribing}
            >
              {isDescribing ? 'Describing...' : 'Describe'}
            </button>
          )}
          {hasSelection && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="secondary"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>
      {error && <Alert message={error} variant="error" />}
      {!info ? (
        <p className="muted">
          {selectedVm ? 'Click "Describe" to view instance details.' : 'Select a VM and describe it to view details.'}
        </p>
      ) : (
        <div className="card">
          <p>
            <strong>InstanceId:</strong> {info.instanceId}
          </p>
          <p>
            <strong>State:</strong> {info.state}
          </p>
          <p>
            <strong>Type:</strong> {info.instanceType}
          </p>
          <p>
            <strong>Public IP:</strong> {info.publicIp ?? '—'}
          </p>
          <p>
            <strong>Private IP:</strong> {info.privateIp ?? '—'}
          </p>
          <p>
            <strong>Region:</strong> {info.region ?? '—'}
          </p>
          <p>
            <strong>Launch Time:</strong> {info.launchTime ?? '—'}
          </p>
        </div>
      )}
    </section>
  );
}


