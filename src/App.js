import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, Form, Button, Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BalanceModal from './components/BalanceModal';
import { useState } from 'react';




function App() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("kaspa:");

  const getBalance = (e) => {
    console.log()
    console.log("test", e)
    fetch(`https://kaspa.herokuapp.com/addresses/${e.target.form.searchBox.value}/balance`)
      .then(response => response.json())
      .then(data => {
        setAddress(data["address"]);
        setBalance(data["balance"] / 100000000);
        setShow(true);
      })
      .catch(r => console.log(r))

  }
  //<Button variant="primary">Go!</Button>
  return (
    <div className="App">
      
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>Kaspa EXPLORER</Navbar.Brand>
          <Nav>
            <Nav.Link href="#home">Dashboard</Nav.Link>
            <Nav.Link href="#blocks">Blocks</Nav.Link>
            <Nav.Link href="#transactions">Transactions</Nav.Link>
          </Nav>
        </Navbar><Container fluid>
        
            <Form>
            <Row className="justify-content-md-center">
          <Col xs={8}>
            <div>
              <Form.Control name="searchBox" type="text" placeholder="Enter kaspa:address / block hash / transaction hash" />
              <Button variant="primary" onClick={getBalance}>Go!</Button>
              </div>
              </Col>
            </Row>
            </Form>
      </Container>
      <BalanceModal handleClose={handleClose} show={show} address={address} balance={balance} />
    </div>
  );
}

export default App;
