import { useState } from "react";
import { useEffect, useRef } from "react";

export function numberWithCommas(x) {
  if (x === undefined) {
    return "";
  }
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function floatToStr(floatNo, maxPrecision = 8) {
  return parseFloat(floatNo.toPrecision(maxPrecision)).toString();
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}
export default usePrevious;

export const useWs = (url) => {
  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);

  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);

    socket.addEventListener("message", (event) => {
      setVal(event.data);
    });

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [url]);

  return {
    isReady,
    data: val,
    send: ws.current?.send.bind(ws.current),
    close: ws.current?.close.bind(ws.current),
  };
};
