const config = require("./database_config.js");
const bcrypt = require("bcrypt");
const SQLDB = config.SQLDB;



async function InitDatabase(){

	try {
		if( process.env.TEST_ACTIVE == "true" ) {
			
		}
	}
	catch( e ) {

	}

}

module.exports = { InitDatabase, SQLDB }