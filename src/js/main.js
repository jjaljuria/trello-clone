import {store} from './store'
import './TaskColumn'

function saveTitle(event) {
	const title = event.target.value;
	if (!title)
		return false;

	localStorage.setItem('title', JSON.stringify(title));
	return true;
}

function getTitle() {
	const title = localStorage.getItem('title');
	if (!title)
		return '';

	return JSON.parse(title);
}
window.addEventListener('DOMContentLoaded', () => {
	store.populate();
	document.querySelectorAll('task-column').forEach(column => column.render());
	document.querySelector('.title > input').value = getTitle();
	document.querySelector('.title > input').onblur = saveTitle;
});