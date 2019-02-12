// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	host : 'http://localhost:3000/',
	commonapihost: 'http://localhost:3001/',
	mastersapihost: 'http://localhost:3002/',
	productapihost: 'http://localhost:3003/',
	projectapihost: 'http://localhost:3004/',
	/*commonapihost: 'https://dad6d64qd6.execute-api.us-east-1.amazonaws.com/dev/',
	  mastersapihost: 'https://7op2npraz4.execute-api.us-east-1.amazonaws.com/dev/',
	  productapihost: 'https://5ouym387z1.execute-api.us-east-1.amazonaws.com/dev/',
	  projectapihost: 'https://n7w7ajamv7.execute-api.us-east-1.amazonaws.com/dev/',*/
	apiversion  : 'api/v1/'
};
