const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const path = require("path");

const {SQLDB} = require( path.join(__dirname, '../database/database_init.js') );
const { requireAuth, requireAdmin, requireManager } = require( path.join(__dirname, '../util/permission_handler.js') );
const message_service = require( path.join(__dirname, '../util/service_message.js') );
const mountData = require( path.join(__dirname, '../util/data_mounter.js') );

router.get('/overview', requireManager, async function(request, response) {
	try {
		await SQLDB.execute(" \
			SELECT * FROM university_location \
			INNER JOIN postcode ON postcode.postcode_code = university_location.fk_postcode", 
		[])
		.then( async([rows,fields]) => {
			response.render( 'location_overview', await mountData( request, response, { location_data: rows } ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

module.exports = router;