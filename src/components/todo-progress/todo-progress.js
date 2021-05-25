import templateHTML from './todo-progress.html';

// Wrapping HTML code in a <template> tag
const template = document.createElement('template');
template.innerHTML = templateHTML;

export default class TodoProgressElement extends HTMLElement {
  constructor() {
    super();

    // Creating Shadow DOM
    this.dom = this.attachShadow({ mode: 'open'});
    this.dom.appendChild(template.content.cloneNode(true));

    // Reference to element children
    this.refs = {
      todoProgress: this.dom.querySelector('#todo-progress'),
    }
  }

  static get observedAttributes() {
    return ['value'];
  }

  render() {
    this.refs.todoProgress.style.width = this.value + '%';
  }

  connectedCallback() {
    this.render();
  }

  /**
   * Getter for 'value' property
   */
  get value() {
    return +this.getAttribute('value');
  }

  /**
   * Setter for 'value' property
   */
  set value(newValue) {
    newValue = !isNaN(parseInt(newValue, 10)) ? newValue : 0;
    this.setAttribute('value', newValue);
    this.render();
  }
}

// Declaring the element with CustomElements API
window.customElements.define('todo-progress', TodoProgressElement);
