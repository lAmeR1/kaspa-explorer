import { Container } from 'react-bootstrap'
import BlockOverview from "./BlockOverview"

export default () => {
    return <div className="blocks-page">

        <Container className="webpage px-md-5 blocks-page-overview" fluid>
            <BlockOverview lines={40} />
        </Container>
    </div>
}