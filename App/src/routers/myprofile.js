const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const path = require("path");

const {SQLDB} = require( path.join(__dirname, '../database/database_init.js') );
const { requireAuth, requireAdmin, requireManager } = require( path.join(__dirname, '../util/permission_handler.js') );
const message_service = require( path.join(__dirname, '../util/service_message.js') );
const mountData = require( path.join(__dirname, '../util/data_mounter.js') );
const user = require( path.join(__dirname, '../util/user.js') );

router.get("/", requireAuth, async function( request, response ) {
	const nPersonID = await user.getUserID( request );

	if ( nPersonID == null ){
		goHome( request, response );
		return;
	}

	try {
		var [mydata, fields] = await SQLDB.execute("SELECT * FROM view_person_essential WHERE person_id = ?", [ nPersonID ]);
		var [mycourses, fields] = await SQLDB.execute("SELECT * FROM view_person_course_essential WHERE person_id = ?", [ nPersonID ]);
	
		response.render( 'my_profile', await mountData( request, response, { mydata: mydata[0], mycourses: mycourses } ) );
	}
	catch( e ){
		console.log( e );
		response.redirect("/home");
	}
})

module.exports = router;