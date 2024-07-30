import React from 'react'
import First from '../assets/First.png'
import Second from '../assets/Second.png'
import Third from '../assets/Third.png'
import Fourth from '../assets/Fourth.png'
import Fifth from '../assets/Fifth.png'
import Sixth from '../assets/Sixth.png'
import Seventh from '../assets/Seventh.png'
import Eighth from '../assets/Eighth.png'
import Nineth from '../assets/Nineth.png'
import Tenth from '../assets/Tenth.png'
import FormNavbar from './FormNavbar'


function HomeBody() {
  return (
    <>
    <FormNavbar/>
    <div style={{backgroundColor:'#171923'}}>
        <img src={First} alt="" />
        <img src={Second} alt="" />
        <img src={Third} alt="" />
        <img src={Fourth} alt="" />
        <img src={Fifth} alt="" />
        <img src={Sixth} alt="" />
        <img src={Seventh} alt="" />
        <img src={Eighth} alt="" />
        <img src={Nineth} alt="" />
        <img src={Tenth} alt="" />
      
    </div>
    </>
  )

}

export default HomeBody
