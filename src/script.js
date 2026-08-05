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

let pageTitle = document.getElementById("page-title");

function homepage() {
    pageTitle.innerHTML = "Home";
    document.getElementById("add-task-button").style.display = "none";

    loadTasks();
}

function changePage(newPage) {
    pageTitle.innerHTML = newPage;
    document.getElementById("add-task-button").style.display = "inline";

    loadTasks();
}

function addTask() {
    let temp = document.getElementById("add-task-template");
    let clon = temp.content.cloneNode(true);

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

    let wrapper = document.getElementById("wrapper");
    wrapper.replaceChildren();

    let temp = document.getElementById("task-table-template");
    let taskTable = temp.content.cloneNode(true);

    for (i = 0; i < tasks.length; i++) {
        let currentI = i;

        if (tasks[i][0] != pageTitle.innerHTML) {
            if (pageTitle.innerHTML != "Home") {
                continue;
            }
        }

        let temp2 = document.getElementById("individual-task-template");
        let individualTask = temp2.content.cloneNode(true);

        let absoluteBackground = individualTask.querySelector(
            "#absolute-background"
        );
        if (tasks[i][2] == true) {
            absoluteBackground.style.backgroundColor = "orange";
        }
        //console.log(tasks[i])

        let individualTaskName = individualTask.querySelector(
            "#individual-task-name",
        );
        individualTaskName.innerHTML = tasks[i][1];

        let individualTaskEdit = individualTask.querySelector(
            "#individual-task-edit",
        );
        individualTaskEdit.innerHTML = editIcon;
        
        individualTaskEdit.onclick = (e) => {   
            const input = document.createElement("input");
            input.type = "text";
            input.className = "edit-task-input";

            const currentTask = e.currentTarget.parentNode;
            const currentTaskName = currentTask.replaceChild(input, currentTask.children[1]);

            individualTaskEdit.disabled = true;
            input.focus();

            input.addEventListener("blur", () => {
                input.parentNode.replaceChild(currentTaskName, input);
                input.remove();
                individualTaskEdit.disabled = false;
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const value = input.value;
                    console.log(value);

                    const newName = document.createElement("div");
                    newName.innerHTML = value;
                    input.parentNode.replaceChild(newName, input);

                    input.remove();
                    individualTaskEdit.disabled = false;

                    const updatedData = JSON.parse(
                        localStorage.getItem("taskData"),
                    );
                    updatedData[currentI][1] = value;
                    localStorage.setItem(
                        "taskData",
                        JSON.stringify(updatedData),
                    );

                    loadTasks();
                }
            })
        }
        
        let individualTaskDelete = individualTask.querySelector(
            "#individual-task-delete",
        );
        individualTaskDelete.innerHTML = binIcon;

        individualTaskDelete.onclick = (e) => {
            let currentTaskData = JSON.parse(localStorage.getItem("taskData"));
            currentTaskData.splice(currentI, 1);
            localStorage.setItem("taskData", JSON.stringify(currentTaskData));
            individualTaskDelete.parentNode.parentNode.remove();
            loadTasks();
        }

        let individualTaskComplete = individualTask.querySelector(
            "#individual-task-complete"
        );

        individualTaskComplete.onchange = (e) => {
            let status = e.target.checked;
            const updatedData = JSON.parse(
                    localStorage.getItem("taskData"),
                );
                updatedData[currentI][3] = status;
                localStorage.setItem(
                    "taskData",
                    JSON.stringify(updatedData),
                );
                loadTasks();
        };
        if (tasks[i][3] == true) {
            absoluteBackground.style.opacity = "50%";
            individualTaskComplete.checked = true;
        } else {
            absoluteBackground.style.opacity = "100%";
            individualTaskComplete.checked = false;
        }

        taskTable.append(individualTask);
    }

    wrapper.append(taskTable);
}
loadTasks();

function confirmAddTask(e) {
    let formData = document.querySelector("#add-task-options");

    let listName = document.getElementById("page-title").innerHTML;
    let taskName = formData.querySelector("#task-name").value;
    if (taskName.trim() == "") {
        return;
    }
    let priority = formData.querySelector("#priority").checked;
    let completed = false;

    let task = [listName, taskName, priority, completed];
    console.log(task);

    tasks.push(task);
    console.log(tasks);

    localStorage.setItem("taskData", JSON.stringify(tasks));

    closeAddTask(e);
    loadTasks();
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

    let isRemoved = false;
    input.addEventListener("blur", (e) => {
        if (isRemoved == false) {
            isRemoved = true;
            input.remove();
        }
        newListButton.disabled = false;
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const value = input.value;
            if (value.trim() == "") {
                return;
            }

            if (isRemoved == false) {
                isRemoved = true;
                input.remove();
            }

            newListButton.disabled = false;

            lists.push(value);
            localStorage.setItem("listData", JSON.stringify(lists));

            changePage(value);
            loadLists();
        }
    });
}

