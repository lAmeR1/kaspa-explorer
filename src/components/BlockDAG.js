import { Card, Container, Row, Col } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";



const BlockDAGBox = () => {
    const [data, setData] = useState({});

    async function updateData() {
        await fetch('https://kaspa.herokuapp.com/info/blockdag')
            .then((response) => response.json())
            .then(d => setData(d))
            .catch(err => console.log("Error", err))
        setTimeout(updateData, 3000)
    }
    useEffect(() => {

        // updateData()
    }, [])


    return <>
        <div className="cardBox">
            <table>
                <tr>
                    <td colspan='2' className="text-center" style={{ "font-size": "4rem" }}>
                        <FontAwesomeIcon icon={faDiagramProject} />
                        <div className="cardLight" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2" className="text-center">
                        <h3>BLOCKDAG INFO</h3>
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Network name
                    </td>
                    <td>
                        {data.networkName}
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Block count
                    </td>
                    <td>
                        {data.blockCount}
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Header count
                    </td>
                    <td>
                        {data.headerCount}
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Virtual DAA Score
                    </td>
                    <td>
                        {data.virtualDaaScore}
                    </td>
                </tr>
            </table>
        </div>
    </>
}


export default BlockDAGBox