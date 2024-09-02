import {faDiagramProject} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useEffect, useState} from "react";
import {getBlockdagInfo, getHashrateMax} from '../kaspa-api-client';
import {numberWithCommas} from "../helper";


const BlockDAGBox = () => {

    const [virtualDaaScore, setVirtualDaaScore] = useState("");
    const [hashrate, setHashrate] = useState("");
    const [maxHashrate, setMaxHashrate] = useState("");

    const initBox = async () => {
        const dag_info = await getBlockdagInfo()
        const hashrateMax = await getHashrateMax()

        setVirtualDaaScore(dag_info.virtualDaaScore)
        setHashrate((dag_info.difficulty * 2 / 1000000000000).toFixed(2))
        setMaxHashrate(hashrateMax.hashrate)
    }

    useEffect(() => {
        initBox();
        const updateInterval = setInterval(async () => {
            const dag_info = await getBlockdagInfo()
            setVirtualDaaScore(dag_info.virtualDaaScore)
            setHashrate((dag_info.difficulty * 2 / 1000000000000).toFixed(2))
        }, 60000)
        return (async () => {
            clearInterval(updateInterval)
        })
    }, [])


    useEffect((e) => {
        document.getElementById('virtualDaaScore').animate([
            // keyframes
            {opacity: '1'},
            {opacity: '0.6'},
            {opacity: '1'},
        ], {
            // timing options
            duration: 300
        });
    }, [virtualDaaScore])

    useEffect((e) => {
        document.getElementById('hashrate').animate([
            // keyframes
            {opacity: '1'},
            {opacity: '0.6'},
            {opacity: '1'},
        ], {
            // timing options
            duration: 300
        });
    }, [hashrate])


    return <>
        <div className="cardBox mx-0">
            <table style={{fontSize: "1rem"}}>
                <tr>
                    <td colspan='2' className="text-center" style={{"fontSize": "4rem"}}>
                        <FontAwesomeIcon icon={faDiagramProject}/>
                        <div className="cardLight"/>
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
                        KASPA MAINNET
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Virtual DAA Score
                    </td>
                    <td className="pt-1 align-top" id="virtualDaaScore">
                        {numberWithCommas(virtualDaaScore)}
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Hashrate
                    </td>
                    <td className="pt-1" id="hashrate">
                        {(hashrate / 1000).toFixed(3)} PH/s
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Max Hashrate
                    </td>
                    <td className="pt-1" id="hashrate">
                        {(maxHashrate / 1000 / 1000).toFixed(3)} EH/s
                    </td>
                </tr>
            </table>
        </div>
    </>
}


export default BlockDAGBox;
