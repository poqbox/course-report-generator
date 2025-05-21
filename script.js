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
    try {
        if (assignment_group.course_id == course_info.id) {
            if (submissions_as_arr.length === 0) {
                // array should not be empty
                throw new Error("submissions_as_arr is empty");
            }
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
                        const submitted_at = submission.submission.submitted_at.split("-").slice(0, 2).map((_) => Number(_));
                        let score = submission.submission.score;
                        let max_points;
                        for (const assignment of assignments) {
                            if (assignment.id == assignment_id) {
                                const due_date = assignment.due_at.split("-").slice(0, 3).map((_) => Number(_));

                                // account for not-yet-due assignments
                                if (due_date[0] > current_date[0])
                                    break;
                                else if (due_date[0] === current_date[0]){
                                    if (due_date[1] > current_date[1])
                                        break;
                                    else if (due_date[1] === current_date[1]){
                                        if (due_date[2] > current_date[2])
                                            break;
                                    }
                                }

                                try {
                                    max_points = assignment.points_possible;
                                    if (max_points === 0) {
                                        // an assignment's possible points should not be 0
                                        throw new Error(`possible_points cannot be 0 (assignment_group=${assignment_group.id}, assignment_id=${assignment.id})`);
                                    }
                                    else if (max_points <= 0) {
                                        // an assignment's possible points should be positive
                                        throw new Error(`possible_points cannot be negative (assignment_group=${assignment_group.id}, assignment_id=${assignment.id})`);
                                    }

                                    // account for late submissions
                                    let late = false;
                                    if (submitted_at[0] > due_date[0])
                                        late = true;
                                    else if (submitted_at[0] === due_date[0]){
                                        if (submitted_at[1] > due_date[1])
                                            late = true;
                                        else if (submitted_at[1] === due_date[1]){
                                            if (submitted_at[2] > due_date[2])
                                                late = true;
                                        }
                                    }
                                    if (late) {
                                        score -= max_points * 0.1;
                                        if (score < 0)
                                            score = 0;
                                    }

                                    score /= max_points;
                                }
                                catch (error) {
                                    console.log(error);
                                    score = error;
                                }
                                finally {
                                    learner[id_prefix + assignment_id] = score;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            // calculate average per student
            calculateAverage(learner_data, assignment_group);

            return learner_data;
        }
        else {
            // match assignment_group's course_id with course_info's id
            throw new Error(`assignment_group.course_id (${assignment_group.course_id}) does not match the provided course_info.id (${course_info.id})`);
        }
    }
    catch (error) {
        console.log(error);
        return [];
    }
}


function calculateAverage(learner_data, assignment_data) {
    for (const learner of learner_data) {
        let points = 0;
        let total_possible_points = 0;

        try {
            for (const property in learner) {
                if (property.startsWith(id_prefix)) {

                    // get assignment weights
                    const id = property.slice(id_prefix.length);
                    for (const assignment of assignment_data.assignments) {
                        if (assignment.id == id) {
                            const possible_points = assignment.points_possible;
                            points += learner[property] * possible_points;
                            if (isNaN(points))
                                // points should be numbers
                                throw new Error("Cannot add number and not-a-number");
                            total_possible_points += possible_points;
                            break;
                        }
                    }
                }
            }
            learner.avg = points/total_possible_points;
        }
        catch (error) {
            console.log(error);
            learner.avg = error;
        }
    }
}


function dataToText(learner_data) {
    let output = "Data:"
    for (let i=0; i < learner_data.length; i++) {
        let learner_obj = learner_data[i]
        output += "\n{"
        for (let property in learner_obj) {
            output += `\n    ${property}: ${learner_obj[property]}`
        }
        output += "\n}"
    }
    return output
}


function dataToCsv(learner_data) {
    let output = Object.keys(learner_data[0]).join(",")
    for (let i=0; i < learner_data.length; i++) {
        output += "\n" + Object.values(learner_data[i]).join(",")
    }
    return output
}


const current_date = [2025, 1, 1];
const id_prefix = "#";

let data = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(dataToText(data))



const outputBoxEl = document.getElementById("output-box")
outputBoxEl.append(dataToTextElement(data))


function dataToTextElement(data) {
    const el = document.createElement("pre")
    el.textContent = dataToText(data)
    return el
}


function dataToCsvElement(data) {
    const el = document.createElement("pre")
    el.textContent = dataToCsv(data)
    return el
}


function dataToJsonElement(data) {
    const el = document.createElement("pre")
    el.textContent = JSON.stringify(data)
    return el
}


function dataToTableElement(data) {
    const el = document.createElement("table")
    const th = el.appendChild(document.createElement("thead"))
    const tb = el.appendChild(document.createElement("tbody"))

    let header_row = th.appendChild(document.createElement("tr"))
    for (let key of Object.keys(data[0])) {
        let td = header_row.appendChild(document.createElement("td"))
        td.textContent = key
    }
    for (let obj of data) {
        const tr = tb.appendChild(document.createElement("tr"))
        for (let value of Object.values(obj)) {
            const td = tr.appendChild(document.createElement("td"))
            td.textContent = value
        }
    }
    return el
}




// output nav bar
let nav_data = [
    {text: "Output", element_creator: dataToTextElement},
    {text: ".csv", element_creator: dataToCsvElement},
    {text: ".json", element_creator: dataToJsonElement},
    {text: "table", element_creator: dataToTableElement}
]

let outputNavEl = document.getElementById("output-switcher")
for (let obj of nav_data) {
    let nav_item = outputNavEl.appendChild(document.createElement("a"))
    nav_item.textContent = obj.text
    nav_item.addEventListener("click", (e) => {
        e.preventDefault()
        outputBoxEl.innerHTML = ""
        outputBoxEl.append(obj.element_creator(data))
    })
}
