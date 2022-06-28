import Data from "./Data";

export default class DataStore {
  #data = [];

  #store = null;

  length = 0;

  constructor(store) {
    this.#store = store;
  }

  attach() {
    const newData = new Data(this);
    this.#data[this.length] = newData;
    this.length += 1;

    return newData;
  }

  save() {
    const data = this.#data.map((item) => item.getAll());

    this.#store.setItem("data", JSON.stringify(data));
  }

  populate() {
    const data = JSON.parse(this.#store.getItem("data"));

    if (!Array.isArray(data)) return;

    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < data[i].length; j += 1) {
        this.#data[i].add(data[i][j]);
      }
    }
  }
}
