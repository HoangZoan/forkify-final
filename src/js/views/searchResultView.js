import { exp } from 'prelude-ls';
import { View } from './view';
import icons from 'url:../../img/icons.svg';

class SearchResultView extends View {
  _data;
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Results not found. Please try again!';

  getQuery() {
    return document.querySelector('.search__field').value;
  }

  clearInput() {
    document.querySelector('.search__field').value = '';
  }

  addSubmitHandler(handler) {
    document.querySelector('.search').addEventListener('submit', handler);
  }

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data
      .map(
        rec => `
      <li class="preview">
          <a class="preview__link ${
            rec.id === id ? 'preview__link--active' : ''
          } " href="#${rec.id}">
          <figure class="preview__fig">
              <img crossorigin="" src="${rec.image}" alt="Test" />
          </figure>
          <div class="preview__data">
              <h4 class="preview__title">${rec.title}</h4>
              <p class="preview__publisher">${rec.publisher}</p>
              <div class="preview__user-generated">
              <svg>
                  <use href="${icons}#icon-user"></use>
              </svg>
              </div>
          </div>
          </a>
      </li>
        `
      )
      .join('');
  }
}

export default new SearchResultView();
