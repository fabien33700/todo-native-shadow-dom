import templateHTML from './todo-item.html'

const template = document.createElement('template');
template.innerHTML = templateHTML;

export class TodoItemElement extends HTMLElement {
  static get observedAttributes() {
    return ['done'];
  }

  constructor() {
    super();

    this.dom = this.attachShadow({ mode: 'open' });
    this.dom.appendChild(template.content.cloneNode(true));

    this.refs = {
      todoText: this.dom.querySelector('#todo-text'),
      todoCheck: this.dom.querySelector('#todo-check'),
    };

    this.refs.todoCheck.addEventListener('change', this.handleCheck.bind(this))
  }

  handleCheck() {
    const { todoCheck } = this.refs;
    this.done = todoCheck.checked;
    this.dispatchEvent(new CustomEvent('todo-toggle', { detail: { done: this.done }}));
    this.render();
  }

  set done(isDone) {
    if (isDone)
      this.setAttribute('done', '');
    else
      this.removeAttribute('done');
  }

  get done() {
    return this.hasAttribute('done');
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const { todoCheck, todoText } = this.refs;
    if (this.done)
      todoCheck.setAttribute('checked', '');
    else
      todoCheck.removeAttribute('checked');
    todoText.classList.toggle('done', this.done);
  }
}

window.customElements.define('todo-item', TodoItemElement);
