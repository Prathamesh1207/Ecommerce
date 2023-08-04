import React, { Fragment, useEffect, useRef, useState } from 'react'
import "./LoginSignup.css"
import Loader from "../layout/loader/Loader"
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
// import PersonIcon from '@mui/icons-material/Person';
// import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
// import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

import {useDispatch,useSelector} from "react-redux";
import {clearErrors,login,register} from "../../actions/userAction"
import {useAlert} from "react-alert"
// import { push } from 'react-router-redux'

const LoginSignup = () => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  // const location = useLocation();

  const {error,loading ,isAuthenticated} = useSelector((state)=>state.user);
    
  const [loginEmail,setLoginEmail]=useState("");
  const [loginPassword,setLoginPassword]=useState("");
  const [user,setUser]=useState({
    name:"",
    email:"",
    password:""
  })
  const {name,email,password}=user;

  const [avatar,setAvatar]=useState();
  const [avatarPreview,setAvatarPreview]=useState("/Profile1.png")

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);



  const loginSubmit=(e)=>{
    e.preventDefault();
    dispatch(login(loginEmail,loginPassword))
  }

  const registerSubmit =(e)=>{
    e.preventDefault();
    const myForm=new FormData();
    myForm.set("name",name);
    myForm.set("email",email);
    myForm.set("password",password);
    myForm.set("avatar",avatar);
    dispatch(register(myForm));
  }

  const registerDataChange=(e)=>{
    if(e.target.name==="avatar"){
      const reader = new FileReader();

      reader.onload=()=>{
        if(reader.readyState===2){
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }else{
      setUser({ ...user , [e.target.name]:e.target.value})
    }
  }
  // const redirect= location.search ? location.search.split("=")[1] : "/account";
  


    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");
    useEffect(() => {
        if(isAuthenticated){
        if (JSON.parse(localStorage.getItem('userInfo'))) {
          navigate(`/${redirect}`); // <-- navigate("/shipping")
       }
      }
    }, [redirect,isAuthenticated,navigate]);

  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch(clearErrors())
    }
        //   if(isAuthenticated){
        // navigate(redirect)
        // history.push("/account")
        // dispatch(push('/account'))
        // }
  },[dispatch,error,alert,navigate,isAuthenticated,redirect])

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? <Loader /> : (
            <Fragment>
            <div className="LoginSignUpContainer">
                <div className="LoginSignUpBox">
                   <div>
                        <div className="login_signUp_toggle">
                            <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                             <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                        </div>
                        <button ref={switcherTab}></button>
                  </div>

              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  {/* <MailOutlineOutlinedIcon /> */}
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  {/* <LockOpenOutlinedIcon /> */}
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>


                <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
                >

                <div className="signUpName">
                  {/* <PersonIcon /> */}
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>

                  <div className="signUpEmail">
                  {/* <EmailOutlinedIcon /> */}
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenOutlinedIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                  <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>


            </div>
         </div>     
    </Fragment>
      )}
    </Fragment>
  )
}

export default LoginSignup