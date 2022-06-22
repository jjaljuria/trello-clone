import { store } from '../store'
import TaskItem from './TaskItem'
import Separator from './Separator'

function getRandomIntInclusive(min, max) {
	const minValue = Math.ceil(min);
	const maxValue = Math.floor(max);
	return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue).toString(); // The maximum is inclusive and the minimum is inclusive
}

class Column extends HTMLElement {
	tasks = null;

	constructor() {
		super();
		this.tasks = store.attach();
		this.render();
	}

	newTask() {
		const task = { title: '', body: '', id: getRandomIntInclusive(1, 100000000) };
		const container = this.querySelector('.task__container');
		const el = this.#createTask(task);
		const separator = this.#addSeparator();

		container.appendChild(el);
		container.appendChild(separator)
		this.tasks.add(task);
		this.tasks.save();
	}

	#createTask({ id, title, body }) {

		const newElementTask = document.createElement('task-item', { is: TaskItem });
		newElementTask.setAttribute('id', id);
		newElementTask.title = title;
		newElementTask.body = body;

		// agrega eventos
		newElementTask.addEventListener('dragstart', this.dragTask);
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
			const previousIdTask = event.target.previousElementSibling.id;
			if (!previousIdTask) {
				this.tasks.add(task);
			}

			const indexOfPreviousTask = this.tasks.indexOf(previousIdTask);

			if (indexOfPreviousTask === -1) {
				throw new Error('task not found')
			}

			this.tasks.insert(indexOfPreviousTask + 1, task);

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
			id: this.dataset.id,
			title: target.title,
			body: target.body,
		}

		dataTransfer.effectAllowed = 'move';
		dataTransfer.setData('text', JSON.stringify(task));
	}

	// remove task when task were droped exitily
	removeTaskDroped(event) {

		if (event.dataTransfer.dropEffect !== 'none') {
			this.tasks.remove(event.target.dataset.id);
			this.tasks.save();
			this.render();
		}
	}

	render() {

		// el orden es importante
		this.innerHTML = `
		<section class="column">
			<p class="new_task">
				Create Task
			</p>
			<div class="task__container">
			</div>
		</section>`;

		this.querySelector('.new_task').addEventListener('click', this.newTask.bind(this));
		this.querySelectorAll('.task__container').forEach(column => {
			column.addEventListener('dragover', event => {

				if (event.target.classList.contains('task__container')) {
					event.preventDefault();
				}
			})// evita que se suelte sobre una task

			column.addEventListener('drop', event => {
				if (event.dataTransfer.effectAllowed === 'move') {
					const task = JSON.parse(event.dataTransfer.getData('text'));
					console.log(event)
					console.log('drop container', { task }, event.bubbles, event.cancelBubble)
					const taskElement = this.#createTask(task, column);
					const separator = this.#addSeparator();
					column.appendChild(taskElement);
					column.appendChild(separator);

					this.tasks.add(task);
					this.tasks.save();
				}
			})

		})

		this.tasks.getAll().forEach((task) => {
			const container = this.querySelector('.task__container');
			const taskElement = this.#createTask(task);
			const separator = this.#addSeparator(container);
			container.appendChild(taskElement);
			container.appendChild(separator);
		});

	}
}

customElements.define('task-column', Column);