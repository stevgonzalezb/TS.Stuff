import WinService from "./service";

export = {
    init(Common:any) {
        return new WinService(Common);
    }
}