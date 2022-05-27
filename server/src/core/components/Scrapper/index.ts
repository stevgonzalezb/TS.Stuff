import Scrapper from './scrapper'

export = {
    init(Common:Common, Sql:any){
		return new Scrapper(Common, Sql);
	}
}