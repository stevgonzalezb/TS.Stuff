import Constants from "./constants";
import Errors from "./errors";
import Messages from "./messages";
import Ajv from 'ajv';

class Common {
	Config: any;
	Constants: any;
	Errors: any;
	Messages: any;
	ErrorFactory: any;
	Logger: any;
	Schemas: any;

	constructor(Config: any, Logger: any, Schemas: any ) {
        this.Config = Config;
		this.Constants = Constants;
		this.Errors = Errors;
		this.Messages = Messages;
		this.Logger = Logger;
		this.Schemas = Schemas;
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
export = Common;