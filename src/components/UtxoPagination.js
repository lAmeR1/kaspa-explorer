import { Pagination } from "react-bootstrap";

const UtxoPagination = (props) => {

    let items = []
    let createIndex;

    if (props.active < 3) {
        createIndex = 3
    } else {
        if (props.active > props.total - 2) {
            createIndex = props.total - 2
        }
        else {
            createIndex = props.active;
        }
    }

    for (let i = Math.max(createIndex - 2, 1); i <= Math.min(createIndex + 2, props.total); i++) {
        items.push(<Pagination.Item active={i === props.active} onClick={() => { props.setActive(i) }}>{i}</Pagination.Item>)
    }

    return <div className="ms-auto fs-6">
        <Pagination>
            {(Math.min(props.active, props.total - 2) - 2) > 1 ? <>
                <Pagination.Item onClick={() => { props.setActive(1) }}>{1}</Pagination.Item>
                {props.active > 4 && <Pagination.Ellipsis />}
            </> : <></>}
            {items}

            {props.total > Math.max(3, props.active) + 2 ? <>
                {props.active < (props.total - 3) && <Pagination.Ellipsis />}
                <Pagination.Item onClick={() => { props.setActive(props.total) }}>{props.total}</Pagination.Item>
            </> : <></>}
        </Pagination>
    </div>
}

export default UtxoPagination;