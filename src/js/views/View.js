import icons from "url:../../img/icons.svg";

export default class View {
    _data;

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render = false
     * @this {Object} View instance
     * @author Ben Burgess
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin", markup);
    }

    /**
     * Similar to render, except instead of forcing the HTML to re-write entirely, it will only re-write parts that have changed (for example when changing quantities)
     * @param {Object | Objectp[]} data The data to be rendered
     * @this {Object} View instance
     * @author Ben Burgess
     */
    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);

        // At this point, the newDom and _parentEl with queryselectorall will return a nodelist, so we save that as an array so the nodes can be compared. Sort of like two virtual DOM's being compared.
        const newElements = Array.from(newDOM.querySelectorAll("*"));
        const curElements = Array.from(this._parentEl.querySelectorAll("*"));

        // Here, we take each part of the new DOM array and compare it to see if it's different from the current DOM array. If yes, then it also checks the first child element's nodevalue (see mdn nodevalue) to see if the text content actually has anything (so anything other than an empty string). If both of those are true, then it changes the current element to the new element. This will mean ONLY the element that has the text content changes, rather than the whole parent element changing.
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            // Updates text
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {
                curEl.textContent = newEl.textContent;
            }

            // Updates attributes
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
            }
        });
    }

    _clear() {
        this._parentEl.innerHTML = "";
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
        this._parentEl.insertAdjacentHTML("afterbegin", markup);
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
        this._parentEl.insertAdjacentHTML("afterbegin", markup);
    }

    renderMessage(message = this._defaultMessage) {
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
        this._parentEl.insertAdjacentHTML("afterbegin", markup);
    }
}