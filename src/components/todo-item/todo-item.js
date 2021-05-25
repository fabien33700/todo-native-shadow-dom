import templateHTML from './todo-item.html'

// Wrapping HTML code in a <template> tag
const template = document.createElement('template');
template.innerHTML = templateHTML;

export class TodoItemElement extends HTMLElement {
  constructor() {
    super();

    // Creating Shadow DOM
    this.dom = this.attachShadow({ mode: 'open' });
    this.dom.appendChild(template.content.cloneNode(true));

    // Reference to element children
    this.refs = {
      todoText: this.dom.querySelector('#todo-text'),
      todoCheck: this.dom.querySelector('#todo-check'),
      deleteBtn: this.dom.querySelector('#delete-btn'),
    };

     // Event handlers binding
    this.handleCheck = this.handleCheck.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  static get observedAttributes() {
    return ['done'];
  }

  /**
   * Handle click event from delete button, then fire 'todo-deleted'
   * event to parent hierarchy.
   */
  handleDelete() {
    this.dispatchEvent(new CustomEvent('todo-deleted', {
      detail: { todoId: +this.dataset['todoId'] },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Handle click event from todo check, then fire 'todo-toggled'
   * event to parent hierarchy.
   */
  handleCheck() {
    this.dispatchEvent(new CustomEvent('todo-toggled', {
      detail: {
        todoId: +this.dataset['todoId'],
        done: !this.done,
      },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Setter for 'done' property
   */
  set done(isDone) {
    if (isDone)
      this.setAttribute('done', '');
    else
      this.removeAttribute('done');
  }

  /**
   * Getter for 'done' property
   */
  get done() {
    return this.hasAttribute('done');
  }

  connectedCallback() {
    this.render();
    this.refs.todoCheck.addEventListener('click', this.handleCheck);
    this.refs.deleteBtn.addEventListener('click', this.handleDelete);
  }

  disconnectedCallback() {
    this.refs.todoCheck.removeEventListener('click', this.handleCheck);
    this.refs.deleteBtn.removeEventListener('click', this.handleDelete);
  }

  render() {
    const { todoCheck, todoText } = this.refs;
    todoCheck.classList.toggle('checked', this.done);
    todoText.classList.toggle('done', this.done);
  }
}

// Declaring the element with CustomElements API
window.customElements.define('todo-item', TodoItemElement);
