import logo from './logo.svg';

import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.scss';
import BalanceModal from './components/BalanceModal';
import { useState } from 'react';
import CoinsupplyBox from './components/CoinsupplyBox';
import BlockDAGBox from './components/BlockDAG';
import KaspadInfoBox from './components/KaspadInfoBox';
import BlockDagVisualization from './components/BlockDagVisualization';
import BlockOverview from './components/BlockOverview';
import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from 'react-router';




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

  const getBalance = (e) => {
    // kaspa:pzhh76qc82wzduvsrd9xh4zde9qhp0xc8rl7qu2mvl2e42uvdqt75zrcgpm00
    fetch(`https://kaspa.herokuapp.com/addresses/${e.target.searchInput.value}/balance`)
      .then(response => response.json())
      .then(data => {
        setAddress(data["address"]);
        setBalance(data["balance"] / 100000000);
        setShow(true);
      })
      .catch(r => console.log(r))


    e.preventDefault()
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
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Form onSubmit={search}>
                <InputGroup className="ms-md-5 mt-5 searchBox">
                  <Form.Control className="bg-light text-dark shadow-none" name="searchInput" type="text" placeholder="kaspa:address / block / tx " />
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
      <div className="row3">
        <Container className="thirdRow webpage" fluid>
          <Row>
            <Col xs={12}><BlockDagVisualization /></Col>
          </Row>
        </Container>
      </div>
      <div className="row4">
        <Container className="fourthRow webpage" fluid>
          <Row>
            <Col xs={12} lg={6}><BlockOverview /></Col>
          </Row>
        </Container>
      </div>
      <BalanceModal handleClose={handleClose} show={show} address={address} balance={balance} />



    </div>

  );
}

export default Dashboard;
