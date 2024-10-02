const path = require("path");
const message_service = require( path.join(__dirname, '../util/service_message.js') );

const requireAuth = async ( req, res, next ) => {
	if ( req.url === "/login" ) {
		next();
	}
	else {
		if ( !req.session.hasAuth ){
			await message_service.setMessage( req, "alert", "You are not authorized! Please login." );
			res.redirect("/login");
		}
		else {
			next();
		}
	}
}

const requireAdmin = async ( req, res, next ) => {
	if ( !req.session.isAdmin ){
		await message_service.setMessage( req, "alert", "You are not authorized! Only admins." );
		res.redirect("/home");
	}
	else {
		next();
	}
}

const requireManager = async ( req, res, next ) => {
	if ( !req.session.isManager ){
		await message_service.setMessage( req, "alert", "You are not authorized! Only managers." );
		res.redirect("/home");
	}
	else {
		next();
	}
}

module.exports = {
    requireAuth,
    requireAdmin,
    requireManager
}