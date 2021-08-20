import { View } from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.nav__item');

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
    const overlay = document.querySelector('.overlay');
    const window = document.querySelector('.add-recipe-window');
    const _this = this;
    [overlay, window].forEach(el =>
      el.addEventListener('click', function (e) {
        const btn =
          e.target.closest('.overlay') || e.target.closest('.btn--close-modal');
        if (!btn) return;

        _this._toggleClasses();
      })
    );
  }

  _toggleClasses() {
    const overlay = document.querySelector('.overlay');
    const window = document.querySelector('.add-recipe-window');
    overlay.classList.toggle('hidden');
    window.classList.toggle('hidden');
  }
}

export default new AddRecipeView();
