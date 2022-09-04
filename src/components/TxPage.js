import { Container } from 'react-bootstrap'
import TxOverview from './TxOverview'

export default () => {
    return <div className="blocks-page">

        <Container className="webpage blocks-page-overview" fluid>
            <TxOverview lines={40} />
        </Container>
    </div>
}