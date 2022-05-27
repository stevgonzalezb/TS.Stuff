import WinService from "./service";

export = {
    init(Common:Common) {
        return new WinService(Common);
    }
}