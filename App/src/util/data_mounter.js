const path = require("path");
const message_service = require( path.join(__dirname, '../util/service_message.js') );
const user = require( path.join(__dirname, '../util/user.js') );

const mountData = async( req, res, _others ) => {
	var data = {
		loginstatus: await user.getLoginStatus( req ),
		userid: await user.getUserID( req ),
		message: await message_service.getMessage( req ) || 'undefined',
	};
	await message_service.removeMessage( req );

	//Object.assign( data, _others );
	data = { ...data, ..._others };
	return data;
}

module.exports = mountData;