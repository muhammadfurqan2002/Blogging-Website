import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSideBar from '../components/DashSideBar';
import DashProfile from '../components/DashProfile';
import DashPost from '../components/DashPost';
import DashUsers from '../components/DashUsers';
function Dashboard() {
  const location=useLocation();
  const [tab,setTab]=useState('')

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabUrl=urlParams.get('tab')
    console.log(tabUrl)
    if(tabUrl){
      setTab(tabUrl)
    }
  },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className="md:w-56">
        <DashSideBar/>
      </div>
      {/* <div className="max-w-lg mx-auto p-3 w-full"> */}
        {tab==='profile' && <DashProfile/>}
        {tab==='posts' && <DashPost/>}
        {tab=='users' && <DashUsers/>}
      {/* </div> */}
    </div>
  )
}

export default Dashboard
