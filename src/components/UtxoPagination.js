import { Pagination } from "react-bootstrap";

const UtxoPagination = (props) => {

    let items = []
    let createIndex;

    if (props.active < 3) {
        createIndex = 3
    } else {
        if (props.active > props.total - 3) {
            createIndex = props.total - 3
        }
        else {
            createIndex = props.active;
        }
    }

    for (let i = Math.max(createIndex - 2, 1); i <= Math.min(createIndex + 2, props.total); i++) {
        console.log(i);
        items.push(<Pagination.Item active={i === props.active} onClick={() => { props.setActive(i) }}>{i}</Pagination.Item>)
    }

    return <div className="ms-auto fs-6">
        <Pagination>
            {(props.active - 2) > 1 ? <>
                <Pagination.Item onClick={() => { props.setActive(1) }}>{1}</Pagination.Item>
                <Pagination.Ellipsis />
            </> : <></>}
            {items}

            {props.total > props.active + 2 ? <>
                <Pagination.Ellipsis />
                <Pagination.Item onClick={() => { props.setActive(props.total) }}>{props.total}</Pagination.Item>
            </> : <></>}
        </Pagination>
    </div>
}

export default UtxoPagination;