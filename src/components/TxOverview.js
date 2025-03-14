import {useContext, useEffect, useRef, useState} from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {BiHide} from "react-icons/bi";
import {FaPause, FaPlay} from "react-icons/fa";
import {RiMoneyDollarCircleFill} from 'react-icons/ri';
import { KASPA_UNIT } from "../explorer_constants";
import {numberWithCommas} from "../helper";
import LastBlocksContext from "./LastBlocksContext";
import {Link} from "react-router-dom"


const TxOverview = (props) => {

    const [tempBlocks, setTempBlocks] = useState([]);
    const [keepUpdating, setKeepUpdating] = useState(true);
    const [ignoreCoinbaseTx, setIgnoreCoinbaseTx] = useState(false);

    const keepUpdatingRef = useRef()
    keepUpdatingRef.current = keepUpdating

    const {blocks, isConnected} = useContext(LastBlocksContext);

    useEffect(() => {
        if (keepUpdatingRef.current) {
            setTempBlocks(blocks);
        }
    }, [blocks])

    const toggleCoinbaseTransactions = () => {
        setIgnoreCoinbaseTx(!ignoreCoinbaseTx);
    }


    return <div className="block-overview mb-4">
        <div className="d-flex flex-row w-100">
            {!keepUpdating ? <FaPlay id="play-button" className="play-button" onClick={() => setKeepUpdating(true)}/> :
                <FaPause id="pause-button" className="play-button" onClick={() => setKeepUpdating(false)}/>}

            <OverlayTrigger overlay={<Tooltip id="tooltip-kgi">{ignoreCoinbaseTx ? "Show" : "Hide"} coinbase
                transactions</Tooltip>}>
                <span><BiHide className={`mx-0 mt-3 hide-button ${ignoreCoinbaseTx && "hide-button-active"}`}
                              onClick={toggleCoinbaseTransactions}/></span>
            </OverlayTrigger>
            <h4 className="block-overview-header text-center w-100 me-4">
                <RiMoneyDollarCircleFill className={isConnected && keepUpdating ? "rotate" : ""} size="1.7rem"/> LATEST
                TRANSACTIONS</h4>
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
                    .sort((a, b) => b.blueScore - a.blueScore)
                    // .slice(0, props.lines)
                    .flatMap((block) => block.txs.slice(ignoreCoinbaseTx ? 1 : 0)
                        .flatMap((tx) => tx.outputs.flatMap((output, outputIndex) => {
                            return {
                                "amount": output[1],
                                "address": output[0],
                                "txId": tx.txId,
                                "blockHash": block.block_hash,
                                outputIndex
                            }
                        })))
                    .filter((v, i, a) => a.findIndex(v2 => {
                        const { blockHash: _, ...vWithoutBlockHash } = v;
                        const { blockHash: __, ...v2WithoutBlockHash } = v2;
                        return (JSON.stringify(vWithoutBlockHash) === JSON.stringify(v2WithoutBlockHash))
                }) === i)
                    .slice(0, props.lines).map(x => {
                        return <tr
                            id={x.address}
                            txid={x.txId}
                            key={x.address + x.txId + x.outputIndex}
                            blockHash={x.blockHash}
                        >
                            <Link key={x.block_hash} to={`/txs/${x.txId}?blockHash=${x.blockHash}`} className="table-cell-link-styled">{x.txId.slice(0, 10)}</Link>
                            <Link key={x.block_hash} to={`/txs/${x.txId}?blockHash=${x.blockHash}`} className="table-cell-link-styled">{numberWithCommas(x.amount / 100000000)}&nbsp;{KASPA_UNIT}</Link>
                            <Link key={x.block_hash} to={`/addresses/${x.address}`} className="table-cell-link-styled">{x.address}</Link>
                        </tr>
                    })}


                </tbody>
            </table>
        </div>
    </div>

}

export default TxOverview
