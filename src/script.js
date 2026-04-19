function homepage() {
    document.getElementById("page-title").innerHTML = "Home";
    document.getElementById("add-task-button").style.display = "none";
}

function changePage(newPage) {
    document.getElementById("page-title").innerHTML = newPage;
    document.getElementById("add-task-button").style.display = "inline";
}

function addTask() {
    let temp = document.getElementById("add-task-template");
    let clon = temp.content.cloneNode(true);

    let dateCheckbox = clon.querySelector("#date-checkbox");
    let dateInput = clon.querySelector("#date-input");
    
    let currentDate = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000,
    )
        .toISOString()
        .slice(0, 10);
    dateInput.min = currentDate;

    dateCheckbox.addEventListener("click", (e) => {
        console.log(dateInput.style.display);
        if (dateInput.style.display != "inline") {
            dateInput.style.display = "inline";
        } else {
            dateInput.style.display = "none";
        }
    });

    document.body.append(clon);
}

function closeAddTask(e) {
    e.parentNode.parentNode.remove();
}

function confirmAddTask(e) {
    let formData = document.querySelector("#add-task-options");
    let listName = document.getElementById("page-title").innerHTML;
    let taskName = formData.querySelector("#task-name").value;
    let dateCheckbox = formData.querySelector("#date-checkbox").checked;
    let dateInput = formData.querySelector("#date-input").value;
    let priority = formData.querySelector("#priority").checked;

    console.log(listName, taskName, dateCheckbox, dateInput, priority);

    console.log(e.parentNode);

    closeAddTask(e);
}

function createNewList() {
    const input = document.createElement("input");
    input.type = "text";

    const container = document.getElementById("list-container");
    container.prepend(input);
    input.focus();

    const newListButton = document.getElementById("new-list-button");
    newListButton.disabled = true;

    input.addEventListener("blur", (e) => {
        input.remove();
        newListButton.disabled = false;
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const value = input.value;
            input.remove();

            const listButton = document.createElement("button");
            listButton.textContent = value;
            listButton.addEventListener("click", () => {
                changePage(value);
            });

            container.append(listButton);
            newListButton.disabled = false;

            changePage(value);
        }
    });
}
