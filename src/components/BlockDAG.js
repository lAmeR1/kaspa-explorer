import { faDiagramProject } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";
import { getBlockdagInfo } from '../kaspa-api-client';


const BlockDAGBox = () => {

    const [data, setData] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    const [blockCount, setBlockCount] = useState();
    const [headerCount, setHeaderCount] = useState("");
    const [virtualDaaScore, setVirtualDaaScore] = useState("");
    const [hashrate, setHashrate] = useState("");

    const initBox = async () => {
        const dag_info = await getBlockdagInfo()


        setBlockCount(dag_info.blockCount)
        setHeaderCount(dag_info.headerCount)
        setVirtualDaaScore(dag_info.virtualDaaScore)
        setHashrate((dag_info.difficulty * 2 / 1000000).toFixed(2))
    }

    useEffect(() => {
        initBox();
        const updateInterval = setInterval(async () => {
            const dag_info = await getBlockdagInfo()
            setBlockCount(dag_info.blockCount)
            setHeaderCount(dag_info.headerCount)
            setVirtualDaaScore(dag_info.virtualDaaScore)
            setHashrate((dag_info.difficulty * 2 / 1000000).toFixed(2))
        }, 60000)
        return (async () => {
            clearInterval(updateInterval)
        })
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

    useEffect((e) => {
        document.getElementById('hashrate').animate([
            // keyframes
            { opacity: '1' },
            { opacity: '0.6' },
            { opacity: '1' },
        ], {
            // timing options
            duration: 300
        });
    }, [hashrate])


    return <>
        <div className="cardBox mx-0">
            <table style={{ fontSize: "1rem" }}>
                <tr>
                    <td colspan='2' className="text-center" style={{ "fontSize": "4rem" }}>
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
                    <td className="pt-1 text-nowrap">
                        KASPA TN10
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Block count
                    </td>
                    <td className="pt-1" id="blockCount">
                        {blockCount}
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Header count
                    </td>
                    <td className="pt-1" id="headerCount">
                        {headerCount}
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Virtual DAA Score
                    </td>
                    <td className="pt-1 align-top" id="virtualDaaScore">
                        {virtualDaaScore}
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Hashrate
                    </td>
                    <td className="pt-1" id="hashrate">
                        {(hashrate * 10).toFixed(3)} MH/s
                    </td>
                </tr>
            </table>
        </div>
    </>
}


export default BlockDAGBox;
