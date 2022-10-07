import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from "react";
import socketIOClient from 'socket.io-client';
import { numberWithCommas } from "../helper";
import PriceContext from "./PriceContext";
import { HiCurrencyDollar } from 'react-icons/hi'
import { IoMdTrendingDown, IoMdTrendingUp } from 'react-icons/io'

const socket = socketIOClient("wss://kaspa.herokuapp.com/", {
    path: '/ws/socket.io'
});


const MarketDataBox = () => {
    const [circCoins, setCircCoins] = useState("-");
    const [isConnected, setIsConnected] = useState(false);
    const { price, marketData } = useContext(PriceContext);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('coinsupply', (e) => {
            setCircCoins(Math.round(parseFloat(e.circulatingSupply) / 100000000))
        })

        // join room to get updates
        socket.emit("join-room", "coinsupply")


        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('coinsupply');
        };
    }, [])



    useEffect(() => {
        document.getElementById('coins').animate([
            // keyframes
            { opacity: '1' },
            { opacity: '0.6' },
            { opacity: '1' },
        ], {
            // timing options
            duration: 300
        });
    }, [circCoins])


    return <>
        <div className="cardBox mx-0">
            <table>
                <tr>
                    <td colspan='2' className="text-center" style={{ "fontSize": "3.8rem" }}>
                        <HiCurrencyDollar style={{transform: "translateY(-10px)"}} />
                        <div id="light1" className="cardLight" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2" className="text-center">
                        <h3>Market data</h3>
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">Price</td>
                    <td>$ {price} / KAS</td>
                </tr>
                <tr>
                    <td style={{fontSize: "small"}} className="cardBoxElement" align="right">1h %</td>
                    <td style={{fontSize: "small"}} className="utxo-value-mono">
                    {marketData?.price_change_percentage_1h_in_currency?.usd > 0 ? <IoMdTrendingUp color='#398851' /> : <IoMdTrendingDown color='#d63328' />}
                     {marketData?.price_change_percentage_1h_in_currency?.usd?.toFixed(1)} %<br />
                    </td>
                </tr>
                <tr>
                    <td style={{fontSize: "small"}} className="cardBoxElement" align="right">24h %</td>
                    <td style={{fontSize: "small"}} className="utxo-value-mono">
                    {marketData?.price_change_percentage_24h > 0 ? <IoMdTrendingUp color='#398851' /> : <IoMdTrendingDown color='#d63328' />}
                         {marketData?.price_change_percentage_24h?.toFixed(1)} %<br />
                    </td>
                </tr>
                <tr>
                    <td style={{fontSize: "small"}} className="cardBoxElement" align="right">7d %</td>
                    <td style={{fontSize: "small"}} className="utxo-value-mono">
                        {marketData?.price_change_percentage_7d > 0 ? <IoMdTrendingUp color='#398851' /> : <IoMdTrendingDown color='#d63328' />}
                         {marketData?.price_change_percentage_7d?.toFixed(1)} %<br />
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">Volume</td>
                    <td className="pt-1">$ {numberWithCommas(marketData?.total_volume?.usd)}</td>
                </tr>
                <tr>
                    <td className="cardBoxElement">MCAP</td>
                    <td className="pt-1">$ {(circCoins * price / 1000000).toFixed(2)} M <a href="https://www.coingecko.com/en/coins/kaspa" target="_blank" className="rank ms-1">Rank #{marketData?.market_cap_rank}</a></td>
                </tr>
            </table>
        </div>
    </>
}


export default MarketDataBox