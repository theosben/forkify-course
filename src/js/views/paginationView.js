import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
    _parentEl = document.querySelector(".pagination");

    addHandlerClick(handler) {
        this._parentEl.addEventListener("click", function(e) {
            const btn = e.target.closest(".btn--inline");

            if (!btn) return;

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        });
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        const nextMarkup = `
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
        const prevMarkup = `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
        `;

        // First page, other pages after
        if (curPage === 1 && numPages > 1) { return nextMarkup; }

        // Last page
        if (curPage === numPages && numPages > 1) { return prevMarkup; }

        // Other page in the middle
        if (curPage < numPages) { return prevMarkup + nextMarkup; }

        // Page 1, no other pages
        return ``;
    }
}

export default new PaginationView();