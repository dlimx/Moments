import { SaveResponse } from '@google-cloud/datastore/build/src/request';
import { datastore } from './datastore';

export type DatastoreQueryResponse<T> = [T, any];

export const parseIDFromDatastoreResult = (datastoreResult: SaveResponse): number =>
  datastoreResult[0]!.mutationResults![0].key!.path![0].id as number;

export const parseDataFromDatastoreResult = <T>(
  datastoreResults: DatastoreQueryResponse<{ [datastore.KEY]: { id: string } }[]>,
) =>
  datastoreResults[0].map((datum) => {
    const mappedData = {
      ...datum,
      id: Number.parseInt(datum[datastore.KEY].id, 10),
    } as any;
    delete mappedData.password;
    return mappedData as T;
  });
