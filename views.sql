/*
    Shows all the relevant information about a student
*/
CREATE VIEW view_student_information AS
SELECT  student.mat_id as "Matriculation number",
        gender.gender_name as "Gender",
        person.email as "Email",
        CONCAT( person.firstname, ' ', person.surname ) as "Name",
        CONCAT( person.postcode, ' ', person.location, ' ', person.street ) as "Address", 
        person.birthdate as "Birthdate"
FROM student 
INNER JOIN person ON person.person_id = student.fk_person
INNER JOIN gender ON gender.gender = person.gender;


/*
    Shows all students and their markaverage even they have not written any exam yet
*/
CREATE VIEW view_markaverage_student_all AS
SELECT  mat_id as "Matriculation number", 
        AVG( reached_mark ) "Grade average"
FROM student 
LEFT JOIN exam_result ON fk_matid = mat_id
GROUP BY mat_id;


/*
    Shows all students and their markaverage that already have written an exam
*/
CREATE VIEW view_markaverage_student_filter AS
SELECT  mat_id as "Matriculation number", 
        AVG( reached_mark ) "Grade average"
FROM student 
INNER JOIN exam_result ON fk_matid = mat_id
GROUP BY mat_id;


/*
    Shows all students and their courses if they have some
*/
CREATE VIEW view_student_current_courses AS
SELECT  student.mat_id as "Matriculation number", 
        CONCAT(person.firstname, ' ', person.surname) AS "Name", 
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
        module.module_name AS "Module Name", 
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
SELECT course_mark_average.course_id, AVG( student_reached_mark ) FROM (
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
    Shows all modules and their mark averages from their courses
*/
CREATE VIEW view_module_mark_average AS
SELECT module.module_id, AVG(course_mark_avg) FROM (
	SELECT course_mark_average.course_id AS "course_id", AVG( course_mark_average.student_reached_mark ) AS "course_mark_avg" FROM (
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
	GROUP BY course_mark_average.course_id
) AS module_mark_average
INNER JOIN module ON module.module_id = module_mark_average.course_id
GROUP BY module.module_id;