document.querySelectorAll('.column').forEach(column => {
	column.addEventListener('dragover', event => {
		if (event.target.classList.contains('column')) {
			event.preventDefault();
		}
	})// evita que se suelte sobre una task

	column.addEventListener('drop', event => {
		if (event.dataTransfer.effectAllowed === 'move') {
			const template = document.getElementById('templateTask').content.cloneNode(true);
			const content = event.dataTransfer.getData('text/plain');
			template.querySelector('.task__body').innerText = content;
			event.target.appendChild(template);
		}
	})
})


function dragTask(event) {
	event.dataTransfer.effectAllowed = 'move';
	event.dataTransfer.setData('text', event.target.querySelector('.task__body').innerText);
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

function dragTaskMobile(event) {
	let touchLocation = event.targetTouches[0];
	console.log(touchLocation);
	event.target.style.left = touchLocation.pageX + 'px';
	event.target.style.top = touchLocation.pageY + 'px';
}

function deleteTask(event){
	event.target.parentNode.parentNode.remove()
}