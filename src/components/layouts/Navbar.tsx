"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Products", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ]

  return (
    <nav className="sticky top-0 z-50 h-20 bg-white/95 backdrop-blur-sm  flex items-center justify-between px-4 md:px-8 lg:px-16 xl:px-40">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          <span className="text-sky-600 text-3xl">Q</span>
          <span className="text-gray-900">HUUBE</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            href={item.href}
            key={item.name}
            className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors duration-200 relative group"
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
        ))}
      </div>

      {/* Desktop CTA */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/contact"
          className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors duration-200"
        >
          Contact
        </Link>
        <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white px-6">
          <Link href="/get-started">Get Started</Link>
        </Button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Menu className="h-8 w-8" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col items-center space-y-6 mt-6">
              {/* Mobile Logo */}
              <Link href="/" className="text-2xl font-bold" onClick={() => setIsOpen(false)}>
                <span className="text-sky-600">Tax</span>
                <span className="text-gray-900">Track</span>
              </Link>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    href={item.href}
                    key={item.name}
                    className="text-lg font-medium text-gray-700 hover:text-sky-600 transition-colors duration-200 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="text-lg font-medium text-gray-700 hover:text-sky-600 transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </div>

              {/* Mobile CTA */}
              <div className="pt-4 border-t border-gray-200">
                <Button asChild className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                  <Link href="/get-started" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

export default Navbar
