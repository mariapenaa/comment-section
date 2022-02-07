import React, {useState} from 'react';
import './Input.scss';
import profilePic from '../../../images/avatars/image-amyrobson.png'
import Button from '../../../shared/Button/Button'
import TextField from '@material-ui/core/TextField';
import { auth, db } from '../../../firebase/config'
import girl1 from '../../../images/avatar-icons/blue-girl.jpg'
import girl2 from '../../../images/avatar-icons/green-girl.png'
import male1 from '../../../images/avatar-icons/yellow-male.jpg'
import male2 from '../../../images/avatar-icons/yellow-male2.webp'

/* db.collection('posts').add({
    owner: auth.currentUser.email,
    ownerName:auth.currentUser.displayName,
    texto: this.state.textoPost,
    createdAt: Date.now(),
    photo: this.state.url, 
}) */

const Input = (props) => {
    const user = auth.currentUser;
    const [inputField, setInputField] = useState('');
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
    let submit = () => {
        let text = inputField;
        setInputField('')
        db.collection('comments').add({
            userAvatar:user.photoURL,
            userId:user.uid,
            userName:user.email,
            likes:0,
            text: text,
            createdAt: Date.now(),
            reply:props.reply ? true : false,
            commentId:props.reply ? props.commentId : null,
        })
        .then( ()=>{ 
            console.log('success')
            if(props.reply){
                props.setReply()
            }
         /*    props.getData() */
        })
        .catch((e)=>{
            console.log(e)
        }) 
    }

    return (
        <div className="commentContainer" style={{marginBottom:'1.5rem'}}>
            <form className="d-flex" style={{flexDirection:'column'}}>
                <span className="buttonContainerDesktop"><Button disabled={inputField === '' ? true : false} submit={submit}  text={props.reply ? 'reply' : 'send'}  /></span>
                <TextField id="outlined-basic" value={inputField} onChange={(e)=>setInputField(e.target.value)} label="Add comment..." variant="outlined" className="input" multiline rows={4} />
                <div className="d-flex justify-content-between imgContainer">
                    {props.img != undefined ?
                     <img src={avatars[parseInt(props.img)-1].src }/> : <div></div>
                    }
                   
                    <span className="buttonContainer" ><Button  disabled={inputField === '' ? true : false} text={props.reply ? 'reply' : 'send'} submit={submit}  /></span>
                </div>
            </form>
        </div>
    );
}

export default Input;
