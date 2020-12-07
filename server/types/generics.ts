export interface IModel<T> {
  getByID: (id: number) => Promise<T>;
  getByName: (name: string) => Promise<T>;
  getAll: () => Promise<T[]>;
  getAllByID: (ids: number[]) => Promise<T[]>;
  editAllByID: (ids: number[], payloads: T[]) => Promise<T[]>;
  create: (payload: Partial<T>) => Promise<T>;
  editByID: (id: number, payload: Partial<T>) => Promise<T>;
  deleteByID: (id: number) => Promise<void>;
}

export interface IObject {
  id?: number;
}

export interface IPaginatedData<T> {
  more: boolean;
  data: T[];
  nextToken: string;
}
