export declare class Entity {
    static validate(data: any): Error;
    static getKey(id: number | string): any;
    static getIncompleteKey(): any;
    static getIncompleteKey(): any;
    static get(key: any): Promise;
    static delete(key: any): Promise;
    static save(entity: Entity): Promise;
    static saveMany(entity: Array<Entity>): Promise;
    static find(fields: any, cursor: any, limit: number): Promise;

    hasKey(): boolean;
}

declare interface Dependencies {
    gcds: any;
}

declare interface Options {
    kind: any;
    schema: any;
}

export declare function EntityFactory (dependencies: Dependencies, options: Options) : Entity;
