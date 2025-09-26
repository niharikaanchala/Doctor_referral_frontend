import React from 'react'
import Header from '../components/header/Header.jsx'
import Footer from '../components/footer/Footer.jsx'
import Router from '../routes/Router.jsx'
import { Toaster } from "react-hot-toast"

const Layout = () => {
  return (
    <>
      <div className="min-h-screen overflow-x-hidden">

        <Header />
        <main className='pt-24 overflow-hidden'>
          <Router />
        </main>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Footer />
      </div>

    </>
  )
}

export default Layout
