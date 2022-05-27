import Server from "./server";

export = {
	init(Common:Common) {
		return new Server(Common);
	}
}