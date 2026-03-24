function changePage(newPage) {
    document.getElementById("page-title").innerHTML = newPage;
}

function createNewList() {
    const input = document.createElement("input");
    input.type = "text";
    document.getElementById("list-container").prepend(input);
    input.focus();
    document.getElementById("new-list-button").disabled = true;

    input.addEventListener("blur", (e) => {
        input.remove();
        document.getElementById("new-list-button").disabled = false;
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

            document.getElementById("list-container").append(listButton);
            document.getElementById("new-list-button").disabled = false;

            changePage(value);
        }
    });
}
