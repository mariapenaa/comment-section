import React, {useState, useEffect} from 'react';
import './Comment.scss';
import profilePic from '../../../images/avatars/image-amyrobson.png'
import ReplyIcon from '@material-ui/icons/Reply';
import CircularProgress from '@material-ui/core/CircularProgress';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { auth, db } from '../../../firebase/config'
import TextField from '@material-ui/core/TextField';
import Button from '../../../shared/Button/Button'
import CloseIcon from '@material-ui/icons/Close';
import girl1 from '../../../images/avatar-icons/blue-girl.jpg'
import girl2 from '../../../images/avatar-icons/green-girl.png'
import male1 from '../../../images/avatar-icons/yellow-male.jpg'
import male2 from '../../../images/avatar-icons/yellow-male2.webp'
import Input from '../Input/Input'
import Dialog from '@material-ui/core/Dialog';
import Backdrop from '@material-ui/core/Backdrop'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from 'firebase'

const Comment = (props) => {
  const user = auth.currentUser
  let {data, id} = props;
  let [comment, setComment] = useState()
  let [edit, setEdit] = useState(false)
  let [reply, setReply] = useState(false)
  const [open, setOpen] = useState(false);

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
    setComment(data)
    return () => {
      setComment(''); // This worked for me
    };
  }, [data]);

  const toggleOpen = () => {
    setOpen(!open);
  };

  
  let like = (action) => {    
    let newLikes = 0;
    if(action === 'add'){
      newLikes = comment.likes + 1;
    } else if(comment.likes > 0) {
      newLikes = comment.likes - 1;
    } 
/* 
    let likeAction = '';
    if(action === 'add'){
      likeAction = firebase.firestore.FieldValue.arrayUnion(user.uid)
    } else if(comment.likes.length > 0) {
      likeAction = firebase.firestore.FieldValue.arrayRemove(user.uid)
    } */


    if(action === 'add'){
      setComment({
        ...comment,
        likes: newLikes
      })

      db.collection('comments').doc(id).update({
        likes: newLikes
      })  
      .then(()=>{
        console.log('success')
      })
      .catch( error => {
        console.log(error);
      })
    }

  }

  let remove = () => {
    setOpen(true)
  }

  let setRemove = () => {
    db.collection('comments').where('createdAt','==',comment.createdAt)
      .onSnapshot(
          docs => {
            docs.forEach( doc => {
              doc.ref.delete()
            })
          }
      )
      setOpen(false)
  }

  let update = () => {
    setEdit(false)
    db.collection('comments').doc(id).update({
      text: comment.text,
    })  
    .then(()=>{
      console.log('success')
    })
    .catch( error => {
      console.log(error);
    })
  }

  return (
    <React.Fragment>
    <div className="commentContainer">
      {data && comment ? 
      <React.Fragment>
        <div className=" counterDesktop counter">
            <button onClick={()=>like('add')}>+</button>
            <p>{data.likes}</p>
            <button onClick={()=>like('less')}>-</button>
        </div>
        <div className="w-100">
          <div className=" d-flex justify-content-between align-items-center flex-direction-row">
            <div className="d-flex align-items-center" style={{flexWrap:'wrap'}}>
              <img src={data.userAvatar ? avatars[parseInt(data.userAvatar)-1].src : profilePic} className="profilePic"/>
              <p className="userName">{data.userName.split('@')[0]}</p>
              {data.isOwner ? <p className="you">you</p> : ''}
              <p className="dateName">{data.weeks}</p>
            </div>
            {user ?
            <div className="actionDivDesktop actionDiv">
              {!data.isOwner && !edit ? 
                  <div>{!data.reply ? <div className="d-flex" onClick={()=>setReply(!reply)}><ReplyIcon className="replyIcon" /><p>Reply</p></div> : <div></div> }</div>:
                  <div className="d-flex" >
                    <span className="d-flex delete" onClick={remove}><DeleteIcon className="replyIcon" /><p>Delete</p></span>
                    <span className="d-flex " onClick={()=>setEdit(!edit)}>{!edit ? <CreateIcon className="replyIcon" />:<CloseIcon className="replyIcon" />} <p>{edit ? 'Close edit' : 'Edit'}</p></span>
                  </div> 
                }
            </div> : <div></div>
            }
          </div>
          <div className='mt-3 ' style={{textAlign:'right'}} >
            <p className={edit ? 'none' : 'block text'}>{comment.text}</p>
            <TextField id="outlined-basic" value={comment.text}  label="Edit comment..." variant="outlined" 
            onChange={(e)=>setComment({...comment, text:e.target.value})} className={!edit ? 'none' : 'block mb-3'} multiline rows={4} />
            {edit ? <Button  text={'update'} submit={update} disabled={comment.text === data.text ? true : false}/> : <div></div> }
          </div>
              <div className=" d-flex justify-content-between align-items-center mt-3 actionDivMobile">
                <div className="counter col">
                  <button onClick={()=>like('add')}>+</button>
                  <p>{data.likes}</p>
                  <button onClick={()=>like('less')}>-</button>
                </div>
                {user ?
                  <div className="actionDiv col">
                    {!data.isOwner ? 
                       <div>{!data.reply ?<div className="d-flex" onClick={()=>setReply(!reply)}><ReplyIcon className="replyIcon" /><p>Reply</p></div> : <div></div> }</div> :
                      <div className="d-flex" >
                        <span className="d-flex delete" onClick={remove}><DeleteIcon className="replyIcon" /><p>Delete</p></span>
                        <span className="d-flex " onClick={()=>setEdit(!edit)}>{!edit ? <CreateIcon className="replyIcon" />:<CloseIcon className="replyIcon" />}<p>{edit ? 'Close' : 'Edit'}</p></span>
                      </div> 
                    }
                  </div> 
                : <div></div> }
              </div> 

                <Dialog
                open={open}
                onClose={toggleOpen}
              
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Delete comment"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete this commente? This will remove the comment and cannot be undone. 
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button  color="primary" text={'No, cancel'} submit={toggleOpen} type={2}/> 
                    <Button color="primary" text={'yes, delete'} type={3} submit={setRemove}/>
                  </DialogActions>
                </Dialog>

        </div>
      </React.Fragment> : <CircularProgress />}
    </div>
    {reply ?
    <div className="replyContainer">
      <Input img={user.photoURL} reply={'true'} commentId={id} setReply={()=>setReply(false)}/> 
    </div> : <div></div>

    }
    </React.Fragment>
  );
}

export default Comment;
