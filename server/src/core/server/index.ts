import Server from "./server";

export = {
	init(Common:any) {
		return new Server(Common);
	}
}