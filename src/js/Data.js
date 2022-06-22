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

	remove(id) {
		const taskWillRemove = this.#data.findIndex(task => task.id === id);
		if (taskWillRemove === -1) {
			return false;
		}

		this.#data.splice(taskWillRemove, 1);
		return true;
	}

	find(id) {
		if (!id)
			return null;

		return this.#data.find(task => task.id === id);
	}

	getAll() {
		return [...this.#data];
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