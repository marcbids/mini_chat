import React from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import "./index.css";

export const Footer = () => {
  return (
    <React.Fragment>
      <div id="footer">
        <footer
          className="bg-dark text-white"
          bg="dark"
          variant="dark"
          id="Footer"
        >
          <Row className="g-0">
            <Col align="center">
              <div id="footer-content">
                <span>&copy; Marco Bidayo | Web Developer Portfolio</span>
              </div>
            </Col>
            <Col align="center">
              <div id="footer-social">
                <a
                  href="https://www.facebook.com/marcbids/"
                  className="facebook social"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UC1QUzfH0BwWotW18wa8IZxw"
                  className="youtube social"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faYoutube} size="2x" />
                </a>
                <a
                  href="https://twitter.com/MarcoBowBow"
                  className="twitter social"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
                <a
                  href="https://www.instagram.com/marcbids/"
                  className="instagram social"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faInstagram} size="2x" />
                </a>
              </div>
            </Col>
          </Row>
        </footer>
      </div>
    </React.Fragment>
  );
};
