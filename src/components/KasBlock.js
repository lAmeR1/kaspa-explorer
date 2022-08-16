import { faSackXmark, faHashtag, faCube } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const KasBlock = (props) => {
    return <div className="kasBlock">
        <div style={{ "text-align": "center" }}><h1><FontAwesomeIcon icon={faCube} /></h1></div>

        <table style={{padding: "1rem", "marginTop": "1.5rem"}}>
            <tr>
                <td><FontAwesomeIcon icon={faHashtag} /></td>
                <td style={{"paddingLeft": ".2rem"}}>{props.hashShort}</td>
            </tr>
            <tr>
                <td><FontAwesomeIcon icon={faSackXmark} /></td>
                <td style={{"paddingLeft": ".2rem"}}>{props.transactions.length} TXs</td>
            </tr>
        </table>

        <div></div>
    </div>
}

export default KasBlock;