import { useState } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { BiCopy } from "react-icons/bi"
import { FaCheck } from "react-icons/fa"

export default (props) => {

    const [justCopied, setJustCopied] = useState(false)

    // useEffect(() => {
    //     document.getElementById('coins').animate([
    //         // keyframes
    //         { transform: 'rotate(0.5turn)'}
    //       ], {
    //         // timing options
    //         duration: 300
    //       });
    // }, [justCopied])

    const handleOnClick = (e) => {
        setJustCopied(true)
        navigator.clipboard.writeText(props.text)
        setTimeout(() => {
            setJustCopied(false)
        }, 1000)
    }

    if (justCopied) {
        return <OverlayTrigger key="copied" overlay={<Tooltip id="tooltip-copied">Copied</Tooltip>}><span><FaCheck className="mx-1 copy-symbol-success" /></span></OverlayTrigger>
    } else {
        return <OverlayTrigger key="copy-cb" overlay={<Tooltip id="tooltip-copy-cb">Copy to clipboard</Tooltip>}><span><BiCopy className="fa ms-1 copy-symbol" onClick={handleOnClick} /></span></OverlayTrigger>
    }
}