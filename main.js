const add = document.querySelector("#add");
const todo = document.querySelector("#todo");
const form = document.querySelector("#form");
const tbody = document.querySelector("#tbody");
const url = "http://localhost:8080/todo/";
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await addTodo();
  getDataFromServer();
});

async function addTodo() {
  await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body: todo.value, status: false }),
  });
}

function getDataFromServer() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => addT(data));
}
getDataFromServer();

function addT(todoList) {
  tbody.innerHTML = "";
  todoList.forEach((todo) => {
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    tdId.innerText = todo.id;
    const tdBody = document.createElement("td");
    tdBody.innerText = todo.body;
    const tdUpdate = document.createElement("td");

    const tdDelete = document.createElement("td");

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "delete";
    deleteButton.onclick = () => {
      deleteTodo(todo.id);
    };
    tdUpdate.append(updateButton());
    tdDelete.append(deleteButton);
    tr.append(tdId);
    tr.append(tdBody);
    tr.append(tdUpdate);
    tr.append(deleteButton);
    tbody.append(tr);
  });
}

async function deleteTodo(id) {
  Swal.fire({
    title: "Do you want to delete todo?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "yes",
    denyButtonText: `no`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await fetch(url + id, {
        method: "DELETE",
      });
      Swal.fire("Good job!", "todo was deleted!", "success");
      getDataFromServer();
    } else if (result.isDenied) {
    }
  });
}

function getUpdateForm() {
  const tr = this.parentElement.parentElement;
  const id = tr.children[0].innerText;
  const input = document.createElement("input");
  const tdBody = document.createElement("td");

  input.value = tr.children[1].innerText;
  input.classList.add("updateInput");
  tr.children[1].parentElement.replaceChild(input, tr.children[1]);
  // update "update" button
  const okButton = document.createElement("button");
  okButton.innerText = "ok";
  okButton.onclick = async (e) => {
    await updateTodoData(id, input.value);
    e.target.parentElement.replaceChild(updateButton(), e.target);
    tdBody.innerText = input.value;
    input.parentElement.replaceChild(tdBody,input)
  };

  this.parentElement.replaceChild(okButton, this);
}

async function updateTodoData(id, body) {
  const bodyData = { id, body };
  await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  }).then((response) => {
    if (response.status == 200) {
      Swal.fire("Good job!", "!", "success");
    }
  });
}

function updateButton() {
  const updateButton = document.createElement("button");
  updateButton.innerText = "update";
  updateButton.onclick = getUpdateForm;
  return updateButton;
}
