// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));


const taskName=document.getElementById('task-name');
const taskDescription=document.getElementById('task-description');
const taskDueDate=document.getElementById('task-due-date');
const taskPriority=document.getElementById('task-priority');

// Todo: create a function to generate a unique task id
function generateTaskId(){
    if(!nextId){
        nextId=1;
    }   else {
        nextId++;
    }
    localStorage.setItem('nextId', JSON.stringify(nextId));
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    console.log(task)

    const card= $("<div>").addClass("card text-center task-card mb-3 z-index-1").attr("id", task.id);
    
    const name = $("<h3>").addClass("card-header mb-3").text(task.title);

    const deleteButton = $("<p>").addClass("mb-2").text(task.description);

    const description = $("<p>").addClass("mb-2").text(task.description);

    const dueDate = $("<p>").addClass("mb-2").text(reformatDate(task.dueDate));

    const priority = $("<p>").addClass("mb-2").text(task.priority);

    //deleteDiv.append(deleteButton);
    card.append(name, description, dueDate, deleteButton, priority);
    $(`#todo-cards`).append(card);

    return card;
}
function reformatDate(date) {
    return dayjs(date).format("DD/MM/YYYY")
}

function updateTaskCardColour(taskCard, task) {
    const today = dayjs();
    const dueDate = dayjs(task.dueDate);
    const daysUntilDue = dueDate.diff(today, "day");
    if (task.status === "done") {
        taskCard.addClass("text-white bg-success");
        return;
    }
    if (daysUntilDue <= 0) {
        taskCard.addClass("bg-danger");
    } else if (daysUntilDue <= 3) {
        taskCard.addClass("bg-warning");
    }
};

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards, #in-progress-cards, #done-cards").empty();
    if (taskList) {
        taskList.forEach(task => {
            let taskCard = createTaskCard(task);
            updateTaskCardColour(taskCard, task);
            taskCard.draggable({
                revert: "invalid",
                cursor: "move",
                opacity: 0.9,
                zIndex: 3
                
            });  
        });
    }
}

// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('submitTask').addEventListener('click', function(event) {
//         event.preventDefault(); // Prevent form submission
//         handleAddTask();
//     });
// });

function handleAddTask(event) {
    event.preventDefault();
    //console.log("in the function handleAdd task")
    let taskNameVal = $("#task-name").val();
   // console.log("this is task elmennt = ", taskNameVal);
    let taskDescriptionVal = $("#task-description").val();
    //console.log("this is task description = ", taskDescriptionVal);
    let taskDueDateVal = $("#task-due-date").val();
    //console.log("this is task due date = ", taskDueDateVal);
    let taskPriorityVal = $("#task-priority").val();
    //console.log("this is task priority = ", taskPriorityVal);

    let task = {
        id: generateTaskId(),
        title: taskNameVal,
        description: taskDescriptionVal,
        dueDate: taskDueDateVal,
        priority: taskPriorityVal,
    }



    createTaskCard(task);


    // var cardContainer = document.getElementById('todo-cards'); // Adjust based on where you want to add the card
    // var newCard = document.createElement('div');
    // newCard.innerHTML = 'New Task'; // Customize with task details
    // cardContainer.appendChild(newCard);

    // Close the modal window
    $('#modalForm').modal('hide');
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

    event.preventDefault();
    const taskId = $(this).closest(".task-card").attr("id");
    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();
    const taskId = ui.draggable[0].id;
    const task = taskList.find(task => task.id === taskId);
    task.status = newStatus;
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $('#task-form').on('submit', handleAddTask);
    $('.document').on('click', ".delete-task", handleDeleteTask);
    $('.card-body').droppable({
        accept: '.card',
        drop: handleDrop
    });
}); 