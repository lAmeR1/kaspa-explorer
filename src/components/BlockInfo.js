/* global BigInt */

import moment from "moment";
import { useContext, useEffect, useState } from 'react';
import { Col, Container, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import { BiNetworkChart } from "react-icons/bi";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { parsePayload } from "../bech32.js";
import { numberWithCommas } from "../helper.js";
import { getBlock, getTransactions } from '../kaspa-api-client.js';
import BlueScoreContext from "./BlueScoreContext.js";
import CopyButton from "./CopyButton.js";
import PriceContext from "./PriceContext.js";

const BlockLamp = (props) => {
    return <OverlayTrigger overlay={<Tooltip>It is a {props.isBlue ? "blue" : "red"} block!</Tooltip>}>
        <div className={`ms-3 block-lamp-${props.isBlue ? "blue" : "red"}`} />
    </OverlayTrigger>
}

const getAddrFromOutputs = (outputs, i) => {
    for (const o of outputs) {
        if (o.index == i) {
            return o.script_public_key_address
        }
    }
}
const getAmountFromOutputs = (outputs, i) => {
    for (const o of outputs) {
        if (o.index == i) {
            return o.amount / 100000000
        }
    }
}


const BlockInfo = () => {
    const { id } = useParams();
    const { blueScore } = useContext(BlueScoreContext);
    const [blockInfo, setBlockInfo] = useState()
    const [txInfo, setTxInfo] = useState()
    const [minerName, setMinerName] = useState()
    const [minerAddress, setMinerAddress] = useState()
    const [isBlueBlock, setIsBlueBlock] = useState(null)
    const [error, setError] = useState(false)
    const { price } = useContext(PriceContext);

    const [blockColor, setBlockColor] = useState()

    useEffect(() => {
        setError(false);
        getBlock(id).then(
            (res) => {
                setBlockInfo(res)
            }
        )
            .catch(() => {
                setError(true);
                setBlockInfo(null);
            }
            )
    }, [id])



    useEffect(() => {

        setIsBlueBlock(null);
        if (!!blockInfo) {
            async function isBlueBlock(startBlocks) {
                var childListGlob = startBlocks

                while (childListGlob.length > 0) {
                    const hash = childListGlob.shift()
                    const block = await getBlock(hash)
                    if (block.verboseData.isChainBlock) {
                        return block.verboseData.mergeSetBluesHashes.includes(blockInfo.verboseData.hash)
                    } else {
                        // console.log("PUSH", block.verboseData.childrenHashes)
                        childListGlob.push(block.verbosedata.childrenHashes)
                    }

                }
            }

            isBlueBlock([...(blockInfo.verboseData.childrenHashes || [])])
                .then((res) => setIsBlueBlock(res))
                .catch((err) => console.log("ERROR", err))


            let [address, miner] = ["No miner info", "No miner info"]

            if (blockInfo.transactions[0]?.payload) {
                [address, miner] = parsePayload(blockInfo.transactions[0].payload);
            }


            // request TX input addresses
            const txToQuery = blockInfo.transactions.flatMap((tx) => tx.inputs?.flatMap(txInput => txInput.previousOutpoint.transactionId)).filter(x => x).concat(
                blockInfo.transactions.map(tx => tx.verboseData.transactionId)
            )

            getTransactions(txToQuery, true, true).then(
                resp => {
                    const respAsObj = resp.reduce((obj, cur) => {
                        obj[cur["transaction_id"]] = cur
                        return obj;
                    }, {});
                    console.log(respAsObj)
                    setTxInfo(respAsObj)

                }
            ).catch(err => console.log("Error ", err))

            setMinerName(miner);
            setMinerAddress(address);
        }
    }, [blockInfo])

    return <div className="blockinfo-page">
        <Container className="webpage" fluid>
            <Row>
                <Col className="mx-0">

                    {error ? <h1 variant="danger">Error loading block</h1> : <></>}

                    {!!blockInfo ?
                        <div className="blockinfo-content">
                            <div className="blockinfo-header"><h4 className="d-flex flex-row align-items-center">block details {isBlueBlock === null ? <Spinner className="ms-3" animation="grow" /> : <BlockLamp isBlue={isBlueBlock} />}</h4></div>
                            {/* <font className="blockinfo-header-id">{id.substring(0, 20)}...</font> */}
                            <Container className="blockinfo-table mx-0" fluid>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Hash</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>{blockInfo.verboseData.hash}
                                        <CopyButton text={blockInfo.verboseData.hash} />
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-kgi">Open in Kaspa Graph Inspector</Tooltip>}>
                                            <span>
                                                <BiNetworkChart className="ms-2 copy-symbol" size="20" onClick={() => { window.open(`https://kgi.kaspad.net/?hash=${id}`, '_blank'); }} />
                                            </span>
                                        </OverlayTrigger>
                                    </Col>
                                    {/* {isBlue ? "BLUE" : "RED"} */}
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Blue Score</Col>
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.header.blueScore}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Bits</Col>
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.header.bits}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Timestamp</Col>
                                    <Col className="blockinfo-value" lg={10}>{moment(parseInt(blockInfo.header.timestamp)).format("YYYY-MM-DD HH:mm:ss")} ({blockInfo.header.timestamp})</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Version</Col>
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.header.version}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Is Chain Block</Col>
                                    <Col className="blockinfo-value" lg={10}>{!!blockInfo.verboseData.isChainBlock ? "true" : "false"}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Parents</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>
                                        <ul>
                                            {blockInfo.header.parents[0].parentHashes.map(x => <li><Link className="blockinfo-link" to={`/blocks/${x}`}>{x}</Link></li>)}
                                        </ul>
                                    </Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Children</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>
                                        <ul>
                                            {(blockInfo.verboseData.childrenHashes || []).map(child => <li><Link className="blockinfo-link" to={`/blocks/${child}`}>{child}</Link></li>)}
                                        </ul>
                                    </Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Merkle Root</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>{blockInfo.header.hashMerkleRoot}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Accepted Merkle Root</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>{blockInfo.header.acceptedIdMerkleRoot}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>UTXO Commitment</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>{blockInfo.header.utxoCommitment}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Nonce</Col>
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.header.nonce}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>DAA Score</Col>
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.header.daaScore}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Blue Work</Col>
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.header.blueWork} ({BigInt(`0x${blockInfo.header.blueWork}`).toString()})</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Pruning Point</Col>
                                    <Col className="blockinfo-value-mono" lg={10}><Link className="blockinfo-link" to={`/blocks/${blockInfo.header.pruningPoint}`}>{blockInfo.header.pruningPoint}</Link></Col>
                                </Row>
                                <Row className="blockinfo-row border-bottom-0">
                                    <Col className="blockinfo-key" lg={2}>Miner Info</Col>
                                    <Col className="blockinfo-value-mono md-3" lg={10}>
                                        <div className="blockinfo-value">{minerName}</div>
                                        <div><Link className="blockinfo-link" to={`/addresses/${minerAddress}`}>{minerAddress}</Link></div>
                                    </Col>
                                </Row>
                            </Container>
                        </div> : <></>}
                </Col>
            </Row>



            <Row>
                <Col>
                    {(!!blockInfo) ?
                        <div className="blockinfo-content mt-4 mb-5">
                            <div className="blockinfo-header"><h4>Transactions</h4></div>
                            <Container className="webpage utxo-box" fluid>
                                {
                                    (blockInfo.transactions || []).map((tx, tx_index) => <>
                                        <Row className="utxo-border py-3">
                                            <Col sm={12} md={12} lg={12}>
                                                <div className="utxo-header">transaction id</div>
                                                <div className="utxo-value-mono">
                                                    <Link to={`/txs/${tx.verboseData.transactionId}`} className="blockinfo-link">
                                                        {tx.verboseData.transactionId}
                                                    </Link>
                                                    <CopyButton text={tx.verboseData.transactionId} />
                                                </div>


                                                <Col sm={12} md={12}>
                                                    <div className="utxo-header mt-3">FROM</div>
                                                    <Container className="utxo-value-mono" fluid>
                                                        {(tx.inputs || []).map((txInput) => <Row>
                                                            {!!txInfo && txInfo[txInput.previousOutpoint.transactionId] ? <>
                                                                <Col xs={12} sm={8} md={9} lg={9} xl={8} xxl={7} className="text-truncate">
                                                                    <Link to={`/addresses/${getAddrFromOutputs(txInfo[txInput.previousOutpoint.transactionId]["outputs"], txInput.previousOutpoint.index || 0)}`} className="blockinfo-link">
                                                                        {getAddrFromOutputs(txInfo[txInput.previousOutpoint.transactionId]["outputs"], txInput.previousOutpoint.index || 0)}
                                                                    </Link>
                                                                    <CopyButton text={getAddrFromOutputs(txInfo[txInput.previousOutpoint.transactionId]["outputs"], txInput.previousOutpoint.index || 0)} />
                                                                </Col><Col className="block-utxo-amount-minus" xs={12} sm={4} md={2}>
                                                                    -{numberWithCommas(getAmountFromOutputs(txInfo[txInput.previousOutpoint.transactionId]["outputs"], txInput.previousOutpoint.index || 0))}&nbsp;KAS
                                                                </Col></>
                                                                :
                                                                <><Col xs={12} sm={8} md={9} lg={9} xl={8} xxl={7} className="text-truncate">
                                                                    <a className="blockinfo-link" href={`https://katnip.kaspad.net/tx/${txInput.previousOutpoint.transactionId}`} target="_blank">
                                                                        TX #{txInput.previousOutpoint.index || 0} {txInput.previousOutpoint.transactionId}
                                                                    </a>
                                                                </Col><Col className="me-auto" xs={12} sm={4} md={2}></Col>
                                                                </>}
                                                        </Row>)}
                                                        {!tx.inputs ? <Row><Col xs={12} sm={8} md="auto" className="text-truncate">COINBASE (New coins)</Col></Row> : <></>}

                                                    </Container>

                                                </Col>

                                                <Col sm={12} md={12}>
                                                    <div className="utxo-header mt-1">TO</div>
                                                    <Container className="utxo-value-mono" fluid>
                                                        {(tx.outputs || []).map((txOutput) => <Row>
                                                            <Col xs={12} sm={8} md={9} lg={9} xl={8} xxl={7} className="text-truncate">
                                                                <Link to={`/addresses/${txOutput.verboseData.scriptPublicKeyAddress}`} className="blockinfo-link">
                                                                    {txOutput.verboseData.scriptPublicKeyAddress}
                                                                </Link>

                                                                <CopyButton text={txOutput.verboseData.scriptPublicKeyAddress} />
                                                            </Col><Col className="block-utxo-amount" xs={12} sm={4} md={3}>+{numberWithCommas(txOutput.amount / 100000000)}&nbsp;KAS</Col>
                                                        </Row>)}
                                                    </Container>
                                                </Col>
                                            </Col>
                                            <Col sm={5} md={4}>
                                                <div className="utxo-header mt-3">tx amount</div>
                                                <div className="utxo-value d-flex flex-row"><div className="utxo-amount">{(numberWithCommas(tx.outputs.reduce((a, b) => (a || 0) + parseInt(b.amount), 0) / 100000000))} KAS</div></div>
                                            </Col>
                                            <Col sm={3} md={2}>
                                                <div className="utxo-header mt-3">tx value</div>
                                                <div className="utxo-value">{(tx.outputs.reduce((a, b) => (a || 0) + parseInt(b.amount), 0) / 100000000 * price).toFixed(2)} $</div>
                                            </Col>
                                            <Col sm={4} md={6}>
                                                <div className="utxo-header mt-3">details</div>
                                                <div className="utxo-value d-flex flex-row flex-wrap">{!!txInfo && txInfo[tx.verboseData.transactionId] ?
                                                    txInfo[tx.verboseData.transactionId]?.is_accepted ? <div className="accepted-true mb-3 me-3">accepted</div> :
                                                        <span className="accepted-false">not accepted</span> : <>-</>}
                                                    {!!txInfo && !!txInfo[tx.verboseData.transactionId]?.is_accepted && blueScore !== 0 && (blueScore - txInfo[tx.verboseData.transactionId].accepting_block_blue_score < 86400) && <div className="confirmations mb-3">{blueScore - txInfo[tx.verboseData.transactionId].accepting_block_blue_score}&nbsp;confirmations</div>}
                                                    {!!txInfo && !!txInfo[tx.verboseData.transactionId]?.is_accepted && blueScore !== 0 && (blueScore - txInfo[tx.verboseData.transactionId].accepting_block_blue_score >= 86400) && <div className="confirmations mb-3">finalized</div>}


                                                </div>
                                            </Col>

                                        </Row>

                                    </>)
                                }

                            </Container>
                        </div> : <></>}
                </Col>
            </Row>

        </Container>
    </div >



}

export default BlockInfo;
