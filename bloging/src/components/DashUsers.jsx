import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, TableCell, Modal, Button } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import {FaCheck,FaTimes} from 'react-icons/fa'

function DashUsers() {

    const { currentUser } = useSelector(state => state.user)
    const [users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [userId, setUserId] = useState("")
    console.log(users)

    useEffect(() => {
        const fetchUsers = async () => {

            try {
                const res = await fetch(`/api/user/getusers?userId`)
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    if (data.users.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error)
            }

        }
        if (currentUser.isAdmin) {
            fetchUsers()
        }
    }, [currentUser._id])


    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
            const data = await res.json()
            if (res.ok) {
                setUsers((user) => [...user, ...data.users])
                if (data.users.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false)
        try {
            const res = await fetch(`/api/user/delete/${userId}`, {
                method: "DELETE",
            })
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message)
            } else {
                setUsers(
                    (prev) =>
                        prev.filter((filteruser) => filteruser._id !== userId)
                )
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700  dark:scrollbar-thumb-slate-300 '>

            {currentUser.isAdmin && users.length > 0 ? (
                <>

                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Users image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell >Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map((user) => {
                            {
                                console.log(user._id)
                            }
                            return (
                                <Table.Body className='divide-y' key={user.username}>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>
                                           <img src={`${user.image}`} alt="image not found" className='w-10 h-10 rounded-full object-cover bg-gray-500 ' />
                                        </Table.Cell>
                                        <Table.Cell>
                                                {user.username}
                                       
                                        </Table.Cell>
                                        <Table.Cell>
                                            {user.email}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {user.isAdmin ?(<FaCheck className="text-green-500"/>) : (<FaTimes className="text-red-500"/>) }
                                        </Table.Cell>
                                        <Table.Cell onClick={() => {
                                            setShowModal(true)
                                            setUserId(user._id)
                                        }}>
                                            <span className='font-medium text-red-500 hover:underline cursor-pointer'>
                                                Delete
                                            </span>
                                        </Table.Cell>
                                        
                                    </Table.Row>
                                </Table.Body>

                            )
                        })}
                    </Table>
                    {
                        showMore && (<button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7 '>Show more</button>)
                    }
                </>
            ) : (
                <p>You have no users yet!</p>)
            }

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md' >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-13 w-14 text-gray-400  dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-grey-500 dark: text-gray-400'>Are yu sure you want to delete user</h3>
                        <div className="flex items-center gap-5">
                            <Button color='failure' onClick={handleDeleteUser}>Yes, I'm</Button>
                            <Button onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default DashUsers
