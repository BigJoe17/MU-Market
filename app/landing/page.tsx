'use client'

import React from 'react'
import Link from 'next/link'
import { Star, Users, MessageCircle, ShoppingBag, BookOpen, Briefcase, 
         Shield, Zap, CheckCircle, TrendingUp, ArrowRight, Search, 
         CreditCard, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-900">MU Market</div>
              <div className="ml-3 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full font-medium">
                Student Marketplace
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth" 
                className="text-gray-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth" 
                className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The <span className="text-blue-900">Student Marketplace</span> 
              <br />for Marwadi University
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Buy, sell, and trade textbooks, electronics, services, and skills with verified MU students. 
              Safe, simple, and exclusively for our university community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/auth" 
                className="bg-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors shadow-lg flex items-center gap-2"
              >
                Start Shopping <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/auth" 
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-900 hover:text-blue-900 transition-colors flex items-center gap-2"
              >
                List an Item <ShoppingBag className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">500+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">1,200+</div>
              <div className="text-gray-600">Items Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">800+</div>
              <div className="text-gray-600">Successful Trades</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">4.8/5</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What You Can Find</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover everything you need for your university life, all in one marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Academic Items</h3>
              <p className="text-gray-600 mb-6">
                Textbooks, notes, study materials, calculators, and lab equipment at student-friendly prices.
              </p>
              <div className="text-sm text-blue-900 font-medium">
                Popular: Engineering Textbooks, Lab Manuals, Stationery
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Electronics & Gadgets</h3>
              <p className="text-gray-600 mb-6">
                Laptops, smartphones, headphones, chargers, and other tech essentials for students.
              </p>
              <div className="text-sm text-blue-900 font-medium">
                Popular: Laptops, Phone Accessories, Gaming Items
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Services & Skills</h3>
              <p className="text-gray-600 mb-6">
                Tutoring, project help, graphic design, coding services, and freelance opportunities.
              </p>
              <div className="text-sm text-blue-900 font-medium">
                Popular: Math Tutoring, Programming Help, Design Services
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How MU Market Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and designed specifically for university students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-900">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sign Up with MU Email</h3>
              <p className="text-gray-600">
                Use your @marwadiuniversity.ac.in email to verify you&apos;re a genuine MU student and join our trusted community.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-900">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse or List Items</h3>
              <p className="text-gray-600">
                Search for what you need or list items you want to sell. Add photos, descriptions, and set your price.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-900">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect & Trade</h3>
              <p className="text-gray-600">
                Message sellers directly, negotiate prices, and arrange safe meetups on campus or nearby.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MU Market?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built by students, for students, with features that matter most to your university experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">University-Verified</h3>
              <p className="text-gray-600">Only verified MU students can join, ensuring a safe and trusted community.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Direct Messaging</h3>
              <p className="text-gray-600">Chat directly with buyers and sellers to negotiate and arrange meetups.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Smart Search</h3>
              <p className="text-gray-600">Find exactly what you need with filters for category, price, and condition.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Rating System</h3>
              <p className="text-gray-600">Rate and review other students to build trust and reputation in the community.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Listings</h3>
              <p className="text-gray-600">List items in minutes with our simple form and photo upload system.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Insights</h3>
              <p className="text-gray-600">See market trends and suggested prices to get the best deals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What MU Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real experiences from your fellow university students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-blue-900">AP</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Arjun Patel</h4>
                  <p className="text-gray-600 text-sm">Computer Science, 3rd Year</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                &quot;Sold my old laptop and bought textbooks for next semester. The whole process was smooth and I saved a lot of money!&quot;
              </p>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-blue-900">PS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Priya Sharma</h4>
                  <p className="text-gray-600 text-sm">Business Management, 2nd Year</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                &quot;Found a calculus tutor who helped me improve my grades. The rating system helped me choose someone reliable.&quot;
              </p>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-blue-900">RK</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Rajesh Kumar</h4>
                  <p className="text-gray-600 text-sm">Mechanical Engineering, 4th Year</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                &quot;Perfect platform for selling things before graduation. Made some extra money and helped junior students too!&quot;
              </p>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of MU students who are already buying, selling, and sharing on our marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth" 
              className="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center justify-center gap-2"
            >
              Sign Up with MU Email <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/dashboard" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors inline-flex items-center justify-center gap-2"
            >
              Browse Marketplace <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">MU Market</div>
              <p className="text-gray-400 mb-4">
                The official student marketplace for Marwadi University. Safe, verified, and community-driven.
              </p>
              <div className="text-sm text-gray-500">
                Made with ❤️ for MU students
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Marketplace</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Browse Items</Link></li>
                <li><Link href="/create" className="hover:text-white transition-colors">Sell Something</Link></li>
                <li><Link href="/favorites" className="hover:text-white transition-colors">My Favorites</Link></li>
                <li><Link href="/my-listings" className="hover:text-white transition-colors">My Listings</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/chat" className="hover:text-white transition-colors">Messages</Link></li>
                <li><Link href="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Rules</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Report Issue</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 MU Market. All rights reserved.
            </div>
            <div className="text-gray-400 text-sm mt-4 md:mt-0">
              Exclusively for Marwadi University Students
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
