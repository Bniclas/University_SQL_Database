const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const path = require("path");

const {SQLDB} = require( path.join(__dirname, '../database/database_init.js') );
const { requireAuth, requireAdmin, requireManager } = require( path.join(__dirname, '../util/permission_handler.js') );
const message_service = require( path.join(__dirname, '../util/service_message.js') );
const mountData = require( path.join(__dirname, '../util/data_mounter.js') );

router.get('/overview', requireManager, async function(request, response) {
	var iPage = request.query.page;
	iPage = iPage - 1;
	const limit = 25;
	const lowerLimit = iPage * limit;

	try {
		await SQLDB.execute(" \
			SELECT employee_id, degree_name, firstname, surname, email_service, department_name, location_name, salary_amount, currency_symbol FROM employee \
			JOIN person ON person.person_id = employee.fk_person \
			JOIN department_staff ON department_staff.fk_employee = employee.employee_id \
			JOIN department ON department.department_id = department_staff.fk_department \
			JOIN university_location ON university_location.location_id = department.fk_uniloc \
			LEFT JOIN job ON job.job_id = employee.fk_job \
			LEFT JOIN degree ON degree.degree_id = person.fk_degree \
			LEFT JOIN salary ON salary.salary_id = employee.fk_salary \
			LEFT JOIN currency ON currency.currency_id = salary.fk_currency ORDER BY employee_id ASC;",
		[lowerLimit])
		.then( async([rows,fields]) => {
			response.render( 'employee_overview', await mountData( request, response, { employee_data: rows, chosen: false } ) );
		});
	}
	catch (e){
		console.log( e );
		goHome(request, response);
	}
});

module.exports = router;