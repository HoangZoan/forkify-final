import { View } from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.nav__item');
  _overlayEl = document.querySelector('.overlay');
  _windowEl = document.querySelector('.add-recipe-window');
  _formEl = document.querySelector('.upload');

  constructor() {
    super();
    this._addOpenModalHandler();
    this._addCloseModalHandler();
    this._checkFirstInput();
  }

  addSubmitHandler() {
    this._formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = [...new FormData(this)];
      const data = Object.fromEntries(formData);
      console.log(data);
    });
  }

  _addOpenModalHandler() {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.nav__btn--add-recipe');
        if (!btn) return;

        this._toggleClasses();
      }.bind(this)
    );
  }

  _addCloseModalHandler() {
    const _this = this;
    [this._overlayEl, this._windowEl].forEach(el =>
      el.addEventListener('click', function (e) {
        const btn =
          e.target.closest('.overlay') || e.target.closest('.btn--close-modal');
        if (!btn) return;

        _this._toggleClasses();
      })
    );
  }

  _toggleClasses() {
    this._overlayEl.classList.toggle('hidden');
    this._windowEl.classList.toggle('hidden');
  }

  _checkFirstInput() {
    const inputs1 = document.querySelectorAll('input[placeholder="Quantity"]');
    const inputs2 = document.querySelectorAll(
      'input[placeholder="Unit (g, cup...)"]'
    );
    const input1Elements = Array.from(inputs1);
    const input2Elements = Array.from(inputs2);
    const events = [...input1Elements, ...input2Elements];
    events.forEach(el =>
      el.addEventListener('blur', function () {
        const span = this.closest('span');
        const input3 = span.querySelector('input[placeholder="Description"]');

        // Check number type of 'Quantity' inputs

        // Check if 'Description' value required to be put in
        if (span.dataset.first) return; // Reject 'Ingredient 1' inputs

        if (this.value !== '') input3.setAttribute('required', 'true');
        else input3.removeAttribute('required');
      })
    );
  }
}

export default new AddRecipeView();
