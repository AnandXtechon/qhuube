"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Products", href: "/" },
    { name: "Pricing", href: "/pricing" },
    // { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ]

  const handleLinkClick = () => {
    setIsOpen(false)
  }
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  return (
    <nav
      className={`fixed w-full z-50  bg-white transition-shadow duration-300 ${scrolled ? "shadow-sm" : ""
        }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="">
                <span className="text-2xl font-bold text-sky-600">Q</span>
            
              <span className="text-xl font-bold text-gray-900">HUUBE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-sky-600 rounded-lg  group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-sky-600 transition-all duration-300 group-hover:left-4 hover:w-10"></span>
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/contact"
              className="px-4 py-2 text-sm bg-gray-100 font-medium text-gray-900 transition-all duration-200 hover:text-sky-600 rounded-lg hover:bg-gray-50"
            >
              Contact
            </Link>
            <Button
              asChild
              className="bg-sky-600 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Link href="/upload">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 sm:p-4 rounded-md hover:bg-blue-100 transition-colors">
                    <Menu className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                    <span className="sr-only">Toggle menu</span>
                  </button>
                </SheetTrigger>
              </Sheet>

              <SheetContent side="right" className="w-full sm:w-[400px] p-0 bg-white/95 backdrop-blur-md">
                <div className="flex h-full flex-col">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <Link
                      href="/"
                      className="group flex  transition-all duration-200"
                      onClick={handleLinkClick}
                    >
                      
                      <h2 className="text-xl font-bold text-sky-600">Q<span className="text-lg font-bold text-gray-900">HUUBE</span></h2>
                      
                      
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose> 
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex-1 overflow-y-auto px-2">
                    <div className="space-y-2">
                      {navItems.map((item, index) => (
                        <Link
                          href={item.href}
                          key={item.name}
                          className="flex items-center rounded-xl py-3 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-sky-600 hover:translate-x-1"
                          onClick={handleLinkClick}
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animation: isOpen ? "slideInRight 0.3s ease-out forwards" : "none",
                          }}
                        >
                          <span className="flex h-2 w-2 rounded-full bg-sky-600 mr-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></span>
                          {item.name}
                        </Link>
                      ))}
                      <Link
                        href="/contact"
                        className="flex items-center rounded-xl py-3 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-sky-600 hover:translate-x-1"
                        onClick={handleLinkClick}
                        style={{
                          animationDelay: `${navItems.length * 50}ms`,
                          animation: isOpen ? "slideInRight 0.3s ease-out forwards" : "none",
                        }}
                      >
                        <span className="flex h-2 w-2 rounded-full bg-sky-600 mr-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></span>
                        Contact
                      </Link>
                    </div>
                  </div>

                  {/* Mobile CTA */}
                  <div className="border-t border-gray-100 p-6">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Link href="/upload" onClick={handleLinkClick}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  )
}

export default Navbar
