// sample course information
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

// sample assignment group
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

// sample learner submission data
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];


function getLearnerData(course_info, assignment_group, submissions_as_arr) {
    if (assignment_group.course_id == course_info.id) {
        const learner_data = [];
        const assignments = assignment_group.assignments;

        // get unique learner IDs as objects
        submissions_loop:
        for (const submission of submissions_as_arr) {
            for (const learner of learner_data) {
                if (learner.id == submission.learner_id) {
                    continue submissions_loop;
                }
            }
            learner_data.push({id: submission.learner_id, avg: undefined});
        }

        // get submissions by student
        for (const learner of learner_data) {
            const learner_id = learner.id;
            for (const submission of submissions_as_arr) {
                if (submission.learner_id == learner_id) {
                    const assignment_id = submission.assignment_id;
                    let max_points;
                    for (const assignment of assignments) {
                        if (assignment.id == assignment_id) {
                            max_points = assignment.points_possible;
                            break;
                        }
                    }
                    learner["assignment_" + assignment_id] = submission.submission.score/max_points;
                }
            }
        }

        // calculate average per student
        for (const learner of learner_data) {
            let average = 0;
            let assignment_count = 0;;

            for (const property in learner) {
                if (property.startsWith("assignment")) {
                    average += learner[property];
                    assignment_count++;
                }
            }
            learner.avg = average/assignment_count;
        }

        return learner_data;
    }
    else {
        throw new Error(`The assignment group's course_id (${assignment_group.course_id}) does not match the provided course info id (${course_info.id}).`);
    }
}


function logLearnerData(learner_data) {
    console.log("Data:");
    for (let i=0; i < learner_data.length; i++) {
        let learner_obj = learner_data[i];
        console.log("{");
        for (let property in learner_obj) {
            console.log(`    ${property}: ${learner_obj[property]}`);
        }
        console.log("}");
    }
}


let data = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
logLearnerData(data);
