import Logger from "./log";

export ={
	init(Config:Config){
		return new Logger(Config);
	}
}