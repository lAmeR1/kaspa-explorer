import { useEffect, useState } from "react";
import { getNewBlocks } from './blocksupdater'
import { FaDiceD20 } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const BlockOverview = () => {

    const [blocks, setBlocks] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const intervalId = setInterval((x) => {
            // var readBlocks = getNewBlocks(setBlocks, 20)
        }, 3000)

        return () => clearInterval(intervalId);

    }, [])

    const onClickRow = (e) => {    
        navigate(`/blocks/${e.target.parentElement.id}`)
    }


    return <div className="block-overview">
        <h4 className="block-overview-header text-center"><FaDiceD20 className="rotate" size="1.7rem"/> LATEST BLOCKS</h4>
        <div className="block-overview-content">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>BlueScore</th>
                        <th>TXs</th>
                        <th>Hash</th>
                    </tr>
                </thead>
                <tbody>
                    {blocks.map((x) => <tr id={x.hash} key={x.hash} onClick={onClickRow}>
                        <td>{x.blueScore}</td>
                        <td>{x.txIds.length}</td>
                        <td>{x.hash.substr(0, 10)}...{x.hash.substr(54, 10)}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>

}

export default BlockOverview;