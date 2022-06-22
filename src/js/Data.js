export default class Data {
	#data = [];

	#dataStore = null;

	constructor(dataStore) {
		this.#dataStore = dataStore;
	}

	/**
	 * @param {Iterable<readonly [any, any]>} data
	 */
	set data(data) {
		if (!Array.isArray(data))
			throw new Error('typeError: Data need array');

		const newData = [];
		data.forEach(task => newData.push(task));

		this.#data = newData;
	}

	add(task) {
		this.#data.push({ ...task });
	}

	find(id) {
		if (!id)
			return null;

		return this.#data.find(task => task.id === id);
	}

	getAll() {
		return [...this.#data];
	}

	/**
	 * 
	 * @param {string} id id of the task have find
	 * @return number position index of tasks or -1 if not find
	 */
	indexOf(id) {
		return this.#data.findIndex(task => task.id === id);
	}

	/**
	 * @param {number} index index of task before insert new task
	 * @param {task} task task for insert
	 * @return true if element was inserted false otherway
	 */
	insert(index, task) {
		try {

			this.#data.splice(index, 0, task);
		} catch (err) {

			return false;
		}

		return true;
	}

	remove(id) {
		const taskWillRemove = this.#data.findIndex(task => task.id === id);
		if (taskWillRemove === -1) {
			return false;
		}

		this.#data.splice(taskWillRemove, 1);
		return true;
	}

	update(task) {
		const taskIndex = this.#data.findIndex(item => item.id === task.id);
		if (taskIndex !== -1) {
			this.#data[taskIndex] = task;
			return true;
		}

		return false;
	}

	save() {
		this.#dataStore.save();
	}
}