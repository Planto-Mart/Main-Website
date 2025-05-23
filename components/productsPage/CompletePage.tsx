/* eslint-disable no-unused-vars */
import Navbar from '../Navbar';

import HeroSection from './HeroSection';

interface ProductDataType {
    id: string;
    slug: string;
    title: string;
    description: string ,
    category: string;
    price: number;
    stock: number;
    status: string;
    image: string;
    }

function CompletePage({ slug }: { slug: string }) {
  return (
    <div className='bg-white'>
      {/* {slug} */}
      <Navbar/>
      <HeroSection/>
      <p className='text-center text-3xl font-bold text-gray-900'>
        this is product page of {slug}
      </p>
    </div>
  )
}

export default CompletePage
