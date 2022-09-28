import { createContext } from "react";


const BlueScoreContext = createContext({'blueScore': 0});
BlueScoreContext.displayName = "VirtualSelectedParentBlueScore";

export default BlueScoreContext;
