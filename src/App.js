import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Kaspa EXPLORER</Navbar.Brand>
        <Nav>
          <Nav.Link href="#home">Dashboard</Nav.Link>
          <Nav.Link href="#blocks">Blocks</Nav.Link>
          <Nav.Link href="#transactions">Transactions</Nav.Link>
        </Nav>
      </Navbar>
      <Form>
        <Form.Control type="text" placeholder="Enter kaspa:address / block hash / transaction hash" />
        <Button variant="primary">Go!</Button>
      </Form>
    </div>
  );
}

export default App;
