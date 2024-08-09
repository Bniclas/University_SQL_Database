DROP DATABASE IF EXISTS university;

CREATE DATABASE university;

USE university;

CREATE TABLE IF NOT EXISTS gender (
	gender VARCHAR(3),
	gender_name VARCHAR( 30 ),
	PRIMARY KEY( gender )
);

CREATE TABLE IF NOT EXISTS semester(
	semester_id BIGINT UNSIGNED AUTO_INCREMENT,
	semster_start DATE NOT NULL,
	semester_end DATE NOT NULL,
	PRIMARY KEY ( semester_id )
);

CREATE TABLE IF NOT EXISTS postcode (
	postcode_code VARCHAR( 5 ),
	postcode_city VARCHAR( 60 ) UNIQUE NOT NULL,
	PRIMARY KEY ( postcode_code )
);

CREATE TABLE IF NOT EXISTS university_locations (
	location_id BIGINT UNSIGNED AUTO_INCREMENT,
	location_name VARCHAR( 100 ) NOT NULL,
	street VARCHAR( 60 ) NOT NULL,
	fk_postcode VARCHAR(5) NOT NULL,
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
	PRIMARY KEY( slot_id )
);

CREATE TABLE IF NOT EXISTS department (
	department_id BIGINT UNSIGNED AUTO_INCREMENT,
	department_name VARCHAR( 100 ) NOT NULL,
	fk_uniloc BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY ( department_id ),
	FOREIGN KEY ( fk_uniloc ) REFERENCES university_locations( location_id )
);

CREATE TABLE IF NOT EXISTS job (
	job_id BIGINT UNSIGNED AUTO_INCREMENT,
	job_name VARCHAR( 100 ) UNIQUE NOT NULL,
	PRIMARY KEY ( job_id )
);

CREATE TABLE IF NOT EXISTS currency (
	currency_id BIGINT UNSIGNED AUTO_INCREMENT,
	currency_symbol VARCHAR(5) UNIQUE NOT NULL,
	currency_name VARCHAR(20) UNIQUE NOT NULL,
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
	degree_name VARCHAR( 30 ) UNIQUE NOT NULL,
	PRIMARY KEY ( degree_id )
);

CREATE TABLE IF NOT EXISTS person (
	person_id BIGINT UNSIGNED AUTO_INCREMENT,
	gender VARCHAR(3) NOT NULL,
	email VARCHAR( 60 ) UNIQUE NOT NULL,
	password VARCHAR( 255 ),
	firstname VARCHAR(60) NOT NULL,
	surname VARCHAR(60) NOT NULL,
	birthdate DATE NOT NULL,
	postcode VARCHAR(5) NOT NULL,
	location VARCHAR(50) NOT NULL,
	street VARCHAR(60) NOT NULL,
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
	discipline_name VARCHAR( 60 ) NOT NULL,
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
	FOREIGN KEY ( fk_matnr ) REFERENCES student( mat_id ) 
);


INSERT INTO gender VALUES( "m", "male" );
INSERT INTO gender VALUES( "f", "female" );
INSERT INTO gender VALUES( "d", "divers" );

INSERT INTO postcode VALUES( "03121", "Meining" );
INSERT INTO postcode VALUES( "53121", "Dumpeln" );
INSERT INTO postcode VALUES( "81121", "Fumplen" );

INSERT INTO university_locations VALUES( NULL, "Campus Meining", "Heinzenstrasse 71a", "03121" );
INSERT INTO university_locations VALUES( NULL, "Campus Dumpeln", "Rumboldstrasse 71b", "53121" );
INSERT INTO university_locations VALUES( NULL, "Aussenstelle Dumpeln", "Kamelweg 31c", "53121" );

INSERT INTO department VALUES( NULL, "Department of Chemistry Dumpeln", 2 );
INSERT INTO department VALUES( NULL, "Department of IT Meining", 1 );

INSERT INTO job VALUES( NULL, "Hilfskraft" );
INSERT INTO job VALUES( NULL, "Professor" );
INSERT INTO job VALUES( NULL, "Lehrkraft" );
INSERT INTO job VALUES( NULL, "Reinigungskraft" );
INSERT INTO job VALUES( NULL, "Wissenschaftlicher Mitarbeiter" );

INSERT INTO currency VALUES( NULL, "€", "Euro" );
INSERT INTO currency VALUES( NULL, "$", "US-Dollar" );

INSERT INTO salary VALUES( NULL, 3500, 1 );
INSERT INTO salary VALUES( NULL, 5500, 1 );
INSERT INTO salary VALUES( NULL, 7500, 1 );
INSERT INTO salary VALUES( NULL, 5000, 2 );
INSERT INTO salary VALUES( NULL, 10000, 2 );

INSERT INTO degree VALUES( NULL, "B.Sc." );
INSERT INTO degree VALUES( NULL, "M.Sc." );
INSERT INTO degree VALUES( NULL, "Dr. rer nat" );
INSERT INTO degree VALUES( NULL, "Dr. med." );
INSERT INTO degree VALUES( NULL, "Prof." );
INSERT INTO degree VALUES( NULL, "Prof. habil." );

INSERT INTO person VALUES( NULL, "m", "email_01@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "m", "email_02@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "m", "email_03@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", 3 );
INSERT INTO person VALUES( NULL, "m", "email_04@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "f", "email_05@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", 1 );
INSERT INTO person VALUES( NULL, "f", "email_06@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "f", "email_07@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", 2 );
INSERT INTO person VALUES( NULL, "f", "email_08@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "f", "email_09@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "f", "email_10@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", 1 );
INSERT INTO person VALUES( NULL, "f", "email_11@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "m", "email_12@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "m", "email_13@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", 4 );
INSERT INTO person VALUES( NULL, "m", "email_14@anymailservice.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );

INSERT INTO employee VALUES( NULL, 1, 3, 1 );
INSERT INTO employee VALUES( NULL, 6, 2, 1 );
INSERT INTO employee VALUES( NULL, 2, 5, 2 );
INSERT INTO employee VALUES( NULL, 8, 2, 4 );
INSERT INTO employee VALUES( NULL, 7, 1, 3 );
INSERT INTO employee VALUES( NULL, 3, 2, 1 );

INSERT INTO department_staff VALUES( 1, 1, DATE_ADD( CURRENT_DATE, INTERVAL - 10 DAY), DATE_ADD( CURRENT_DATE, INTERVAL + 360 DAY) );
INSERT INTO department_staff VALUES( 4, 2, DATE_ADD( CURRENT_DATE, INTERVAL - 140 DAY), DATE_ADD( CURRENT_DATE, INTERVAL + 360 DAY) );
INSERT INTO department_staff VALUES( 3, 2, DATE_ADD( CURRENT_DATE, INTERVAL - 120 DAY), DATE_ADD( CURRENT_DATE, INTERVAL + 360 DAY) );
INSERT INTO department_staff VALUES( 2, 1, DATE_ADD( CURRENT_DATE, INTERVAL - 1000 DAY), DATE_ADD( CURRENT_DATE, INTERVAL + 360 DAY) );

INSERT INTO discipline VALUES( NULL, "Biochemistry", "6", 1, 2 );
INSERT INTO discipline VALUES( NULL, "Information Technology", "6", 3, 1 );
