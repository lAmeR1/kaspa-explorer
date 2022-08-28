import { useEffect, useRef, useState } from "react";
import { getNewBlocks } from './blocksupdater'
import { FaDiceD20 } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';

// io.set('transports', ['websocket']);

const socket = io("ws://127.0.0.1:8000", {
    path: '/ws/socket.io'
});

const BlockOverview = () => {

    const [blocks, setBlocks] = useState([]);
    const blocksRef = useRef(blocks);
    blocksRef.current = blocks;
    const [isConnected, setIsConnected] = useState(socket.connected);
    const navigate = useNavigate();



    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            
          });
      
          socket.on('disconnect', () => {
            
            setIsConnected(false);
          });

          socket.on('last-blocks', (e) => {
            setBlocks(e)
            socket.emit("join-room", "blocks")
          })

          socket.emit('last-blocks', "")
      
          socket.on('new-block', (d) => {
            setBlocks([...blocksRef.current, d].slice(-20))
          });
      
          return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('new-block');
          };

          

    }, [])

    const onClickRow = (e) => {    
        navigate(`/blocks/${e.target.parentElement.id}`)
    }


    return <div className="block-overview">
        <h4 className="block-overview-header text-center"><FaDiceD20 className={isConnected ? "rotate" : ""} size="1.7rem"/> LATEST BLOCKS</h4>
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
                    {[...blocks].sort((a,b) => b.verboseData.blueScore - a.verboseData.blueScore).slice(0,20).map((x) => <tr id={x.verboseData.hash} key={x.verboseData.hash} onClick={onClickRow}>
                        <td>{x.verboseData.blueScore}</td>
                        <td>{x.transactions.length}</td>
                        <td>{x.verboseData.hash.substr(0, 10)}...{x.verboseData.hash.substr(54, 10)}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>

}

export default BlockOverview;