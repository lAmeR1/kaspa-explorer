import {useEffect, useRef} from "react";

export function numberWithCommas(num) {
    const [integerPart, fractionalPart] = (num || '').toString().split('.');

    if (!integerPart) return "0";

    return (
        <span>
      <span>
        {integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </span>
            {fractionalPart &&
                <span style={{fontSize: "80%"}}>.{fractionalPart}</span>
            }
    </span>
    );
}

export function floatToStr(floatNo, maxPrecision = 8) {
    return parseFloat(floatNo.toPrecision(maxPrecision)).toString()
}


export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value; //assign the value of ref to the argument
    }, [value]); //this code will run when the value of 'value' changes
    return ref.current; //in the end, return the current ref value.
}

export default usePrevious;