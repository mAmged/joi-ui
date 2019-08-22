import React, { Fragment, } from 'react';
import './App.css';
import Select from 'react-select';
import Textfield from '@atlaskit/textfield';

import * as x from "./fn-builder"
import { listCurrentAvailableFunctions, selectFunction, applyParamsOnLastFunction } from "./fn-builder";
window.fnbuilder = x;
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      val: { value: '', label: 'search here', color: '#5243AA' },
      availableFunctions: listCurrentAvailableFunctions(),
      values: [],
      selected: [],
      functionsChain: [], // a game player
      paramFields: [],
      paramValues: []
    }
  }
  componentDidMount = () => {
    this.updateAvaliableFunctions();
  }

  updateAvaliableFunctions = () => {
    let values = listCurrentAvailableFunctions(this.state.selected).map(fn => ({ ...fn, value: fn.name, label: fn.name }));
    this.setState({ values })
  }
  cleanCurrentEnteredValues() {
    this.setState({ val: null, paramFields: [], paramValues: [] });
  }
  applyLabelBeforeSubmit(val) {
    if (this.state.val.argsLength > 0) {
      val = {
        ...val,
        label: `${this.state.val.label}(${this.state.paramValues.join(',')})`
      }
      debugger
    }
    return val;
  }
  addNewFunctionToChain(val) {
    console.log('adding ', val, 'to selected array')
    val = this.applyLabelBeforeSubmit(val)
    this.updateAvaliableFunctions();
    this.setState({ selected: [...this.state.selected, val] });
    this.cleanCurrentEnteredValues()
    console.log('added new function to chain')
  }
  onChange = (val) => {
    console.log('val', val)
    this.setState({ val: {...val} })
    let selectedFns = selectFunction(val.value);
    console.log('selectedFns', selectedFns)
    this.setState({ 'functionsChain': selectedFns })
    if (val.argsLength === 0) {
      let lst = listCurrentAvailableFunctions(selectedFns);
      console.log('lst', lst)
      this.addNewFunctionToChain(val)
    }
    else {
      this.fucusParamInput()
      this.setState({ paramFields: Array.from(Array(val.argsLength).keys()) })
      // this.updateAvaliableFunctions();
    }
  }
  fucusParamInput() {
    setTimeout(() => document.querySelector('.input-param').focus());
  }

  _handleKeyDown = (e, paramIndex) => {
    if (e.key === 'Enter') {
      // when user press enter key
      // select the function with the parameters
      try {
        applyParamsOnLastFunction(this.state.paramValues)
        console.log('Enter Key Pressed addNewFunctionToChain')
        this.addNewFunctionToChain(this.state.val)
      } catch (e) {
        console.error('you need to validate your number')
      }
    }
  }
  updateParamValues(e, paramIndex){
    let inputValue = e.nativeEvent.target.value;
    if (!isNaN(parseInt(inputValue))) { //if it's number, then parse it
      inputValue = parseInt(inputValue)
    }
    let newParamValues = [...this.state.paramValues];
    newParamValues[paramIndex] = inputValue;
    console.log('applyParamsOnLastFunction', newParamValues)
    console.log('value', e.nativeEvent.target.value, 'paramIndex', paramIndex);
    this.setState({ paramValues: newParamValues });
  }
  render() {
    const { values, selected, paramFields } = this.state;
    return (
      <div className="App">
        {selected.map((i, ndx) => <h1 key={i.label + ndx}>{i.label}</h1>)}
        <div style={{ width: '600px', textAlign: 'left' }}>
          <Fragment>
            <div style={{ width: '300px', display: 'inline-block', textAlign: 'left' }}>
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={'defaultValue'}
                isSearchable={true}
                name="color"
                options={values}
                onChange={this.onChange}
                value={this.state.val}
              />
            </div>
            {
              paramFields.map(paramIndex =>
                (<div style={{ width: "100px", display: 'inline-block' }} key={paramIndex}>
                  <Textfield

                    onKeyDown={((e) => this._handleKeyDown(e, paramIndex))}
                    onKeyUp={((e) => this.updateParamValues(e, paramIndex))}
                    placeholder="param1"
                    className="input-param"
                    name="placeholder" />
                </div>))
            }
            <button onClick={this.updateAvaliableFunctions}>add</button>
          </Fragment>
        </div>
      </div>)
  }
}


// export default App;
// <div style={{ width: "100px", display: 'inline-block' }}>
// <Textfield ref={this.paramInput1} onKeyDown={this._handleKeyDown} placeholder="param1" name="placeholder" />
//             </div >