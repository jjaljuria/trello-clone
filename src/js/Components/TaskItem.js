function editElement(event) {
	const element = event.target;
	element.contentEditable = true;
}

export default class TaskItem extends HTMLElement {

	#body = '';

	#title = '';

	constructor(props) {
		super(props);

		this.attachShadow({ mode: 'open' });

		this.render();

		// handlers
		this.titleElem.addEventListener('click', editElement)
		this.titleElem.addEventListener('blur', (event) => this.saveText(event, 'title'));
		this.bodyElem.addEventListener('blur', (event) => this.saveText(event, 'body'));
		this.bodyElem.addEventListener('click', editElement);
		this.deleteButton.addEventListener('click', this.deleteTask.bind(this));
	}

	deleteTask() {
		const newEvent = new CustomEvent('deleteTask', {
			detail: {
				id: this.id
			}
		});

		this.dispatchEvent(newEvent);
	}

	saveText(event, attr) {
		const newEvent = new CustomEvent('textChange', {
			detail: {
				id: this.dataset.id,
				attr,
				text: event.target.innerText
			},
			composed: true
		});


		this.setAttribute(attr, event.target.innerText);
		event.target.contentEditable = false;
		this.dispatchEvent(newEvent);
	}

	set body(value) {
		this.#body = value;
		this.setAttribute('body', value);
	}

	get body() {
		return this.#body;
	}

	set title(value) {
		this.#title = value;
		this.setAttribute('title', value);
	}

	get title() {
		return this.#title;
	}

	static get observedAttributes() {
		return ['title', 'body', 'id']
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log({ name }, { newValue })
		switch (name) {
			case 'title':
				this.titleElem.innerText = newValue || '';
				break;
			case 'body':
				this.bodyElem.innerText = newValue || '';
				break;
			case 'id':
				this.dataset.id = newValue || '';
				break;
			default:

		}
	}

	render() {
		this.shadowRoot.innerHTML = `
			${this.#styles()}
			<div class="task" draggable="true" data-id="${this.id}">
			<header class="task__header">
				<div class="task__title">
				</div>
				<div class="task__icon">
					<button class="task__icon-delete">x</button>
				</div>
			</header>
			<hr>
			<section class="task__body">
			</section>
		</div>
		`;


		this.titleElem = this.shadowRoot.querySelector('.task__title');
		this.bodyElem = this.shadowRoot.querySelector('.task__body');
		this.deleteButton = this.shadowRoot.querySelector('.task__icon-delete');
	}

	#styles() {
		return `
		<style>
		.task {
			display: block;
			background-color: var(--color-primary);
			width: calc(100% - 1rem);
			margin: auto;
			word-break: break-word;
		}

		.task hr {
			border: 0;
			border-top: 1px solid #777;
			margin-left: 4px;
			margin-right: 4px;
		}

		.task__header {
			display: flex;
			word-break: break-word;
			padding: 5px;
			gap: 2px
		}

		.task__title {
			width: 100%;
			outline: none;
			word-wrap: break-word;
		}

		.task__icon {
			display: flex;
			gap: 2px;
			align-items: start;
		}

		.task__body {
			min-height: 5rem;
			word-wrap: break-word;
			padding: 5px;
			outline: none;
		}
		</style>
		`;
	}
}

customElements.define('task-item', TaskItem);