export interface IModel<T> {
  getByID: (id: number) => Promise<T>;
  getAll: () => Promise<T[]>;
  create: (payload: Partial<T>) => Promise<T>;
  editByID: (id: number, payload: Partial<T>) => Promise<T>;
  deleteByID: (id: number) => Promise<void>;
}

export interface IObject {
  id?: number;
}
