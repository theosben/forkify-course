import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class ResultsView extends View {
    _parentEl = document.querySelector('.results');
    _errorMessage = `No recipes found from your search. Please try again!`;
    _defaultMessage = ``;

    _generateMarkup() {
        return this._data
            .map(result => previewView.render(result, false))
            .join("");
    }
}

export default new ResultsView ();