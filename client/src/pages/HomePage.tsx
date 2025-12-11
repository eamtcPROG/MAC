import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { VMDto, InstanceInfoDto, CreateVmRequest } from "../api/api";
import {
  createVm,
  listVms,
  getVmById,
  describeInstanceByEntityId,
  deleteVm,
} from "../api/api";
import { VmForm } from "../components/home/VmForm";
import { VmTable } from "../components/home/VmTable";
import { VmDetails } from "../components/home/VmDetails";
import { InstanceInfoPanel } from "../components/home/InstanceInfoPanel";
import { PaginationControls } from "../components/home/PaginationControls";

const initialForm: CreateVmRequest = {
  instanceType: "",
  ownerUsername: "",
  vmName: "",
  region: "",
  minCount: 1,
  maxCount: 1,
};
const onPage = 10;

type HomeState = {
  form: CreateVmRequest;
  vms: VMDto[];
  selectedVm: VMDto | null;
  instanceInfo: InstanceInfoDto | null;
  isFetchingList: boolean;
  isCreating: boolean;
  isDescribing: boolean;
  isDeleting: boolean;
  formError: string | null;
  listError: string | null;
  detailsError: string | null;
  describeError: string | null;
  page: number;
  totalPages: number;
};

type Action =
  | { type: "updateFormField"; name: keyof CreateVmRequest; value: unknown }
  | { type: "resetForm" }
  | { type: "setPage"; payload: number }
  | { type: "loadListStart" }
  | {
      type: "loadListSuccess";
      payload: { vms: VMDto[]; page: number; totalPages: number };
    }
  | { type: "loadListError"; payload: string }
  | { type: "createStart" }
  | { type: "createSuccess" }
  | { type: "createError"; payload: string }
  | { type: "selectStart" }
  | { type: "selectSuccess"; payload: VMDto }
  | { type: "selectError"; payload: string }
  | { type: "describeStart" }
  | { type: "describeSuccess"; payload: InstanceInfoDto }
  | { type: "describeError"; payload: string }
  | { type: "deleteStart" }
  | { type: "deleteSuccess"; payload: { deletedId: number } }
  | { type: "deleteError"; payload: string };

const initialState: HomeState = {
  form: initialForm,
  vms: [],
  selectedVm: null,
  instanceInfo: null,
  isFetchingList: false,
  isCreating: false,
  isDescribing: false,
  isDeleting: false,
  formError: null,
  listError: null,
  detailsError: null,
  describeError: null,
  page: 1,
  totalPages: 1,
};

function reducer(state: HomeState, action: Action): HomeState {
  switch (action.type) {
    case "updateFormField": {
      const { name, value } = action;
      const parsedValue =
        name === "minCount" || name === "maxCount"
          ? value === "" || value === null
            ? undefined
            : Number(value)
          : value;
      return {
        ...state,
        form: {
          ...state.form,
          [name]: parsedValue as CreateVmRequest[keyof CreateVmRequest],
        },
      };
    }
    case "resetForm":
      return { ...state, form: initialForm };
    case "setPage":
      return { ...state, page: action.payload };
    case "loadListStart":
      return { ...state, isFetchingList: true, listError: null };
    case "loadListSuccess":
      return {
        ...state,
        isFetchingList: false,
        vms: action.payload.vms,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
      };
    case "loadListError":
      return { ...state, isFetchingList: false, listError: action.payload };
    case "createStart":
      return { ...state, isCreating: true, formError: null };
    case "createSuccess":
      return { ...state, isCreating: false, form: initialForm };
    case "createError":
      return { ...state, isCreating: false, formError: action.payload };
    case "selectStart":
      return { ...state, detailsError: null };
    case "selectSuccess":
      return { ...state, selectedVm: action.payload, instanceInfo: null };
    case "selectError":
      return { ...state, detailsError: action.payload };
    case "describeStart":
      return { ...state, isDescribing: true, describeError: null };
    case "describeSuccess":
      return { ...state, isDescribing: false, instanceInfo: action.payload };
    case "describeError":
      return { ...state, isDescribing: false, describeError: action.payload };
    case "deleteStart":
      return { ...state, isDeleting: true, listError: null };
    case "deleteSuccess": {
      const shouldClear = state.selectedVm?.id === action.payload.deletedId;
      return {
        ...state,
        isDeleting: false,
        selectedVm: shouldClear ? null : state.selectedVm,
        instanceInfo: shouldClear ? null : state.instanceInfo,
      };
    }
    case "deleteError":
      return { ...state, isDeleting: false, listError: action.payload };
    default:
      return state;
  }
}

