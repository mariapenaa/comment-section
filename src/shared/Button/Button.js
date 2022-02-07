import { SettingsApplicationsSharp } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import './Button.scss';

const Button = (props) => {
  let {text, submit, disabled} = props;
  const [class1, setClass1] = useState('mainButton')
  let action = (e) => {
    e.preventDefault();
    submit()
  }
  useEffect(()=>{
    if(props.type===2){
      setClass1('mainButtonGrey')
    }
    if(props.type===3){
      setClass1('mainButtonRed')
    }
  })
    return (
      <button onClick={(e)=>action(e)} className={class1} disabled={disabled ? true : false}>
        {text}
      </button>
    );
}

export default Button;
