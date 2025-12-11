import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL is not set');
}
// Shared DTOs (mirroring backend)
export interface CreateVmRequest {
  instanceType: string;
  ownerUsername: string;
  vmName: string;
  region?: string;
  minCount?: number;
  maxCount?: number;
}

export interface VMDto {
  id: number;
  instanceId: string;
  instanceType: string;
  vmName: string;
  ownerUsername: string;
  region: string;
  publicIp?: string;
  privateIp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstanceInfoDto {
  instanceId: string;
  state: string;
  publicIp?: string;
  privateIp?: string;
  instanceType: string;
  launchTime?: string;
  region?: string;
}

export interface ApiMessage {
  code?: string;
  field?: string;
  message: string;
}

export interface ResultObjectDto<T> {
  error: boolean;
  htmlcode: number;
  object: T | null;
  messages: ApiMessage[];
}

export interface ResultListDto<T> {
  error: boolean;
  htmlcode: number;
  objects: T[];
  messages: ApiMessage[];
  total: number;
  totalpages: number;
}

const http = axios.create({
  baseURL: API_URL,
});

function unwrapObject<T>(res: ResultObjectDto<T>): T {
  if (res.error || !res.object) {
    throw new Error(buildApiError(res.messages, 'Unexpected API error'));
  }
  return res.object;
}

function unwrapList<T>(res: ResultListDto<T>): ResultListDto<T> {
  if (res.error) {
    throw new Error(buildApiError(res.messages, 'Unexpected API error'));
  }
  return res;
}

function buildApiError(messages: ApiMessage[] | undefined, fallback: string) {
  if (messages && messages.length > 0) {
    const first = messages[0];
    const parts = [first.message];
    if (first.field) parts.push(`field: ${first.field}`);
    if (first.code) parts.push(`code: ${first.code}`);
    return parts.filter(Boolean).join(' | ');
  }
  return fallback;
}

export async function createVm(payload: CreateVmRequest): Promise<VMDto> {
  const { data } = await http.post<ResultObjectDto<VMDto>>('/', payload);
  return unwrapObject(data);
}

export async function listVms(
  page?: number,
  onPage?: number,
): Promise<ResultListDto<VMDto>> {
  const { data } = await http.get<ResultListDto<VMDto>>('/', {
    params: { page, onpage: onPage },
  });
  return unwrapList(data);
}

export async function getVmById(id: number): Promise<VMDto> {
  const { data } = await http.get<ResultObjectDto<VMDto>>(`/${id}`);
  return unwrapObject(data);
}

export async function describeInstanceByEntityId(
  id: number,
): Promise<InstanceInfoDto> {
  const { data } =
    await http.get<ResultObjectDto<InstanceInfoDto>>(`/instances/${id}`);
  return unwrapObject(data);
}

export async function deleteVm(id: number): Promise<VMDto> {
  const { data } = await http.delete<ResultObjectDto<VMDto>>(
    `/instances/${id}`,
  );
  return unwrapObject(data);
}
