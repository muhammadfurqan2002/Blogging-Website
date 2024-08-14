import React from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { Avatar, Button, Dropdown, Navbar, TextInput, theme } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import {signoutSuccess} from '../redux/user/userSlice'
function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const pic = 'https://images.unsplash.com/photo-1611601322175-ef8ec8c85f01?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

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
        <Navbar className='border-b-2 '>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='rounded-lg text-white px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>Fb's</span>
                Blog
            </Link>
            <form>
                <TextInput placeholder='Search...'
                    className='hidden lg:inline'
                    rightIcon={AiOutlineSearch} />
            </form>
            <Button className='w-12 h-9 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>
            <div className='flex gap-2 md:order-2'>
                <Button className="w-12 h-9 hidden sm:inline" color='gray' pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}

                </Button>
                {
                    currentUser ? (<Dropdown arrowIcon={false} inline label={
                        <Avatar alt='user' img={pic} rounded />
                    }>
                        <Dropdown.Header>
                            <span className='block text-sm'>{currentUser.username}</span>
                            <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignout} >Sign out</Dropdown.Item>

                    </Dropdown>) : (<Link to='/sign-in'>
                        <Button outline gradientDuoTone='purpleToBlue' >
                            Sign In
                        </Button>
                    </Link>)
                }

                <Navbar.Toggle />

            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to='/about'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={'div'}>
                    <Link to='/projects'>Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
