const home_screen = document.querySelector(".home-screen");
const question_screen = document.querySelector(".question-screen");
const next_button = document.getElementById("next-btn");
const option_list = document.querySelector(".answer-options");
const tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
const result_screen = document.querySelector(".result-screen");
var object, id = 0, range, score = 0, width, index;

document.getElementById("start-btn").addEventListener("click", function () {
    const question_category = document.getElementById("category_question").value;
    const difficulty = document.getElementById("diff_lvl").value;
    range = document.getElementById("range_question").value;
    width = 100 / range;
    let error = '';
    let flag = false;
    if (question_category == '' && difficulty == '') {
        error = "Please choose Question Category and Difficulty Level!"
        flag = true;
    } else if (difficulty == '') {
        error = "Please choose the Difficulty level of Questions!";
        flag = true;
    } else if (question_category == '') {
        error = "Please choose the Category of Questions!"
        flag = true;
    }

    if (flag == true) {
        show_error(error);
    } else {
        start_quiz(question_category, difficulty);
    }

})

show_error = (error) => {
    Swal.fire({
        icon: 'error',
        title: error,
        showConfirmButton: true,
        timer: 3000
    })
}

function start_quiz(question_category, difficulty) {
    home_screen.classList.add("d-none");
    question_screen.classList.remove("d-none");
    let url = "https://the-trivia-api.com/api/questions?categories=" + question_category + "&limit=" + range + "&type=multiple&difficulty=" + difficulty;
    fetch(url).then(response => response.json())
        .then(data => {
            object = data;
            document.getElementById("max-ques").innerHTML = range;
            iterate(0);
        })
}

function iterate(curr) {
    let question = object[curr].question;
    let helper = width * (curr + 1);
    $('.progress-bar').css('width', helper + '%').attr('aria-valuenow', helper);
    next_button.style.display = "none";
    rightAns = object[curr].correctAnswer;
    let possibleAnswers = object[curr].incorrectAnswers;
    document.getElementById("ques").innerHTML = question;
    if (curr === 0) {
        index = Math.floor(Math.random() * 4);
    } else {
        index = getNewRand(index);
    }
    possibleAnswers.splice(index, 0, rightAns);
    let option_tag = '<div class="option"><span>' + possibleAnswers[0] + '</span></div>'
        + '<div class="option"><span>' + possibleAnswers[1] + '</span></div>'
        + '<div class="option"><span>' + possibleAnswers[2] + '</span></div>'
        + '<div class="option"><span>' + possibleAnswers[3] + '</span></div>';
    option_list.innerHTML = option_tag;
    document.getElementById("curr-ques").innerHTML = curr + 1;
    document.getElementById("ques").innerHTML = question;
    const option = option_list.querySelectorAll(".option");
    for (i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this,rightAns)");
    }
}

function getNewRand(oldRand) {
    const newRand = Math.floor(Math.random() * 4);
    return (newRand === oldRand ? getNewRand(newRand) : newRand)
}

next_button.addEventListener("click", function () {
    id++;
    if (id != range) {
        iterate(id);
    } else {
        show_results();
    }
})

function optionSelected(answer, correcAns) {
    let userAns = answer.textContent;
    const allOptions = option_list.children.length;
    if (userAns == correcAns) {
        answer.classList.add("correct");
        score++;
        answer.insertAdjacentHTML("beforeend", tickIconTag);
    } else {
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIconTag);
        for (i = 0; i < allOptions; i++) {//auto selecting correct answer
            if (option_list.children[i].textContent == correcAns) {
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
            }
        }
    }
    for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user selects an option then disable all options
    }

    next_button.style.display = "inline";
    if (id == range - 1) {
        next_button.innerText = "Show Results"
    }
}

function restart_quiz() {
    Swal.fire({
        title: 'Are you sure?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    })
}

function show_results() {
    question_screen.classList.add("d-none");
    result_screen.classList.remove("d-none");
    document.getElementById("score").innerHTML = "You answered " + score + " out of " + range + " Questions Correctly!";
}

window.oncontextmenu = function () {
    return false;
}

$(document).keydown(function (event) {
    if (event.keyCode == 123) {
        return false;
    }
    else if ((event.ctrlKey && event.shiftKey && event.keyCode == 73) || (event.ctrlKey && event.shiftKey && event.keyCode == 74)) {
        return false;
    }
});