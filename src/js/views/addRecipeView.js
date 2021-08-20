import { View } from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.nav__item');
  _overlayEl = document.querySelector('.overlay');
  _windowEl = document.querySelector('.add-recipe-window');
  _formEl = document.querySelector('.upload');

  addOpenModalHandler() {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.nav__btn--add-recipe');
        if (!btn) return;

        this._toggleClasses();
      }.bind(this)
    );
  }

  addCloseModalHandler() {
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

  addSubmitHandler() {
    this._formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Working');
    });
  }

  _toggleClasses() {
    this._overlayEl.classList.toggle('hidden');
    this._windowEl.classList.toggle('hidden');
  }
}

export default new AddRecipeView();
