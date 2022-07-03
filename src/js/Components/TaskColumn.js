import { store } from "../store";
import List from "../List";
import TaskItem from "./TaskItem";

function getRandomIntInclusive(min, max) {
  const minValue = Math.ceil(min);
  const maxValue = Math.floor(max);
  return Math.floor(
    Math.random() * (maxValue - minValue + 1) + minValue
  ).toString(); // The maximum is inclusive and the minimum is inclusive
}

class Column extends HTMLElement {
  list = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  newTask() {
    const task = {
      title: "",
      body: "",
      id: getRandomIntInclusive(1, 100000000),
    };
    const container = this.shadowRoot.querySelector(
      ".task__container task-separator"
    );

    const el = this.#createTask(task);
    const separator = this.#addSeparator();

    container.insertAdjacentElement("afterend", el);
    el.after(separator);
    this.list.insert(0, task);
    store.save();
  }

  #createTask({ id, title, body }) {
    const newElementTask = document.createElement("task-item", {
      is: TaskItem,
    });
    newElementTask.setAttribute("id", id);
    newElementTask.title = title;
    newElementTask.body = body;

    // agrega eventos
    newElementTask.addEventListener("dragstart", this.dragTask.bind(this));
    newElementTask.addEventListener(
      "dragend",
      this.removeTaskDroped.bind(this)
    );
    newElementTask.addEventListener(
      "textChange",
      this.#saveTextChange.bind(this)
    );
    newElementTask.addEventListener(
      "deleteTask",
      this.#deleteTask.bind(this, id)
    );

    return newElementTask;
  }

  #addSeparator() {
    const separator = document.createElement("task-separator");

    separator.addEventListener("dropTask", (event) => {
      event.stopPropagation();
      const { task } = event.detail;
      const taskElement = this.#createTask(task);
      const separatorTask = this.#addSeparator();
      event.target.insertAdjacentElement("afterend", taskElement);
      taskElement.insertAdjacentElement("afterend", separatorTask);
      const previousIdTask = event.target.previousElementSibling?.id;
      if (!previousIdTask) {
        this.list.insert(0, task);
      } else {
        const indexOfPreviousTask = this.list.indexOf(previousIdTask);
        this.list.insert(indexOfPreviousTask + 1, task);
      }

      store.save();
    });

    return separator;
  }

  #deleteTask(id) {
    this.list.remove(id);
    store.save();
    this.render();
  }

  #saveTextChange(event) {
    const { id, text, attr } = event.detail;
    const task = this.list.find(id);
    task[attr] = text;
    this.list.update(task);
    store.save();
  }

  #saveTitle(event) {
    this.list.name = event.target.value;
  }

  dragTask(event) {
    const { dataTransfer, target } = event;

    const task = {
      id: target.dataset.id,
      title: target.title,
      body: target.body,
    };

    dataTransfer.effectAllowed = "move";
    dataTransfer.setData("text", JSON.stringify(task));

    task.deleted = true;
    this.list.update(task);
  }

  // remove task when task were droped exitily
  removeTaskDroped(event) {
    if (event.dataTransfer.dropEffect !== "none") {
      this.list.removeDeleted();
      store.save();
      this.render();
    }
  }

  render() {
    // el orden es importante

    this.shadowRoot.innerHTML = `
		${this.styles()}
		
		<section class="column">
      <div class="column__title__group">
        <input class="column__title" placeholder="title" value="${
          this.list?.name || ""
        }" maxlenght="20">
        <button class="btn btn-danger m-1"><i class="fas fa-times"></i></button>
      </div>
			<p class="new_task">
				Add Task <i class="fa fa-plus"></i>
			</p>
			<div class="task__container">
			</div>
		</section>`;

    this.addHandlers();

    this.shadowRoot.appendChild(Column.createLink("/css/styles.css"));

    this.addTaskInStock();
  }

  /**
   *
   * @param {string} url direcction url of the file css
   * @return Element link generated
   */
  static createLink(url) {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", url);
    return link;
  }

  addHandlers() {
    this.shadowRoot
      .querySelector(".column__title")
      .addEventListener("blur", this.#saveTitle.bind(this));

    this.shadowRoot
      .querySelector(".column__title__group > .btn")
      .addEventListener("click", () => {
        store.remove(this.list.id);
        this.remove();
      });

    this.shadowRoot
      .querySelector(".new_task")
      .addEventListener("click", this.newTask.bind(this));

    // drag and drop handlers
    const taskContainer = this.shadowRoot.querySelectorAll(".task__container");

    taskContainer.forEach((column) => {
      column.appendChild(this.#addSeparator());

      column.addEventListener("dragover", (event) => {
        if (event.target.classList.contains("task__container")) {
          event.preventDefault();
        }
      }); // evita que se suelte sobre una task

      column.addEventListener("drop", (event) => {
        if (event.dataTransfer.effectAllowed === "move") {
          const task = JSON.parse(event.dataTransfer.getData("text"));

          const taskElement = this.#createTask(task, column);
          const separator = this.#addSeparator();
          column.appendChild(taskElement);
          column.appendChild(separator);

          this.list.add(task);
          store.save();
        }
      });
    });
  }

  addTaskInStock() {
    if (!this.list) return;

    this.list.getAll().forEach((task) => {
      const container = this.shadowRoot.querySelector(".task__container");
      const taskElement = this.#createTask(task);
      const separator = this.#addSeparator(container);
      container.appendChild(taskElement);
      container.appendChild(separator);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  styles() {
    return `
    <style>
			.column {
				background: rgb(250, 250, 250, 0.6);
				border-radius: 5px;
				overflow-y: auto;
				max-height: 80vh;
				width: 15rem;
				display: flex;
				flex-direction: column;
			}

			.task__container {
				height: 100%;
				overflow-y: auto;
			}


			.new_task {
				background-color: var(--color-primary);
				padding: 0.5rem;
				margin: 0.3rem;
				border-radius: 5px;
				font-size: 1rem;
				font-weight: bold;
				user-select: none;
			}

			.new_task:hover {
				background-color: var(--color-secondary);
				cursor: default;
			}

			@media (max-width: 360px) {
				html {
					font-size: 13px;
				}

				.container {
					grid-template-rows: 2rem repeat(5, 80vh);
				}

				.column {
					grid-column: 1/6;
				}
			}

			.column__title{
				padding: 0.5rem;
        margin: 0.3rem;
				margin-bottom: .2rem;
				outline: none;
				border:0;
				font-size: 1rem;
				background: transparent;
				font-weight: bold;
        width: 100%;
        
			}

      .column__title:focus{
        background: inherit;
        outline: inherit;
      }

      .column__title__group{
        display: flex;
        align-items: center;
      }
			
		</style>`;
  }
}

customElements.define("task-column", Column);
