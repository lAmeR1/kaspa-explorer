import { faRotate } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { FaCheck, FaCopy, FaClipboard, FaClipboardCheck } from "react-icons/fa"
import { BiCopy, BiCheckCircle } from "react-icons/bi"

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

    return <>{justCopied ? <><FaCheck className="mx-1 copy-symbol-success" /><font className="copy-symbol-success">copied</font></> : <BiCopy className="fa ms-1 copy-symbol" onClick={handleOnClick} />}</>
}