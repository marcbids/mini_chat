import React from "react";
import { Container } from "react-bootstrap";

import "./index.css";
import img2 from "../../images/feature-image_book.jpeg";

export const Banner = () => {
  return (
    <>
      <Container>
        <div id="Banner">
          <img
            src={img2}
            alt="books"
            style={{ width: "100%", height: "36vw" }}
          />
        </div>
      </Container>
    </>
  );
};
