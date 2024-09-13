DROP DATABASE IF EXISTS university;

CREATE DATABASE university;

USE university;

CREATE TABLE IF NOT EXISTS gender (
	gender NVARCHAR(3),
	gender_name NVARCHAR( 30 ),
	PRIMARY KEY( gender )
);

CREATE TABLE IF NOT EXISTS semester (
	semester_id MEDIUMINT UNSIGNED AUTO_INCREMENT,
	semester_typ ENUM( "WS", "SS" ) NOT NULL,
	semester_start DATE NOT NULL,
	semester_end DATE NOT NULL,
	PRIMARY KEY ( semester_id ),
	CONSTRAINT check_dates CHECK( semester_start < semester_end )
);

CREATE TABLE IF NOT EXISTS postcode (
	postcode_code NVARCHAR( 5 ),
	postcode_city NVARCHAR( 60 ) UNIQUE NOT NULL,
	PRIMARY KEY ( postcode_code )
);

CREATE TABLE IF NOT EXISTS university_location (
	location_id INT UNSIGNED AUTO_INCREMENT,
	location_name NVARCHAR( 100 ) NOT NULL,
	street NVARCHAR( 60 ) NOT NULL,
	fk_postcode NVARCHAR(5) NOT NULL,
	PRIMARY KEY( location_id ),
	FOREIGN KEY ( fk_postcode ) REFERENCES postcode( postcode_code )
);

CREATE TABLE IF NOT EXISTS room (
	room_id INT UNSIGNED AUTO_INCREMENT,
	room_number INT UNSIGNED NOT NULL,
	floor TINYINT UNSIGNED NOT NULL,
	fk_uniloc INT UNSIGNED NOT NULL,
	PRIMARY KEY (room_id),
	FOREIGN KEY (fk_uniloc) REFERENCES university_location(location_id)
);

CREATE TABLE IF NOT EXISTS timeslot (
	slot_id SMALLINT UNSIGNED AUTO_INCREMENT,
	start_at DATETIME NOT NULL,
	end_at DATETIME NOT NULL,
	PRIMARY KEY( slot_id ),
	CONSTRAINT check_time CHECK( start_at < end_at )
);

CREATE TABLE IF NOT EXISTS department (
	department_id INT UNSIGNED AUTO_INCREMENT,
	department_name NVARCHAR( 100 ) NOT NULL,
	fk_uniloc INT UNSIGNED NOT NULL,
	PRIMARY KEY ( department_id ),
	FOREIGN KEY ( fk_uniloc ) REFERENCES university_location( location_id )
);

CREATE TABLE IF NOT EXISTS job (
	job_id SMALLINT UNSIGNED AUTO_INCREMENT,
	job_name NVARCHAR( 100 ) UNIQUE NOT NULL,
	PRIMARY KEY ( job_id )
);

CREATE TABLE IF NOT EXISTS currency (
	currency_id INT UNSIGNED AUTO_INCREMENT,
	currency_symbol NVARCHAR(5) UNIQUE NOT NULL,
	currency_name NVARCHAR(20) UNIQUE NOT NULL,
	PRIMARY KEY (currency_id)
);

CREATE TABLE IF NOT EXISTS salary (
	salary_id INT UNSIGNED AUTO_INCREMENT,
	salary_amount INT UNSIGNED NOT NULL,
	fk_currency INT UNSIGNED NOT NULL,
	PRIMARY KEY ( salary_id ),
	FOREIGN KEY ( fk_currency ) REFERENCES currency( currency_id )
);

CREATE TABLE IF NOT EXISTS degree (
	degree_id INT UNSIGNED AUTO_INCREMENT,
	degree_name NVARCHAR( 30 ) UNIQUE NOT NULL,
	PRIMARY KEY ( degree_id )
);

CREATE TABLE IF NOT EXISTS person (
	person_id INT UNSIGNED AUTO_INCREMENT,
	gender NVARCHAR(3),
	email_private NVARCHAR( 60 ) UNIQUE NOT NULL,
	email_service NVARCHAR( 60 ) UNIQUE NOT NULL,
	password NVARCHAR( 255 ),
	firstname NVARCHAR(60) NOT NULL,
	surname NVARCHAR(60) NOT NULL,
	birthdate DATE NOT NULL,
	postcode NVARCHAR(5) NOT NULL,
	location NVARCHAR(50) NOT NULL,
	street NVARCHAR(60) NOT NULL,
	fk_degree INT UNSIGNED,
	PRIMARY KEY ( person_id ),
	FOREIGN KEY ( fk_degree ) REFERENCES degree( degree_id )
);

CREATE TABLE IF NOT EXISTS employee (
	employee_id INT UNSIGNED AUTO_INCREMENT,
	fk_person INT UNSIGNED UNIQUE NOT NULL,
	fk_job SMALLINT UNSIGNED NOT NULL,
	fk_salary INT UNSIGNED NOT NULL,
	PRIMARY KEY ( employee_id ),
	FOREIGN KEY ( fk_person ) REFERENCES person( person_id ),
	FOREIGN KEY ( fk_job ) REFERENCES job( job_id ),
	FOREIGN KEY ( fk_salary ) REFERENCES salary( salary_id )
);

CREATE TABLE IF NOT EXISTS department_staff (
	fk_employee INT UNSIGNED NOT NULL,
	fk_department INT UNSIGNED NOT NULL,
	date_from DATE NOT NULL,
	date_to DATE,
	FOREIGN KEY ( fk_employee ) REFERENCES employee( employee_id ),
	FOREIGN KEY ( fk_department ) REFERENCES department( department_id ),
    CONSTRAINT interval_check CHECK( date_from < date_to )
);

