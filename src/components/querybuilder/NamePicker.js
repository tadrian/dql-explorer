import React from 'react';

import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import {
  CompactPeoplePicker,
  ValidationState
} from 'office-ui-fabric-react/lib/Pickers';
import { Promise } from 'es6-promise';

// Helper imports to generate data for this particular examples. Not exported by any package.
import { people, mru } from './PeoplePickerData';
import withApp from '../../withApp';

const suggestionProps = {
  suggestionsHeaderText: 'Suggested Names',
  mostRecentlyUsedHeaderText: 'Suggested Names',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: true,
  suggestionsAvailableAlertText: 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: 'Suggested names'
};

class NamePicker extends BaseComponent {
  // All pickers extend from BasePicker specifying the item type.
  _picker = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      currentPicker: 1,
      delayResults: false,
      peopleList: people,
      mostRecentlyUsed: mru,
      isPickerDisabled: false
    };
  }
  
  render() {

    return (
      <React.Fragment>
        <CompactPeoplePicker
            onResolveSuggestions={this._onFilterChanged}
            onEmptyInputFocus={this._returnMostRecentlyUsed}
            getTextFromItem={this._getTextFromItem}
            pickerSuggestionsProps={suggestionProps}
            className={'ms-PeoplePicker'}
            onValidateInput={this._validateInput}
            selectedItems={this.props.formdata.readers}
            onChange={this._onReadersChange}
            componentRef={this._picker}
            resolveDelay={300}
            disabled={this.state.isPickerDisabled}
            iconProps={{ iconName: 'user', className: 'inFieldIcon' }}
            key={'list'}
        />
      </React.Fragment>
    );
  }

  _getTextFromItem(persona) {
    return persona.text;
  }

  _onReadersChange = (items) => {
    this.props.onReadersChange(items);
  };

  _onFilterChanged = (
    filterText,
    currentPersonas,
    limitResults
  ) => {
    if (filterText) {
      let filteredPersonas = this._filterPersonasByText(filterText);

      filteredPersonas = this._removeDuplicates(filteredPersonas, currentPersonas);
      filteredPersonas = limitResults ? filteredPersonas.splice(0, limitResults) : filteredPersonas;
      return this._filterPromise(filteredPersonas);
    } else {
      return [];
    }
  };

  _returnMostRecentlyUsed = (currentPersonas) => {
    let { mostRecentlyUsed } = this.state;
    mostRecentlyUsed = this._removeDuplicates(mostRecentlyUsed, currentPersonas);
    return this._filterPromise(mostRecentlyUsed);
  };

  _filterPromise(personasToReturn) {
    if (this.state.delayResults) {
      return this._convertResultsToPromise(personasToReturn);
    } else {
      return personasToReturn;
    }
  }

  _listContainsPersona(persona, personas) {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter(item => item.text === persona.text).length > 0;
  }

  _filterPersonasByText(filterText) {
    return this.state.peopleList.filter(item => this._doesTextStartWith(item.text, filterText));
  }

  _doesTextStartWith(text, filterText) {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

  _convertResultsToPromise(results) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(results), 2000));
  }

  _removeDuplicates(personas, possibleDupes) {
    return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
  }

   _validateInput = (input) => {
    if (input.indexOf('@') !== -1) {
      return ValidationState.valid;
    } else if (input.length > 1) {
      return ValidationState.warning;
    } else {
      return ValidationState.invalid;
    }
  };

}

export default withApp(NamePicker);