const HomePage: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const canSubmit = useMemo(() => {
    return (
      state.form.instanceType.trim() !== "" &&
      state.form.ownerUsername.trim() !== "" &&
      state.form.vmName.trim() !== ""
    );
  }, [state.form.instanceType, state.form.ownerUsername, state.form.vmName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: "updateFormField",
      name: name as keyof CreateVmRequest,
      value,
    });
  };

  const loadVms = useCallback(
    async () => {
      try {
        dispatch({ type: "loadListStart" });
        const res = await listVms(state.page, onPage);
        dispatch({
          type: "loadListSuccess",
          payload: {
            vms: res.objects,
            page: state.page,
            totalPages: res.totalpages ?? 1,
          },
        });
      } catch (err) {
        dispatch({
          type: "loadListError",
          payload: getErrorMessage(err, "Failed to load VMs"),
        });
      }
    },
    [state.page]
  );

  useEffect(() => {
    loadVms();
  }, [loadVms]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      dispatch({ type: "createStart" });
      await createVm({
        ...state.form,
        region: state.form.region || undefined,
      });
      dispatch({ type: "createSuccess" });
      if (state.page !== 1) {
        dispatch({ type: "setPage", payload: 1 });
      } else {
        await loadVms();
      }
    } catch (err) {
      dispatch({
        type: "createError",
        payload: getErrorMessage(err, "Failed to create VM"),
      });
    }
  };

  const handleSelect = async (id: number) => {
    try {
      dispatch({ type: "selectStart" });
      const vm = await getVmById(id);
      dispatch({ type: "selectSuccess", payload: vm });
    } catch (err) {
      dispatch({
        type: "selectError",
        payload: getErrorMessage(err, "Failed to load VM"),
      });
    }
  };

  const handleDescribe = async (id: number) => {
    try {
      if (state.isDescribing) return; // debounce describe
      dispatch({ type: "describeStart" });
      const info = await describeInstanceByEntityId(id);
      dispatch({ type: "describeSuccess", payload: info });
    } catch (err) {
      dispatch({
        type: "describeError",
        payload: getErrorMessage(err, "Failed to describe VM"),
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (state.isDeleting) return; // debounce delete
      dispatch({ type: "deleteStart" });
      await deleteVm(id);
      dispatch({ type: "deleteSuccess", payload: { deletedId: id } });
      if (state.page !== 1) {
        dispatch({ type: "setPage", payload: 1 });
      } else {
        await loadVms();
      }
    } catch (err) {
      dispatch({
        type: "deleteError",
        payload: getErrorMessage(err, "Failed to delete VM"),
      });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>VM Dashboard</h1>
          <p className="muted small">Create, inspect, and manage VMs quickly.</p>
        </div>
      </div>

      <div className="content-grid">
        <div className="stack">
          <VmForm
            form={state.form}
            canSubmit={canSubmit}
            isSubmitting={state.isCreating}
            error={state.formError}
            onChange={handleChange}
            onSubmit={handleCreate}
          />

          <VmTable
            vms={state.vms}
            isFetching={state.isFetchingList}
            isDescribing={state.isDescribing}
            isDeleting={state.isDeleting}
            error={state.listError}
            onSelect={handleSelect}
            onDescribe={handleDescribe}
            onDelete={handleDelete}
            onRefresh={() => {
              if (state.page !== 1) {
                dispatch({ type: "setPage", payload: 1 });
              } else {
                loadVms();
              }
            }}
          />

          <PaginationControls
            page={state.page}
            totalPages={state.totalPages}
            disabled={state.isFetchingList}
            onPrev={() =>
              dispatch({
                type: "setPage",
                payload: Math.max(1, state.page - 1),
              })
            }
            onNext={() => dispatch({ type: "setPage", payload: state.page + 1 })}
          />
        </div>

        <div className="stack">
          <VmDetails vm={state.selectedVm} error={state.detailsError} />

          <InstanceInfoPanel
            info={state.instanceInfo}
            error={state.describeError}
          />
        </div>
      </div>
    </div>
  );
};

export { HomePage };

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    if (err.message.includes("VITE_API_URL is not set")) {
      return "API URL is not configured. Set VITE_API_URL in your client .env.";
    }
    return err.message;
  }
  return fallback;
}
