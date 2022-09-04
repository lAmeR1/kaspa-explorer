import { useContext, useEffect, useRef, useState } from "react";
import { getNewBlocks } from './blocksupdater'
import { FaDiceD20, FaPause, FaPlay } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import LastBlocksContext from "./LastBlocksContext";




const BlockOverview = () => {   
    const navigate = useNavigate();

    const { blocks, isConnected } = useContext(LastBlocksContext);
    const [tempBlocks, setTempBlocks] = useState([]);
    const [keepUpdating, setKeepUpdating] = useState(true);

    const keepUpdatingRef = useRef()
    keepUpdatingRef.current = keepUpdating

    const onClickRow = (e) => {    
        navigate(`/blocks/${e.target.parentElement.id}`)
    }

    useEffect(() => {
        if (keepUpdatingRef.current) {
            setTempBlocks(blocks);
        }
    }, [blocks])

    return <div className="block-overview">
                <div className="d-flex flex-row w-100">
        {!keepUpdating ? <FaPlay id="play-button" className="play-button" onClick={() => setKeepUpdating(true)} /> : <FaPause id="pause-button" className="play-button" onClick={() => setKeepUpdating(false)} />}
        <h4 className="block-overview-header text-center w-100 me-4"><FaDiceD20 className={isConnected ? "rotate" : ""} size="1.7rem"/> LATEST BLOCKS</h4>
        </div>
        
        <div className="block-overview-content">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>BlueScore</th>
                        <th>TXs</th>
                        <th>Hash</th>
                    </tr>
                </thead>
                <tbody>
                    {[...tempBlocks].sort((a,b) => b.verboseData.blueScore - a.verboseData.blueScore).slice(0,20).map((x) => <tr id={x.verboseData.hash} key={x.verboseData.hash} onClick={onClickRow}>
                        <td>{x.verboseData.blueScore}</td>
                        <td>{x.transactions.length}</td>
                        <td>{x.verboseData.hash}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>

}

export default BlockOverview;