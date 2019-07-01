import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, } from 'mdbreact';
import API from '../../utils/AdminAPI'
import '../pageStyle.css'

class Admin extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    };
  }

  populateRoute = (e) => {
    e.preventDefault()
    API.addAllRoutes()
      .then(res => {
        console.log("All routes Added.")
      })
  }

  render() {
    return(
      <MDBContainer className="text-center mt-5 pt-5 mainContainer">
          <MDBRow className="justify-content-center">
              <MDBCol md="5" sm="12">
                <MDBBtn onClick = {(e) => this.populateRoute(e)}>Add TTC Routes and Stops</MDBBtn>
              </MDBCol>
          </MDBRow>

      </MDBContainer>
    );
  };
};

export default Admin