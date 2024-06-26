import icons from '../../img/icons.svg';
import View from './view';
import previewView from './preview-view';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query. Please try again.';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);
    // console.log(this._generateMarkup);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
