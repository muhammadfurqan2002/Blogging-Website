import React, { useEffect, useState } from 'react'
import { Select, TextInput, FileInput, Button, Alert } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate, useParams } from 'react-router-dom'
import {useSelector} from 'react-redux'
function UpdatePost() {
    const {currentUser}=useSelector((state)=>state.user)
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [publisherError, setPublisherError] = useState(null)
    const { postId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        try {

            const fetchPost = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`)
                const data =await res.json()
                if (!res.ok) {
                    console.log(data.message)
                    setPublisherError(data.message)
                    return;
                }
                if (res.ok) {
                    setPublisherError(null)
                    setFormData(data.posts[0])
                    // console.log(data.posts[0])
                }

            }
            fetchPost()

        } catch (error) {
            console.log(error.message)
        }

    }, [postId])

    const handleUploadImage = async () => {
        try {

            if (!file) {
                setImageUploadError("Please select an image")
                return
            }
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed', (snapshot) => {
                const progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageUploadProgress(progess.toFixed(0))
            }, (error) => {
                setImageUploadError('Image upload failed')
                setImageUploadProgress(null)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUploadProgress(null)
                    setImageUploadError(null)
                    setFormData({ ...formData, image: downloadURL })
                })
            })
        } catch (error) {
            setImageUploadError("Image upload failed")
            setImageUploadProgress(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatePost/${formData._id}/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (!res.ok) {
                setPublisherError(data.message)
                return
            }
            if (res.ok) {
                setPublisherError(null)
                // setFormData()
                // console.log(data)
                navigate(`/post/${data.slug}`)
            }

        } catch (error) {
            setPublisherError("Something went wrong")
        }
    }


    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type='text' value={formData.title} placeholder='Title required' required id='title' className='flex-1' onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value="unCategorized">Select a category</option>
                        <option value="javascript">Javacsript</option>
                        <option value="java">Java</option>
                        <option value="reactjs">React.js</option>
                    </Select>
                </div>
                <div className="flex ga-4 items-center justify-between border-4 border-teal-500 border-dotted p-5">
                    <FileInput type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button type='button' gradientDuoTone="purpleToBlue" size="sm" outline onClick={handleUploadImage} disabled={imageUploadProgress} >

                        {
                            imageUploadProgress ? <div className="w-16 h-16">
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}`} />
                            </div> : "Upload Image"
                        }

                    </Button>
                </div>
                {imageUploadError && <Alert color={'failure'}>{imageUploadError}</Alert>}
                {
                    formData.image && (<img src={`${formData.image}`} className='w-full h-72 object-cover' />)
                }
                <ReactQuill theme="snow" value={formData.content} placeholder='Write something...' className='h-72 mb-12' required onChange={(value) => setFormData({ ...formData, content: value })} />
                <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
                {publisherError && <Alert color={'failure'}>{publisherError}</Alert>}
            </form>

        </div>
    )
}

export default UpdatePost
