import View from './View.js';
import icons from 'url:../../img/icons.svg'; // parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    console.log(numPages);
    const currPage = this._data.page;

    // page 1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      return `
      <div>
        <span class="pagination__curr-page">Page ${currPage}</span>
      </div>
      <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;
    }

    //   last page
    if (currPage === numPages && numPages > 1) {
      return `
      <div>
            <span class="pagination__curr-page">Page ${currPage}</span>
          </div>
      <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
        `;
    }

    //   other pages
    if (currPage < numPages) {
      return `
      <div>
        <span class="pagination__curr-page">Page ${currPage}</span>
      </div>

      <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          
       <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>

          
        `;
    }

    //   pgae 1, and there aren't other pages
    return '';
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
