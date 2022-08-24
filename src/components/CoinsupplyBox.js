import { Card, Container, Row, Col } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CBox = () => {
    const [circCoins, setCircCoins] = useState("-");

    async function updateCircSupply() {
        const coins = await fetch('https://kaspa.herokuapp.com/info/coinsupply/circulating')
            .then((response) => response.text())
            .then(data => parseFloat(data))
            .catch(err => console.log("Error", err))
        setCircCoins(Math.round(coins))
        setTimeout(updateCircSupply, 10000)
    }
    useEffect(() => {
        updateCircSupply()
    }, [])


    return <>
        <div className="cardBox">
            <table>
                <tr>
                    <td colspan='2' className="text-center" style={{ "font-size": "4rem" }}>
                        <FontAwesomeIcon icon={faCoins} />
                        <div id="light1" className="cardLight" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2" className="text-center">
                        <h3>Coin supply</h3>
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Circulating</td>
                    <td>{numberWithCommas(circCoins)} KAS
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">Total</td>
                    <td>28,600,000,000 KAS</td>
                </tr>
            </table>
        </div>
    </>
}


export default CBox