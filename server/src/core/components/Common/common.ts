import Config from '../../../resources/config';
import Logger from '../Logger';
import Ajv from 'ajv';


export default class Common {

	Config: Config;
	Logger: any;

	constructor() {
        this.Config = Config;
		this.Logger = Logger.init(Config);
    }

	async Format(str: any, args: any) {
		let i = args.length;
		while (i--) {
			str = str.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
		}
		return str;
	}

	async ValidateSchema(Schema: any, Data: any) {
		const ajv = new Ajv();
		const valid = ajv.validate(Schema, Data);
		if (!valid) {
			return {result: false, errors: ajv.errors[0]};
		}
		else {
			return {result: true, errors: null};
		}
	}
}