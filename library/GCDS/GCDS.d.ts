export declare class GCDS {
    save(entity: any): Promise;
    get(key: any): Promise;
    query(): Promise;

    getIncompleteKey(kind: string): any;
    getKey(path: Array<string | number>): any;
    getCompleteKey (entityName: string, id: number): any;
    allocateIds(incompleteKey: any, n: number): Promise;
}
