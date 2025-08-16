'use client'

import React from 'react'
import Link from 'next/link'
import { Star, Users, MessageCircle, ShoppingBag, BookOpen, Briefcase, 
         Shield, CheckCircle, TrendingUp, ArrowRight, Search, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-slate-800">
                MU Market
              </div>
              <div className="ml-3 text-xs text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1 rounded-md font-semibold">
                PROFESSIONAL MARKETPLACE
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth" 
                className="text-slate-600 hover:text-slate-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth" 
                className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                The Professional
                <span className="text-blue-600 block">Student Marketplace</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Connect, trade, and grow with fellow Marwadi University students. 
                Our secure platform facilitates seamless academic and professional exchanges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/auth" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg inline-flex items-center justify-center"
                >
                  Start Trading
                </Link>
                <Link 
                  href="/auth" 
                  className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-md text-lg font-medium transition-colors inline-flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Market Analytics</h3>
                    <p className="text-slate-600 text-sm">Real-time pricing insights</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Secure Transactions</h3>
                    <p className="text-slate-600 text-sm">University-verified users only</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Community Network</h3>
                    <p className="text-slate-600 text-sm">Connect with 500+ students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Students</h2>
            <p className="text-slate-600">Join the growing community of Marwadi University traders</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Active Students", color: "blue" },
              { number: "1.2K+", label: "Items Listed", color: "green" },
              { number: "800+", label: "Completed Trades", color: "purple" },
              { number: "98%", label: "Success Rate", color: "orange" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-slate-50 rounded-lg">
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'purple' ? 'text-purple-600' :
                  'text-orange-600'
                }`}>
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Professional Categories
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover opportunities across academic, technological, and professional domains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Academic Excellence",
                description: "Premium textbooks, research materials, laboratory equipment, and academic resources.",
                color: "blue"
              },
              {
                icon: ShoppingBag,
                title: "Technology Solutions",
                description: "Professional-grade laptops, devices, software licenses, and technical equipment.",
                color: "green"
              },
              {
                icon: Briefcase,
                title: "Professional Services",
                description: "Expert tutoring, consulting, design work, and skill-based freelancing opportunities.",
                color: "purple"
              }
            ].map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${
                  category.color === 'blue' ? 'bg-blue-100' :
                  category.color === 'green' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  <category.icon className={`w-7 h-7 ${
                    category.color === 'blue' ? 'text-blue-600' :
                    category.color === 'green' ? 'text-green-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {category.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional tools designed for the modern student marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "University Authentication",
                description: "Secure access with @marwadiuniversity.ac.in verification"
              },
              {
                icon: Search,
                title: "Advanced Search",
                description: "Intelligent filtering and categorization systems"
              },
              {
                icon: MessageCircle,
                title: "Integrated Messaging",
                description: "Professional communication tools built-in"
              },
              {
                icon: Star,
                title: "Reputation System",
                description: "Comprehensive rating and review framework"
              },
              {
                icon: TrendingUp,
                title: "Market Intelligence",
                description: "Real-time analytics and pricing trends"
              },
              {
                icon: CheckCircle,
                title: "Quality Assurance",
                description: "Verified listings and transaction security"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Transform Your Trading Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Join the professional student marketplace that&apos;s revolutionizing campus commerce
          </p>
          <Link 
            href="/auth" 
            className="bg-white text-blue-600 px-12 py-4 rounded-md text-lg font-bold hover:bg-gray-50 transition-colors shadow-lg inline-flex items-center gap-3"
          >
            Launch Your Marketplace Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold mb-4">MU Market</div>
              <p className="text-slate-300 mb-6 max-w-md">
                The professional marketplace solution designed specifically for 
                Marwadi University&apos;s academic and professional community.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-slate-300">
                <div>Academic Resources</div>
                <div>Technology Trading</div>
                <div>Professional Services</div>
                <div>Market Analytics</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-slate-300">
                <div>Help Center</div>
                <div>Security</div>
                <div>Community Guidelines</div>
                <div>Contact Us</div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <div className="text-slate-400">
              © 2025 MU Market. Professional marketplace solutions for Marwadi University.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
