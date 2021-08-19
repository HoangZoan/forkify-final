import { View } from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addRenderHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const header = document.querySelector('.header');
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      handler(btn.dataset.page);
    });
  }

  _generateMarkup() {
    const resultsCount = this._data.results.length;
    const resPerPage = this._data.resultsPerPage;
    const pageTotal = Math.ceil(resultsCount / resPerPage);
    const page = +this._data.page;

    // In the first page, and there are NO others
    if (resultsCount < resPerPage) return '';

    // In the first page, and there are others
    if (page === 1) return this._generateNextPage(page);

    // In the last page
    if (page === pageTotal) return this._generatePrevPage(page);

    // In the others
    return this._generateNextPage(page) + this._generatePrevPage(page);
  }

  _generateNextPage(page) {
    return `
        <button class="btn--inline pagination__btn--next" data-page="${
          page + 1
        }">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }

  _generatePrevPage(page) {
    return `
        <button class="btn--inline pagination__btn--prev" data-page="${
          page - 1
        }">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
        </button>
      `;
  }
}

export default new PaginationView();
