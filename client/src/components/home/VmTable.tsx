import type { VMDto } from '../../api/api';
import { Alert } from './Alert';
import { EmptyState } from './EmptyState';

interface VmTableProps {
  vms: VMDto[];
  isFetching: boolean;
  isDeleting: boolean;
  error?: string | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

export function VmTable({
  vms,
  isFetching,
  isDeleting,
  error,
  onSelect,
  onDelete,
  onRefresh,
}: VmTableProps) {
  return (
    <section>
      <h2>VMs</h2>
      {error && <Alert message={error} variant="error" />}
      <div className="refresh-row">
        <button onClick={onRefresh} disabled={isFetching}>
          Refresh
        </button>
      </div>
      {isFetching && <p className="muted">Loading...</p>}
      {!isFetching && vms.length === 0 ? (
        <EmptyState message="No VMs found." />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>InstanceId</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Region</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vms.map((vm) => (
                <tr key={vm.id}>
                  <td>{vm.id}</td>
                  <td>{vm.vmName}</td>
                  <td>{vm.instanceId}</td>
                  <td>{vm.instanceType}</td>
                  <td>{vm.ownerUsername}</td>
                  <td>{vm.region}</td>
                  <td className="actions-cell">
                    <button onClick={() => onSelect(vm.id)} disabled={isFetching}>
                      View
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => onDelete(vm.id)}
                      disabled={isFetching || isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}


