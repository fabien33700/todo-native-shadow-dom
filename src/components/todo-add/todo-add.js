import templateHTML from './todo-add.html'

// Wrapping HTML code in a <template> tag
const template = document.createElement('template');
template.innerHTML = templateHTML;

export class TodoAddElement extends HTMLElement {
  constructor() {
    super();

    // Creating Shadow DOM
    this.dom = this.attachShadow({ mode: 'open' });
    this.dom.appendChild(template.content.cloneNode(true));

    // Reference to element children
    this.refs = {
      addInput: this.dom.querySelector('#add-input'),
    };

    // Event handlers binding
    this.addTodo = this.addTodo.bind(this);
  }

  /**
   * Fire an event to add a todo
   * @param {Event} e the event sent by typing enter
   */
  addTodo(e) {
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

// Declaring the element with CustomElements API
window.customElements.define('todo-add', TodoAddElement);
