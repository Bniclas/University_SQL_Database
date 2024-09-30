/*
    Shows all the relevant information about a student
*/
CREATE VIEW view_student_information AS
SELECT  student.mat_id as "matric_number",
        gender.gender_name as "gender",
        person.email_private as "private_email",
        person.email_service as "service_email",
        CONCAT( person.firstname, ' ', person.surname ) as "name",
        CONCAT( person.postcode, ' ', person.location, ' ', person.street ) as "address", 
        SUBSTRING( person.birthdate, 1, 12 ) as "birthdate"
FROM student 
INNER JOIN person ON person.person_id = student.fk_person
LEFT JOIN gender ON gender.gender = person.gender;


/*
    Shows all students and their markaverage even they have not written any exam yet
*/
CREATE VIEW view_markaverage_student_all AS
SELECT  mat_id as "matric_number", 
        ROUND( AVG( reached_mark ), 2 ) "Grade average"
FROM student 
LEFT JOIN exam_result ON fk_matid = mat_id
GROUP BY mat_id;


/*
    Shows all students and their markaverage that already have written an exam
*/
CREATE VIEW view_markaverage_student_filter AS
SELECT  mat_id as "matric_number", 
        ROUND( AVG( reached_mark ), 2 ) "Grade average"
FROM student 
INNER JOIN exam_result ON fk_matid = mat_id
GROUP BY mat_id;


/*
    Shows all students and their courses if they have some
*/
CREATE VIEW view_student_current_courses AS
SELECT  student.mat_id as "matric_number", 
        CONCAT(person.firstname, ' ', person.surname) AS "name", 
        module.module_name as "Module name", 
        module.module_ects as "Module ECTS"
FROM student_course
INNER JOIN course ON course.course_id = student_course.fk_course
INNER JOIN student ON student.mat_id = student_course.fk_matid
INNER JOIN module ON module.module_id = course.fk_module
INNER JOIN person ON person.person_id = student.fk_person;

/*
    Shows how many students are in the different courses
*/
CREATE VIEW view_course_student_amount AS
SELECT  course.course_id AS "Course ID", 
        module.module_name AS "Module name", 
        CONCAT(person.firstname, ' ', person.surname) AS "Professor", 
        COUNT( student_course.fk_matid ) AS "Amount students" 
FROM course
INNER JOIN module ON module.module_id = course.fk_module
LEFT JOIN employee ON employee.employee_id = course.fk_prof
LEFT JOIN person ON person.person_id = employee.fk_person
LEFT JOIN student_course ON course.course_id = student_course.fk_course
LEFT JOIN student ON student.mat_id = student_course.fk_matid
GROUP BY course.course_id
ORDER BY course.course_id;

/*
    Shows all courses and their mark average
*/
CREATE VIEW view_course_mark_average AS
SELECT course_mark_average.course_id as "course", ROUND( AVG( student_reached_mark ), 2 ) as "average" FROM (
	SELECT 
		course.course_id,
		student.mat_id,
		AVG( reached_mark ) AS "student_reached_mark"
	FROM student 
	INNER JOIN exam_result ON fk_matid = mat_id
	INNER JOIN exam ON exam.exam_nr = exam_result.fk_exam
	INNER JOIN course ON course.course_id = exam.fk_course
	GROUP BY course.course_id, student.mat_id
) AS course_mark_average
GROUP BY course_mark_average.course_id;


/*
    Shows all different mark averages from each single exam in a course
*/

CREATE VIEW view_course_exams AS
SELECT course_mark_average.course_id as "course", course_mark_average.exam_nr as "exam", ROUND( AVG( student_reached_mark ), 2 ) as "average" FROM (
	SELECT 
		course.course_id,
		student.mat_id,
		exam.exam_nr,
		AVG( reached_mark ) AS "student_reached_mark"
	FROM student 
	INNER JOIN exam_result ON fk_matid = mat_id
	INNER JOIN exam ON exam.exam_nr = exam_result.fk_exam
	INNER JOIN course ON course.course_id = exam.fk_course
	GROUP BY course.course_id, student.mat_id, exam.exam_nr
) AS course_mark_average
GROUP BY course_mark_average.course_id, course_mark_average.exam_nr;

/*
    Shows all modules and their mark averages from their courses
*/
CREATE VIEW view_module_mark_average AS
SELECT module_mark_average.fk_module as "ModuleID", ROUND( AVG( student_reached_mark ), 2 )as "Module_Markaverage" FROM (
	SELECT 
		course.fk_module,
		student.mat_id,
		AVG( reached_mark )AS "student_reached_mark"
	FROM student 
	INNER JOIN exam_result ON fk_matid = mat_id
	INNER JOIN exam ON exam.exam_nr = exam_result.fk_exam
	INNER JOIN course ON course.course_id = exam.fk_course
	GROUP BY course.fk_module, student.mat_id
) AS module_mark_average
GROUP BY module_mark_average.fk_module;

/*
    Shows all information from person except password
*/
CREATE VIEW view_person_essential AS
SELECT person_id, gender, firstname, surname, birthdate, email_private, email_service, postcode, location, street FROM person;


/*
    Shows all information about the courses from a student
*/

CREATE VIEW view_person_course_essential AS 
SELECT  DISTINCT person.person_id, 
        course_id, 
        module_name, 
        module_ects, 
        semester_id, 
        CONCAT( semester_typ, " ", SUBSTRING( semester_start, 3, 2 ), "/", SUBSTRING( semester_end, 3, 2 ) ) as "semester" 
FROM person
JOIN student ON student.fk_person = person.person_id
JOIN student_course ON student_course.fk_matid = student.mat_id
JOIN course ON course.course_id = student_course.fk_course
JOIN module ON module.module_id = course.fk_module
JOIN semester ON semester.semester_id = course.fk_semester;


/*
    Shows all information about the courses from a student and their course marks
*/

CREATE VIEW view_person_course_essential_marks AS 
SELECT  person.person_id, 
        course_id, 
        module_name, 
        module_ects, 
        semester_id, 
        CONCAT( semester_typ, " ", SUBSTRING( semester_start, 3, 2 ), "/", SUBSTRING( semester_end, 3, 2 ) ) as "semester",
        reached_mark,
        exam.exam_nr,
        student_exam_attempt.attempt
FROM person
JOIN student ON student.fk_person = person.person_id
JOIN student_course ON student_course.fk_matid = student.mat_id
JOIN course ON course.course_id = student_course.fk_course
JOIN module ON module.module_id = course.fk_module
JOIN semester ON semester.semester_id = course.fk_semester
LEFT JOIN exam ON exam.fk_course = course.course_id
LEFT JOIN exam_result ON ( exam_result.fk_matid = student.mat_id AND exam_result.fk_exam = exam.exam_nr )
LEFT JOIN student_exam_attempt ON ( student_exam_attempt.fk_exam = exam_result.fk_exam AND exam_result.fk_matid = student_exam_attempt.fk_matid);