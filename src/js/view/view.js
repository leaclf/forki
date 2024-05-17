import icons from '../../img/icons.svg';
export default class View {
  _data;

  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data the data to be rendered(e.g recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering it to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Willy Wonka
   * @todo Finish implementation
   */
  render(data, render = true) {
    // console.log(data);
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);
    // console.log(curElements);
    newElements.forEach((newel, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newel.isEqualNode(curEl));

      //Update changed TEXT
      if (
        !newel.isEqualNode(curEl) &&
        newel.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newel.firstChild.nodeValue);
        curEl.textContent = newel.textContent;
      }

      // Update changed ATTRIBUTES
      if (!newel.isEqualNode(curEl)) {
        Array.from(newel.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
        <p>${message}</p>
       </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderSuccess(message = this._message) {
    const markup = `
      <div class="message">
        <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
        <p>${message}</p>
       </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
