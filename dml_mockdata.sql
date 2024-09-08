INSERT INTO gender VALUES( "m", "Male" );
INSERT INTO gender VALUES( "f", "Female" );
INSERT INTO gender VALUES( "d", "Divers" );

INSERT INTO postcode VALUES( "03121", "Meining" );
INSERT INTO postcode VALUES( "53121", "Dumpeln" );
INSERT INTO postcode VALUES( "81121", "Fumplen" );

INSERT INTO university_location VALUES( NULL, "Campus Meining", "Heinzenstrasse 71a", "03121" );
INSERT INTO university_location VALUES( NULL, "Campus Dumpeln", "Rumboldstrasse 71b", "53121" );
INSERT INTO university_location VALUES( NULL, "Aussenstelle Dumpeln", "Kamelweg 31c", "53121" );

INSERT INTO room VALUES( NULL, 100, 1, 1 );
INSERT INTO room VALUES( NULL, 200, 1, 1 );
INSERT INTO room VALUES( NULL, 300, 2, 1 );
INSERT INTO room VALUES( NULL, 400, 2, 1 );

INSERT INTO room VALUES( NULL, 100, 2, 2 );
INSERT INTO room VALUES( NULL, 200, 2, 2 );
INSERT INTO room VALUES( NULL, 300, 2, 2 );

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

INSERT INTO person VALUES( NULL, "m", "email_01@anymailservice.com", "email_01@privatemail.com", "213123h1##+123#123%!das", "Amber", "Apple", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "m", "email_02@anymailservice.com", "email_02@privatemail.com", "213123h1##+123#123%!das", "Bella", "Born", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "m", "email_03@anymailservice.com", "email_03@privatemail.com", "213123h1##+123#123%!das", "Cynia", "Cynisch", "2002-05-12", "03123", "Anywhere", "Mystreet 247", 3 );
INSERT INTO person VALUES( NULL, "m", "email_04@anymailservice.com", "email_04@privatemail.com", "213123h1##+123#123%!das", "David", "Davos", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "f", "email_05@anymailservice.com", "email_05@privatemail.com", "213123h1##+123#123%!das", "Elbe", "Ebers", "2002-05-12", "03123", "Anywhere", "Mystreet 247", 1 );
INSERT INTO person VALUES( NULL, "f", "email_06@anymailservice.com", "email_06@privatemail.com", "213123h1##+123#123%!das", "Fred", "Friend", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "f", "email_07@anymailservice.com", "email_07@privatemail.com", "213123h1##+123#123%!das", "George", "Gong", "2002-05-12", "03123", "Anywhere", "Mystreet 247", 2 );
INSERT INTO person VALUES( NULL, "f", "email_08@anymailservice.com", "email_08@privatemail.com", "213123h1##+123#123%!das", "Hella", "Hample", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );
INSERT INTO person VALUES( NULL, "f", "email_09@anymailservice.com", "email_09@privatemail.com", "213123h1##+123#123%!das", "Ian", "Ino", "2002-05-12", "03123", "Anywhere", "Mystreet 247", NULL );

INSERT INTO employee VALUES( NULL, 1, 3, 1 );
INSERT INTO employee VALUES( NULL, 2, 2, 1 );
INSERT INTO employee VALUES( NULL, 3, 5, 2 );
INSERT INTO employee VALUES( NULL, 4, 2, 4 );

INSERT INTO department_staff VALUES( 1, 1, DATE_ADD( CURRENT_DATE, INTERVAL - 10 DAY), DATE_ADD( CURRENT_DATE, INTERVAL + 360 DAY) );
INSERT INTO department_staff VALUES( 4, 2, DATE_ADD( CURRENT_DATE, INTERVAL - 140 DAY), DATE_ADD( CURRENT_DATE, INTERVAL + 360 DAY) );
INSERT INTO department_staff VALUES( 3, 2, DATE_ADD( CURRENT_DATE, INTERVAL - 120 DAY), DATE_ADD( CURRENT_DATE, INTERVAL + 360 DAY) );
INSERT INTO department_staff VALUES( 2, 1, DATE_ADD( CURRENT_DATE, INTERVAL - 1000 DAY), DATE_ADD( CURRENT_DATE, INTERVAL + 360 DAY) );

INSERT INTO discipline VALUES( NULL, "Biochemistry", "6", 1, 2 );
INSERT INTO discipline VALUES( NULL, "Information Technology", "6", 3, 1 );

