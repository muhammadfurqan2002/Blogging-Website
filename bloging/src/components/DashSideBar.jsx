import { Sidebar } from 'flowbite-react'
import React, { useState, useEffect } from 'react'
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice'

function DashSideBar() {

  const dispatch = useDispatch()
  const location = useLocation();
  const [tab, setTab] = useState('')
  const {currentUser} = useSelector(state => state.user)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get('tab')
    console.log(tabUrl)
    if (tabUrl) {
      setTab(tabUrl)
    }
  }, [location.search])

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
    <Sidebar className='w-full md:w-56' aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item href="#" active={tab === 'profile'} label={currentUser.isAdmin? "Admin":"User"} labelColor="dark" icon={HiUser} as='div'>
              Profile
            </Sidebar.Item>
          </Link>
          {
            currentUser.isAdmin &&
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item href="" active={tab === 'posts'} icon={HiDocumentText} as='div'>
                Posts
              </Sidebar.Item>
            </Link>
          }
          {
            currentUser.isAdmin &&
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item href="" active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>
                Users
              </Sidebar.Item>
            </Link>
          }

          <Sidebar.Item onClick={handleSignout} href="#" className='cursor-pointer' icon={HiArrowSmRight}>
            Sign out
          </Sidebar.Item>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar
