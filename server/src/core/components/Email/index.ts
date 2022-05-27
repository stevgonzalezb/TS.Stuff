import Email from './mail';

export = {
    init(Common:Common){
		return new Email(Common);
	}
}