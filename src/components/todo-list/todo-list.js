import templateHTML from './todo-list.html';
import '../todo-item/todo-item';

const template = document.createElement('template');
template.innerHTML = templateHTML;

export default class TodoListElement extends HTMLElement {
  constructor() {
    super();

    this.dom = this.attachShadow({ mode: 'open'});
    this.dom.appendChild(template.content.cloneNode(true));

    this.refs = {
      todosContainer: this.dom.querySelector('#todos-container'),
    }

    this._todos = [];
  }

  static get observedAttributes() {
    return ['todos'];
  }

  handleTodoToggle(e) {
    const index = e.target.dataset['todoId'];
    if (!this._todos[index]) return;

    this._todos[index].done = e.detail.done;
  }

  renderTodo(todo, index) {
    const el = document.createElement('todo-item');
    el.done = todo.done;
    el.innerHTML = todo.text;
    el.dataset['todoId'] = index;
    el.addEventListener('todo-toggle', this.handleTodoToggle.bind(this));
    return el;
  }

  render() {
    this.refs.todosContainer.innerHTML = '';
    this._todos
      .map((todo, index) => this.renderTodo(todo, index))
      .forEach(el => this.refs.todosContainer.appendChild(el));
  }

  connectedCallback() {
    this.render();
  }

  set todos(newTodos) {
    this._todos = newTodos;
    this.render();
  }

  get todos() {
    return this._todos;
  }
}

window.customElements.define('todo-list', TodoListElement);
