import templateHTML from './todo-list.html';

// Importing required elements
import '../todo-item/todo-item';
import { TodoItemElement } from '../todo-item/todo-item';

// Wrapping HTML code in a <template> tag
const template = document.createElement('template');
template.innerHTML = templateHTML;

export default class TodoListElement extends HTMLElement {
  constructor() {
    super();

    // Creating Shadow DOM
    this.dom = this.attachShadow({ mode: 'open'});
    this.dom.appendChild(template.content.cloneNode(true));

    // Reference to element children
    this.refs = {
      todosContainer: this.dom.querySelector('#todos-container'),
    }

    // Data model
    this._todos = [];
  }

  static get observedAttributes() {
    return ['todos'];
  }

  /**
   * Render a todo item with associated <todo-item> element
   * @param {object} todo The todo item
   * @param {number} index The item index in todo list
   * @returns {TodoItemElement}
   */
  renderTodo(todo, index) {
    const el = document.createElement('todo-item');
    el.done = todo.done;
    el.innerHTML = todo.text;
    el.dataset['todoId'] = index;
    return el;
  }

  render() {
    this.refs.todosContainer.innerHTML = '';
    this._todos
      .map((todo, index) => this.renderTodo(todo, index))
      .forEach(el => this.refs.todosContainer.appendChild(el));
  }

  /**
   * Setter for 'todos' property
   */
  set todos(newTodos) {
    this._todos = newTodos;
    this.render();
  }

  /**
   * Getter for 'todos' property
   */
  get todos() {
    return this._todos;
  }

  connectedCallback() {
    this.render();
  }
}

// Declaring the element with CustomElements API
window.customElements.define('todo-list', TodoListElement);
