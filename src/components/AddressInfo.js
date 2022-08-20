import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router";
import { useEffect, useState } from 'react'
import { getAddressBalance, getAddressUtxos } from '../kaspa-api-client.js'

const AddressInfo = () => {
    const { addr } = useParams();
    const [addressBalance, setAddressBalance] = useState()
    const [utxos, setUtxos] = useState()
    
    useEffect(() => {
        getAddressBalance(addr).then(
            (res) => {
                setAddressBalance(res)
            }
        )
    }, [])

    useEffect(() => {
        getAddressUtxos(addr).then(
            (res) => {
                setUtxos(res)
            }
        )
    }, [addressBalance])

    return <div className="blockinfo-page">
        <Container className="webpage" fluid>
            <Row>
                <Col>
                    {addressBalance ?
                        <div className="blockinfo-content">
                            <div className="blockinfo-header"><h3>Details for {addr}</h3></div>
                            <table className="blockinfo-table">
                                <tr className="trow">
                                    <td>Balance</td>
                                    <td>{addressBalance/100000000} KAS</td>
                                </tr>
                                <tr>
                                    <td>UTXOs</td>
                                    <td>{utxos ? <ul>
                                        {utxos
                                        .sort((a,b) => {return b.utxoEntry.blockDaaScore - a.utxoEntry.blockDaaScore})
                                        .map(x => <li>{x.utxoEntry.amount/100000000} KAS ({x.outpoint.transactionId})</li>)}
                                    </ul> : <>Loading UTXOs <Spinner animation="border" role="status" /></>}</td>
                                </tr>
                            </table>
                        </div> : <>Loading Address info <Spinner animation="border" role="status" /></>}

                </Col>
            </Row>
        </Container></div>

}

export default AddressInfo;


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