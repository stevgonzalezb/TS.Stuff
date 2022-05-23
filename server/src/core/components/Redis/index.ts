import Redis from './queue';

export = {
    init(Common:any, Name:any){
		return new Redis(Common, Name);
	}
}