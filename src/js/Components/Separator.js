export default class Separator extends HTMLElement {

	constructor(props) {
		super(props);

		this.attachShadow({ mode: 'open' })

		this.addEventListener('dragenter', () => {
			this.shadowRoot.querySelector('.separator').classList.toggle('space', true)
		});
		this.addEventListener('dragleave', () => {
			this.shadowRoot.querySelector('.separator').classList.toggle('space', false);
		});

		this.addEventListener('dragover', (event) => {
			event.preventDefault();
		})

		this.addEventListener('drop', event => {
			event.stopPropagation();
			if (event.dataTransfer.effectAllowed === 'move') {
				const task = JSON.parse(event.dataTransfer.getData('text'));
				this.shadowRoot.querySelector('.separator').classList.toggle('space', false);
				const newEvent = new CustomEvent('dropTask', {
					detail: {
						task
					},
					composed: true
				})
				this.dispatchEvent(newEvent);

			}
		})

		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = `
			${this.#style()}
			<div class="separator"></div>
		`;
	}

	#style() {
		return (`
			<style>
			.separator {
				box-sizing: border-box;
				padding: 1rem;
			}
			.space {
				width: 100%;
				height: 8rem;
			}

			</style>
		`);
	}
}

customElements.define('task-separator', Separator);