import type { VMDto } from '../../api/api';
import { Alert } from './Alert';

interface VmDetailsProps {
  vm: VMDto | null;
  error?: string | null;
}

export function VmDetails({ vm, error }: VmDetailsProps) {
  return (
    <section>
      <h2>Selected VM</h2>
      {error && <Alert message={error} variant="error" />}
      {!vm ? (
        <p className="muted">Select a VM to view details.</p>
      ) : (
        <div className="card">
          <p>
            <strong>ID:</strong> {vm.id}
          </p>
          <p>
            <strong>Name:</strong> {vm.vmName}
          </p>
          <p>
            <strong>InstanceId:</strong> {vm.instanceId}
          </p>
          <p>
            <strong>Type:</strong> {vm.instanceType}
          </p>
          <p>
            <strong>Owner:</strong> {vm.ownerUsername}
          </p>
          <p>
            <strong>Region:</strong> {vm.region}
          </p>
          <p>
            <strong>Public IP:</strong> {vm.publicIp ?? '—'}
          </p>
          <p>
            <strong>Private IP:</strong> {vm.privateIp ?? '—'}
          </p>
          <p>
            <strong>Created:</strong> {vm.createdAt}
          </p>
          <p>
            <strong>Updated:</strong> {vm.updatedAt}
          </p>
        </div>
      )}
    </section>
  );
}