let editing = false;

function loadLists(selectedIndex = null) {
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

        function keyDownEvent(e) {
            if (e.key === "ArrowUp") {
                const updatedData = JSON.parse(
                    localStorage.getItem("listData"),
                );
                if (currentI > 0) {
                    [updatedData[currentI - 1], updatedData[currentI]] = [
                        updatedData[currentI],
                        updatedData[currentI - 1],
                    ];
                } else return;
                localStorage.setItem("listData", JSON.stringify(updatedData));
                loadLists(currentI - 1);
            }
            if (e.key === "ArrowDown") {
                const updatedData = JSON.parse(
                    localStorage.getItem("listData"),
                );
                if (currentI < lists.length - 1) {
                    [updatedData[currentI + 1], updatedData[currentI]] = [
                        updatedData[currentI],
                        updatedData[currentI + 1],
                    ];
                } else return;
                localStorage.setItem("listData", JSON.stringify(updatedData));
                loadLists(currentI + 1);
            }
        }
        moveButton.addEventListener("keydown", keyDownEvent);
        moveButton.onclick = () => {
            moveButton.classList.add("selected");
        };
        moveButton.addEventListener("blur", (e) => {
            moveButton.style.background = "#f0f0f0";
        });

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
            input.focus();

            let isRemoved = false;
            input.addEventListener("blur", (e) => {
                if (isRemoved == false) {
                    isRemoved = true;
                    input.remove();
                }

                buttonContainer.insertBefore(
                    listButton,
                    buttonContainer.children[1],
                );
                editButton.disabled = false;
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const value = input.value;
                    if (isRemoved == false) {
                        isRemoved = true;
                        input.remove();
                    }

                    buttonContainer.insertBefore(
                        listButton,
                        buttonContainer.children[1],
                    );
                    editButton.disabled = false;

                    const updatedData = JSON.parse(
                        localStorage.getItem("listData"),
                    );
                    updatedData[currentI] = value;

                    localStorage.setItem(
                        "listData",
                        JSON.stringify(updatedData),
                    );

                    changePage(value);
                    loadLists();
                }
            });
        };

        let binButton = document.createElement("button");
        binButton.innerHTML = binIcon;
        binButton.classList = "bin-button";
        binButton.onclick = () => {
            let currentListData = JSON.parse(localStorage.getItem("listData"));
            currentListData.splice(currentI, 1);
            localStorage.setItem("listData", JSON.stringify(currentListData));
            homepage();
            binButton.parentNode.parentNode.remove();
            loadLists();
        };

        const value = lists[i];
        listButton.textContent = value;
        listButton.addEventListener("click", () => {
            changePage(value);
        });

        if (editing) {
            editBinContainer.append(editButton, binButton);
            buttonContainer.append(moveButton, listButton, editBinContainer);
        } else {
            listButton.style.border = "2px solid rgb(96, 96, 96)";
            buttonContainer.append(listButton);
        }
        container.append(buttonContainer);
    }

    if (selectedIndex !== null) {
        const moveButtons = container.querySelectorAll(".move-button");
        const button = moveButtons[selectedIndex];

        if (button) {
            button.focus();
            button.classList.add("selected");
        }
    }
}
loadLists();

const deleteAllButton = document.getElementById("delete-all");
deleteAllButton.style.display = "none";

function editLists() {
    editing = !editing;
    const button = document.getElementById("edit-lists-button");

    if (editing) {
        button.style.background = "lightblue";
        deleteAllButton.style.display = "";
    } else {
        button.style.background = "#f0f0f0";
        deleteAllButton.style.display = "none";
    }

    loadLists();
    loadTasks();
}

function deleteAll() {
    const confirmed = window.confirm(
        "Are you sure you want to delete all lists and tasks? This action cannot be undone.",
    );
    if (confirmed) {
        localStorage.clear();
        window.location.reload();
    }
}
