const enum HttpCodes {
    OK = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	ERROR = 500
}

const enum LogLevels {
	ERROR = 0,
	INFO = 1,
	DEBUG = 2
}


const enum LogMessages {

	// Error
	INVALID_TRANSACTION = 'Ilegal transaction format.',
	INVALID_TRANSACTION_DESCRIPTION = 'Transaction failed Schema Validation. {0},{1}',

	// Warning
	APPROOT_NOTFOUND = 'No AppRoot defined in main class. Logger won\'t log to file.',
	SERVICE_ACTION_UNKNOWN = 'Flag value <{0}> not recognized. Please use Install or Uninstall.',
	SERVICE_FLAG_UNKNOWN = 'Flags [{0}] not recognized. Available flags are -s or --service.',

	// Success
	FILE_TRANSPORT = 'Logger using file transport created succesfully.',
	SERVICE_CREATED = 'Service {0} installed correctly. Service Exists: {1}.',
	SERVICE_REMOVED = 'Service {0} uninstalled correctly. Service Exists: {1}.'
}