import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { signoutSuccess, updateFailure, updateStart, updateSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

function DashProfile() {
  const { currentUser, error, loading } = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const filePickerRef = useRef();

  const [imageFileUploadProgess, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const [showModal, setSHowModal] = useState(false)

  const pic = "https://images.unsplash.com/photo-1611601322175-ef8ec8c85f01?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


  const handleChangeImage = (e) => {
    const file = e.target.files[0]

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }

  }
  // console.log(imageFile,imageFileUrl)

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile])

  console.log(imageFileUploadError, imageFileUploadProgess)

  const uploadImage = async () => {

    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setImageFileUploadProgress(progress.toFixed(0))
    }, (error) => {
      setImageFileUploadError('Could not upload image (File must be less than 2MB)')
      setImageFileUploading(false);
    },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downnloadURL) => {
          setImageFileUrl(downnloadURL);
          setFormData({ ...formData, profilePicture: downnloadURL });
          setImageFileUploading(false);
        })
      }

    )
  }


  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made")
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload")
      return;
    }
    try {
      dispatch(updateStart())
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json();
      if (!response.ok) {
        dispatch(updateFailure())
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data))
        setUpdateUserSuccess("User's Profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }

  }

  const handleDeleteUser = async () => {
    setSHowModal(false)
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })

      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message))
      } else {
        dispatch(deleteUserSuccess(data))
      }

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      const response = await fetch('/api/user/signout', {
        method: "POST"
      })
      const data = await response.json()
      if (!response.ok) {
        console.log(data.message)
      } else {
        dispatch(signoutSuccess())
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input hidden type="file" accept='image/*' name="profileImage" id="profileImage" onChange={handleChangeImage} ref={filePickerRef} />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgess && (
            <CircularProgressbar value={imageFileUploadProgess || 0} text={`${imageFileUploadProgess}`}
              strokeWidth={5} styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }, path: {
                  stroke: `rgba (62,152,199,${imageFileUploadProgess / 100})`
                }
              }}
            />
          )}
          <img src={imageFileUrl || pic} className='shaddow-md overflow-hidden border-8 object-cover border-[lightgray] rounded-full w-full h-full' alt="" />
        </div>
        {imageFileUploadError &&
          <Alert color="failure">
            {imageFileUploadError}
          </Alert>}

        <TextInput type='text' id='username' defaultValue={currentUser.username} onChange={handleChange} placeholder='username' />
        <TextInput type='text' id='email' defaultValue={currentUser.email} onChange={handleChange} placeholder='email' />
        <TextInput type='text' id='password' onChange={handleChange} placeholder='password' />

        <Button type='submit' outline gradientDuoTone='purpleToBlue' disabled={loading || imageFileUploading}>{loading ? 'Loading...' : 'Update'} </Button>

        {currentUser.isAdmin &&
          <Link to={'/create-post'}><Button type='button' outline gradientDuoTone='purpleToBlue' className='w-full' >Create a post</Button></Link>}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setSHowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && <Alert color='success' className='mt-5'>
        {updateUserSuccess}
      </Alert>}
      {updateUserError && <Alert color='failure' className='mt-5'>
        {updateUserError}
      </Alert>}
      {error && <Alert color='failure' className='mt-5'>
        {error}
      </Alert>}

      <Modal show={showModal} onClose={() => setSHowModal(false)} popup size='md' >

        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-13 w-14 text-gray-400  dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-grey-500 dark: text-gray-400'>Are yu sure you want to delete your account</h3>
            <div className="flex items-center gap-5">
              <Button color='failure' onClick={handleDeleteUser}>Yes, I'm</Button>
              <Button onClick={() => setSHowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile
