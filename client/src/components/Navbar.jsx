import React, { use, useContext } from 'react'
import { assets } from '../assets/assets'
import {useClerk,useUser,UserButton} from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const Navbar = () => {
    const {openSignIn}=useClerk()
    const {user}=useUser()
    const navigate=useNavigate()
    const {setShowRecruiterLogin} = useContext(AppContext)
  return (
    <div className="shadow-md py-4 bg-white">
      <div className="container mx-auto px-4 2xl:px-20 flex justify-between items-center">
        <img onClick={()=>navigate('/')}src={assets.logo} alt="Logo" className="h-10 sm:h-12" />
        {
          user?<div className='flex items-center gap-3'><Link to={'/applications'}>Applied Jobs</Link>
          <p></p>
          <p className='max-sm:hidden'>Hi {user.firstName+" "+user.lastName}</p>
          <UserButton/>
          </div>: <div className="flex items-center gap-4 text-sm sm:text-base">
          <button onClick={e=>setShowRecruiterLogin(true)}className="text-gray-600 hover:text-gray-800 transition">Recruiter Login</button>
          <button onClick={e=>openSignIn()} className="bg-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition">
            Login
          </button>
          </div>
        }

       
   
      </div>
    </div>
  )
}

export default Navbar
