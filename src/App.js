import logo from './logo.svg';

import { Navbar, Nav, Form, Button, Container, Row, Col, InputGroup, Card } from 'react-bootstrap';
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
import Dashboard from './Dashboard';
import BlockInfo from './components/BlockInfo';


document.addEventListener("DOMContentLoaded", function(){
  window.addEventListener('scroll', function() {
      if (window.scrollY > 200) {
        document.getElementById('navbar_top').classList.add('fixed-top');
      } else {
        document.getElementById('navbar_top').classList.remove('fixed-top');
      } 
  });
}); 

function App() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("kaspa:");

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
    <div className="big-page">
      <Navbar id="navbar_top" className="navbar-ext" variant="dark" bg="dark" sticky="top">
        <div className="navbar-container">
        <Navbar.Brand className="navbar-title">
          <img className="shake" src="/k-icon-glow.png" style={{ "margin": ".2rem", width: "4rem", height: "4rem" }} /> </Navbar.Brand>
        <Nav>
          <Nav.Link href="#home" className="fs-4">Dashboard</Nav.Link>
          <Nav.Link href="#blocks" className="fs-4">Blocks</Nav.Link>
          <Nav.Link href="#transactions" className="fs-4">Transactions</Nav.Link>
        </Nav>
        </div>
      </Navbar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/blocks/:id" element={<BlockInfo />} />

        <Route path="*" element={<Dashboard />} />
      </Routes>

    </div>

  );
}

export default App;