INSERT INTO student VALUES( NULL, 5 );
INSERT INTO student VALUES( NULL, 6 );
INSERT INTO student VALUES( NULL, 7 );
INSERT INTO student VALUES( NULL, 8 );
INSERT INTO student VALUES( NULL, 9 );

INSERT INTO `university`.`module` (`module_name`, `module_ects`, `fk_moduleleader`) VALUES ('Information Systems Basics', '5', '1');
INSERT INTO `university`.`module` (`module_name`, `module_ects`, `fk_moduleleader`) VALUES ('Databases', '10', '4');
INSERT INTO `university`.`module` (`module_name`, `module_ects`, `fk_moduleleader`) VALUES ('Math I', '5', '2');
INSERT INTO `university`.`module` (`module_name`, `module_ects`, `fk_moduleleader`) VALUES ('Math II', '7', '2');
INSERT INTO `university`.`module` (`module_name`, `module_ects`, `fk_moduleleader`) VALUES ('Math III', '7', '1');

INSERT INTO semester VALUES( NULL, "SS", "2024-04-01", "2024-08-01" );
INSERT INTO semester VALUES( NULL, "WS", "2024-10-01", "2025-02-01" );

INSERT INTO `university`.`timeslot` (`start_at`, `end_at`) VALUES ('2024-11-10 08:00:00', '2024-11-10 10:00:00');
INSERT INTO `university`.`timeslot` (`start_at`, `end_at`) VALUES ('2024-11-12 08:00:00', '2024-11-12 10:00:00');
INSERT INTO `university`.`timeslot` (`start_at`, `end_at`) VALUES ('2024-12-10 08:00:00', '2024-12-10 10:00:00');
INSERT INTO `university`.`timeslot` (`start_at`, `end_at`) VALUES ('2024-12-12 08:00:00', '2024-12-12 10:00:00');

INSERT INTO course VALUES( NULL, 1, 1, 2 );
INSERT INTO course VALUES( NULL, 4, 1, 3 );
INSERT INTO course VALUES( NULL, 2, 1, 1 );
INSERT INTO course VALUES( NULL, 3, 1, 4 );
INSERT INTO course VALUES( NULL, 1, 2, 1 );

INSERT INTO course_session VALUES( 1, 1, 1 );
INSERT INTO course_session VALUES( 1, 2, 1 );
INSERT INTO course_session VALUES( 2, 1, 2 );
INSERT INTO course_session VALUES( 2, 1, 2 );
INSERT INTO course_session VALUES( 1, 1, 1 );

INSERT INTO `university`.`exam` (`fk_course`, `logon_date`, `logout_date`, `max_points`, `fk_room`) VALUES ('1', '2024-08-10 07:50:41', '2024-08-10 07:50:44', '90', '1');
INSERT INTO `university`.`exam` (`fk_course`, `logon_date`, `logout_date`, `max_points`, `fk_room`) VALUES ('2', '2024-08-10 07:50:41', '2024-08-10 07:50:44', '90', '2');
INSERT INTO `university`.`exam` (`fk_course`, `logon_date`, `logout_date`, `max_points`, `fk_room`) VALUES ('3', '2024-08-10 07:50:41', '2024-08-10 07:50:44', '90', '3');
INSERT INTO `university`.`exam` (`fk_course`, `logon_date`, `logout_date`, `max_points`, `fk_room`) VALUES ('4', '2024-08-10 07:50:41', '2024-08-10 07:50:44', '90', '4');

INSERT INTO exam_result VALUES( 1, 2, 85, 1.3 );
INSERT INTO exam_result VALUES( 2, 2, 80, 1.7 );
INSERT INTO exam_result VALUES( 1, 1, 85, 2.3 );
INSERT INTO exam_result VALUES( 2, 1, 81, 1.0 );


INSERT INTO `university`.`student_course` (`fk_course`, `fk_matid`) VALUES ('1', '1');
INSERT INTO `university`.`student_course` (`fk_course`, `fk_matid`) VALUES ('1', '2');
INSERT INTO `university`.`student_course` (`fk_course`, `fk_matid`) VALUES ('1', '3');
INSERT INTO `university`.`student_course` (`fk_course`, `fk_matid`) VALUES ('3', '5');
INSERT INTO `university`.`student_course` (`fk_course`, `fk_matid`) VALUES ('3', '3');