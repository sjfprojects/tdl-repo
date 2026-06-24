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
        "Are you sure you want to delete all lists and tasks? This action cannot be undone."
    );
    if (confirmed) {
        localStorage.clear();
        window.location.reload();
    }
}
