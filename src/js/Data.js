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
		const taskRemoved = this.#data.find(task => task.id === id);
		if (!taskRemoved)
			return -1;

		this.#data = this.#data.filter(task => task.id === id);

		return taskRemoved;
	}

	find(id) {
		if (!id)
			return null;

		return { ...this.#data.get(id) };
	}

	getAll() {
		return Array.from(this.#data.values());
	}

	update(task) {
		if (this.#data.has(task.id)) {
			this.#data.set(task.id, task);
			return true;
		}

		return false;
	}

	save() {
		this.#dataStore.save();
	}
}