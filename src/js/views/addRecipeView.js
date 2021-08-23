import { View } from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.nav__item');
  _overlayEl = document.querySelector('.overlay');
  _windowEl = document.querySelector('.add-recipe-window');
  _formEl = document.querySelector('.upload');
  _submitAvailable = true;

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
        console.log(data);
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

        // Check value type of 'Unit' field, if value contains number
        // then send message and stop submit handler
        if (el.dataset.type === 'Unit') {
          const validateResult = _this._validateUnitField(el);
          if (validateResult) _this._submitAvailable = true;
          else _this._submitAvailable = false;
        }

        // Check if 'Description' value required to be put in
        if (this.value !== '') {
          input3.setAttribute('required', 'true');
        } else {
          ing1DescInput.setAttribute('required', 'true');
        }

        if (span.dataset.first) return;

        if (this.value !== '') {
          ing1DescInput.removeAttribute('required');
        } else {
          input3.removeAttribute('required');
        }
      })
    );

    // Validate 'Description' inputs
    input3Elements.forEach(el =>
      el.addEventListener('blur', function () {
        const span = this.closest('span');

        if (span.dataset.first) return;

        if (this.value !== '')
          ing1QuantityInput.value === '' &&
            ing1UnitInput.value === '' &&
            ing1DescInput.removeAttribute('required');
        else ing1DescInput.setAttribute('required', 'true');
      })
    );
  }

  _validateUnitField(unitEl) {
    const messageEl = document.querySelector('.warning-sign--unit');
    const valueArr = unitEl.value.split('');
    const numberTypeCheck = valueArr.some(val => Number.isFinite(+val));

    // Show message if the value includes number
    if (numberTypeCheck) messageEl.classList.remove('hidden');
    if (unitEl.value === '' || !numberTypeCheck)
      messageEl.classList.add('hidden');

    if (unitEl.value === '') return true;
    return !numberTypeCheck;
  }
}

export default new AddRecipeView();
