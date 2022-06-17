function edit(event) {
	event.target.contentEditable = true;
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min).toString(); // The maximum is inclusive and the minimum is inclusive
}

class Data{
	#data = new Map();

	#dataStore = null;

	constructor(dataStore){
		this.#dataStore = dataStore;
	}

	/**
	 * @param {Iterable<readonly [any, any]>} data
	 */
	set data(data){
		if(!Array.isArray(data))
			return new Error('typeError: Data need array');

		const newData = new Map();
		data.forEach(task => newData.set(task.id, task));

		this.#data = newData;
	}

	add(task){
		this.#data.set(task.id, { ...task});
	}

	remove(id){
		return this.#data.delete(id);
	}

	find(id){
		return { ...this.#data.get(id)};
	}

	getAll(){
		return Array.from(this.#data.values());
	}

	update(task) {
		if(this.#data.has(task.id)){
			this.#data.set(task.id, task);
			return true;
		}

		return false;
	}

	save(){
		this.#dataStore.save();
	}


}

class DataStore{
	#data = [];

	#store = null;

	length = 0;

	constructor(store){
		this.#store = store;
	}

	attach(){
		const newData = new Data(this);
		this.#data[this.length++] = newData;

		return newData;
	}

	save(){

		const data = this.#data.map((item)=> item.getAll());

		this.#store.setItem('data', JSON.stringify(data));
	}

	populate(){
		const data = JSON.parse(this.#store.getItem('data'));

		if(!Array.isArray(data))
			return;
		
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[i].length; j++) {
				this.#data[i].add(data[i][j]);
			}
			
		}

	}
}

const store = new DataStore(localStorage);

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
				}
			})
		})

		// setting tasks

		this.tasks.getAll().forEach((task) => this.#createTask(task));
	}

	newTask(event) {
		const task = { title: '', body: '', id: getRandomIntInclusive(1, 100000000) };
		this.#createTask(task);
		this.tasks.add(task);
		this.tasks.save();
	}

	#createTask({ id, title, body }) {
		const templateTask = document.getElementById('templateTask').content.cloneNode(true); // clona template

		this.firstElementChild.appendChild(templateTask);// agrega a DOM
		const newElementTask = this.firstElementChild.lastElementChild

		// setting
		newElementTask.dataset.id = id;
		newElementTask.querySelector('.task__title').innerText = title
		newElementTask.querySelector('.task__body').innerText = body;

		// agrega eventos
		newElementTask.addEventListener('dragstart', this.dragTask.bind(this));
		newElementTask.addEventListener('dragend', this.removeTaskDroped.bind(this));
		newElementTask.querySelector('.task__icon-delete').addEventListener('click', this.#deleteTask.bind(this, id));
		newElementTask.querySelector('.task__title').addEventListener('blur', this.#saveTextChange.bind(this, [id, 'title']));
		newElementTask.querySelector('.task__body').addEventListener('blur', this.#saveTextChange.bind(this, [id, 'body']));
		return newElementTask;

	}

	#deleteTask(id) {
		this.tasks.remove(id);
		this.tasks.save();
		this.render();
	}

	#saveTextChange([id, text]) {
		event.target.contentEditable = false;
		const newText = event.target.innerText;
	
		const task = this.tasks.find(id);
		task[text] = newText;
		this.tasks.update(task);
		this.tasks.save();
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
			this.tasks.remove(event.target.dataset.id);
			event.target.remove();
			this.tasks.save();
		}
	}
}

customElements.define('task-column', Column);

window.addEventListener('DOMContentLoaded', ()=> {
	store.populate();
	document.querySelectorAll('task-column').forEach(column => column.render());
	document.querySelector('.title > input').value = getTitle();
});

function saveTitle(event){
	const title = event.target.value;
	if(!title)
		return false;
	
	localStorage.setItem('title', JSON.stringify(title));
}

function getTitle(){
	const title = localStorage.getItem('title');
	if(!title)
		return '';
	
	return JSON.parse(title);
}