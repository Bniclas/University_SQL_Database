CREATE VIEW view_student_information AS
SELECT student.mat_id, person.*, student.current_semester, student.immatriculated, discipline.discipline_name, degree.degree_name FROM student 
INNER JOIN person ON person.person_id = student.fk_person
INNER JOIN discipline ON discipline.discipline_id = student.fk_discipline
INNER JOIN degree ON degree.degree_id = discipline.fk_degree;