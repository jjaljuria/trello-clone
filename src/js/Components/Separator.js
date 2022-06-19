export default class Separator extends HTMLElement {

	constructor(props) {
		super(props);

		this.addEventListener('dragenter', () => {
			this.querySelector('.separator').classList.toggle('space', true);
		});
		this.addEventListener('dragleave', () => {
			this.querySelector('.separator').classList.toggle('space', false);
		});
		this.render();
	}

	render() {
		this.innerHTML = `
			<div class="separator"></div>
		`;
	}
}

customElements.define('task-separator', Separator);