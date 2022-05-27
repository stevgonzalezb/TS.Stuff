import mssql from 'mssql';

class MSSQL {
    Common:Common;

    constructor(Common:Common){
        this.Common = Common;
    }

    async Connect (DbConfig:any, cb:any) {
        const self = this;
        self.Common.Logger.Debug('[ConnectionManager.ts].[Connect] >> Connecting to Database');
        const pool = new mssql.ConnectionPool(DbConfig, (err) => {
            if (err) {
                self.Common.Logger.Error(`[ConnectionManager.ts].[Connect] >> Error trying to connect to Database >> ${err}`);
                cb(err)
            } else {
                self.Common.Logger.Debug('ConnectionManager.js >> Connect >> Succesfully connected to Database');
                cb(null, pool);
            }
        });
    };

    async ExecuteQuery(pool:any, query:string, cb:any) {
        const self = this;
        self.Common.Logger.Debug('[ConnectionManager.ts].[ExecuteQuery] >> Successful connection to DB from query');
        pool.request().query(query)
            .then((res:any)  => {
                self.Common.Logger.Debug('[ConnectionManager.ts].[ExecuteQuery] >> Successful SQL statement', {
                    affected_Rows: res.rowsAffected[0],
                    Query: query
                });
                cb(null, res)
            }).catch((err:any) => {
                self.Common.Logger.Error(err);
                cb(err)
            })
    };

    ExecuteStoredProcedure(pool:any, spName:any, spParams:any, cb:any) {
        const self = this;
        self.Common.Logger.Debug(`[ConnectionManager.ts].[ExecuteStoredProcedure] >> Successful connection to DB from SP execution ${spName}`);
        const request = pool.request();
        // Se agregan los parámetros que requiere el SP para ejecutarse
        if (spParams.length > 0) {
            spParams.forEach((param:any) => {
                request.input(param.name, param.type, param.value)
            });
        }
        // Se ejecuta el SP
        request.execute(spName)
            .then((res:any) => {
                self.Common.Logger.Debug(`[ConnectionManager.ts].[ExecuteStoredProcedure] >> Successful SP execution: ${spName}`);
                cb(null, res)
            }).catch((err:any) => {
                cb(`[ConnectionManager.ts].[ExecuteStoredProcedure] >> ${err}`)
            })
    };
}

export = MSSQL;