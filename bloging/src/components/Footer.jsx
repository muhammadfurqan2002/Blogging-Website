import React from 'react'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import {BsFacebook,BsInstagram,BsTwitter,BsGithub, BsGoogle} from 'react-icons/bs' 
function FooterCom() {
  return (
    <Footer className="border border-t-8 border-teal-500">
      <div className=" w-full p-5 max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1" >
          <div className="mt-10">
            <Link to='/' className='self-center whitespace-nowrap 
              text-lg sm:text-xl font-semibold dark:text-white'>
              <span className='rounded-lg text-white px-2  
                py-1 bg-gradient-to-r from-indigo-500 
              via-purple-500 to-pink-500'>Fb's</span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 mt-5 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col >
                <Footer.Link href='htttps://www.google.com' target='_blank' rel='noopener noreferrer'>
                  100 JS Projects
                </Footer.Link>
                <Footer.Link href='htttps://www.google.com' target='_blank' rel='noopener noreferrer'>
                  Furqan's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title='Follow Us' />
              <Footer.LinkGroup col >
                <Footer.Link href='htttps://www.google.com' target='_blank' rel='noopener noreferrer'>
                  GitHub
                </Footer.Link>
                <Footer.Link href='htttps://www.google.com' target='_blank' rel='noopener noreferrer'>
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col >
                <Footer.Link href='htttps://www.google.com' target='_blank' rel='noopener noreferrer'>
                  privacy
                </Footer.Link>
                <Footer.Link href='htttps://www.google.com' target='_blank' rel='noopener noreferrer'>
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>


          </div>
        </div>
        <Footer.Divider/>
        <div className='w-full p-5 sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright href='#' by="Furqan's blog" year={new Date().getFullYear()}/>
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center p-3">
            <Footer.Icon href='#' icon={BsFacebook}/>
            <Footer.Icon href='#' icon={BsTwitter}/>
            <Footer.Icon href='#' icon={BsGoogle}/>
            <Footer.Icon href='#' icon={BsGithub}/>
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default FooterCom
