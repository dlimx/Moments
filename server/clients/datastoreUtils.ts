import { SaveResponse } from '@google-cloud/datastore/build/src/request';
import { datastore } from './datastore';
import { parseBase10Int } from '../utils/utils';

export type DatastoreQueryResponse<T> = [T, any];

export const parseIDFromDatastoreResult = (datastoreResult: SaveResponse): number =>
  parseBase10Int(datastoreResult[0]!.mutationResults![0].key!.path![0].id as string);

export const parseDataFromDatastoreResult = <T>(
  datastoreResults: DatastoreQueryResponse<{ [datastore.KEY]: { id: string } }[]>,
) =>
  (datastoreResults[0].map((datum) => ({
    ...datum,
    id: parseBase10Int(datum[datastore.KEY].id),
  })) as unknown) as T[];
