function changePage(newPage) {
    document.getElementById("page-title").innerHTML = newPage;
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
    })

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
