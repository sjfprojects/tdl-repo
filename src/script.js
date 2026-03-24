function changePage(newPage) {
    document.getElementById("page-title").innerHTML = newPage;
}

function createNewList(listName) {
    console.log("creating list" + listName);
    const list = document.createElement("button");
    list.textContent = listName;
    list.onclick = changePage(listName);
    document.getElementById("custom-lists").appendChild(list);
}
