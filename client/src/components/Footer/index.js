import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";

const FooterPage = () => {
  return (
    <MDBFooter color="elegant-color-dark" className="font-small mt-4">
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright: <a href="/admin">WW</a><br />
          <span>Powered by Google &amp; NextBus</span>
        </MDBContainer>
      </div>
    </MDBFooter>
  );
}

export default FooterPage;