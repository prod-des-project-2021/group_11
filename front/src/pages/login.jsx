import React, { useState, useEffect } from 'react';
import { IonContent,  IonButton, IonInput, IonPopover } from '@ionic/react';

export default function Login (props) {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [tempPassword, settempPassword] =useState("")
    const [logReg, setLogReg] = useState(true)
    
    function loginUser () {
        props.login(username, password)
    }

    function registerUser () {
        if(password === tempPassword) 
            props.register(username,password)
    }

    let returnval = logReg? (<>
    <IonInput placeholder="Username" onIonChange={e => setUsername(e.target.value)}/>
    <IonInput placeholder="Password" onIonChange={e => setPassword(e.target.value)}/>
    <IonButton onClick={()=>loginUser()}>Login!</IonButton>
    <IonButton onClick={()=>setLogReg(!logReg)}>Register</IonButton></>):
    (<>
    <IonInput placeholder="Username" onIonChange={e => setUsername(e.target.value)}/>
    <IonInput placeholder="Password" onIonChange={e => setPassword(e.target.value)}/>
    <IonInput placeholder="Repeat Password" onIonChange={e => settempPassword(e.target.value)}/>
    <IonButton onClick={()=>registerUser()}>Register</IonButton>
    <IonButton onClick={()=>{setLogReg(!logReg); settempPassword("")}}>Login</IonButton></>
    )
    
    return (<IonPopover isOpen={true}>
        {returnval}
    </IonPopover>
    )


}