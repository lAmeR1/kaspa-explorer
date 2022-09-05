import logo from './logo.svg';

import { Navbar, Nav, Form, Button, Container, Row, Col, InputGroup, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.scss';
import BalanceModal from './components/BalanceModal';
import { useEffect, useRef, useState } from 'react';
import CoinsupplyBox from './components/CoinsupplyBox';
import BlockDAGBox from './components/BlockDAG';
import KaspadInfoBox from './components/KaspadInfoBox';
import BlockDagVisualization from './components/BlockDagVisualization';
import BlockOverview from './components/BlockOverview';
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from './Dashboard';
import BlockInfo from './components/BlockInfo';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import NotFound from './components/NotFound';
import AddressInfo from './components/AddressInfo';
import { FaDollarSign, FaSearch } from 'react-icons/fa';
import BlocksPage from './components/BlocksPage';
import PriceContext from './components/PriceContext';
import AddressInfoPage from './components/AddressInfo';
import io from 'socket.io-client';
import LastBlocksContext from './components/LastBlocksContext';
import TxPage from './components/TxPage';
import { NavLink } from 'react-router-dom';


document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener('scroll', function () {
    if (window.location.pathname == "/") {

      if (window.scrollY > 200) {
        document.getElementById('navbar_top').classList.add('fixed-top');
      } else {
        document.getElementById('navbar_top').classList.remove('fixed-top');
      }
    }
  });
});

const socket = io("wss://api.kaspa.org", {
  path: '/ws/socket.io'
});

function App() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("kaspa:");

  const [price, setPrice] = useState("")

  const [blocks, setBlocks] = useState([]);
  const [isConnected, setIsConnected] = useState();

  const location = useLocation()
  const navigate = useNavigate()

  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;


  const search = (e) => {
    e.preventDefault();
    const v = e.target.searchbox.value

    if (v.length == 64) {
      navigate(`/blocks/${v}`)
    }

    if (v.startsWith("kaspa:")) {
      navigate(`/addresses/${v}`)
    }

    e.target.searchbox.value = ""
  }

  const updatePrice = () => {
    fetch(`https://api.coingecko.com/api/v3/coins/kaspa`, {
      headers: { "Cache-Control": "no-cache" }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data['market_data']['current_price']['usd'].toFixed(6))
        setPrice(data['market_data']['current_price']['usd'].toFixed(6));
      })
      .catch(r => console.log(r))
  }

  useEffect(() => {
    updatePrice()

    const intervalPrice = setInterval(() => {
      updatePrice()
    }, 60000);

    // socketio
    socket.on('connect', () => {
      setIsConnected(true);

    });

    socket.on('disconnect', () => {

      setIsConnected(false);
    });

    socket.on('last-blocks', (e) => {
      setBlocks(e)
      socket.emit("join-room", "blocks")
    })

    socket.emit('last-blocks', "")

    socket.on('new-block', (d) => {
      setBlocks([...blocksRef.current, d].slice(-100))
    });

    return () => {
      clearInterval(intervalPrice);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new-block');
    }
  }, [])


  const closeMenuIfNeeded = () => {
    if (document.getElementById("responsive-navbar-nav").classList.contains('show')) {
      document.getElementsByClassName("navbar-toggler")[0].click()
    }
  }


  //<Button variant="primary">Go!</Button>
  return (
    <LastBlocksContext.Provider value={{ blocks, isConnected }}>
      <PriceContext.Provider value={{ price }}>
        <div className="big-page">
          <Navbar expand="md" bg="dark" variant="dark" sticky="top" id="navbar_top" className={location.pathname == "/" ? "" : "fixed-top"}>
            <Container id="navbar-container" fluid>
              <div className="navbar-title">
                <Navbar.Brand >
                  <Link to="/">
                    <div className="navbar-brand">
                      <img className="shake" src="/k-icon-glow.png" style={{ "marginRight": ".5rem", width: "4rem", height: "4rem" }} />
                      <div className="navbar-brand-text text-start">KASPA<br />EXPLORER</div>
                    </div>
                  </Link>
                </Navbar.Brand>
              </div>

              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Item><NavLink className="nav-link fs-5" onClick={closeMenuIfNeeded} to={"/"}>Dashboard</NavLink></Nav.Item>
                  <Nav.Item><NavLink className="nav-link fs-5" onClick={closeMenuIfNeeded} to={"/blocks"}>Blocks</NavLink></Nav.Item>
                  <Nav.Item><NavLink className="nav-link fs-5" onClick={closeMenuIfNeeded}  to={"/txs"}>Transactions</NavLink></Nav.Item>
                </Nav>
                <div className='ms-auto navbar-price'>${price} <span className="text-light">/ KAS</span></div>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <div className="search-row">
            <Container className="webpage" hidden={location.pathname == "/"}>
              <Row><Col xs={12}>
                  <Form onSubmit={search} className="">
                    <InputGroup className="mt-4 mb-4 search-box-group">
                      <Form.Control className="d-inline-block bg-light text-dark shadow-none" name="searchbox" id="search-box-high" type="text" placeholder="kaspa:address / block / tx " />
                      <Button type="submit" className="shadow-none searchButton" variant="dark"><i className='fa fa-search' /></Button>
                    </InputGroup>
                  </Form>
              </Col></Row>
            </Container>
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/blocks" element={<BlocksPage />} />
            <Route path="/blocks/:id" element={<BlockInfo />} />
            <Route path="/blocks/:id/:txview" element={<BlockInfo />} />
            <Route path="/addresses/:addr" element={<AddressInfoPage />} />
            <Route path="/txs" element={<TxPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* <div className="alpha">ALPHA VERSION</div> */}
        </div>
      </PriceContext.Provider>
    </LastBlocksContext.Provider>

  );
}

export default App;
