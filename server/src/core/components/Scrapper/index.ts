import Scrapper from './scrapper'

export = {
    init(Common:any, Sql:any){
		return new Scrapper(Common, Sql);
	}
}