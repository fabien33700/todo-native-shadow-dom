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

    this.todos = [
      {
        text: 'Tâche 1',
        done: false,
      },
      {
        text: 'Tâche 2',
        done: true,
      },
    ]
  }

  handleTodoToggle(e) {
    const index = e.target.getAttribute('todo-id');
    if (!this.todos[index]) return;

    this.todos[index].done = e.detail.done;
  }

  renderTodo(todo, index) {
    const el = document.createElement('todo-item');
    el.done = todo.done;
    el.innerHTML = todo.text;
    el.setAttribute('todo-id', index);
    el.addEventListener('todo-toggle', this.handleTodoToggle.bind(this));
    return el;
  }

  render() {
    this.todos
      .map((todo, index) => this.renderTodo(todo, index))
      .forEach(el => this.refs.todosContainer.appendChild(el));
  }

  connectedCallback() {
    this.render();
  }
}

window.customElements.define('todo-list', TodoListElement);
