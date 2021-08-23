import { View } from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.nav__item');
  _overlayEl = document.querySelector('.overlay');
  _windowEl = document.querySelector('.add-recipe-window');
  _formEl = document.querySelector('.upload');
  _submitAvailable = true;
  _valueTypeValidation = [];

  constructor() {
    super();
    this._addOpenModalHandler();
    this._addCloseModalHandler();
    this._validateInputs();
  }

  addSubmitHandler() {
    this._formEl.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();

        if (!this._submitAvailable) return;
        const formData = [...new FormData(this._formEl)];
        const data = Object.fromEntries(formData);
        // console.log(data);
      }.bind(this)
    );
  }

  _addOpenModalHandler() {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.nav__btn--add-recipe');
        if (!btn) return;

        this._toggleClasses();
      }.bind(this)
    );
  }

  _addCloseModalHandler() {
    const _this = this;
    [this._overlayEl, this._windowEl].forEach(el =>
      el.addEventListener('click', function (e) {
        const btn =
          e.target.closest('.overlay') || e.target.closest('.btn--close-modal');
        if (!btn) return;

        _this._toggleClasses();
      })
    );
  }

  _toggleClasses() {
    this._overlayEl.classList.toggle('hidden');
    this._windowEl.classList.toggle('hidden');
  }

  _validateInputs() {
    const _this = this;
    const inputs1 = document.querySelectorAll('input[data-type="Quantity"]');
    const inputs2 = document.querySelectorAll('input[data-type="Unit"]');
    const inputs3 = document.querySelectorAll('input[data-type="Description"]');
    const input1Elements = Array.from(inputs1);
    const input2Elements = Array.from(inputs2);
    const input3Elements = Array.from(inputs3);
    const events = [...input1Elements, ...input2Elements];
    const ing1DescInput = input3Elements[0];
    const ing1QuantityInput = input1Elements[0];
    const ing1UnitInput = input2Elements[0];

    // Validate 'Quantity' and 'Unit' inputs
    events.forEach(el =>
      el.addEventListener('blur', function () {
        const span = this.closest('span');
        const input3 = span.querySelector('input[data-type="Description"]');

        // Check value type of 'Quantity' field, if value contains not a number type
        // then send message and stop submit handler
        if (el.dataset.type === 'Quantity') {
          const validateResult = _this._validateFirst2Field(
            input1Elements,
            'quantity'
          );
          _this._setUploadAvailable(validateResult, 'quantity');
        }

        // Check value type of 'Unit' field, if value contains number
        // then send message and stop submit handler
        if (el.dataset.type === 'Unit') {
          const validateResult = _this._validateFirst2Field(
            input2Elements,
            'unit'
          );
          _this._setUploadAvailable(validateResult, 'unit');
        }

        // Check if 'Description' value required to be put in
        // If there are values, set 'required' to the 'Description' input
        if (this.value !== '') {
          input3.setAttribute('required', 'true');

          // If the first 2 inputs of ingredients 1 have value, then skip to
          // remain the 'required'
          if (span.dataset.first) return;

          // Remove the 'required' from 'Description' input in 1st ingredient
          ing1DescInput.removeAttribute('required');
        }

        // If there are NO value, remain 'required' of the first ingredient 'Description' input
        else {
          const emptyValueCheck = input3Elements.some(el => el.value !== '');
          // If there are NO value in both the first 2 inputs of the first ingredient,
          // then remain 'required' of the 'Description' input
          if (
            ing1QuantityInput.value === '' &&
            ing1UnitInput.value === '' &&
            !emptyValueCheck
          ) {
            ing1DescInput.setAttribute('required', 'true');
            return;
          }
          input3.removeAttribute('required');
        }
      })
    );

    // Validate 'Description' inputs
    input3Elements.forEach(el =>
      el.addEventListener('blur', function () {
        const emptyValueCheck = input3Elements.some(el => el.value !== '');

        // If there are values in the "Description" inputs
        if (emptyValueCheck) {
          // If there are value in any of the first 2 inputs of the first ingredient,
          // then remain 'required' of the 'Description' input
          if (ing1QuantityInput.value !== '' || ing1UnitInput.value !== '') {
            ing1DescInput.setAttribute('required', 'true');
            return;
          }

          // If there are NO values of the first 2 inputs of the first ingredient,
          // then remove the 'required' of the 'Description' input
          ing1DescInput.removeAttribute('required');
        }
        // If there are values in the "Description" inputs
        else {
          ing1DescInput.setAttribute('required', 'true');
        }
      })
    );
  }

  _validateFirst2Field(inputsArr, type) {
    const messageEl = document.querySelector(`.warning-sign--${type}`);
    const newInputArr = inputsArr.flatMap(input => input.value.split(''));
    let numberCheck;

    if (newInputArr.length === 0) {
      messageEl.classList.add('hidden');
      return true;
    }

    // Check if input values contain number. If true, show message
    if (type === 'quantity')
      numberCheck = newInputArr.every(
        letter => Number.isFinite(+letter) == true
      );

    if (type === 'unit') {
      numberCheck = !newInputArr.some(
        letter => Number.isFinite(+letter) == true
      );
    }

    if (!numberCheck) messageEl.classList.remove('hidden');
    else messageEl.classList.add('hidden');

    // // Return a Boolean to determine the upload availability
    return numberCheck;
  }

  _setUploadAvailable(result, type) {
    if (type === 'quantity') this._valueTypeValidation[0] = result;
    if (type === 'unit') this._valueTypeValidation[1] = result;

    const resultCheck = this._valueTypeValidation.some(res => res == false);

    if (!resultCheck) this._submitAvailable = true;
    else this._submitAvailable = false;
  }
}

export default new AddRecipeView();
