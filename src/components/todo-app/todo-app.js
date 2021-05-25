import templateHTML from './todo-app.html';

// Importing required elements
import '../todo-list/todo-list';
import '../todo-add/todo-add';
import '../todo-progress/todo-progress';

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
      todoList: this.dom.querySelector('todo-list'),
      todoAdd: this.dom.querySelector('todo-add'),
      todoProgress: this.dom.querySelector('todo-progress'),
    };

    // Data model
    this._todos = [
      { text: 'Faire les courses', done: false },
      { text: 'Présentation Web Components', done: true }
    ];

    // Event handlers binding
    this.handleAdded = this.handleAdded.bind(this);
    this.handleDeleted = this.handleDeleted.bind(this);
    this.handleToggled = this.handleToggled.bind(this);
  }

  /**
   * Handle the event sent when user click on a todo check.
   * @param {CustomEvent} e the event
   */
  handleToggled(e) {
    const { done, todoId } = e.detail;
    if (!this._todos[todoId]) return;

    this._todos = this._todos.map((todo, index) => {
      const elem = (todoId === index) ? { ...todo, done } : todo;
      return elem;
    });
    this.updateTodos();
  }
  /**
   * Handle the event sent when user click on a todo delete button.
   * @param {CustomEvent} e the event
   */
  handleDeleted(e) {
    const { todoId } = e.detail;
    this._todos.splice(todoId, 1);
    this.updateTodos();
  }

  /**
   * Handle the event sent when user enter a new todo.
   * @param {CustomEvent} e the event
   */
  handleAdded(e) {
    const { text } = e.detail;
    if (this._todos.find(todo => todo.text === text))
      return;
    this._todos.push({
      text,
      done: false
    });
    this.updateTodos();
  }

  /**
   * Update todo list from data model
   */
  updateTodos() {
    this.refs.todoList.todos = [...this._todos];
    const { percentage } = this.getTodosCount();
    this.refs.todoProgress.value = percentage;
  }

  /**
   * Get todos count stats.
   * @returns {object}
   */
  getTodosCount() {
    const done = this._todos.filter(todo => todo.done).length;
    const total = this._todos.length;
    const percentage = Math.round(done / total * 100);
    return { done, total, percentage };
  }

  connectedCallback() {
    this.updateTodos();
    this.refs.todoAdd.addEventListener('todo-added', this.handleAdded);
    this.refs.todoList.addEventListener('todo-deleted', this.handleDeleted);
    this.refs.todoList.addEventListener('todo-toggled', this.handleToggled);
  }

  disconnectedCallback() {
    this.refs.todoAdd.removeEventListener('todo-added', this.handleAdded);
    this.refs.todoList.removeEventListener('todo-deleted', this.handleDeleted);
    this.refs.todoList.removeEventListener('todo-toggled', this.handleToggled);
  }
}

// Declaring the element with CustomElements API
window.customElements.define('todo-app', TodoItemElement);
