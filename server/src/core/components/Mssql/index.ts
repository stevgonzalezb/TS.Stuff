import MSSQL from './ConnectionManager';
export = {
    create(Common:any){
        return new MSSQL(Common);
    }
}