import List from "./List";

export default class DataStore {
  #lists = [];

  #store = null;

  length = 0;

  constructor(store) {
    this.#store = store;
  }

  attach(list){
    this.#lists.push(list);
  }

  getLists() {
    const lists = DataStore.ListsJSONtoLists(this.#store.getItem("lists"));
    return lists;
  }
  
  static ListsJSONtoLists(ListJSON) {
    if (!ListJSON) return [];

    const listsRaw = JSON.parse(ListJSON);

    if (!Array.isArray(listsRaw)) return [];

    return listsRaw.map(listRaw => List.create(listRaw));
  }

  remove(id){
    this.#lists = this.#lists.filter(list => list.id !== id);
    this.save();
  }
  
  save() {
    const listsObject = this.#lists.map(list => list.toObject());
    this.#store.setItem("lists", JSON.stringify(listsObject));
  }
}
