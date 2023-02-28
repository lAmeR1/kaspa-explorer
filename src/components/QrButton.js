import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { FaQrcode } from "react-icons/fa"

export default (props) => {

    
    return <OverlayTrigger key="qr" overlay={<Tooltip id="tooltip-qr-cb">Show QR-Code</Tooltip>}><span><FaQrcode style={{marginLeft: "0.2rem"}} className="fa ms-1 copy-symbol" onClick={props.onClick} /></span></OverlayTrigger>
}