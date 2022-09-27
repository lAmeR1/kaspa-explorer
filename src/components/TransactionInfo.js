/* global BigInt */

import moment from "moment";
import { useContext, useEffect, useState } from 'react';
import { Col, Container, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import { BiNetworkChart } from "react-icons/bi";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { parsePayload } from "../bech32.js";
import { numberWithCommas } from "../helper.js";
import { getBlock, getTransaction, getTransactions } from '../kaspa-api-client.js';
import CopyButton from "./CopyButton.js";
import PriceContext from "./PriceContext.js";


const TransactionInfo = () => {
    const { id } = useParams();
    const [txInfo, setTxInfo] = useState()
    const [additionalTxInfo, setAdditionalTxInfo] = useState()
    const [minerName, setMinerName] = useState()
    const [minerAddress, setMinerAddress] = useState()
    const [isBlueBlock, setIsBlueBlock] = useState(null)
    const [error, setError] = useState(false)
    const { price } = useContext(PriceContext);

    const [blockColor, setBlockColor] = useState()

    useEffect(() => {
        setError(false);
        getTransaction(id).then(
            (res) => {
                setTxInfo(res)
            }
        )
            .catch(() => {
                setError(true);
                setTxInfo(null);
            }
            )
    }, [id])

    const getAddrFromOutputs = (outputs, i) => {
        for (const o of outputs) {
            if (o.index == i) {
                return o.scriptPublicKeyAddress
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

    useEffect(() => {
        // request TX input addresses
        if (!!txInfo) {
            const txToQuery = txInfo.inputs?.flatMap(txInput => txInput.previous_outpoint_hash).filter(x => x)

            getTransactions(txToQuery, true, true).then(
                resp => {
                    const respAsObj = resp.reduce((obj, cur) => {
                        obj[cur["transaction_id"]] = cur
                        return obj;
                    }, {});
                    console.log(respAsObj)
                    setAdditionalTxInfo(respAsObj)
                }
            ).catch(err => console.log("Error ", err))
        }
    }, [txInfo])


    return <div className="blockinfo-page">
        <Container className="webpage" fluid>
            <Row>
                <Col className="mx-0">
                    {!!txInfo ?
                        <div className="blockinfo-content">
                            <div className="blockinfo-header"><h4 className="d-flex flex-row align-items-center">tansaction info</h4></div>
                            <Container className="blockinfo-table mx-0" fluid>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Transaction Id</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>{txInfo.transaction_id}
                                        <CopyButton text={txInfo.transaction_id} />
                                    </Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Subnetwork Id</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>{txInfo.subnetwork_id}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Hash</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>{txInfo.hash}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Mass</Col>
                                    <Col className="blockinfo-value" lg={10}>{txInfo.mass ? txInfo.mass : "-"}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Block Hashes</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>{txInfo.block_hash.map(x => <li>{x}</li>)}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Block Time</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>{txInfo.block_time}</Col>
                                </Row>
                                <Row className="blockinfo-row">
                                    <Col className="blockinfo-key" lg={2}>Details</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>
                                        {txInfo.is_accepted ? <span className="accepted-true">accepted</span> :
                                            <span className="accepted-false">not accepted</span>}
                                    </Col>
                                </Row>
                                <Row className="blockinfo-row border-bottom-0">
                                    <Col className="blockinfo-key" lg={2}>Accepted Block Hash</Col>
                                    <Col className="blockinfo-value-mono" lg={10}>{txInfo.accepted_block_hash}</Col>
                                </Row>
                            </Container>
                        </div> : <></>}
                </Col>
            </Row>

            {/* id = Column(Integer, primary_key=True)
    transaction_id = Column(String)
    index = Column(Integer)

    previous_outpoint_hash = Column(String)  # "ebf6da83db96d312a107a2ced19a01823894c9d7072ed0d696a9a152fd81485e"
    previous_outpoint_index = Column(String)  # "ebf6da83db96d312a107a2ced19a01823894c9d7072ed0d696a9a152fd81485e"

    signatureScript = Column(String)  # "41c903159094....281a1d26f70b0037d600554e01",
    sigOpCount = Column(Integer) */}

            <Row>
                <Col>
                    {(!!txInfo) ?
                        <div className="blockinfo-content mt-4 mb-5">
                            <div className="blockinfo-header"><h4>Inputs</h4></div>
                            <Container className="webpage utxo-box" fluid>
                                {
                                    (txInfo.inputs || []).map((tx_input) => <>
                                        <Row className="utxo-border py-3">
                                            <Col sm={6} md={6} lg={2}>
                                                <div className="blockinfo-key mt-0 mt-md-2">Signature Op Count</div>
                                                <div className="utxo-value-mono">
                                                    {tx_input.sigOpCount}
                                                </div>
                                            </Col>
                                            <Col sm={12} md={12} lg={10}>
                                                <div className="blockinfo-key mt-2">Signature Script</div>
                                                <div className="utxo-value-mono">
                                                    {tx_input.signatureScript}
                                                </div>
                                            </Col>
                                            <Col sm={12} md={12} lg={12}>
                                                <div className="blockinfo-key mt-2">Previous Outpoint Index + Hash</div>
                                                <div className="utxo-value-mono">
                                                    #{tx_input.previous_outpoint_index} {tx_input.previous_outpoint_hash}
                                                </div>
                                            </Col>
                                            {additionalTxInfo && additionalTxInfo[tx_input.previous_outpoint_hash] && <>
                                                <Col sm={12} md={12} lg={12}>
                                                    <div className="blockinfo-key mt-2">Address</div>
                                                    <div className="utxo-value-mono">
                                                        <Link to={`/addresses/${additionalTxInfo[tx_input.previous_outpoint_hash]
                                                            .outputs[tx_input.previous_outpoint_index].scriptPublicKeyAddress}`} className="blockinfo-link">
                                                            {additionalTxInfo[tx_input.previous_outpoint_hash]
                                                                .outputs[tx_input.previous_outpoint_index].scriptPublicKeyAddress}
                                                        </Link>
                                                    </div>
                                                </Col>
                                                <Col sm={12} md={12} lg={12}>
                                                    <div className="blockinfo-key mt-2">Amount</div>
                                                    <div className="utxo-value">
                                                        <span className="utxo-amount-minus">-{additionalTxInfo[tx_input.previous_outpoint_hash]
                                                            .outputs[tx_input.previous_outpoint_index].amount / 100000000}&nbsp;KAS</span>
                                                    </div>
                                                </Col></>}
                                        </Row>

                                    </>)
                                }

                            </Container>
                            <div className="blockinfo-header mt-5"><h4>Outputs</h4></div>
                            <Container className="webpage utxo-box" fluid>
                                {
                                    (txInfo.outputs || []).map((tx_output) =>
                                        <Row className="utxo-border py-3">
                                            <Col sm={6} md={6} lg={2}>
                                                <div className="blockinfo-key mt-2 mt-lg-0">Index</div>
                                                <div className="utxo-value-mono">
                                                    #{tx_output.index}
                                                </div>
                                            </Col>
                                            <Col sm={12} md={12} lg={4}>
                                                <div className="blockinfo-key mt-2 mt-lg-0">Script Public Key Type</div>
                                                <div className="utxo-value-mono">
                                                    {tx_output.scriptPublicKeyType}
                                                </div>
                                            </Col>
                                            <Col sm={6} md={6} lg={3}>
                                                <div className="blockinfo-key mt-2 mt-lg-0">Amount</div>
                                                <div className="utxo-value">
                                                    <span className="utxo-amount">+{tx_output.amount / 100000000}&nbsp;KAS</span>
                                                </div>
                                            </Col>
                                            <Col sm={12} md={12} lg={12}>
                                                <div className="blockinfo-key mt-2">Script Public Key</div>
                                                <div className="utxo-value-mono">
                                                    {tx_output.scriptPublicKey}
                                                </div>
                                            </Col>
                                            <Col sm={12} md={12} lg={12}>
                                                <div className="blockinfo-key mt-2">Script Public Key Address</div>
                                                <div className="utxo-value-mono">

                                                    <Link to={`/addresses/${tx_output.scriptPublicKeyAddress}`} className="blockinfo-link">
                                                        {tx_output.scriptPublicKeyAddress}
                                                    </Link>
                                                </div>
                                            </Col>
                                        </Row>)
                                }
                            </Container></div> : <></>}
                </Col>
            </Row>

        </Container>
    </div >



}

export default TransactionInfo;
