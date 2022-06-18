export default class Data {
	#data = new Map();

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

		const newData = new Map();
		data.forEach(task => newData.set(task.id, task));

		this.#data = newData;
	}

	add(task) {
		this.#data.set(task.id, { ...task });
	}

	remove(id) {
		return this.#data.delete(id);
	}

	find(id) {
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