import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { set } from 'mongoose';
import React, { useState } from 'react'
import { Link,useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';

function Signup() {
  const [formData, setFormData] = useState({});
  const [loading, setLaoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate=useNavigate();
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value })
    console.log(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields");
    }
    try {
      setLaoding(true)
      const res = await fetch('/api/auth/signup', {
        method: 'post',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLaoding(false);
      if(res.ok){
        navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      {/* left side */}
      <div className=" gap-5 flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center" >

        <div className="flex-1">
          <Link to='/' className=' font-bold dark:text-white text-4xl'>
            <span className='rounded-lg text-white px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>Fb's</span>
            Blog
          </Link>

          <p className='text-sm mt-5'>This is Demo project.You can signup wiyth your email and password or with Google account</p>

        </div>
        {/* right side */}
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className=''>
              <Label value='Your username' />
              <TextInput type='text' placeholder='Username' id='username' onChange={handleChange} />
            </div>
            <div className=''>
              <Label value='Your email' />
              <TextInput type='email' placeholder='name@gmail.com' id='email' onChange={handleChange} />
            </div>
            <div className=''>
              <Label value='Your password' />
              <TextInput type='password' placeholder='password' id='password' onChange={handleChange} />
            </div>
            <Button disabled={loading} gradientDuoTone='purpleToPink' type='submit'>
              {loading?(
                <>
                <Spinner size="sm"/>
                <span className='pl-5' >Loading...</span>
                </>
              ):"Sign Up"}
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>

          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>


      </div>
    </div>
  )
}

export default Signup
