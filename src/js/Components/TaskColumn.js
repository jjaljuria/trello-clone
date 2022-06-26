import { store } from '../store'
import TaskItem from './TaskItem'

function getRandomIntInclusive(min, max) {
	const minValue = Math.ceil(min);
	const maxValue = Math.floor(max);
	return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue).toString(); // The maximum is inclusive and the minimum is inclusive
}

class Column extends HTMLElement {

	constructor() {
		super();
		this.tasks = store.attach();
		this.attachShadow({ mode: 'open' });
		this.render();
	}

	newTask() {
		const task = { title: '', body: '', id: getRandomIntInclusive(1, 100000000) };
		const container = this.shadowRoot.querySelector('.task__container task-separator');

		const el = this.#createTask(task);
		const separator = this.#addSeparator();


		container.insertAdjacentElement('afterend', el);
		el.after(separator)
		this.tasks.insert(0, task);
		this.tasks.save();
	}

	#createTask({ id, title, body }) {

		const newElementTask = document.createElement('task-item', { is: TaskItem });
		newElementTask.setAttribute('id', id);
		newElementTask.title = title;
		newElementTask.body = body;

		// agrega eventos
		newElementTask.addEventListener('dragstart', this.dragTask.bind(this));
		newElementTask.addEventListener('dragend', this.removeTaskDroped.bind(this));
		newElementTask.addEventListener('textChange', this.#saveTextChange.bind(this));
		newElementTask.addEventListener('deleteTask', this.#deleteTask.bind(this, id));

		return newElementTask;
	}

	#addSeparator() {
		const separator = document.createElement('task-separator');

		separator.addEventListener('dropTask', (event) => {
			event.stopPropagation();
			const { task } = event.detail;
			const taskElement = this.#createTask(task);
			const separatorTask = this.#addSeparator();
			event.target.insertAdjacentElement('afterend', taskElement);
			taskElement.insertAdjacentElement('afterend', separatorTask);
			const previousIdTask = event.target.previousElementSibling?.id;
			if (!previousIdTask) {
				this.tasks.insert(0, task)
			} else {
				const indexOfPreviousTask = this.tasks.indexOf(previousIdTask);
				this.tasks.insert(indexOfPreviousTask + 1, task);
			}

			this.tasks.save();
		});

		return separator;

	}

	#deleteTask(id) {
		this.tasks.remove(id);
		this.tasks.save();
		this.render();
	}

	#saveTextChange(event) {
		const { id, text, attr } = event.detail
		const task = this.tasks.find(id);
		task[attr] = text;
		this.tasks.update(task);
		this.tasks.save();
	}

	dragTask(event) {

		const { dataTransfer, target } = event;

		const task = {
			id: target.dataset.id,
			title: target.title,
			body: target.body,
		}

		dataTransfer.effectAllowed = 'move';
		dataTransfer.setData('text', JSON.stringify(task));

		task.deleted = true;
		this.tasks.update(task);
	}

	// remove task when task were droped exitily
	removeTaskDroped(event) {

		if (event.dataTransfer.dropEffect !== 'none') {
			this.tasks.removeDeleted();
			this.tasks.save();
			this.render();
		}
	}


	render() {
		// el orden es importante
		this.shadowRoot.innerHTML = `
		<style>
			.column {
				background: rgb(250, 250, 250, 0.6);
				border-radius: 5px;
				overflow-y: auto;
				height: 100%;
				width: 100%;
				display: flex;
				flex-direction: column;
			}

			.task__container {
				height: 100%;
				overflow-y: auto;
			}


			.new_task {
				background-color: var(--color-primary);
				padding: 1rem;
				margin: 0.3rem;
				border-radius: 5px;
				font-size: 1.2rem;
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
		</style>
		<section class="column">
			
			<p class="new_task">
				Create Task
			</p>
			<div class="task__container">
			</div>
		</section>`;

		this.shadowRoot.querySelector('.new_task').addEventListener('click', this.newTask.bind(this));
		const taskContainer = this.shadowRoot.querySelectorAll('.task__container');
		taskContainer.forEach(column => {
			column.appendChild(this.#addSeparator());

			column.addEventListener('dragover', event => {

				if (event.target.classList.contains('task__container')) {
					event.preventDefault();
				}
			})// evita que se suelte sobre una task

			column.addEventListener('drop', event => {
				if (event.dataTransfer.effectAllowed === 'move') {
					const task = JSON.parse(event.dataTransfer.getData('text'));

					const taskElement = this.#createTask(task, column);
					const separator = this.#addSeparator();
					column.appendChild(taskElement);
					column.appendChild(separator);

					this.tasks.add(task);
					this.tasks.save();
				}
			})

		})


		this.tasks.getAll().forEach(task => {

			const container = this.shadowRoot.querySelector('.task__container');
			const taskElement = this.#createTask(task);
			const separator = this.#addSeparator(container);
			container.appendChild(taskElement);
			container.appendChild(separator);

		});

	}
}

customElements.define('task-column', Column);