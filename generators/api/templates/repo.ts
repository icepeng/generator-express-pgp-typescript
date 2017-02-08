import { IDatabase, IMain } from 'pg-promise';

export interface <%= interfaceName %> {
    <%= properties %>
}

export class <%= interfaceName %>Repo {

    db: IDatabase<any>;
    pgp: IMain;

    constructor(db: IDatabase<any>, pgp: IMain) {
        this.db = db;
        this.pgp = pgp;
    }

    empty = () =>
        this.db.none('TRUNCATE TABLE "<%= modelName %>" CASCADE');

    add = (params: <%= interfaceName %>): Promise<string> =>
        this.db.one('INSERT INTO "<%= modelName %>"(<%= columns %>) '
            + 'VALUES(<%= values %>) '
            + 'RETURNING id', params, (<%= modelName %>: <%= interfaceName %>) => <%= modelName %>.id)

    remove = (id: string): Promise<any> =>
        this.db.result('DELETE FROM "<%= modelName %>" WHERE id = $1', id, (r: any) => r.rowCount);

    edit = (id: string, params: <%= interfaceName %>): Promise<any> => {
        params.id = id;
        return this.db.result('UPDATE <%= modelName %> '
            + 'SET (<%= columns %>) = '
            + '(<%= values %>) '
            + 'WHERE id = ${id}' , params, (r: any) => r.rowCount);
    }

    find = (id: string): Promise<<%= interfaceName %>> =>
        this.db.oneOrNone('SELECT * FROM "<%= modelName %>" WHERE id = $1', id);

    all = (): Promise<<%= interfaceName %>[]> =>
        this.db.any('SELECT * FROM "<%= modelName %>"');

    total = (): Promise<number> =>
        this.db.one('SELECT count(*) FROM "<%= modelName %>"', [], (a: any) => +a.count);
}
