function edit(event) {
	event.target.contentEditable = true;
}

function save(event) {
	event.target.contentEditable = false;
}


function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min).toString(); //The maximum is inclusive and the minimum is inclusive
}

class Column extends HTMLElement {
	tasks = [];

	constructor() {
		super();
		this.render();
		
	}

	render() {
		this.innerHTML = `
		<section class="column">
			<p class="new_task" onclick="">
				Create Task
			</p>
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
					this.tasks.push(task);
				}
			})
		})

		// setting tasks
		this.tasks.forEach((task)=> this.#createTask(task))
	}

	newTask(event) {
		const task = { title: '', body: '', id: getRandomIntInclusive(1,100000000)};
		this.#createTask(task);
		this.tasks.push(task);
		console.log(this.tasks)
	}

	#createTask({ id , title, body }) {
		console.log({id}, {title}, {body})
		const templateTask = document.getElementById('templateTask').content.cloneNode(true); // clona template
		
		this.firstElementChild.appendChild(templateTask);// agrega a DOM
		const newElementTask = this.firstElementChild.lastElementChild

		// setting
		newElementTask.dataset.id = id;
		newElementTask.querySelector('.task__title').innerText = title
		newElementTask.querySelector('.task__body').innerText = body;

		// agrega eventos
		newElementTask.addEventListener('dragstart', this.dragTask.bind(this));
		newElementTask.addEventListener('dragend',this.removeTaskDroped.bind(this));
		newElementTask.querySelector('.task__icon-delete').addEventListener('click', this.#deleteTask.bind(this,id));

		return newElementTask;

	}

	#deleteTask(id) {
		this.tasks = this.tasks.filter(task => task.id !== id);
		this.render();
	}
	

	dragTask(event) {
		const task = {
			id: event.target.dataset.id,
			title: event.target.querySelector('.task__title').innerText,
			body: event.target.querySelector('.task__body').innerText,
		}

		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text', JSON.stringify(task));
	}

	// remove task when task were droped exitily
	removeTaskDroped(event) {
		
	if (event.dataTransfer.dropEffect !== 'none') {
		this.tasks = this.tasks.filter((task) => task.id !== event.target.dataset.id);
		event.target.remove();
	}
}
}
customElements.define('task-column', Column);