import React from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle ,MDBCollapse, MDBNavItem, MDBDropdownItem ,MDBNavLink, MDBIcon } from 'mdbreact';

class FixedNavbar extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          collapse: false,
      };
      this.onClick = this.onClick.bind(this);
  }

  onClick = () => {
    this.setState({
        collapse: !this.state.collapse,
      });
  }

  render() {
    const bgPink = {backgroundColor: '#e91e63'}
    return(
      <div>
        <header>
          <MDBNavbar style={bgPink} dark expand="md" scrolling fixed="top">
            <MDBNavbarBrand href="/">
                <strong>Walk/Wait</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={ this.onClick } />
            <MDBCollapse collapse = { this.state.collapse } navbar>
              <MDBNavbarNav left>
                <MDBNavItem active>
                    <MDBNavLink to="/">Home</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink to="#">About</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink to="#">Contact Us</MDBNavLink>
                </MDBNavItem>
              </MDBNavbarNav>
              <MDBNavbarNav right>
                <MDBNavItem>
                <MDBDropdown>
                  <MDBDropdownToggle nav caret>
                    <MDBIcon icon="user-alt" /> 
                  </MDBDropdownToggle>

                  <MDBDropdownMenu className="dropdown-default">
                    <MDBDropdownItem to="#!"> My account </MDBDropdownItem>
                    <MDBDropdownItem to="#!"> Log out </MDBDropdownItem>
                    <MDBDropdownItem to="#!"> Register </MDBDropdownItem>
                  </MDBDropdownMenu>
                  </MDBDropdown>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBNavbar>
        </header>
      </div>
    );
  }
}

export default FixedNavbar;