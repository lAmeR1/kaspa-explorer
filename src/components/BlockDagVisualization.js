import { useState } from "react";
import KasBlock from "./KasBlock";

const BlockDagVisualization = () => {

    const [kasBlocks, setKasBlocks] = useState([
        {"hashShort": "a1212f1f", "daaScore": 23936006, parents: ["5498b336a42713"], transactions: ["", ""]},
        {"hashShort": "bcd7dbcd8", "daaScore": 23936006, parents: ["5498b336a42713"], transactions: [""]},
        {"hashShort": "876dcdd7dc", "daaScore": 23936006, parents: ["5498b336a42713"], transactions: ["", ""]},
        {"hashShort": "987c9dcd", "daaScore": 23936006, parents: ["5498b336a42713"], transactions: [""]},
        {"hashShort": "a1212f1f", "daaScore": 23936006, parents: ["5498b336a42713"], transactions: ["", ""]},
        {"hashShort": "bcd7dbcd8", "daaScore": 23936006, parents: ["5498b336a42713"], transactions: [""]},
        {"hashShort": "876dcdd7dc", "daaScore": 23936006, parents: ["5498b336a42713"], transactions: ["", ""]}
    ])



    return <div className="blockDagVis">
        {kasBlocks.map((x) => <KasBlock hashShort={x.hashShort} daaScore={x.daaScore} transactions={x.transactions} />)}
        </div>
}

export default BlockDagVisualization;