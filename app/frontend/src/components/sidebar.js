import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const SidebarContainer = styled.div`
    display: flex;
    flex-direction: column;    
    height: 100vh;
    background-color: #252529;
    color: #fff;
`;
const SidebarMenu = styled.ul`
        display: flex;
        align-items: left;
        flex-direction: column;
        list-style: none;
        width: 100%;
        padding: 0px 30px;
`;
const SidebarMenuItem = styled.li`
        display: flex;
        height: 40px;
        width: 100%;
        align-items: center;
        padding-left: 30px;
        &:hover {
        background: rgba(255, 255, 255, 0.05);
        box-shadow: inset 3px 0 0 0 #ffffff;
        cursor: pointer;
        }
`;

const SidebarMenuItemLabel = styled.p`
        font-family: "Roboto", sans-serif;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.3;
        text-align: left;
        margin-left: 20px;
        padding: 12px 0px;
        color: #ffffff;
`;
const Icon = styled.svg`
        width: 20px;
        height: 20px;
`;

const MenuLogo = styled.div`
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 16px;
        font-size: 18px;
        line-height: 1.5;
        font-weight: 600;
        height: 45px;
        color: #fff;
        margin: 0px 30px 30px 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #2e2e33;
`;

const MenuSignOut = styled.div`
        font-size: 14px;
        line-height: 1.5;
        font-weight: 500;
        height: 45px;
        color: #fff;
        margin: 200px 30px 60px 30px;
        padding: 20px 0px 0px 30px;
        border-top: 1px solid #2e2e33;
`;

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#e3f2fd',
      main: '#e3f2fd',
      dark: '#e3f2fd',
      contrastText: '#fff',
    }
  },
});

class Sidebar extends Component {
    // For the sidebar menu items, we will point to routes defined in the main application. 
    // The menu items are displayed using buttons so I don't have to deal with the traditional
    // link behavior (underlining it, changing color once visited.) Button colors are customized
    // to contrast well with the sidebar color.
    render() {
        return <SidebarContainer>
            <SidebarMenu>
                <MenuLogo>
                    {" "}
                    <Icon viewBox="0 0 20 20">
                        <path
                            width="20px"
                            height="20px"
                            viewBox="0 0 20 17"
                            fill="white"
                            d="M4.23832506,4.349694 L5.39932506,7.16397019 L2.73332506,7.16397019 L4.23832506,4.349694 Z M13.5843251,9.22420166 L16.5773251,9.22420166 L11.0983251,15.2483185 L13.5843251,9.22420166 Z M8.74132506,15.2627401 L3.10032506,9.22420166 L6.24932506,9.22420166 L8.74132506,15.2627401 Z M7.56832506,7.16397019 L6.29332506,4.07362298 L13.5403251,4.07362298 L12.2653251,7.16397019 L7.56832506,7.16397019 Z M11.4153251,9.22420166 L9.91732506,12.8553596 L8.41832506,9.22420166 L11.4153251,9.22420166 Z M17.2603251,7.16397019 L14.4343251,7.16397019 L15.6113251,4.3105496 L17.2603251,7.16397019 Z M19.7873251,7.43592074 L16.9333251,2.26783009 C16.8173251,2.08652972 16.6613251,2 16.4823251,2 C16.2933251,2 16.0773251,2.0133915 15.8533251,2.0133915 L4.18832506,2.0133915 C3.96732506,2.0133915 3.75432506,2.00515058 3.56732506,2.00515058 C3.37732506,2.00515058 3.21332506,2.07313822 3.09432506,2.26783009 L0.198325064,7.75216627 C-0.107674936,8.25383264 -0.0556749356,8.8337878 0.327325064,9.27570745 L9.02132506,18.55499 C9.27732506,18.8516633 9.63032506,19 9.98332506,19 C10.3423251,19 10.7013251,18.848573 10.9593251,18.5436587 L19.6813251,9.01508817 C20.0633251,8.56389747 20.1063251,7.93449676 19.7873251,7.43592074 L19.7873251,7.43592074 Z"
                            id="path-1"
                        />
                    </Icon>
                   RheaDoor
                   </MenuLogo>
                <SidebarMenuItem>
                    <Icon viewBox="0 0 20 20">
                        <path
                            width="20px"
                            height="20px"
                            fill="white"
                            d="M18,17 C18,17.552 17.552,18 17,18 L14,18 C13.448,18 13,17.552 13,17 L13,14 C13,13.448 13.448,13 14,13 L17,13 C17.552,13 18,13.448 18,14 L18,17 Z M18,11 L13,11 C11.895,11 11,11.895 11,13 L11,18 C11,19.105 11.895,20 13,20 L18,20 C19.105,20 20,19.105 20,18 L20,13 C20,11.895 19.105,11 18,11 L18,11 Z M18,6 C18,6.552 17.552,7 17,7 L14,7 C13.448,7 13,6.552 13,6 L13,3 C13,2.448 13.448,2 14,2 L17,2 C17.552,2 18,2.448 18,3 L18,6 Z M18,0 L13,0 C11.895,0 11,0.895 11,2 L11,7 C11,8.105 11.895,9 13,9 L18,9 C19.105,9 20,8.105 20,7 L20,2 C20,0.895 19.105,0 18,0 L18,0 Z M7,17 C7,17.552 6.552,18 6,18 L3,18 C2.448,18 2,17.552 2,17 L2,3 C2,2.448 2.448,2 3,2 L6,2 C6.552,2 7,2.448 7,3 L7,17 Z M7,0 L2,0 C0.895,0 0,0.895 0,2 L0,18 C0,19.105 0.895,20 2,20 L7,20 C8.105,20 9,19.105 9,18 L9,2 C9,0.895 8.105,0 7,0 L7,0 Z"
                        />
                    </Icon>
                    <SidebarMenuItemLabel>
                        <Button to="/" component={Link} color="primary">
                                Home
                        </Button>
                    </SidebarMenuItemLabel>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Icon viewBox="0 0 20 20">
                        <path
                            width="20px"
                            height="20px"
                            fill="white"
                            d="M11,5.007 L11,12.007 C11,12.559 10.552,13.007 10,13.007 C9.448,13.007 9,12.559 9,12.007 L9,5.007 C9,4.455 9.448,4.007 10,4.007 C10.552,4.007 11,4.455 11,5.007 L11,5.007 Z M11,15.007 C11,15.559 10.552,16.007 10,16.007 C9.448,16.007 9,15.559 9,15.007 C9,14.455 9.448,14.007 10,14.007 C10.552,14.007 11,14.455 11,15.007 L11,15.007 Z M18,17 C18,17.552 17.552,18 17,18 L3,18 C2.448,18 2,17.552 2,17 L2,3 C2,2.448 2.448,2 3,2 L17,2 C17.552,2 18,2.448 18,3 L18,17 Z M18,0 L2,0 C0.895,0 0,0.899 0,2.003 L0,2.007 L0,18.007 C0,19.112 0.895,20 2,20 L18,20 C19.105,20 20,19.108 20,18.003 L20,2.007 C20,0.902 19,0 18,0 L18,0 Z"
                        />
                    </Icon>
                        <SidebarMenuItemLabel>
                            <MuiThemeProvider theme={theme}>
                                <Button to="/secured" component={Link} color="primary">
                                    Login
                                </Button>
                            </MuiThemeProvider>
                        </SidebarMenuItemLabel>
                </SidebarMenuItem>
                <MenuSignOut>Sign Out</MenuSignOut>
            </SidebarMenu>
        </SidebarContainer>;
    }
}
export default Sidebar;