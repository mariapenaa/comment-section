import React, {useState, useEffect, useReducer} from 'react';
import './Body.scss';
import Comment from './Comment/Comment'
import Input from './Input/Input'
import { auth, db } from '../../firebase/config'; 
import { CircularProgress } from '@material-ui/core';
import { ExposurePlus2Sharp, SettingsInputAntennaTwoTone } from '@material-ui/icons';
import Header from '../Header/Header'

const Body = () => {
    let user = auth.currentUser;
    let [data, setData] = useState([])
    let [login, setLogin ] = useState(false)


    useEffect(()=>{
        getData()
    }, [login])


    useEffect(()=>{
        auth.onAuthStateChanged((user) => {
            if (user) {
                setLogin(true)
              // ...
            } else {
                setLogin(false)
            }
        });
    }, [])

    let logoutUser = () => {
        if(user){
            auth.signOut()
            .then( (res)=>{
                setLogin(false)
            })
            .catch(error=>{
                console.log(error)
            })
        }
    }

    let getData = () => {
        db.collection('comments').orderBy('createdAt','desc').onSnapshot(
            docs => {
              //Array para crear datos en formato más útil.
            let comments = [];
            docs.forEach( doc => {
                comments.push({
                    id: doc.id,   
                    data: doc.data(),
                })
            })
            comments.forEach(e=>{
                if(user){
                    if(e.data.userId === user.uid){
                        e.data.isOwner = true
                    }else{
                        e.data.isOwner = false
                    }
                }

                if (weeksBetween(e.data.createdAt)) {
                    e.data.weeks = weeksBetween(e.data.createdAt)
                }

            })
            setData(comments)
        }
        )
    }


    let weeksBetween = (d2) => {
        var today = new Date();
        var dayToday = today.getDate()
        var monthToday = today.getMonth() + 1
        var yearToday = today.getFullYear()

        var last = new Date(d2)
        var dayLast = last.getDate()
        var monthLast = last.getMonth() + 1
        var yearLast = last.getFullYear()

        let date1 = new Date(yearToday, monthToday, dayToday)
        let date2 = new Date(yearLast, monthLast, dayLast)

        let days = Math.round((date1 - date2) / ( 24 * 60 * 60 * 1000))
        let weeks = Math.round((date1 - date2) / (7 * 24 * 60 * 60 * 1000)); 

        if(days < 7){
            switch (days) {
                case 0:
                    return 'Today';
                    break;
                case 1: 
                    return 'Yesterday';
                    break;
                default:
                    return days + ' days ago'
                    break;
            }
        }else {
            if(weeks === 1){
                return 'Last week'
            }else {
                return weeks + ' weeks ago'
            }
        }
    }

    return (
        <React.Fragment>

            <Header logoutUser={logoutUser} login={login}/>
            <div className="mainContainer">
                {user != null ? 
                <Input getData={getData} img={user.photoURL}/> : <div></div>
                }
                {data.map((e,idx) => (
                    <div style={e.data.reply  ?  {paddingBottom:'0rem'} : {paddingBottom:'1.5rem'} }> 
                        {!e.data.reply ?
                            <Comment key={idx} data={e.data} id={e.id} getData={getData} /> : <div></div>
                        }
                        {data.map((e2,idx2)=>(
                            <React.Fragment>
                            {e2.data.reply && e2.data.commentId === e.id ? 
                                <div className="replyContainer">
                                <Comment key={idx2} data={e2.data} id={e2.id} getData={getData}/>
                                </div> : <div></div>
                            }
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>
        </React.Fragment> 
    );
}

export default Body;
