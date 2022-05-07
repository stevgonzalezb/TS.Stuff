import Logger from "./log";

export ={
	init(Config:any){
		return new Logger(Config);
	}
}