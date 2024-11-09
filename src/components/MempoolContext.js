import {createContext} from "react";


const MempoolContext = createContext( 0);
MempoolContext.displayName = "MempoolSize";

export default MempoolContext;
