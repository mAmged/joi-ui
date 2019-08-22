import React, { Fragment, createRef} from 'react';
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
      paramValues: [],
      menuIsOpen: true,
      closeMenuOnSelect: false
    }
    this.selectRef = createRef();
  }
  componentDidMount = () => {
    this.updateAvaliableFunctions();
    this.selectRef.current.focus()
    document.querySelector('.basic-single').querySelector('input').style.opacity = 1;
  }

  updateAvaliableFunctions = () => {
    let values = listCurrentAvailableFunctions(this.state.selected).map(fn => ({ ...fn, value: fn.name, label: fn.name }));
    this.setState({ values })
  }
  cleanCurrentEnteredValues() {
    this.setState({ val: null, paramFields: [], paramValues: [] });
  }
  applyLabelBeforeSubmit(val) {
    if (val.argsLength > 0) {
      val = {
        ...val,
        label: `${val.label}(${this.state.paramValues.join(',')})`
      }
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
    this.setState({ menuIsOpen: true})
  }
  onChange = (val,w,e) => {
    window.slctRef = this.selectRef;
    console.log('val', val, 'eee', e)
    this.setState({ val: {...val} })
    let selectedFns = selectFunction(val.value);
    console.log('selectedFns', selectedFns)
    this.setState({ 'functionsChain': selectedFns })
    if (val.argsLength === 0) {
      let lst = listCurrentAvailableFunctions(selectedFns);
      console.log('lst', lst)
      this.addNewFunctionToChain(val)
      window.slx = this.selectRef;
      setTimeout(() => {
        this.selectRef.current.focus();
        document.querySelector('.basic-single').querySelector('input').style.opacity = 1;
      })
      
    }
    else {
      this.fucusParamInput()
      this.setState({ closeMenuOnSelect: true, menuIsOpen:false, paramFields: Array.from(Array(val.argsLength).keys()) })
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
    const { values, selected, paramFields, menuIsOpen, closeMenuOnSelect } = this.state;
    return (
      <div className="App">
        {selected.map((i, ndx) => <h1 key={i.label + ndx}>{i.label}</h1>)}
        <div style={{ width: '600px', textAlign: 'left' }}>
          <Fragment>
            <div style={{ width: '300px', display: 'inline-block', textAlign: 'left' }}>
              <label>User Enter to input function</label>
              <Select
                ref={this.selectRef}
                className="basic-single"
                classNamePrefix="select"
                defaultValue={'defaultValue'}
                isSearchable={true}
                name="color"
                closeMenuOnSelect={closeMenuOnSelect}
                menuIsOpen={menuIsOpen}
                options={values}
                onChange={this.onChange}
                isClearable={true}
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