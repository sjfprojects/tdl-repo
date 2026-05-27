const moveIcon = `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-menu-icon lucide-menu"
    >
        <path d="M4 5h16" />
        <path d="M4 12h16" />
        <path d="M4 19h16" />
    </svg>
`;

const editIcon = `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-pencil-icon lucide-pencil"
    >
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="m15 5 4 4" />
    </svg>
`;

const binIcon = `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-trash-icon lucide-trash"
    >
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
`;

function homepage() {
    document.getElementById("page-title").innerHTML = "Home";
    document.getElementById("add-task-button").style.display = "none";

    loadTasks();
}

function changePage(newPage) {
    document.getElementById("page-title").innerHTML = newPage;
    document.getElementById("add-task-button").style.display = "inline";

    loadTasks();
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

    loadTasks();
}

function closeAddTask(e) {
    e.parentNode.parentNode.remove();
}

let tasks = [];

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("taskData"));
    if (tasks == null || tasks.length == 0) {
        tasks = [];
        return;
    }

    let main = document.getElementById("main-container");

    let temp = document.getElementById("task-table-template");
    let taskTable = temp.content.cloneNode(true);
    main.append(taskTable);

    let temp2 = document.getElementById("individual-task-template");
    let individualTask = temp2.content.cloneNode(true);
}
loadTasks();

function confirmAddTask(e) {
    let formData = document.querySelector("#add-task-options");

    let listName = document.getElementById("page-title").innerHTML;
    let taskName = formData.querySelector("#task-name").value;
    let dateBool = formData.querySelector("#date-checkbox").checked;
    let date = formData.querySelector("#date-input").value;
    let priority = formData.querySelector("#priority").checked;

    let task = [listName, taskName, dateBool, date, priority];
    console.log(task);

    tasks.push(task);
    console.log(tasks);

    localStorage.setItem("taskData", JSON.stringify(tasks));

    closeAddTask(e);
}

lists = [];

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

            newListButton.disabled = false;

            lists.push(value);
            localStorage.setItem("listData", JSON.stringify(lists));

            changePage(value);
            loadLists();
        }
    });
}

function loadLists() {
    lists = JSON.parse(localStorage.getItem("listData"));
    if (lists == null || lists.length == 0) {
        lists = [];
        return;
    }

    let sidebar = document.getElementById("sidebar");
    const container = document.getElementById("list-container");
    container.replaceChildren();

    for (i = 0; i < lists.length; i++) {
        let currentI = i;

        let buttonContainer = document.createElement("div");
        buttonContainer.classList = "button-container";

        let moveButton = document.createElement("button");
        moveButton.innerHTML = moveIcon;
        moveButton.classList = "move-button";

        let listButton = document.createElement("button");
        listButton.classList = "list-button";

        let editBinContainer = document.createElement("div");
        editBinContainer.classList = "edit-bin-container";

        let editButton = document.createElement("button");
        editButton.innerHTML = editIcon;
        editButton.classList = "edit-button";
        editButton.onclick = () => {
            listButton.remove();
            const input = document.createElement("input");
            input.type = "text";
            input.classList = "edit-button-input";

            buttonContainer.insertBefore(input, buttonContainer.children[1]);

            editButton.disabled = true;

            input.addEventListener("blur", (e) => {
                if (input.isConnected) {
                    input.remove();
                }
                buttonContainer.insertBefore(listButton, buttonContainer.children[1]);
                editButton.disabled = false;
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const value = input.value;
                    if (input.isConnected) {
                        input.remove();
                    }
                    
                    buttonContainer.insertBefore(listButton, buttonContainer.children[1]);
                    editButton.disabled = false;

                    const updatedData = JSON.parse(localStorage.getItem("listData"));
                    updatedData[currentI] = value;
                    
                    localStorage.setItem("listData", JSON.stringify(updatedData));

                    changePage(value);
                    loadLists();
                }
            });

        }

        let binButton = document.createElement("button");
        binButton.innerHTML = binIcon;
        binButton.classList = "bin-button"
        binButton.onclick = () => {
            let currentListData = JSON.parse(localStorage.getItem("listData"));
            currentListData.splice(currentI, 1);
            console.log(currentListData);
            localStorage.setItem("listData", JSON.stringify(currentListData));
            homepage();
            binButton.parentNode.parentNode.remove();
            loadLists();
        }

        const value = lists[i];
        listButton.textContent = value;
        listButton.addEventListener("click", () => {
            changePage(value);
        });

        editBinContainer.append(
            editButton,
            binButton,
        )
        buttonContainer.append(
            moveButton,
            listButton,
            editBinContainer,
        );
        container.append(buttonContainer);
    }
}
loadLists();

function editLists() {


    loadLists();
    loadTasks();
}

function reset() {
    localStorage.clear();
    window.location.reload();
}