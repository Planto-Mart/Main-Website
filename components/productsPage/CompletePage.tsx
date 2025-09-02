import Footer from '../Footer';
import Navbar from '../Navbar';
import BundlesProductCombiner from './bundlesProductCombiner';

import HeroSection from './HeroSection';
import ProductDetailedDescription from './markdownContentDesc';
import ProductReviews from './ProductReviews';

function CompletePage({ slug }: { slug: string }) {
  return (
    <div className='bg-white'>
      {/* {slug} */}
      <Navbar/>
      <HeroSection slug={slug}/>
      <ProductDetailedDescription slug={slug}/>
      <BundlesProductCombiner slug={slug}/>
      <ProductReviews slug={slug}/>
      <Footer/>
    </div>
  )
}

export default CompletePage
