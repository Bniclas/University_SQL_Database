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
