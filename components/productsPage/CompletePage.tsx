import Navbar from '../Navbar';

import HeroSection from './HeroSection';
import ProductDetailedDescription from './markdownContentDesc';

function CompletePage({ slug }: { slug: string }) {
  return (
    <div className='bg-white'>
      {/* {slug} */}
      <Navbar/>
      <HeroSection slug={slug}/>
      <ProductDetailedDescription slug={slug}/>
      <p className='text-center text-3xl font-bold text-gray-900'>
        this is product page of {slug}
      </p>
    </div>
  )
}

export default CompletePage
