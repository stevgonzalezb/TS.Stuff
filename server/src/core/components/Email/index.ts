import Email from './mail';

export = {
    init(Common:any){
		return new Email(Common);
	}
}