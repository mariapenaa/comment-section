import React, {useState, useEffect} from 'react';
import './Login.scss';
import TextField from '@material-ui/core/TextField';
import { auth, db } from '../../firebase/config'; 
import Button from '../../shared/Button/Button'
import { useNavigate } from "react-router-dom";
import Header from '../Header/Header'
import girl1 from '../../images/avatar-icons/blue-girl.jpg'
import girl2 from '../../images/avatar-icons/green-girl.png'
import male1 from '../../images/avatar-icons/yellow-male.jpg'
import male2 from '../../images/avatar-icons/yellow-male2.webp'

const Login = (props) => {
    let [login, setLogin] = useState(true)
    let [email, setEmail] = useState('')
    let [pass, setPass] = useState('')
    let [pass2, setPass2] = useState('')
    let [error, setError] = useState('')
    let [logued, setLogued] = useState(false)
    let [avatar, setAvatar] = useState('')
    let navigate = useNavigate();

    const avatars = [
        {  
            id:1,
            src:girl1,
        },
        {  
            id:2,
            src:girl2,
        },
        {  
            id:3,
            src:male1,
        },
        {  
            id:4,
            src:male2,
        }
    ]
    useEffect(()=>{
        auth.onAuthStateChanged((user) => {
            if (user) {
            
                navigate("/");
              // ...
            } else {
                return;
            }
          });
    }, [])
    
    let registerUser = () => {
        if(pass === pass2){
            auth.createUserWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                updateUser()
            })
            .catch((error) => {
                setError(error.message)
            // ..
            });
        }else{
            setError('Passwords don´t match')
        }
    }

    let updateUser = () => {
        const user = auth.currentUser;
        if(user != null && avatar != ''){
            user.updateProfile({
                photoURL: avatar,
              }).then(() => {
                setLogin(true)
              }).catch((error) => {
                console.log(error)
              });  
        }
    }

    let loginUser = () => {
        auth.signInWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            setLogued(true)
            navigate("/");
        })
        .catch((error) => {
            setError(error.message)
        });
    }

    let toggleLogin = () => {
        setLogin(!login)
        setEmail('')
        setPass('')
        setPass2('')
        setError('')
    }

    

    return (
        <React.Fragment>
        <Header />
        <div className="mainContainer d-flex justify-content-center align-items-center">
            {login ? 
            <div className="whiteBox">
                <div>
                    <p className="loginTitle">Login</p>
                    <TextField id="outlined-basic" value={email} label="Email" variant="outlined" className="mt-3 w-100" onChange={(e)=>setEmail(e.target.value)}/>
                    <TextField id="outlined-basic" value={pass} label="Password" type="password" variant="outlined" className="mt-3 w-100" onChange={(e)=>setPass(e.target.value)}/>
                    <p className="errorTitle">{error}</p>
                </div>
                <div className="mt-4">
                    <Button text={'login'} submit={loginUser} disabled={email === '' || pass === '' }/>
                    <p className="registerLink mt-1">Don´t have an account? <span className="registerButton" onClick={toggleLogin}>Register</span></p>
                </div>
            </div> :
            <div className="whiteBox">
                <div>
                    <p className="loginTitle">Register</p>
               
                        <TextField id="outlined-basic" value={email} label="Email" variant="outlined" className="mt-3 w-100" onChange={(e)=>setEmail(e.target.value)}/>
                        <TextField id="outlined-basic" value={pass} label="Password" type="password" variant="outlined" className="mt-3 w-100" onChange={(e)=>setPass(e.target.value)}/>
                        <TextField id="outlined-basic" value={pass2} label="Repeat password" type="password" variant="outlined" className="mt-3 w-100" onChange={(e)=>setPass2(e.target.value)}/>
                 
                    <p className="errorTitle">{error}</p>
                </div>
                <div className="mt-2 avatarDiv">
                    <p className="choose">Choose your avatar</p>
                    <div className="d-flex justify-content-center mt-1" style={{flexWrap:'wrap'}}>
                    {avatars.map(e=>(
                        <img src={e.src} alt={e.id+'-avatar'} className={e.id === avatar ? 'avatarIcon borderAvatar':'avatarIcon'} onClick={()=>setAvatar(e.id)}/>
                    ))}
                    </div>
                </div>
                <div className="mt-4">
                    <Button text={'register'} submit={registerUser} disabled={email === '' || pass === '' || pass2 === '' || avatar === ''} />
                    <p className="registerLink mt-1">Already have an account? <span className="registerButton"  onClick={toggleLogin}>Login</span></p>
                </div>
            </div>
            }
        </div>
        </React.Fragment>
    );
}

export default Login;
