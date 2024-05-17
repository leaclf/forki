import icons from '../../img/icons.svg';
import View from './view';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was succesfully uploaded :)';
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
    // this._addHandlerUpload();
  }
  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      //   console.log(dataArray);
      handler(data);
    });
  }
  _generateMarkup() {}
}
export default new AddRecipeView();
