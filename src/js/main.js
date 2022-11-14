import { store } from "./store";
import "./Components/TaskColumn";
import "./Components/Separator";
import "./Components/TaskItem";
import List from "./List";

function saveTitle(event) {
  const title = event.target.value;
  if (!title) return false;

  localStorage.setItem("title", JSON.stringify(title));
  return true;
}

function getTitle() {
  const title = localStorage.getItem("title");
  if (!title) return "";

  return title;
}

function createColumn(event) {
  event.preventDefault();
  event.stopPropagation();
  const column = event.target.parentNode;

  column.innerHTML = `
  <form class="form-create-column">
    <input type=text name="name">
    <button type="submit" class="btn btn-primary">Create</button>
  </form>
  `;
  column
    .querySelector(".form-create-column")
    .addEventListener("submit", instanceColumn);
}

function instanceColumn(event) {
  event.preventDefault();

  const nameOfNewList = event.target.elements.name.value;
  const newList = new List();
  const newColumn = document.createElement("task-column");
  const addColumnButton = event.target.parentNode;

  newList.name = nameOfNewList;
  newColumn.list = newList;
  store.attach(newColumn.list);
  store.save();
  addColumnButton.insertAdjacentElement("beforebegin", newColumn);
  newColumn.render();

  addColumnButton.innerHTML = `
      <a class="add-column__button" >Add Column <i class="fa fa-plus"></i></a>
  `;

  addColumnButton
    .querySelector(".add-column .add-column__button")
    .addEventListener("click", createColumn);
}

window.addEventListener("DOMContentLoaded", () => {
  // document.querySelectorAll("task-column").forEach((column) => column.render());
  document.querySelector(".title > input").value = getTitle();
  document.querySelector(".title > input").onblur = saveTitle;

  document
    .querySelector(".add-column .add-column__button")
    .addEventListener("click", createColumn);

  // get lists in store
  const lists = store.getLists();

  if (!lists.length > 0) return;

  // show list
  lists.forEach((list) => {
    const column = document.createElement("task-column");
    const addColumn = document.querySelector(".add-column");
    column.list = list;
    store.attach(list);
    addColumn.insertAdjacentElement("beforebegin", column);
    column.render();
  });
});
