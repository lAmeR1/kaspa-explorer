import { Card, Container, Row, Col } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";
import io from 'socket.io-client';

const socket = io("ws://127.0.0.1:8000", {
    path: '/ws/socket.io'
});


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CBox = () => {
    const [circCoins, setCircCoins] = useState("-");
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('coinsupply', (e) => {
            setCircCoins(Math.round(parseFloat(e.circulatingSupply)/100000000))
        })

        // join room to get updates
        socket.emit("join-room", "coinsupply")


        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('coinsupply');
        };
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