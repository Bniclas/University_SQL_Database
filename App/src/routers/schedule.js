const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const path = require("path");

const {SQLDB} = require( path.join(__dirname, '../database/database_init.js') );
const { requireAuth, requireAdmin, requireManager } = require( path.join(__dirname, '../util/permission_handler.js') );
const message_service = require( path.join(__dirname, '../util/service_message.js') );
const mountData = require( path.join(__dirname, '../util/data_mounter.js') );

router.get('/overview', requireAuth, async function(request, response) {
	try {
		await SQLDB.execute(" \
			SELECT module_name, room_number, floor, SUBSTRING( start_at, 1, 16 ) as start_at, SUBSTRING( end_at, 1, 16 ) as end_at, location_name, location_id FROM course_session \
			JOIN course ON course.course_id = course_session.fk_course \
			JOIN timeslot ON timeslot.slot_id = course_session.fk_timeslot \
			JOIN room ON room.room_id = course_session.fk_room \
			JOIN semester ON semester.semester_id = course.fk_semester \
			JOIN module ON module.module_id = course.fk_module \
			JOIN employee ON employee.employee_id = course.fk_prof \
			JOIN person ON person.person_id = employee.fk_person \
			JOIN university_location ON university_location.location_id = room.fk_uniloc \
			WHERE start_at > NOW();",
		[])
		.then( async([rows,fields]) => {
			response.render( 'schedule_overview', await mountData( request, response, { schedule_data: rows } ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

module.exports = router;