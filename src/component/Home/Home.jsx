import React from 'react'
import "./Home.css"
import MultiItemCArousel from './MultiItemCArousel'
import FurnitureCard from '../Furniture/FurnitureCard'
   
const Furniture = [1,1,1,1,1,1,1]
   const Home = () => {
      
    return (
       <div className='pb-10'>
          <section className='banner -z-50 relative flex flex-col justify-center items-center'>
     <div className='w-[50vw] z-10 text-center'>
     <p className='text-2xl lg:text-6xl font-bold z-10 py-5'>Furniture Reduction</p>
     <p className='z-10 text-gray-300 text-x1 lg:text-4xl'>Offer Your Used Furniture Or Electronics for other to benefit.</p>
     </div>
     <div className='cover absolute top-0 left-0 right-0'>

     </div>
     <div className='fadout'>

     </div>
          </section>
          <section className='p-10 lg:py-10 lg:px-20'>
            <p className='text-2xl font-semibold text-gray-400 py-3 pb-10'>Products to Donate</p>
            <MultiItemCArousel/>
          </section>
          <section className='px-5 lg:px-20 pt-5'>
            <h1 className='text-2xl font-semibold text-gray-400 pb-10'>Request from the Donater</h1>
            <div className='flex flex-wrap items-center justify-around gap-5'>
               {
                  Furniture.map((item)=><FurnitureCard/>)
               }
            </div>
          </section>
       </div>  
    )
   }

   export default Home