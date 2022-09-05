import { Col, Container, Nav, OverlayTrigger, Row, Spinner, Tab, Tabs, Tooltip } from "react-bootstrap";
import { useParams } from "react-router";
import { useContext, useEffect, useState } from 'react'
import { getBlock } from '../kaspa-api-client.js'
import { Link } from "react-router-dom";
import moment from "moment";
import PriceContext from "./PriceContext.js";
import { FaCopy } from "react-icons/fa";
import CopyButton from "./CopyButton.js";
import { NavLink } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { BiNetworkChart } from "react-icons/bi";
import { numberWithCommas } from "../helper.js";




const BlockInfo = () => {
    const { id } = useParams();
    const [blockInfo, setBlockInfo] = useState()
    const [error, setError] = useState(false)
    const { price } = useContext(PriceContext);

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

    return <div className="blockinfo-page">
        <Container className="webpage" fluid>
            <Row>
                <Col>

                    {error ? <h1 variant="danger">Error loading block</h1> : <></>}

                    {!!blockInfo ?
                        <div className="blockinfo-content">
                            <div className="blockinfo-header"><h4>block details</h4></div>
                            {/* <font className="blockinfo-header-id">{id.substring(0, 20)}...</font> */}
                            <Container className="blockinfo-table" fluid>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Hash</Col>
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.verboseData.hash}
                                        <CopyButton text={blockInfo.verboseData.hash} />
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-kgi">Open in Kaspa Graph Inspector</Tooltip>}>
                                            <span>
                                                <BiNetworkChart className="ms-2 copy-symbol" size="20" onClick={() => { window.open(`https://kgi.kaspad.net/?hash=${id}`, '_blank'); }} />
                                            </span>
                                        </OverlayTrigger>
                                    </Col>
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
                                    <Col className="blockinfo-key" lg={2}>Parents</Col>
                                    <Col className="blockinfo-value" lg={10}>
                                        <ul>
                                            {blockInfo.header.parents[0].parentHashes.map(x => <li><Link className="blockinfo-link" to={`/blocks/${x}`}>{x}</Link></li>)}
                                        </ul>
                                    </Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Merkle Root</Col>
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.header.hashMerkleRoot}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Accepted Merkle Root</Col>
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.header.acceptedIdMerkleRoot}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>UTXO Commitment</Col>
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.header.utxoCommitment}</Col>
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
                                    <Col className="blockinfo-value" lg={10}>{blockInfo.header.blueWork}</Col>
                                </Row>
                                <Row className="blockinfo-row border-bottom-0">
                                    <Col className="blockinfo-key" lg={2}>Pruning Point</Col>
                                    <Col className="blockinfo-value" lg={10}><Link className="blockinfo-link" to={`/blocks/${blockInfo.header.pruningPoint}`}>{blockInfo.header.pruningPoint}</Link></Col>
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
                                                <div className="utxo-value">
                                                    {tx.verboseData.transactionId}
                                                    <CopyButton text={tx.verboseData.transactionId} />
                                                </div>


                                                <Col sm={12} md={12}>
                                                    <div className="utxo-header mt-3">FROM</div>
                                                    <Container className="utxo-value">
                                                        {(tx.inputs || []).map((txInput) => <Row>
                                                            <Col xs={12} sm={8} md={9} lg={9}  xl={8} xxl={7} className="text-truncate">
                                                                TX {txInput.previousOutpoint.transactionId}
                                                            </Col><Col className="me-auto" xs={12} sm={4} md={2}></Col>
                                                        </Row>)}
                                                        {!tx.inputs ? <Row><Col xs={12} sm={8} md="auto" className="text-truncate">COINBASE (New coins)</Col></Row> : <></>}

                                                    </Container>
                                                </Col>

                                                <Col sm={12} md={12}>
                                                    <div className="utxo-header mt-1">TO</div>
                                                    <Container className="utxo-value" fluid>
                                                        {(tx.outputs || []).map((txOutput) => <Row>
                                                            <Col xs={12} sm={8} md={9} lg={9}  xl={8} xxl={7} className="text-truncate">
                                                            <Link to={`/addresses/${txOutput.verboseData.scriptPublicKeyAddress}`} className="blockinfo-link">
                                                                {txOutput.verboseData.scriptPublicKeyAddress}
                                                                </Link>

                                                                <CopyButton text={txOutput.verboseData.scriptPublicKeyAddress} />
                                                            </Col><Col className="block-utxo-amount" xs={12} sm={4} md={3}>{txOutput.amount / 100000000}&nbsp;KAS</Col>
                                                        </Row>)}
                                                    </Container>
                                                </Col>
                                            </Col>
                                            <Col sm={5} md={4}>
                                                <div className="utxo-header mt-3">tx amount</div>
                                                <div className="utxo-value d-flex flex-row"><div className="utxo-amount">{(numberWithCommas(tx.outputs.reduce((a, b) => (a || 0) + parseInt(b.amount), 0) / 100000000))} KAS</div></div>
                                            </Col>
                                            <Col sm={4} md={2}>
                                                <div className="utxo-header mt-3">tx value</div>
                                                <div className="utxo-value">{(tx.outputs.reduce((a, b) => (a || 0) + parseInt(b.amount), 0) / 100000000 * price).toFixed(2)} $</div>
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

    //     <Container className="webpage" fluid>
    //         <Row>
    //             <Col>

    //             </div> : <>{!error ? <>Loading Blockinfo <Spinner animation="border" role="status" /></> : <></>}</>}
    //         </Col>
    //     </Row>
    // </Container>



}

export default BlockInfo;


// Hash	f08eeaff68bc2ba4f2001cda61263549d64fca9a2293b8fabd9ebec2b9882433
// Is Header Only	false
// Blue Score	22632652
// Version	1
// Parents (3)
// caa643e423bb0c326a99f76a2622afef5858fb89fb099d670a4c91cea3b37f20
// c03e33ccafb49806fe3b58b2821e2998409b05c328d9b37e547928b85d562909
// 3c63790b7f8b809ffcf90b429507ec9ecd241d2c3561fc20496de79a24e3a00d
// Merkle Root	784c09ff1331bc9a330c0cef85cc6578261351362240abec875ee8555fbdb8dd
// Accepted Merkle Root	cd75b4e94ee810b0d14c41295607f4a7771a87a610542935943054447a5a9324
// UTXO Commitment	3a480129f8578f0285dd5f4cc25b2ff0ee4828dbfa52e71c237a66befefec4ab
// Timestamp	2022-08-15 19:41:37.000000739
// Bits	1b0754ff, 754ff000000000000000000000000000000000000000000000000
// Nonce	f3b3a7e035c3589
// DAA Score	24136925
// Blue Work	68851a3d36517ab64
// Pruning Point
// d03fcd0ac26fb847a283464c922cbf9c76a88d6129edac5b976f9ee6caee842c
// Transactions (6)
// 10d1c9d9dbb5d7cbd4d5c34e629a6b68cad7b4548bd652ebb54e16355a030d3c
// 87d8770820d9f038706e74b19e302193ac46b916290ce0745da27afc8020e1d2
// b14a788379bf2e6ec6ab85feb605c36bb7be073f915496089f4f9f6d8d11a783
// 517da75098711b66b21de6da8fa47f300bf621b5fee7adf631f90de04c478bb4
// ea3ef1db0e07a4ad7ebaca3140d58842e1a344d5e1da2cd94002b56ba1e0096c
// 4492281822a4dd2f97920fb0f595523361f266796b71bec49a60cb2228f5f1a0
