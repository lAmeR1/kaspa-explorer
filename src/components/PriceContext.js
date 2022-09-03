import { createContext } from "react";


const PriceContext = createContext({'price': 0});
PriceContext.displayName = "KasPrice";

export default PriceContext;
