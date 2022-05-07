export = {
	type: "object",
	properties: {
		Logs: {
			type: "object",
			properties: {
				Level: { type: "string" },
				FileName: {
					type: "object",
					properties: {
						Name: { type: "string", minLength: 3 },
						DatePattern: { type: "string" }
					},
					additionalProperties: false,
					required: ["Name", "DatePattern"]
				},
				DateFormat: { type: "string" },
				MaxSize: {
					type: "object",
					properties: {
						Value: { type: "string" },
						Unit: { type: "string" }
					},
					additionalProperties: false,
					required: ["Value", "Unit"]
				},
				MaxFiles: {
					type: "object",
					properties: {
						Value: { type: "string" },
						Type: { type: "string" }
					},
					additionalProperties: false,
					required: ["Value", "Type"]
				},
				Backup: {
					type: "object",
					properties: {
						RequireBackup: { type: "boolean" },
						BackupFolderName: { type: "string" }
					},
					additionalProperties: false,
					required: ["RequireBackup", "BackupFolderName"]
				},
				ZippedLogFile: { type: "boolean" }
			},
			additionalProperties: false,
			required: ["Level", "FileName", "DateFormat", "MaxSize", "MaxFiles", "Backup", "ZippedLogFile"]
		},
		Service: {
			type: "object",
			properties: {
				Name: { type: "string" },
				Description: { type: "string" },
				Main: { type: "string" },
				NodeOptions: { type: "string" },
				Start: { type: "boolean" }
			},
			additionalProperties: false,
			required: ["Name", "Description", "Main", "NodeOptions", "Start"]
		},
		Database: {
			type: "object",
			properties: {
				user: { type: "string" },
				password: { type: "string" },
				server: { type: "string" },
				database: { type: "string" },
				port: { type: "integer" },
				connectionTimeout: { type: "integer" },
				requestTimeout: { type: "integer" }
			},
			additionalProperties: false,
			required: ["user", "password", "server", "database", "port", "connectionTimeout", "requestTimeout"]
		},
		StoredProcedures: {
			type: "object",
			properties: {
				Insertion: { type: "string" }
			},
			additionalProperties: false,
			required: ["Insertion"]
		},
		CIAWebPageUrl: { type: "string" }
	},
	additionalProperties: false
};