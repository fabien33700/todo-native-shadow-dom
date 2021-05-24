import templateHTML from './todo-add.html'

const template = document.createElement('template');
template.innerHTML = templateHTML;

export class TodoAddElement extends HTMLElement {
  constructor() {
    super();

    this.dom = this.attachShadow({ mode: 'open' });
    this.dom.appendChild(template.content.cloneNode(true));

    this.refs = {
      addInput: this.dom.querySelector('#add-input'),
    };

    this.addTodo = this.addTodo.bind(this);
  }

  addTodo(e) {
    e.preventDefault();
    if (e.key !== 'Enter') return;

    const todoText = e.target.value;
    if (!todoText || !todoText.trim()) return;

    this.dispatchEvent(new CustomEvent('todo-added', { detail: { text: todoText }}));
    e.target.value = '';
  }

  connectedCallback() {
    this.refs.addInput.addEventListener('keyup', this.addTodo);
  }

  disconnectedCallback() {
    this.refs.addInput.removeEventListener('keyup', this.addTodo);
  }

}

window.customElements.define('todo-add', TodoAddElement);
