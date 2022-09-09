import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import './App.scss';
import BalanceModal from './components/BalanceModal';
import BlockDAGBox from './components/BlockDAG';
import BlockOverview from './components/BlockOverview';
import CoinsupplyBox from './components/CoinsupplyBox';
import KaspadInfoBox from './components/KaspadInfoBox';
import TxOverview from './components/TxOverview';




function Dashboard() {

  const [show, setShow] = useState(false);
  const navigate = useNavigate()

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("kaspa:");

  const search = (e) => {
    e.preventDefault();
    const v = e.target.searchInput.value

    if (v.length == 64) {
      navigate(`/blocks/${v}`)
    }

    if (v.startsWith("kaspa:")) {
      navigate(`/addresses/${v}`)
    }

    

  }


  //<Button variant="primary">Go!</Button>
  return (
    <div>
      <div className="row1">
        <Container className="firstRow webpage" fluid>
          <Row>
            <Col md={12} className='d-flex flex-row justify-content-start text-light d-xs-none align-items-center'>
              <img className="big-kaspa-icon" src="/k-icon-glow.png" />
              <div className="bigfont">
                KASPA<br />EXPLORER
              </div>
              <div className="beta-dashboard fs-1" style={{transform: "translateX(-3rem)"}}>BETA</div>
            </Col>
          </Row>
          <Row>
            <Col xs={11}>
              <Form onSubmit={search}>
                <InputGroup className="ms-md-5 mt-5 me-5 dashboard-search-box">
                  <Form.Control className="bg-light text-dark shadow-none" name="searchInput" type="text" placeholder="Search for kaspa:address or block" />
                  <Button type="submit" className="shadow-none searchButton" variant="dark" ><i className='fa fa-search' /></Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Container>

      </div>
      <div className="row2">
        <Container className="secondRow webpage" fluid>
          <Row>
            <Col sm={12} md={6} lg={4}><div className="infoBox">
              <CoinsupplyBox />
            </div></Col>
            <Col sm={12} md={6} lg={4}><div className="infoBox"><BlockDAGBox /></div></Col>
            <Col sm={12} md={6} lg={4}><div className="infoBox"><KaspadInfoBox /></div></Col>
          </Row>
        </Container>
      </div>
      {/* <div className="row3">
        <Container className="thirdRow webpage" fluid>
          <Row>
            <Col xs={12}><BlockDagVisualization /></Col>
          </Row>
        </Container>
      </div> */}
      <div className="row4">
        <Container className="fourthRow webpage" fluid>
          <Row>
            <Col className="" xs={12} lg={6}><BlockOverview lines={20} small/></Col>
            <Col className="mt-5 mt-lg-0"  xs={12} lg={6}><TxOverview lines={20}  /></Col>
          </Row>
        </Container>
      </div>
      <BalanceModal handleClose={handleClose} show={show} address={address} balance={balance} />



    </div>

  );
}

export default Dashboard;
