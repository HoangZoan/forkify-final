import icons from 'url:../../img/icons.svg';

export class View {
  _data;

  render(data) {
    if (Array.isArray(data) && data.length === 0) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  update(data) {
    this._data = data;
    // Save the new change HTML in 'newMarkup'
    const newMarkup = this._generateMarkup();

    // Create new DOM by 'newMarkup'
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderError(message = this._errorMessage) {
    const markup = this._generateErrorMessage(message);

    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;

    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  _formatQuantity(num) {
    const numStr = num.toFixed(2).toString();
    if (numStr.includes('.0')) return numStr.slice(0, -3);
    if (numStr.slice(-1) === '0') return numStr.slice(0, -1);
    return numStr;
  }

  _goTopPage() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  _generateErrorMessage(message) {
    return `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
  }
}
