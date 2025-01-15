import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";

const NotAcceptedTooltip = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const tooltipText = `
    GHOSTDAG allows multiple blocks to coexist, so the 
    same transaction can appear in several blocks.
    The consensus accepts one and rejects the others.
    `;

  return (
    <OverlayTrigger
      show={visible}
      placement="top"
      overlay={
        <Tooltip id="not-accepted-tooltip">{tooltipText.trim()}</Tooltip>
      }
    >
      <span
        onClick={toggleVisibility}
        style={{ cursor: "pointer", marginLeft: "0.5rem" }}
      >
        <FaQuestionCircle />
      </span>
    </OverlayTrigger>
  );
};

export default NotAcceptedTooltip;