CREATE TABLE IF NOT EXISTS discipline (
	discipline_id INT UNSIGNED AUTO_INCREMENT,
	discipline_name NVARCHAR( 60 ) NOT NULL,
	discipline_semesters ENUM ( "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14" ) NOT NULL,
	fk_prof INT UNSIGNED NOT NULL,
	fk_degree INT UNSIGNED NOT NULL,
	PRIMARY KEY ( discipline_id),
	FOREIGN KEY ( fk_prof ) REFERENCES employee( employee_id ),
	FOREIGN KEY ( fk_degree ) REFERENCES degree( degree_id )
);

CREATE TABLE IF NOT EXISTS student (
	mat_id INT UNSIGNED AUTO_INCREMENT,
	fk_person INT UNSIGNED UNIQUE NOT NULL,
	PRIMARY KEY ( mat_id ),
	FOREIGN KEY ( fk_person ) REFERENCES person( person_id )
);

CREATE TABLE IF NOT EXISTS student_discipline (
	fk_matid INT UNSIGNED NOT NULL,
	fk_discipline INT UNSIGNED NOT NULL,
	semester_start MEDIUMINT UNSIGNED NOT NULL,
	semester_end MEDIUMINT UNSIGNED,
	FOREIGN KEY ( fk_matid ) REFERENCES student( mat_id ),
	FOREIGN KEY ( fk_discipline ) REFERENCES discipline( discipline_id ),
	FOREIGN KEY ( semester_start ) REFERENCES semester( semester_id ),
	FOREIGN KEY ( semester_end ) REFERENCES semester( semester_id )
);

CREATE TABLE IF NOT EXISTS immatriculation (
	fk_matid INT UNSIGNED NOT NULL,
	immatric_date DATE NOT NULL,
	examtric_date DATE,
	FOREIGN KEY (fk_matid) REFERENCES student( mat_id ),
	CONSTRAINT check_date CHECK( immatric_date < examtric_date )
);

CREATE TABLE IF NOT EXISTS module (
	module_id INT UNSIGNED AUTO_INCREMENT,
	module_name NVARCHAR( 100 ) UNIQUE NOT NULL,
	module_ects TINYINT UNSIGNED NOT NULL,
	fk_moduleleader INT UNSIGNED NOT NULL,
	PRIMARY KEY (module_id),
	FOREIGN KEY ( fk_moduleleader ) REFERENCES employee( employee_id )
);

CREATE TABLE IF NOT EXISTS course (
	course_id INT UNSIGNED AUTO_INCREMENT,
	fk_module INT UNSIGNED NOT NULL,
	fk_semester MEDIUMINT UNSIGNED,
	fk_prof INT UNSIGNED NOT NULL,
	PRIMARY KEY ( course_id ),
	FOREIGN KEY ( fk_module ) REFERENCES module( module_id ),
	FOREIGN KEY ( fk_semester ) REFERENCES semester( semester_id ),
	FOREIGN KEY ( fk_prof ) REFERENCES employee( employee_id )
);

CREATE TABLE IF NOT EXISTS course_session (
	fk_course INT UNSIGNED NOT NULL,
	fk_timeslot SMALLINT UNSIGNED NOT NULL,
	fk_room INT UNSIGNED NOT NULL,
	FOREIGN KEY ( fk_course ) REFERENCES course( course_id ),
	FOREIGN KEY ( fk_timeslot ) REFERENCES timeslot( slot_id ),
	FOREIGN KEY ( fk_room ) REFERENCES room( room_id )
);

CREATE TABLE IF NOT EXISTS student_course (
	fk_course INT UNSIGNED NOT NULL,
	fk_matid INT UNSIGNED NOT NULL,
	FOREIGN KEY ( fk_course ) REFERENCES course( course_id ),
	FOREIGN KEY ( fk_matid ) REFERENCES student( mat_id )
);

CREATE TABLE IF NOT EXISTS exam (
	exam_nr INT UNSIGNED AUTO_INCREMENT,
	fk_course INT UNSIGNED NOT NULL,
	logon_date DATETIME NOT NULL,
	logout_date DATETIME NOT NULL,
	max_points TINYINT UNSIGNED,
	fk_room INT UNSIGNED,
	PRIMARY KEY ( exam_nr ),
	FOREIGN KEY ( fk_course ) REFERENCES course ( course_id ),
	FOREIGN KEY ( fk_room ) REFERENCES room ( room_id )
);

CREATE TABLE IF NOT EXISTS exam_result (
	fk_exam INT UNSIGNED NOT NULL,
	fk_matid INT UNSIGNED NOT NULL,
	reached_points TINYINT UNSIGNED,
	reached_mark DOUBLE(2,1),
	FOREIGN KEY ( fk_exam ) REFERENCES exam( exam_nr ),
	FOREIGN KEY ( fk_matid ) REFERENCES student( mat_id ),
	CONSTRAINT check_mark CHECK( reached_mark >= 1.0 AND reached_mark <= 5.0 )
);

CREATE TABLE IF NOT EXISTS student_exam_attempt (
	fk_exam INT UNSIGNED NOT NULL,
	fk_matid INT UNSIGNED NOT NULL, 
	attempt ENUM( "1", "2", "3" ) NOT NULL,
	FOREIGN KEY ( fk_exam ) REFERENCES exam( exam_nr ),
	FOREIGN KEY ( fk_matid ) REFERENCES student( mat_id )
);