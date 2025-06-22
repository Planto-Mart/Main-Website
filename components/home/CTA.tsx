
function CTA() {
  return (
    <div>
      <section className="bg-green-800 py-20 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Join Our Green Community</h2>
            <p className="mb-8 text-lg text-green-100">
              Subscribe to our newsletter for exclusive offers, plant care tips, and updates on new arrivals.
            </p>
            <div className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="grow rounded-full px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button type='button' className="whitespace-nowrap rounded-full bg-green-600 px-8 py-3 font-medium text-white transition-colors hover:bg-green-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CTA
