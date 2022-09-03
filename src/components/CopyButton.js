import { faRotate } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { FaClipboard, FaClipboardCheck } from "react-icons/fa"

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

    return <>{justCopied ? <FaClipboardCheck key={props.text} className="ms-1 copy-symbol-success" /> : <FaClipboard className="ms-1 copy-symbol" onClick={handleOnClick} />}</>
}