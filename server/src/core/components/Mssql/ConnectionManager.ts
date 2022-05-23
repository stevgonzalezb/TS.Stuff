import mssql from 'mssql';

class MSSQL {
    Common:any;

    constructor(Common:any){
        this.Common = Common;
    }

    async Connect (Config:any, cb:any) {
        const self = this;
        self.Common.Logger.Debug('ConnectionManager.js >> Connect >> Conectando a Base de datos');
        const pool = new mssql.ConnectionPool(Config, (err) => {
            if (err) {
                self.Common.Logger.Error('ConnectionManager.js >> Connect >> Error conectando a BD >> ' + err);
                cb(err)
            } else {
                self.Common.Logger.Debug('ConnectionManager.js >> Connect >> Conexión exitosa a BD');
                cb(null, pool);
            }
        });
    };

    async ExecuteQuery(pool:any, query:string, cb:any) {
        const self = this;
        self.Common.Logger.Debug('Conexión exitosa a BD desde query');
        pool.request().query(query)
            .then((res:any)  => {
                self.Common.Logger.Debug('Sentencia SQL exitosa', {
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
        self.Common.Logger.Debug('ConnectionManager.js >> ExecuteSP >> Conexión exitosa a BD desde ejecución de SP' + spName);
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
                self.Common.Logger.Debug('ConnectionManager.js >> ExecuteSP >> Ejecución de SP exitosa: ' + spName);
                cb(null, res)
            }).catch((err:any) => {
                cb('ConnectionManager.js >> ExecuteSP >> ' + err)
            })
    };
}

export = MSSQL;