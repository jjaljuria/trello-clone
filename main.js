document.querySelectorAll('.column').forEach(column => {
	column.addEventListener('dragover', event => {
		if (event.target.classList.contains('column')) {
			event.preventDefault();
		}
	})// evita que se suelte sobre una task

	column.addEventListener('drop', event => {
		if (event.dataTransfer.effectAllowed === 'move') {
			const template = document.getElementById('templateTask').content.cloneNode(true);
			const task = JSON.parse(event.dataTransfer.getData('text'));
			template.querySelector('.task__title').innerText = task.title
			template.querySelector('.task__body').innerText = task.body;
			event.target.appendChild(template);
		}
	})
})


function dragTask(event) {
	const task = {
		title: event.target.querySelector('.task__title').innerText,
		body: event.target.querySelector('.task__body').innerText,
	}


	event.dataTransfer.effectAllowed = 'move';
	event.dataTransfer.setData('text', JSON.stringify(task));
}

// remove task when task were droped exitily
function removeTaskDroped(event) {

	if (event.dataTransfer.dropEffect !== 'none') {
		event.target.remove();
	}
}

function newTask(event) {
	const templateTask = document.getElementById('templateTask').content.cloneNode(true);
	event.target.parentNode.appendChild(templateTask);
}

function edit(event) {
	event.target.contentEditable = true;
}

function save(event) {
	event.target.contentEditable = false;
}

function deleteTask(event){
	event.target.parentNode.parentNode.parentNode.remove()
}