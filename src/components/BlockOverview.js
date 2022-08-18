import { useEffect, useState } from "react";
import { getNewBlocks } from './blocksupdater'
import { FaDiceD20 } from 'react-icons/fa';

const BlockOverview = () => {

    const [blocks, setBlocks] = useState([])

    useEffect(() => {
        const intervalId = setInterval((x) => {
            var readBlocks = getNewBlocks(setBlocks, 20)
        }, 3000)

        return () => clearInterval(intervalId);

    }, [])


    return <div className="block-overview">
        <h3 className="block-overview-header text-center"><FaDiceD20 size="4rem"/><br />LATEST 20 BLOCKS</h3>
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
                    {blocks.map((x) => <tr key={x.hash}>
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