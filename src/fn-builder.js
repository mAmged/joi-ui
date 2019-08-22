import Joi from 'joi-browser'
window.Joi = Joi;
let fnx = [];
// window.fnx = fnx; //was here for testing purposes
function getFunctionInfo(name, fnRef) {
    return { name, fnRef, argsLength: fnRef.length }
}
function getSubFunctionsInfo(fn) {
    let obj = getCurrentChainArrayRef();
    let existingFunctions = []
    for (var fnName in obj) {
        let fn = obj[fnName];
        if (typeof (fn) === 'function' && fnName.indexOf('_') === -1)
            existingFunctions.push(getFunctionInfo(fnName, fn))
    }
    return existingFunctions;
}
export function getCurrentChainArrayRef() {
    return fnx.reduce((chainRef, currentFunction, index) => {
        // debugger
        let lastref = chainRef[currentFunction.name](...currentFunction.paramValues);
        return lastref
    }, Joi)
}
export function listCurrentAvailableFunctions(selectedFnArray) {
    let _fns = selectedFnArray || fnx;
    console.warn('will handle _fns', _fns)
    let lastFunctionReference;
    if (_fns.length === 0)
        lastFunctionReference = Joi
    else lastFunctionReference = _fns[_fns.length - 1].fnRef
    return getSubFunctionsInfo(lastFunctionReference);
}
export function getNewFunctionObj(fnName, params = [], ) {
    if (fnx.length === 0) {
        return {
            name: fnName,
            paramValues: params,
            argsLength: Joi[fnName].length,
            fnRef: Joi[fnName].length === 0 || Joi[fnName].length !== params.length ? Joi[fnName] : Joi[fnName](...params),
            isValid: Joi[fnName].length === 0 || Joi[fnName].length === params.length

        }
    }
    return fnx.reduce((chainRef, currentFunction, index) => {
        // debugger
        let lastref = chainRef[currentFunction.name](...currentFunction.paramValues);
        if (index === fnx.length - 1) {
            let isValid = lastref[fnName].length === params.length;
            return {
                name: fnName,
                paramValues: params,
                argsLength: lastref[fnName].length,
                fnRef: isValid ? lastref[fnName](...params) : lastref[fnName],
                isValid: isValid
            }
        }
        return lastref
    }, Joi)
}
export function applyParamsOnLastFunction(params=[]) {
    if (fnx.length === 0)
        throw new Error('Empty function queue.')
    return fnx.reduce((chainRef, currentFunction, index) => {
        // last item
        if (index === fnx.length - 1) {
            let lastref = chainRef[currentFunction.name];
            
            let fnRef;
            let isValid = lastref.length === params.length;
            if (isValid){
                try{
                    fnRef = chainRef[currentFunction.name](...params)
                } catch(e){
                    fnRef = chainRef[currentFunction.name];
                }
            }
            let obj = {
                name: currentFunction.name,
                paramValues: params,
                argsLength: lastref.length,
                fnRef,
                isValid: isValid,
                lastItemApplied: true
            }
            updateLastFunctionValue(obj);
            return obj
        }
        return chainRef[currentFunction.name](...currentFunction.paramValues)
    }, Joi)
}
function updateLastFunctionValue(newValue) {
    fnx[fnx.length - 1] = newValue;
    return newValue;
}
export function selectFunction(fnName, params = []) {
    if (fnx.length === 0)
        fnx.push(getNewFunctionObj(fnName, params))
    else {
        let lastSelectedFunction = fnx[fnx.length - 1];
        if (lastSelectedFunction.isValid)
            fnx.push(getNewFunctionObj(fnName, params))
        else
            throw new Error('Error: You can\'t select new function without validating the last selected function')
    }
    return fnx;
}
// (() => {
//     setTimeout(() => {
//         let s1 = listCurrentAvailableFunctions();
//         console.log('s1:', s1);
//         let s2 = selectFunction('number')
//         console.log('s2:', s2)
//         let s2_1 = listCurrentAvailableFunctions();
//         console.log('s2_1:', s2_1);
//         let s3 = selectFunction('min')
//         console.log('s3:', s3)
//         setTimeout(() => {
//             let s3_1 = applyParamsOnLastFunction([5])
//             console.log('s3_1:', s3_1)
// //             let s4 = listCurrentAvailableFunctions()
// //             console.log('s4:', s4)
// //             let s5 = selectFunction('max')
// //             console.log('s5:', s5)
// //             let s5_1 = applyParamsOnLastFunction([5])
// //             console.log('s5_1:', s5_1)
//         }, 100);

        

//     }, 100);

// })()