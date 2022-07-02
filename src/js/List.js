function getRandomIntInclusive(min, max) {
  const minValue = Math.ceil(min);
  const maxValue = Math.floor(max);
  return Math.floor(
    Math.random() * (maxValue - minValue + 1) + minValue
  ).toString(); // The maximum is inclusive and the minimum is inclusive
}

export default class List {
  id = "";

  tasks = [];

  name = "";

  /**
   *
   * @param {id} string 
   * @param {name} string
   * @param {tasks} Array tasks
   */
  constructor() {
    this.id = getRandomIntInclusive(1, 10_000_000);
  }

  add(task) {
    this.tasks.push({ ...task });
  }

  static create({
    id,
    name,
    tasks,
  }){
    const newList = new List();
    newList.id = id;
    newList.name = name;
    newList.tasks = tasks;
    return newList;
  }

  find(id) {
    if (!id) return null;

    return this.tasks.find((task) => task.id === id);
  }

  getAll() {
    return [...this.tasks];
  }

  /**
   *
   * @param {string} id id of the task have find
   * @return number position index of tasks or -1 if not find
   */
  indexOf(id) {
    return this.tasks.findIndex((task) => task.id === id);
  }

  /**
   * @param {number} index index of task before insert new task
   * @param {task} task task for insert
   * @return true if element was inserted false otherway
   */
  insert(index, task) {
    try {
      this.tasks.splice(index, 0, task);
    } catch (err) {
      return false;
    }

    return true;
  }

  remove(id) {
    const taskWillRemove = this.tasks.findIndex((task) => task.id === id);
    if (taskWillRemove === -1) {
      return false;
    }

    this.tasks.splice(taskWillRemove, 1);
    return true;
  }

  removeDeleted() {
    this.tasks = this.tasks.filter((item) => !item.deleted);
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      tasks: this.tasks,
    };
  }

  update(task) {
    const taskIndex = this.tasks.findIndex((item) => item.id === task.id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = task;
      return true;
    }

    return false;
  }
}
