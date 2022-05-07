import Common from "./common";

export ={
	init(Config:any, Logger:any, Schemas:any){
		return new Common(Config, Logger, Schemas);
	}
}