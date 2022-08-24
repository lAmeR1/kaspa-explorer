import { Container } from 'react-bootstrap'
import BlockOverview from "./BlockOverview"

export default () => {
    return <div className="blocks-page">

        <Container className="blocks-page-overview">
            <BlockOverview />
        </Container>
    </div>
}