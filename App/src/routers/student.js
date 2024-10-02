const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const path = require("path");

const {SQLDB} = require( path.join(__dirname, '../database/database_init.js') );
const { requireAuth, requireAdmin, requireManager } = require( path.join(__dirname, '../util/permission_handler.js') );
const message_service = require( path.join(__dirname, '../util/service_message.js') );
const mountData = require( path.join(__dirname, '../util/data_mounter.js') );

router.get('/', requireManager, async function(request, response) {
	var page = request.query.page;
	page = page - 1;
	const limit = 25;
	const lowerLimit = page * limit;

	try {
		await SQLDB.execute("SELECT * FROM view_student_information WHERE matric_number > ? ORDER BY matric_number ASC LIMIT 25;", [lowerLimit])
		.then( async([rows,fields]) => {
			response.render( 'student_overview', await mountData( request, response, {student_data: rows} ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

router.post('/', requireManager, [
		check('search').escape(),
	], async function( request, response ) {
	const sSearchParam = "%" + request.body.search + "%";
	try {
		await SQLDB.execute("SELECT * FROM view_student_information WHERE private_email LIKE ? OR service_email LIKE ? OR name LIKE ? OR address LIKE ? OR birthdate LIKE ? LIMIT 100;", [ sSearchParam, sSearchParam, sSearchParam, sSearchParam, sSearchParam])
		.then( async([rows,fields]) => {
			response.render( 'student_overview', await mountData( request, response, {student_data: rows} ) );
		});
	}
	catch( e ){
		console.log( e );
		response.redirect("/student_overview");
	}
});

module.exports = router;