/** biome-ignore-all lint/a11y/noSvgWithoutTitle: Not required it seems will disable globally if required */

function Testimonials() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-green-100 py-24">
        {/* Decorative plant elements */}
        <div className="absolute left-0 top-0 size-64 -translate-x-1/2 -translate-y-1/2">
          <svg viewBox="0 0 200 200" className="size-full text-green-200 opacity-40">
            <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.2C64.8,55.2,53.9,66.7,40.3,74.4C26.8,82.1,10.7,86.1,-3.9,91.4C-18.4,96.6,-36.8,103.2,-52.6,99.1C-68.5,95,-81.8,80.3,-87.3,64.1C-92.8,47.9,-90.6,30.3,-88.1,14.4C-85.6,-1.4,-82.8,-15.6,-78.5,-30.3C-74.3,-45,-68.4,-60.1,-57.2,-68.6C-46,-77.1,-29.3,-79,-13.8,-74.8C1.8,-70.5,30.6,-83.5,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 size-80 translate-x-1/3 translate-y-1/3">
          <svg viewBox="0 0 200 200" className="size-full text-green-300 opacity-30">
            <path fill="currentColor" d="M30.9,-51.7C40.1,-46.1,47.6,-37.3,53.8,-27.3C60,-17.2,64.9,-6,67.4,7.4C69.9,20.8,70,36.3,62.1,44.4C54.2,52.4,38.4,53,24.5,56.2C10.7,59.4,-1.2,65.1,-13.8,65C-26.3,64.8,-39.6,58.7,-46.5,48.5C-53.4,38.2,-54,23.7,-57.7,9.8C-61.4,-4.1,-68.2,-17.5,-67.8,-31.1C-67.3,-44.7,-59.5,-58.5,-47.5,-63.1C-35.5,-67.7,-19.3,-63.1,-5.7,-54.8C7.9,-46.5,21.6,-57.3,30.9,-51.7Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="size-12 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 8.5H21L16 13L18 19L12 15L6 19L8 13L3 8.5H9.5L12 2Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">What Our Community Says</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Hear from our community of plant enthusiasts and eco-conscious shoppers
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Priya Sharma",
                role: "Plant Enthusiast",
                quote: "Plantomart transformed my apartment into a green sanctuary. Their curated selection and expert advice helped me choose the perfect plants for my space."
              },
              {
                name: "Rahul Mehra",
                role: "First-time Plant Parent",
                quote: "As someone new to plant care, I appreciated the detailed care instructions and responsive customer service. My plants are thriving thanks to Plantomart!"
              },
              {
                name: "Anjali Reddy",
                role: "Interior Designer",
                quote: "I recommend Plantomart to all my clients. Their products elevate any interior space with a touch of nature while supporting sustainable practices."
              }
            ].map((testimonial, index) => (
              <div 
                // biome-ignore lint/suspicious/noArrayIndexKey: don't need it here it seems 
                key={index} 
                className="group relative overflow-hidden rounded-2xl border border-green-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
              >
                {/* Accent border - changes color on hover */}
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-green-300 to-green-500 transition-colors duration-300 group-hover:from-green-400 group-hover:to-green-600"></div>
                <div className="relative mb-8">
                  <div className="absolute -left-2 -top-2 font-serif text-6xl text-green-100 opacity-70 transition-colors duration-300 group-hover:text-green-200">"</div>
                  <p className="relative z-10 text-lg leading-relaxed text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                    {testimonial.quote}
                  </p>
                  <div className="absolute -bottom-8 -right-2 rotate-180 font-serif text-6xl text-green-100 opacity-70 transition-colors duration-300 group-hover:text-green-200">"</div>
                </div>
                <div className="mt-6 border-t border-green-100 pt-6 transition-colors duration-300 group-hover:border-green-200">
                  <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                  <p className="text-green-600">{testimonial.role}</p>
                </div>
                <div className="mt-4 flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg 
                      // biome-ignore lint/suspicious/noArrayIndexKey: don't need it here it seems 
                      key={i} 
                      className="size-5 text-yellow-400 transition-colors duration-300 group-hover:text-yellow-500" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {/* Decorative leaf in the background - appears on hover */}
                <div className="absolute -bottom-16 -right-16 size-48 text-green-50 opacity-0 transition-all duration-500 group-hover:translate-x-4 group-hover:translate-y-4 group-hover:opacity-30">
                  <svg viewBox="0 0 200 200" className="size-full">
                    <path fill="currentColor" d="M43.2,-57.2C58.3,-49.8,74.5,-41.6,79.7,-28.5C84.9,-15.5,79,-2.5,74.4,10.2C69.8,22.8,66.5,35.1,57.7,42.2C48.9,49.4,34.7,51.5,21.4,56.6C8.1,61.7,-4.4,69.8,-15.9,68.7C-27.4,67.6,-37.8,57.3,-45.3,46.3C-52.8,35.3,-57.3,23.5,-60.1,10.9C-62.9,-1.7,-64,-15.2,-60.9,-28.1C-57.8,-41,-50.7,-53.3,-40,-61.4C-29.3,-69.5,-14.7,-73.3,-0.3,-72.9C14,-72.5,28.1,-64.6,43.2,-57.2Z" transform="translate(100 100)" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          {/* Optional: Add a subtle leaf pattern at the bottom for aesthetic appeal */}
          <div className="mt-16 flex justify-center">
            <svg className="h-12 w-32 text-green-200" viewBox="0 0 172 24" fill="none">
              <path d="M86 0C70.6 0 55.1 12 39.7 12C24.3 12 8.8 0 8.8 0H0C0 0 15.5 24 39.7 24C63.9 24 79.4 0 79.4 0C79.4 0 94.9 24 119.1 24C143.3 24 158.8 0 158.8 0H172C172 0 156.5 12 141.1 12C125.7 12 110.2 0 94.8 0H86Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Testimonials