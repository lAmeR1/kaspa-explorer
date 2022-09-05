import { useContext, useEffect, useRef, useState } from "react";
import { getNewBlocks } from './blocksupdater'
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { HiPlayPause } from 'react-icons/hi'
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import LastBlocksContext from "./LastBlocksContext";
import { FaPause, FaPlay } from "react-icons/fa";
import { BiRotateLeft } from "react-icons/bi";

const socket = io("wss://api.kaspa.org", {
    path: '/ws/socket.io'
});

const TxOverview = (props) => {

    const [tempBlocks, setTempBlocks] = useState([]);
    const [keepUpdating, setKeepUpdating] = useState(true);

    const keepUpdatingRef = useRef()
    keepUpdatingRef.current = keepUpdating

    const { blocks, isConnected } = useContext(LastBlocksContext);
    const navigate = useNavigate();

    const onClickRow = (e) => {
        navigate(`/addresses/${e.target.parentElement.id}`)
    }

    useEffect(() => {
        if (keepUpdatingRef.current) {
            setTempBlocks(blocks);
        }
    }, [blocks])


    return <div className="block-overview mb-4">
        <div className="d-flex flex-row w-100">
        {!keepUpdating ? <FaPlay id="play-button" className="play-button" onClick={() => setKeepUpdating(true)} /> : <FaPause id="pause-button" className="play-button" onClick={() => setKeepUpdating(false)} />}
        <h4 className="block-overview-header text-center w-100 me-4"><RiMoneyDollarCircleFill className={isConnected && keepUpdating ? "rotate" : ""} size="1.7rem" /> LATEST TRANSACTIONS</h4>
        </div>
        <div className="block-overview-content">
            <table className={`styled-table w-100`}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Amount</th>
                        <th width="100%">Recipient</th>
                    </tr>
                </thead>
                <tbody>
                    {[...tempBlocks]
                        .sort((a, b) => b.verboseData.blueScore - a.verboseData.blueScore)
                        .slice(0, props.lines)
                        .flatMap((block) => block.transactions
                            .flatMap(tx => tx.outputs.flatMap((output, outputIndex) => {
                                return {
                                    "amount": output.amount,
                                    "address": output.verboseData.scriptPublicKeyAddress,
                                    "txId": tx.verboseData.transactionId,
                                    "outputIndex": outputIndex
                                }
                            })))
                        .filter((v, i, a) => a.findIndex(v2 => (JSON.stringify(v) === JSON.stringify(v2))) === i)
                        .slice(0, props.lines).map(x => {
                            return <tr
                                id={x.address}
                                key={x.address + x.txId + x.outputIndex}
                                onClick={onClickRow}
                            >
                                <td>{x.txId.slice(0, 10)}...</td>
                                <td>{x.amount / 100000000}&nbsp;KAS</td>
                                <td className="hashh">{x.address}</td>
                            </tr>
                        })}



                </tbody>
            </table>
        </div>
    </div>

}

export default TxOverview