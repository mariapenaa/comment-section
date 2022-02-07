import './Header.scss';
import {useEffect, useState} from 'react';
import PersonIcon from '@material-ui/icons/Person';
import { Link } from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import { auth, db } from '../../firebase/config'; 
import { useLocation } from 'react-router-dom'
import { PinDropSharp } from '@material-ui/icons';

const Header = (props) => {
    const user = auth.currentUser;
    const location = useLocation();
    let [logout, setLogout] = useState(false)
    let [home, setHome] = useState('')

    useEffect(()=>{

        if(user ){
            setLogout(true)
        }else{
            setLogout(false)
        }
    }, [props.login])

    useEffect(()=>{
        if(location.pathname === '/'){
            setHome(true)
        }else{
            setHome(false)
        }
    }, [location.pathname])


    return (
        <header>
            <ul>
                {!home ? 
                    <li>
                        <HomeIcon className="person-icon" />
                        <Link to="/"><p className="mb-0" >Home</p></Link>
                    </li> : 
                    <li>
                        <PersonIcon className="person-icon" />
                        {props.login ?  
                        <p className="mb-0" onClick={props.logoutUser} style={{cursor:'pointer'}}>Logout</p> :
                        <Link to="/login"><p className="mb-0">Login</p></Link>}
                        
                    </li>
                }
            </ul>
            
        </header>
    );
}

export default Header;
