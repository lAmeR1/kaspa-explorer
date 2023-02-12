import { useEffect, useRef } from "react";

export function numberWithCommas(x) {
    if (x === undefined) {
        return ""
    }
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export function floatToStr(floatNo, maxPrecision = 8) {
    return parseFloat(floatNo.toPrecision(maxPrecision)).toString()
}


export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value; //assign the value of ref to the argument
    },[value]); //this code will run when the value of 'value' changes
    return ref.current; //in the end, return the current ref value.
  }
  export default usePrevious;