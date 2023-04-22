import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { FaDiceD20, FaPause, FaPlay } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import LastBlocksContext from "./LastBlocksContext";




const BlockOverview = (props) => {   
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
        <h4 className="block-overview-header text-center w-100 me-4"><FaDiceD20 className={isConnected && keepUpdating ? "rotate" : ""} size="1.7rem"/> LATEST BLOCKS</h4>
        </div>
        
        <div className="block-overview-content">
            <table className={`styled-table w-100`}>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        {props.small ? <></> : <th>BlueScore</th>}
                        <th>TXs</th>
                        <th width="100%">Hash</th>
                    </tr>
                </thead>
                <tbody>
                    {[...tempBlocks].sort((a,b) => b.blueScore - a.blueScore).slice(0,props.lines).map((x) => <tr id={x.block_hash} key={x.block_hash} onClick={onClickRow}>
                        <td className="table-timestamp">{moment(parseInt(x.timestamp)).format("YYYY‑MM‑DD HH:mm:ss")}</td>
                        {props.small ? <></> : <td>{x.blueScore}</td>}
                        <td>{x.txs.length}</td>
                        <td className="hashh">{x.block_hash}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>

}

export default BlockOverview;