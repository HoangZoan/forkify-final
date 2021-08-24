import { View } from './view';
import icons from 'url:../../img/icons.svg';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _message = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _iconType = 'icon-smile';

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
          </div>
          <svg class="nav__icon ${rec.upload ? '' : 'hidden'}">
            <use href="${icons}#icon-edit"></use>
          </svg>
          </a>
      </li>
        `
      )
      .join('');
  }
}

export default new BookmarkView();
