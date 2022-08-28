import { Card, Container, Row, Col } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("ws://127.0.0.1:8000", {
    path: '/ws/socket.io'
});


const BlockDAGBox = () => {
    const [data, setData] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    const [blockCount, setBlockCount] = useState("");
    const [headerCount, setHeaderCount] = useState("");
    const [virtualDaaScore, setVirtualDaaScore] = useState("");

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('blockdag', (data) => {
            setData(data)
            setBlockCount(data.blockCount)
            setHeaderCount(data.headerCount)
            setVirtualDaaScore(data.virtualDaaScore)
        })

        // join room to get updates
        socket.emit("join-room", "blockdag")


        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('coinsupply');
        };
    }, [])

    useEffect((e) => {
        document.getElementById('blockCount').animate([
            // keyframes
            { opacity: '1' },
            { opacity: '0.6' },
            { opacity: '1' },
          ], {
            // timing options
            duration: 300
          });
    }, [blockCount])

    useEffect((e) => {
        document.getElementById('headerCount').animate([
            // keyframes
            { opacity: '1' },
            { opacity: '0.6' },
            { opacity: '1' },
          ], {
            // timing options
            duration: 300
          });
    }, [headerCount])

    useEffect((e) => {
        document.getElementById('virtualDaaScore').animate([
            // keyframes
            { opacity: '1' },
            { opacity: '0.6' },
            { opacity: '1' },
          ], {
            // timing options
            duration: 300
          });
    }, [virtualDaaScore])


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
                    <td id="blockCount">
                        {blockCount}
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Header count
                    </td>
                    <td id="headerCount">
                        {headerCount}
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Virtual DAA Score
                    </td>
                    <td id="virtualDaaScore">
                        {virtualDaaScore}
                    </td>
                </tr>
            </table>
        </div>
    </>
}


export default BlockDAGBox;