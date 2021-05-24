import templateHTML from './todo-app.html';
import '../todo-list/todo-list';
import '../todo-add/todo-add';

const template = document.createElement('template');
template.innerHTML = templateHTML;

export class TodoItemElement extends HTMLElement {
  constructor() {
    super();

    this.dom = this.attachShadow({ mode: 'open' });
    this.dom.appendChild(template.content.cloneNode(true));

    this.refs = {
      todoList: this.dom.querySelector('todo-list'),
      todoAdd: this.dom.querySelector('todo-add'),
    };

    this._todos = [
      { text: 'Faire les courses', done: false },
      { text: 'Présentation Web Components', done: true }
    ];

    this.handleTodoAdded = this.handleTodoAdded.bind(this);
    this.handleTodoDeleted = this.handleTodoDeleted.bind(this);
  }

  handleTodoDeleted(e) {
    const todoId = e.target.dataset['todoId'];
    this._todos.splice(todoId, 1);
    this.updateTodos();
  }

  handleTodoAdded(e) {
    const { text } = e.detail;
    if (this._todos.find(todo => todo.text === text))
      return;
    this._todos.push({
      text,
      done: false
    });
    this.updateTodos();
  }

  updateTodos() {
    this.refs.todoList.todos = [...this._todos];
  }

  connectedCallback() {
    this.updateTodos();
    this.refs.todoAdd.addEventListener('todo-added', this.handleTodoAdded);
    this.refs.todoList.addEventListener('todo-deleted', this.handleTodoDeleted);
  }

  disconnectedCallback() {
    this.refs.todoAdd.removeEventListener('todo-added', this.handleTodoAdded);
    this.refs.todoList.removeEventListener('todo-deleted', this.handleTodoDeleted);
  }
}

window.customElements.define('todo-app', TodoItemElement);
