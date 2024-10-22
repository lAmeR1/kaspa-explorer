import { Container } from "react-bootstrap";
import TxOverview from "./TxOverview";

const QrButton = () => {
  return (
    <div className="blocks-page">
      <Container className="webpage px-md-5 blocks-page-overview" fluid>
        <TxOverview font="normal" lines={40} />
      </Container>
    </div>
  );
};

export default QrButton;
