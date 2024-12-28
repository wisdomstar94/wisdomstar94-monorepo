import { IUseIndexeddbManager } from '@wisdomstar94/react-indexeddb-manager';

const getDefineSchemas = <DBNAME, STORENAME>(defineSchemas: IUseIndexeddbManager.DefineSchemas<DBNAME, STORENAME>) =>
  defineSchemas;

export const defineSchemas = getDefineSchemas([
  {
    dbName: 'blob-url-cache-database' as const,
    version: 1,
    defineStores: [
      {
        storeName: 'blob-url-cache-list' as const,
        storekeyPath: 'key',
        isIfExistDeleteThenCreate: false,
        storeIndexItems: [{ indexName: `key_unique`, keyPath: `key`, options: { unique: true } }],
      },
    ],
  },
]);

const _getDbVersion = <DBNAME, STORENAME>(defineSchemas: IUseIndexeddbManager.DefineSchemas<DBNAME, STORENAME>) => {
  return (dbName: DBNAME) => defineSchemas.find((x) => x.dbName === dbName)?.version ?? 1;
};

export const getDbVersion = _getDbVersion(defineSchemas);
