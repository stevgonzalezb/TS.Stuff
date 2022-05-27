import MSSQL from './ConnectionManager';
export = {
    create(Common:Common){
        return new MSSQL(Common);
    }
}