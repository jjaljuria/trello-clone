import { store } from '../store'

function editElement(event) {
	const element = event.target;
	element.contentEditable = true;
}

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

	render() {

		// el orden es importante
		this.innerHTML = `
		<section class="column">
			<p class="new_task" onclick="">
				Create Task
			</p>
			<task-separator>
		</section>`;

		this.querySelector('.new_task').addEventListener('click', this.newTask.bind(this));
		this.querySelectorAll('.column').forEach(column => {
			column.addEventListener('dragover', event => {
				if (event.target.classList.contains('column')) {
					event.preventDefault();
				}
			})// evita que se suelte sobre una task

			column.addEventListener('drop', event => {
				if (event.dataTransfer.effectAllowed === 'move') {
					const task = JSON.parse(event.dataTransfer.getData('text'));
					this.#createTask(task);
					this.tasks.add(task);
					this.tasks.save();
					this.render();
				}
			})
		})

		// setting tasks

		this.tasks.getAll().forEach((task) => this.#createTask(task));
	}

	newTask() {
		const task = { title: '', body: '', id: getRandomIntInclusive(1, 100000000) };
		this.#createTask(task);
		this.tasks.add(task);
		this.tasks.save();
	}

	#createTask({ id, title, body }) {
		const templateTask = document.getElementById('templateTask').content.cloneNode(true); // clona template

		this.firstElementChild.appendChild(templateTask);// agrega a DOM
		const newElementTask = this.firstElementChild.lastElementChild;
		// setting

		newElementTask.dataset.id = id;
		newElementTask.querySelector('.task__title').innerText = title
		newElementTask.querySelector('.task__body').innerText = body;

		// agrega eventos
		newElementTask.addEventListener('dragstart', this.dragTask);
		newElementTask.addEventListener('dragend', this.removeTaskDroped.bind(this));
		newElementTask.querySelector('.task__icon-delete').addEventListener('click', this.#deleteTask.bind(this, id));
		newElementTask.querySelector('.task__title').addEventListener('blur', this.#saveTextChange.bind(this, { id, text: 'title' }));
		newElementTask.querySelector('.task__body').addEventListener('blur', this.#saveTextChange.bind(this, { id, text: 'body' }));
		newElementTask.querySelector('.task__title').addEventListener('click', editElement);
		newElementTask.querySelector('.task__body').addEventListener('click', editElement);

		return newElementTask;

	}

	#deleteTask(id) {
		this.tasks.remove(id);
		this.tasks.save();
		this.render();
	}

	#saveTextChange({ id, text }, event) {

		const element = event.target;
		element.contentEditable = false;
		const newText = element.innerText;

		const task = this.tasks.find(id);
		task[text] = newText;
		this.tasks.update(task);
		this.tasks.save();
	}

	dragTask(event) {

		const { dataTransfer } = event;

		const task = {
			id: this.dataset.id,
			title: this.querySelector('.task__title').innerText,
			body: this.querySelector('.task__body').innerText,
		}

		dataTransfer.effectAllowed = 'move';
		dataTransfer.setData('text', JSON.stringify(task));
	}

	// remove task when task were droped exitily
	removeTaskDroped(event) {

		if (event.dataTransfer.dropEffect !== 'none') {
			this.tasks.remove(event.target.dataset.id);
			event.target.remove();
			this.tasks.save();
		}
	}
}

customElements.define('task-column', Column);