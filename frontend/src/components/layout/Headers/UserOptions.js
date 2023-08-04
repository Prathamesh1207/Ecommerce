import React, { Fragment, useState } from 'react'
import "./Header.css"
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction'; 
import DashboardIcon from '@mui/icons-material/Dashboard';   
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt'; 
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import { Backdrop } from '@mui/material';  
import { useNavigate } from "react-router-dom";
import {useAlert} from "react-alert";
import { logout } from '../../../actions/userAction';
import {useDispatch, useSelector} from "react-redux";
 

const UserOptions = ({user}) => {
    const {cartItems} = useSelector((state)=>state.cart)

    const [open ,setOpen] = useState(false);
    const alert = useAlert();
    const dispatch=useDispatch();
    const options =[
        {icon: <ListAltIcon />, name:"Orders" , func:orders},
        {icon: <PersonIcon />, name:"Profile", func: account},
        {icon: <ShoppingCartCheckoutOutlinedIcon style={{color: cartItems.length>0 ? "tomato" : "unset"}} />, name:`Cart(${cartItems.length})`,func: cart },
        {icon: <ExitToAppIcon />, name:"Logout", func: logoutUser}
    ];
    if(user.role === "admin"){
        options.unshift({icon: <DashboardIcon />,name:"DashBoard",func:dashboard});
    }
    const navigate = useNavigate()

    function dashboard(){
        navigate("/admin/dashboard"); 
    }
    function orders(){
        navigate("/orders");
    }
    function account(){
        navigate("/account");
    }
    function cart(){
        navigate("/cart");
    }
    function logoutUser(){
        dispatch(logout());
        alert.success("Logout Successfully")
    }



  return (
    <Fragment>
        <Backdrop open={open} style={{zIndex:"10"}} />
        <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open} 
        style={{zIndex:"11"}}
        direction='down'
        className='speedDial'
        icon={
            <img className='speedDialIcon' src={user.avatar.url ? user.avatar.url : "/Profile1.png"} alt='Profile'/>
        }
        >
            {options.map((item)=>(
                <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} onClick={item.func} tooltipOpen />
            ))}

        </SpeedDial>
    </Fragment>
  )
}

export default UserOptions