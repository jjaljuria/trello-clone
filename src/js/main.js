import { store } from "./store";
import "./Components/TaskColumn";
import "./Components/Separator";
import "./Components/TaskItem";

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
  console.log(column);
  column.innerHTML = `
  <form class="form-create-column">
    <input type=text name="name">
    <button type="submit">Create</button>
  </form>
  `;
  column
    .querySelector(".form-create-column")
    .addEventListener("submit", instanceColumn);
}

function instanceColumn(event) {
  event.preventDefault();

  const newColumn = document.createElement("task-column");
  const title = event.target.elements["name"].value;
  newColumn.title = title;
  const container = event.target.parentNode;

  container.insertAdjacentElement("beforebegin", newColumn);
}

window.addEventListener("DOMContentLoaded", () => {
  // store.populate();
  // document.querySelectorAll("task-column").forEach((column) => column.render());
  document.querySelector(".title > input").value = getTitle();
  document.querySelector(".title > input").onblur = saveTitle;

  document
    .querySelector(".add-column .add-column__button")
    .addEventListener("click", createColumn);
});
