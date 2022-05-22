const addForm = document.querySelector("#addForm");
const todoValue = document.querySelector("#todoValue");
const items = document.querySelector(".items");
const url = "http://localhost:8080/todo/";

// add to list
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  addTodo();
});

async function addTodo() {
  await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body: todoValue.value, status: false }),
  });
  todoValue.value = "";
  getDataFromServer();
}

// get data from server
async function getDataFromServer() {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => addT(data));
}
getDataFromServer();
function addT(todoList) {
  items.innerHTML = "";
  todoList.forEach((todo) => {
    const item = document.createElement("div");
    item.id = todo.id;
    item.className = "item";
    const p = document.createElement("p");
    p.innerText = todo.body;

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.onclick = () => {
      deleteTodo(todo.id);
    };

    item.append(updateButton());
    item.append(deleteButton);
    item.append(p);
    items.append(item);
  });
}

function updateButton() {
  const updateButton = document.createElement("button");
  updateButton.innerHTML = '<i class="fa-solid fa-paintbrush"></i>';
  updateButton.onclick = getUpdateForm;
  return updateButton;
}

function getUpdateForm() {
  const input = document.createElement("input");
  input.className = "updateInput";
  const item = this.parentElement;
  const p = item.children[2];
  const itemOldValue = p.innerText;
  input.value = itemOldValue;
  item.replaceChild(input, p);

  const okButton = document.createElement("button");
  okButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  this.parentElement.replaceChild(okButton, this);
  okButton.onclick = async (e) => {
    await updateTodoData(item.id, input.value);
    e.target.parentElement.replaceChild(updateButton(), e.target);
    p.innerText = input.value;
    input.parentElement.replaceChild(p, input);
  };
}

// delete todo
async function deleteTodo(id) {
  Swal.fire({
    title: "Do you want to delete todo task?",
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
