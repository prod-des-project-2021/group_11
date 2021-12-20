import React, { useState, useEffect } from 'react';
import { IonContent, IonButton, IonInput } from '@ionic/react';

export function Register (props) {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    function userRegister () {
        props.register(username, password, confirmPassword)
        
    }
    
    return (

            <IonContent>
                <IonInput placeholder="Username" onIonChange={e => setUsername(e.target.value)}/>
                <IonInput placeholder="Password" onIonChange={e => setPassword(e.target.value)}/>
                <IonInput placeholder="Confirm Password" onIonChange={e => setConfirmPassword(e.target.value)}/>
                <IonButton onClick={() => userRegister()}>Register</IonButton>
            </IonContent>
        
    )
}