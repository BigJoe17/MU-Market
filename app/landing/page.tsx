'use client'

import React from 'react'
import Link from 'next/link'
import { Star, Users, MessageCircle, ShoppingBag, BookOpen, Briefcase, 
         Shield, Zap, CheckCircle, TrendingUp, ArrowRight, Search, 
         Sparkles, Zap as Lightning, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                MU Market
              </div>
              <div className="ml-3 text-xs text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-2 py-1 rounded-full font-medium">
                NEON MARKETPLACE
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth" 
                className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
              >
                Sign In
              </Link>
              <Link 
                href="/auth" 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-cyan-500/25"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium">
                <Lightning className="w-4 h-4 mr-2" />
                FUTURE OF STUDENT TRADING
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                THE NEON
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                MARKETPLACE
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the <span className="text-cyan-400 font-semibold">future of student commerce</span> at Marwadi University. 
              Buy, sell, and trade in a <span className="text-purple-400 font-semibold">vibrant digital ecosystem</span> designed for the next generation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/auth" 
                className="group bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 transition-all duration-500 shadow-2xl shadow-cyan-500/30 hover:shadow-purple-500/40 transform hover:scale-105 flex items-center gap-3"
              >
                <Sparkles className="w-6 h-6" />
                Enter the Matrix
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/dashboard" 
                className="group border-2 border-cyan-500 text-cyan-400 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-cyan-500/10 hover:border-purple-500 hover:text-purple-400 transition-all duration-500 flex items-center gap-3"
              >
                <Globe className="w-6 h-6" />
                Explore Universe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Neon Stats Grid */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Digital Nomads", color: "cyan" },
              { number: "1.2K+", label: "Neon Items", color: "purple" },
              { number: "800+", label: "Quantum Trades", color: "pink" },
              { number: "4.8★", label: "Cosmic Rating", color: "yellow" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-4xl md:text-6xl font-black mb-3 bg-gradient-to-r ${
                  stat.color === 'cyan' ? 'from-cyan-400 to-cyan-600' :
                  stat.color === 'purple' ? 'from-purple-400 to-purple-600' :
                  stat.color === 'pink' ? 'from-pink-400 to-pink-600' :
                  'from-yellow-400 to-yellow-600'
                } bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neon Categories */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              NEON CATEGORIES
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover digital treasures across our <span className="text-cyan-400">illuminated marketplace dimensions</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "CYBER ACADEMICS",
                description: "Digital textbooks, quantum notes, holographic study materials, and neural lab equipment.",
                gradient: "from-cyan-500 to-blue-600",
                borderColor: "border-cyan-500/50",
                bgColor: "bg-cyan-500/5"
              },
              {
                icon: ShoppingBag,
                title: "TECH MATRIX",
                description: "Futuristic laptops, neural smartphones, quantum headphones, and cyberpunk accessories.",
                gradient: "from-purple-500 to-pink-600",
                borderColor: "border-purple-500/50",
                bgColor: "bg-purple-500/5"
              },
              {
                icon: Briefcase,
                title: "SKILL NEXUS",
                description: "AI tutoring, code wizardry, digital artistry, and interdimensional freelance services.",
                gradient: "from-pink-500 to-red-600",
                borderColor: "border-pink-500/50",
                bgColor: "bg-pink-500/5"
              }
            ].map((category, index) => (
              <div key={index} className={`group ${category.bgColor} ${category.borderColor} border-2 p-8 rounded-3xl hover:scale-105 transition-all duration-500 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform duration-500`}>
                    <category.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-6 tracking-wider">{category.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {category.description}
                  </p>
                  <div className={`mt-6 text-sm bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent font-bold`}>
                    EXPLORE DIMENSION →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neon Process */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              QUANTUM PROCESS
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Enter the future in three simple <span className="text-purple-400">dimensional steps</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "NEURAL LOGIN",
                description: "Authenticate with your @marwadiuniversity.ac.in neural ID to access the quantum marketplace.",
                color: "cyan"
              },
              {
                step: "02", 
                title: "DIGITAL BROWSE",
                description: "Navigate through holographic listings or upload your items to the neon marketplace matrix.",
                color: "purple"
              },
              {
                step: "03",
                title: "COSMIC TRADE",
                description: "Connect through quantum messaging and execute trades in our secure digital dimension.",
                color: "pink"
              }
            ].map((process, index) => (
              <div key={index} className="text-center group">
                <div className={`relative w-32 h-32 mx-auto mb-8`}>
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                    process.color === 'cyan' ? 'from-cyan-500 to-cyan-700' :
                    process.color === 'purple' ? 'from-purple-500 to-purple-700' :
                    'from-pink-500 to-pink-700'
                  } opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  <div className={`absolute inset-2 rounded-full border-2 ${
                    process.color === 'cyan' ? 'border-cyan-500' :
                    process.color === 'purple' ? 'border-purple-500' :
                    'border-pink-500'
                  } flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <span className={`text-3xl font-black ${
                      process.color === 'cyan' ? 'text-cyan-400' :
                      process.color === 'purple' ? 'text-purple-400' :
                      'text-pink-400'
                    }`}>
                      {process.step}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-wider">{process.title}</h3>
                <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neon Features Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              CYBERPUNK FEATURES
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience next-generation trading with <span className="text-cyan-400">quantum-powered features</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "QUANTUM SECURITY", description: "Military-grade encryption with neural verification protocols.", color: "cyan" },
              { icon: MessageCircle, title: "HOLO MESSAGING", description: "Real-time quantum communication across digital dimensions.", color: "purple" },
              { icon: Search, title: "AI DISCOVERY", description: "Neural search algorithms that predict your cosmic needs.", color: "pink" },
              { icon: Star, title: "RATING MATRIX", description: "Dimensional reputation system with quantum trust metrics.", color: "yellow" },
              { icon: Zap, title: "INSTANT DEPLOY", description: "Lightning-fast listing deployment across the metaverse.", color: "cyan" },
              { icon: TrendingUp, title: "PRICE ORACLE", description: "AI-powered market predictions from the digital future.", color: "purple" }
            ].map((feature, index) => (
              <div key={index} className={`group p-8 rounded-3xl border-2 ${
                feature.color === 'cyan' ? 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10' :
                feature.color === 'purple' ? 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10' :
                feature.color === 'pink' ? 'border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10' :
                'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10'
              } hover:scale-105 transition-all duration-500`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-r ${
                  feature.color === 'cyan' ? 'from-cyan-500 to-cyan-700' :
                  feature.color === 'purple' ? 'from-purple-500 to-purple-700' :
                  feature.color === 'pink' ? 'from-pink-500 to-pink-700' :
                  'from-yellow-500 to-yellow-700'
                } group-hover:rotate-12 transition-transform duration-500`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-4 tracking-wider">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neon Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-purple-900/10 to-pink-900/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              DIGITAL VOICES
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Hear from our <span className="text-purple-400">quantum community</span> of digital nomads
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "CYBER_ARJUN",
                role: "Neural Engineer • Level 3",
                message: "Traded my quantum laptop for next-gen textbooks. The neon marketplace is absolutely mind-blowing!",
                gradient: "from-cyan-500 to-blue-600",
                avatar: "AP"
              },
              {
                name: "PRIYA_NEO",
                role: "Digital Architect • Level 2", 
                message: "Found the perfect AI tutor through the holographic search. This platform is from the future!",
                gradient: "from-purple-500 to-pink-600",
                avatar: "PN"
              },
              {
                name: "RAJESH_X",
                role: "Quantum Developer • Level 4",
                message: "Best cyberpunk marketplace ever! Made credits before graduation and helped junior code warriors.",
                gradient: "from-pink-500 to-red-600", 
                avatar: "RX"
              }
            ].map((testimonial, index) => (
              <div key={index} className="group p-8 rounded-3xl border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-500 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-500`}>
                    <span className="font-black text-white text-lg">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-white tracking-wider">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  &quot;{testimonial.message}&quot;
                </p>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neon CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
            ENTER THE
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              NEON VERSE
            </span>
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Join the <span className="text-cyan-400 font-bold">quantum revolution</span> of student commerce
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/auth" 
              className="group bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl text-2xl font-black hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 transition-all duration-500 shadow-2xl shadow-cyan-500/30 hover:shadow-purple-500/40 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Lightning className="w-8 h-8" />
              JACK IN NOW
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link 
              href="/dashboard" 
              className="group border-2 border-cyan-500 text-cyan-400 px-12 py-6 rounded-2xl text-2xl font-black hover:bg-cyan-500/10 hover:border-purple-500 hover:text-purple-400 transition-all duration-500 flex items-center justify-center gap-3"
            >
              <Globe className="w-8 h-8" />
              EXPLORE MATRIX
            </Link>
          </div>
        </div>
      </section>

      {/* Cyberpunk Footer */}
      <footer className="bg-black border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
                MU MARKET
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The cyberpunk student marketplace for Marwadi University. Experience the future of digital commerce.
              </p>
              <div className="text-sm text-purple-400 font-bold">
                CODED WITH ⚡ FOR MU CYBORGS
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-black text-white mb-6 tracking-wider">NEON MARKETPLACE</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">◦ Browse Matrix</Link></li>
                <li><Link href="/create" className="hover:text-cyan-400 transition-colors">◦ Upload Items</Link></li>
                <li><Link href="/favorites" className="hover:text-cyan-400 transition-colors">◦ Saved Items</Link></li>
                <li><Link href="/my-listings" className="hover:text-cyan-400 transition-colors">◦ My Uploads</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-black text-white mb-6 tracking-wider">DIGITAL NEXUS</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/chat" className="hover:text-purple-400 transition-colors">◦ Holo Messages</Link></li>
                <li><Link href="/profile" className="hover:text-purple-400 transition-colors">◦ Neural Profile</Link></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">◦ Cyber Safety</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">◦ Digital Rules</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-black text-white mb-6 tracking-wider">QUANTUM SUPPORT</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">◦ Help Portal</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">◦ Neural Contact</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">◦ Bug Reports</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">◦ Privacy Matrix</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm">
              © 2025 MU MARKET • ALL DIGITAL RIGHTS RESERVED
            </div>
            <div className="text-gray-500 text-sm mt-4 md:mt-0">
              EXCLUSIVELY FOR MARWADI UNIVERSITY CYBORGS
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
