DROP DATABASE IF EXISTS university;

CREATE DATABASE university;

USE university;

CREATE TABLE IF NOT EXISTS gender (
	gender NVARCHAR(3),
	gender_name NVARCHAR( 30 ),
	PRIMARY KEY( gender )
);

CREATE TABLE IF NOT EXISTS semester(
	semester_id BIGINT UNSIGNED AUTO_INCREMENT,
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

CREATE TABLE IF NOT EXISTS university_locations (
	location_id BIGINT UNSIGNED AUTO_INCREMENT,
	location_name NVARCHAR( 100 ) NOT NULL,
	street NVARCHAR( 60 ) NOT NULL,
	fk_postcode NVARCHAR(5) NOT NULL,
	PRIMARY KEY( location_id ),
	FOREIGN KEY ( fk_postcode ) REFERENCES postcode( postcode_code )
);

CREATE TABLE IF NOT EXISTS room (
	room_id BIGINT UNSIGNED AUTO_INCREMENT,
	room_number BIGINT UNSIGNED NOT NULL,
	floor TINYINT UNSIGNED NOT NULL,
	fk_uniloc BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (room_id),
	FOREIGN KEY (fk_uniloc) REFERENCES university_locations(location_id)
);

CREATE TABLE IF NOT EXISTS timeslot (
	slot_id BIGINT UNSIGNED AUTO_INCREMENT,
	start_at DATETIME NOT NULL,
	end_at DATETIME NOT NULL,
	PRIMARY KEY( slot_id ),
	CONSTRAINT check_time CHECK( start_at < end_at )
);

CREATE TABLE IF NOT EXISTS department (
	department_id BIGINT UNSIGNED AUTO_INCREMENT,
	department_name NVARCHAR( 100 ) NOT NULL,
	fk_uniloc BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY ( department_id ),
	FOREIGN KEY ( fk_uniloc ) REFERENCES university_locations( location_id )
);

CREATE TABLE IF NOT EXISTS job (
	job_id BIGINT UNSIGNED AUTO_INCREMENT,
	job_name NVARCHAR( 100 ) UNIQUE NOT NULL,
	PRIMARY KEY ( job_id )
);

CREATE TABLE IF NOT EXISTS currency (
	currency_id BIGINT UNSIGNED AUTO_INCREMENT,
	currency_symbol NVARCHAR(5) UNIQUE NOT NULL,
	currency_name NVARCHAR(20) UNIQUE NOT NULL,
	PRIMARY KEY (currency_id)
);

CREATE TABLE IF NOT EXISTS salary (
	salary_id BIGINT UNSIGNED AUTO_INCREMENT,
	salary_amount INT UNSIGNED NOT NULL,
	fk_currency BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY ( salary_id ),
	FOREIGN KEY ( fk_currency ) REFERENCES currency( currency_id )
);

CREATE TABLE IF NOT EXISTS degree (
	degree_id BIGINT UNSIGNED AUTO_INCREMENT,
	degree_name NVARCHAR( 30 ) UNIQUE NOT NULL,
	PRIMARY KEY ( degree_id )
);

CREATE TABLE IF NOT EXISTS person (
	person_id BIGINT UNSIGNED AUTO_INCREMENT,
	gender NVARCHAR(3) NOT NULL,
	email NVARCHAR( 60 ) UNIQUE NOT NULL,
	password NVARCHAR( 255 ),
	firstname NVARCHAR(60) NOT NULL,
	surname NVARCHAR(60) NOT NULL,
	birthdate DATE NOT NULL,
	postcode NVARCHAR(5) NOT NULL,
	location NVARCHAR(50) NOT NULL,
	street NVARCHAR(60) NOT NULL,
	fk_degree BIGINT UNSIGNED,
	PRIMARY KEY ( person_id ),
	FOREIGN KEY ( fk_degree ) REFERENCES degree( degree_id )
);

CREATE TABLE IF NOT EXISTS employee (
	employee_id BIGINT UNSIGNED AUTO_INCREMENT,
	fk_person BIGINT UNSIGNED UNIQUE NOT NULL,
	fk_job BIGINT UNSIGNED NOT NULL,
	fk_salary BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY ( employee_id ),
	FOREIGN KEY ( fk_person ) REFERENCES person( person_id ),
	FOREIGN KEY ( fk_job ) REFERENCES job( job_id ),
	FOREIGN KEY ( fk_salary ) REFERENCES salary( salary_id )
);

CREATE TABLE IF NOT EXISTS department_staff (
	fk_employee BIGINT UNSIGNED NOT NULL,
	fk_department BIGINT UNSIGNED NOT NULL,
	date_from DATE NOT NULL,
	date_to DATE,
	FOREIGN KEY ( fk_employee ) REFERENCES employee( employee_id ),
	FOREIGN KEY ( fk_department ) REFERENCES department( department_id ),
    CONSTRAINT interval_check CHECK( date_from < date_to )
);

CREATE TABLE IF NOT EXISTS discipline (
	discipline_id BIGINT UNSIGNED AUTO_INCREMENT,
	discipline_name NVARCHAR( 60 ) NOT NULL,
	discipline_semesters ENUM ( "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14" ) NOT NULL,
	fk_prof BIGINT UNSIGNED NOT NULL,
	fk_degree BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY ( discipline_id),
	FOREIGN KEY ( fk_prof ) REFERENCES employee( employee_id ),
	FOREIGN KEY ( fk_degree ) REFERENCES degree( degree_id )
);

CREATE TABLE IF NOT EXISTS student (
	mat_id BIGINT UNSIGNED AUTO_INCREMENT,
	fk_person BIGINT UNSIGNED UNIQUE NOT NULL,
	current_semester TINYINT UNSIGNED NOT NULL,
	immatriculated DATE NOT NULL,
	fk_discipline BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY ( mat_id ),
	FOREIGN KEY ( fk_person ) REFERENCES person( person_id ),
	FOREIGN KEY ( fk_discipline ) REFERENCES discipline(discipline_id)
);

CREATE TABLE IF NOT EXISTS module (
	module_id BIGINT UNSIGNED AUTO_INCREMENT,
	fk_moduleleader BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (module_id),
	FOREIGN KEY ( fk_moduleleader ) REFERENCES employee( employee_id )
);

CREATE TABLE IF NOT EXISTS course (
	course_id BIGINT UNSIGNED AUTO_INCREMENT,
	fk_module BIGINT UNSIGNED NOT NULL,
	fk_semester BIGINT UNSIGNED,
	fk_prof BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY ( course_id ),
	FOREIGN KEY ( fk_module ) REFERENCES module( module_id ),
	FOREIGN KEY ( fk_semester ) REFERENCES semester( semester_id ),
	FOREIGN KEY ( fk_prof ) REFERENCES employee( employee_id )
);

CREATE TABLE IF NOT EXISTS course_session (
	fk_course BIGINT UNSIGNED NOT NULL,
	fk_timeslot BIGINT UNSIGNED NOT NULL,
	fk_room BIGINT UNSIGNED NOT NULL,
	FOREIGN KEY ( fk_course ) REFERENCES course( course_id ),
	FOREIGN KEY ( fk_timeslot ) REFERENCES timeslot( slot_id ),
	FOREIGN KEY ( fk_room ) REFERENCES room( room_id )
);

CREATE TABLE IF NOT EXISTS exam (
	exam_nr BIGINT UNSIGNED AUTO_INCREMENT,
	fk_course BIGINT UNSIGNED NOT NULL,
	logon_date DATETIME NOT NULL,
	logout_date DATETIME NOT NULL,
	max_points TINYINT UNSIGNED,
	fk_room BIGINT UNSIGNED,
	PRIMARY KEY ( exam_nr ),
	FOREIGN KEY ( fk_course ) REFERENCES course ( course_id ),
	FOREIGN KEY ( fk_room ) REFERENCES room ( room_id )
);

CREATE TABLE IF NOT EXISTS exam_results (
	fk_exam BIGINT UNSIGNED NOT NULL,
	fk_matnr BIGINT UNSIGNED NOT NULL,
	attempt ENUM( "1", "2", "3" ) NOT NULL,
	reached_points TINYINT UNSIGNED,
	reached_mark DOUBLE(2,1),
	FOREIGN KEY ( fk_exam ) REFERENCES exam( exam_nr ),
	FOREIGN KEY ( fk_matnr ) REFERENCES student( mat_id ),
	CONSTRAINT check_mark CHECK( reached_mark <= 5.0 )
);
