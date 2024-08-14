import { Button } from 'flowbite-react'
import React from 'react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
function OAuth() {
    const auth=getAuth(app);
    const handleGoogleClick=async()=>{
        const provider=new GoogleAuthProvider()
        provider.setCustomParameters({prompt:"select _account"});
        try{
                const resultFromGoogle=await signInWithPopup(auth,provider)
                console.log(resultFromGoogle);
        }catch(error){

        }
    }
  return (
    <Button type='button' onClick={handleGoogleClick} gradientDuoTone='pinkToOrange' outline>
      <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
      Continue with Google
    </Button>
  )
}

export default OAuth
