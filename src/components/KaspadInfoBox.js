import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMemory } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";



const KaspadInfoBox = () => {
    const [data, setData] = useState({});

    async function updateData() {
        await fetch('https://api.kaspa.org/info/kaspad')
            .then((response) => response.json())
            .then(d => setData(d))
            .catch(err => console.log("Error", err))
        setTimeout(updateData, 60000)
    }
    useEffect(() => {

        updateData()
    }, [])


    return <>
        <div className="cardBox mx-0 mx-sm-5">
            <table>
                <tr>
                    <td colspan='2' className="text-center" style={{ "font-size": "4rem" }}>
                        <FontAwesomeIcon icon={faMemory} />
                        <div className="cardLight" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2" className="text-center">
                        <h3>KASPAD INFO</h3>
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Mempool size
                    </td>
                    <td>
                        {data.mempoolSize}
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Server version
                    </td>
                    <td>
                        {data.serverVersion}
                    </td>
                </tr>
            </table>
        </div>
    </>
}


export default KaspadInfoBox