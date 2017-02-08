import { IMain, IDatabase } from 'pg-promise';
import * as pgPromise from 'pg-promise';

// import repos here

import { pgConfig } from '../config';

export interface IExtensions {
    // declare repos here
}

let pgp: IMain;

const options = {
    extend: (obj: any) => {
        // create repos here
    }
};


pgp = pgPromise(options);

export const Model = <IDatabase<IExtensions>&IExtensions>pgp(pgConfig);

// export interfaces here
