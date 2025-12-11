import type { InstanceInfoDto } from '../../api/api';
import { Alert } from './Alert';

interface InstanceInfoPanelProps {
  info: InstanceInfoDto | null;
  error?: string | null;
}

export function InstanceInfoPanel({ info, error }: InstanceInfoPanelProps) {
  return (
    <section>
      <h2>Instance Info</h2>
      {error && <Alert message={error} variant="error" />}
      {!info ? (
        <p className="muted">Describe an instance to view details.</p>
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


