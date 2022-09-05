import { Button, ButtonGroup, Col, Container, Pagination, Row, Spinner, Table } from "react-bootstrap";
import { useParams } from "react-router";
import { useContext, useEffect, useState } from 'react'
import { getAddressBalance, getAddressUtxos, getBlock, getBlockdagInfo } from '../kaspa-api-client.js'
import moment from "moment";
import PriceContext from "./PriceContext.js";
import CopyButton from "./CopyButton.js";
import UtxoPagination from "./UtxoPagination.js";
import { numberWithCommas } from "../helper"

const AddressInfoPage = () => {
    const { addr } = useParams();
    return <AddressInfo key={addr} />
}

const AddressInfo = () => {
    const { addr } = useParams();
    const [addressBalance, setAddressBalance] = useState(0)
    const [utxos, setUtxos] = useState([])
    const [loadingUtxos, setLoadingUtxos] = useState(true)
    const [active, setActive] = useState(1)

    const [currentEpochTime, setCurrentEpochTime] = useState(0);
    const [currentDaaScore, setCurrentDaaScore] = useState(0);

    const { price } = useContext(PriceContext);

    useEffect(() => {
        getAddressBalance(addr).then(
            (res) => {
                setAddressBalance(res)
            }
        )

        getBlockdagInfo().then(
            (blockdag) => {
                getBlock(blockdag.tipHashes[0]).then(
                    (block) => {
                        setCurrentEpochTime(Math.round(parseInt(block.header.timestamp) / 1000))
                        setCurrentDaaScore(parseInt(block.header.daaScore))
                    }
                )
            }
        )

    }, [])

    useEffect(() => {
        setLoadingUtxos(true);
        getAddressUtxos(addr).then(
            (res) => {
                setLoadingUtxos(false);
                setUtxos(res);
            }
        )
    }, [addressBalance])


    //     <div className="blockinfo-content">
    //     <div className="blockinfo-header"><h3>Details for {addr}</h3></div>
    //     <table className="blockinfo-table">
    //         <tr className="trow">
    //             <td>Balance</td>
    //             <td>{addressBalance/100000000} KAS</td>
    //         </tr>
    //         <tr>
    //             <td>UTXOs</td>
    //             <td>{utxos ? <ul>
    //                 {utxos
    //                 .sort((a,b) => {return b.utxoEntry.blockDaaScore - a.utxoEntry.blockDaaScore})
    //                 .map(x => <li>{x.utxoEntry.amount/100000000} KAS ({x.outpoint.transactionId})</li>)}
    //             </ul> : <>Loading UTXOs <Spinner animation="border" role="status" /></>}</td>
    //         </tr>
    //     </table>
    // </div> : <>Loading Address info <Spinner animation="border" role="status" /></>}

    return <div className="addressinfo-page">
        <Container className="webpage addressinfo-box" fluid>
            <Row>
                <Col xs={12}>
                    <div className="addressinfo-title d-flex flex-row align-items-end">address Overview
                    </div>

                </Col>
            </Row>
            <Row>
                <Col md={12} className="addressinfo-header mt-sm-4">

                    <div>Address</div>
                    <div className="addressinfo-title-addr">{addr}
                        <CopyButton size="2rem" text={addr} /></div>


                </Col>

            </Row>
            <Row>
                <Col sm={6} md={4}>
                    <div className="addressinfo-header mt-4">balance</div>
                    <div className="addressinfo-value d-flex"><div className="utxo-amount">{numberWithCommas(addressBalance / 100000000)} KAS</div></div>
                </Col>
                <Col sm={6} md={4}>
                    <div className="addressinfo-header mt-4 ms-sm-5">UTXOs count</div>
                    <div className="addressinfo-value ms-sm-5">{!loadingUtxos ? utxos.length : <Spinner animation="border" variant="primary" />}</div>
                </Col>
            </Row>
            <Row>
                <Col sm={6} md={4}>
                    <div className="addressinfo-header addressinfo-header-border mt-4 mt-sm-4 pt-sm-4 me-sm-5">value</div>
                    <div className="addressinfo-value">{(addressBalance / 100000000 * price).toFixed(2)} USD</div>
                </Col>
                <Col sm={6} md={4}>
                    <div className="addressinfo-header addressinfo-header-border mt-4 mt-sm-4 pt-sm-4 ms-sm-5">Transactions count</div>
                    <div className="addressinfo-value ms-sm-5">{!loadingUtxos ? utxos.length : <Spinner animation="border" variant="primary" />}</div>
                </Col>
            </Row>
        </Container>

        <Container className="webpage addressinfo-box mt-4" fluid>
            <Row className="border-bottom border-bottom-1">
                <Col xs={1}>
                    <div className="utxo-title d-flex flex-row">UTXOs</div>
                </Col>
                {utxos.length > 10 ? <Col xs={12} sm={11} className="d-flex flex-row justify-items-end">
                    <UtxoPagination active={active} total={Math.ceil(utxos.length / 10)} setActive={setActive} />
                </Col> : <></>}
            </Row>
            {!loadingUtxos ? utxos.sort((a, b) => b.utxoEntry.blockDaaScore - a.utxoEntry.blockDaaScore).slice((active - 1) * 10, (active - 1) * 10 + 10).map((x) =>
                <Row className="utxo-border pb-5 mb-5">
                    <Col sm={6} md={4}>
                        <div className="utxo-header mt-3">Block DAA Score</div>
                        <div className="utxo-value">{x.utxoEntry.blockDaaScore}<br />({moment(((currentEpochTime) - (currentDaaScore - x.utxoEntry.blockDaaScore)) * 1000).format("YYYY-MM-DD HH:mm:ss")})</div>
                    </Col>
                    <Col sm={6} md={4}>
                        <div className="utxo-header mt-3">amount</div>
                        <div className="utxo-value d-flex flex-row"><div className="utxo-amount">{x.utxoEntry.amount / 100000000} KAS</div></div>
                    </Col>
                    <Col sm={6} md={4}>
                        <div className="utxo-header mt-3">value</div>
                        <div className="utxo-value">{(x.utxoEntry.amount / 100000000 * price).toFixed(2)} $</div>
                    </Col>
                    <Col sm={6} md={4}>
                        <div className="utxo-header mt-3">index</div>
                        <div className="utxo-value">{x.outpoint.index}</div>
                    </Col>
                    <Col sm={6} md={4}>
                        <div className="utxo-header mt-3">transaction id</div>
                        <div className="utxo-value">
                            {x.outpoint.transactionId}
                            <CopyButton text={x.outpoint.transactionId} />
                        </div>
                    </Col>
                    <Col sm={6} md={4}>
                        <div className="utxo-header mt-3">details</div>
                        <div className="utxo-value">Unspent</div>
                    </Col>
                </Row>
            ) : <Spinner animation="border" variant="primary" />}

        </Container>

    </div>

}

export default AddressInfoPage;


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
