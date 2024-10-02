const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const path = require("path");

const {SQLDB} = require( path.join(__dirname, '../database/database_init.js') );
const { requireAuth, requireAdmin, requireManager } = require( path.join(__dirname, '../util/permission_handler.js') );
const message_service = require( path.join(__dirname, '../util/service_message.js') );
const mountData = require( path.join(__dirname, '../util/data_mounter.js') );

router.get('/', requireAuth, async function(request, response) {
	try {
		await SQLDB.execute('SELECT * FROM view_course_student_amount;', [])
		.then( async([rows,fields]) => {
			response.render( 'course_overview', await mountData( request, response, { course_data: rows } ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

router.get('/show', requireAuth, async function(request, response) {
	const courseid = request.query.id;
	try {
		if ( courseid ) {
			const [course_data, _fields] = await SQLDB.execute('SELECT * FROM view_course_mark_average WHERE course = ?', [courseid]);
			

			if ( course_data.length == 0 ){	
				await message_service.setMessage( request, "info", "Sorry, no data found." );
				goHome(request, response);
				return;
			}

			const [marks_data, __fields] = await SQLDB.execute(" \
				SELECT exam.exam_nr, reached_mark, COUNT(*) as count FROM exam_result \
				JOIN exam ON exam.exam_nr = exam_result.fk_exam \
				WHERE fk_course = ? \
				GROUP BY exam.exam_nr, reached_mark \
				ORDER BY exam.exam_nr"
			,[courseid]);

			const [personal_marks, ___fields] = await SQLDB.execute("SELECT * FROM view_person_course_essential_marks WHERE person_id = ? AND course_id = ?"
			,[ request.session.userid, courseid ]);


			response.render( 'course_mark_average', await mountData( request, response, { course_data : course_data[0], mark_data: marks_data, personal_marks: personal_marks, chosen: true } ) );
		}
		else {
			await SQLDB.execute('SELECT * FROM view_course_mark_average;', [])
			.then( async([rows,fields]) => {
				response.render( 'course_mark_average', await mountData( request, response, { course_data : rows, chosen: false } ) );
			});
		}
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});


module.exports = router;