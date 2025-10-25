import React from 'react'
import { BookOpen, Zap, CheckCircle } from 'lucide-react'

const About = () => {
  return (
    <section className="bg-[#2e4b30] min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-[#f5efe1] bg-opacity-10 rounded-full mb-6">
              <span className="text-[#f5efe1] text-sm font-medium tracking-wide">ABOUT US</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#f5efe1] mb-6 leading-tight">
              Welcome to Booker
            </h2>
            
            <p className="text-[#f5efe1] text-lg sm:text-xl mb-6 leading-relaxed opacity-90">
              Your premium destination for discovering extraordinary books since 2020.
            </p>
            
            <p className="text-[#f5efe1] text-base sm:text-lg mb-8 leading-relaxed opacity-80">
              We connect readers with carefully curated collections spanning every genre. 
              From timeless classics to modern bestsellers, our mission is to make quality 
              literature accessible to everyone.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-[#f5efe1] bg-opacity-10 backdrop-blur-sm px-6 py-4 rounded-lg flex-1 min-w-[140px]">
                <div className="text-3xl font-bold text-[#f5efe1] mb-1">5000+</div>
                <div className="text-[#f5efe1] text-sm opacity-80">Books Available</div>
              </div>
              <div className="bg-[#f5efe1] bg-opacity-10 backdrop-blur-sm px-6 py-4 rounded-lg flex-1 min-w-[140px]">
                <div className="text-3xl font-bold text-[#f5efe1] mb-1">24/7</div>
                <div className="text-[#f5efe1] text-sm opacity-80">Customer Support</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#f5efe1] bg-opacity-5 backdrop-blur-sm border border-[#f5efe1] border-opacity-20 p-6 rounded-xl hover:bg-opacity-10 transition-all duration-300">
              <div className="w-12 h-12 bg-[#f5efe1] bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[#f5efe1]" />
              </div>
              <h3 className="text-xl font-semibold text-[#f5efe1] mb-2">Wide Selection</h3>
              <p className="text-[#f5efe1] opacity-80 text-sm leading-relaxed">
                Discover thousands of titles across all genres and categories
              </p>
            </div>
            
            <div className="bg-[#f5efe1] bg-opacity-5 backdrop-blur-sm border border-[#f5efe1] border-opacity-20 p-6 rounded-xl hover:bg-opacity-10 transition-all duration-300">
              <div className="w-12 h-12 bg-[#f5efe1] bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[#f5efe1]" />
              </div>
              <h3 className="text-xl font-semibold text-[#f5efe1] mb-2">Fast Delivery</h3>
              <p className="text-[#f5efe1] opacity-80 text-sm leading-relaxed">
                Quick and secure shipping to bring books right to your doorstep
              </p>
            </div>
            
            <div className="bg-[#f5efe1] bg-opacity-5 backdrop-blur-sm border border-[#f5efe1] border-opacity-20 p-6 rounded-xl hover:bg-opacity-10 transition-all duration-300">
              <div className="w-12 h-12 bg-[#f5efe1] bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-[#f5efe1]" />
              </div>
              <h3 className="text-xl font-semibold text-[#f5efe1] mb-2">Quality Guaranteed</h3>
              <p className="text-[#f5efe1] opacity-80 text-sm leading-relaxed">
                Every book carefully selected and verified for your satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About