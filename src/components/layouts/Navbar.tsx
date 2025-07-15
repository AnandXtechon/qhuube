"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X, Mail, Phone, MapPin, ChevronDown, ChevronUp, Shield, FileText, Globe, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isContactPopoverOpen, setIsContactPopoverOpen] = useState(false) // State for desktop contact popover
  const [isCompliancePopoverOpen, setIsCompliancePopoverOpen] = useState(false) // State for desktop compliance popover
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false) // State for mobile contact section
  const [isMobileComplianceOpen, setIsMobileComplianceOpen] = useState(false) // State for mobile compliance section

  const navItems = [
    { name: "Products", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "Compliance", href: "/compliance" },
    { name: "Contact", href: "/contact" },
  ]

  const contactDetails = {
    email: "connect@qhuube.com",
    phone: "+353 1 270 5111",
    address: "Balheary Road, Swords, Dublin K67E5A0",
  }

  const complianceServices = [
    {
      icon: Shield,
      title: "VAT Compliance",
      description: "Complete VAT registration, filing, and management across all EU member states",
      href: "/"
    },
    {
      icon: Globe,
      title: "OSS (One Stop Shop)",
      description: "Simplified EU-wide VAT reporting for digital services and distance sales",
      href: "/"
    },
    {
      icon: FileText,
      title: "Tax Reporting",
      description: "Automated tax reporting and documentation for European markets",
      href: "/"
    },
    {
      icon: Calculator,
      title: "Tax Calculation",
      description: "Real-time VAT calculation engine for all EU jurisdictions",
      href: "/"
    }
  ]

  const handleLinkClick = () => {
    setIsOpen(false)
    setIsMobileContactOpen(false)
    setIsMobileComplianceOpen(false)
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
    <nav className={`fixed w-full z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-sm" : ""}`}>
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
            {navItems.map((item) => {
              if (item.name === "Contact") {
                return (
                  <Popover key={item.name} open={isContactPopoverOpen} onOpenChange={setIsContactPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className="relative cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-sky-600 rounded-lg group outline-none border-none"
                        onMouseEnter={() => setIsContactPopoverOpen(true)}
                        onMouseLeave={() => setIsContactPopoverOpen(false)}
                      >
                        {item.name}
                        <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-sky-600 transition-all duration-300 group-hover:left-4 hover:w-10"></span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto min-w-[200px] p-4 text-sm bg-white rounded-lg shadow-lg"
                      onMouseEnter={() => setIsContactPopoverOpen(true)}
                      onMouseLeave={() => setIsContactPopoverOpen(false)}
                      side="bottom"
                      align="center"
                      sideOffset={10}
                    >
                      <div className="grid gap-2">
                        <div className="font-semibold text-gray-900">Contact Us</div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a href={`mailto:${contactDetails.email}`} className="text-sky-600 hover:underline">
                            {contactDetails.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a href={`tel:${contactDetails.phone}`} className="text-gray-700 hover:underline">
                            {contactDetails.phone}
                          </a>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <span className="text-gray-700">{contactDetails.address}</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )
              } else if (item.name === "Compliance") {
                return (
                  <Popover key={item.name} open={isCompliancePopoverOpen} onOpenChange={setIsCompliancePopoverOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className="relative cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-sky-600 rounded-lg group outline-none border-none"
                        onMouseEnter={() => setIsCompliancePopoverOpen(true)}
                        onMouseLeave={() => setIsCompliancePopoverOpen(false)}
                      >
                        {item.name}
                        <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-sky-600 transition-all duration-300 group-hover:left-4 hover:w-10"></span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto min-w-[400px] p-0 bg-white rounded-lg shadow-lg border"
                      onMouseEnter={() => setIsCompliancePopoverOpen(true)}
                      onMouseLeave={() => setIsCompliancePopoverOpen(false)}
                      side="bottom"
                      align="center"
                      sideOffset={10}
                    >
                      <div className="p-4">
                        <div className="font-semibold text-gray-900 mb-3">European Tax Compliance</div>
                        <div className="grid gap-3">
                          {complianceServices.map((service) => {
                            const IconComponent = service.icon
                            return (
                              <Link
                                key={service.title}
                                href={service.href}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                              >
                                <div className="flex-shrink-0 w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                                  <IconComponent className="h-4 w-4 text-sky-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 text-sm group-hover:text-sky-600 transition-colors">
                                    {service.title}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    {service.description}
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                        {/* <div className="mt-4 pt-3 border-t border-gray-100">
                          <Link
                            href="/compliance"
                            className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                          >
                            View all compliance services →
                          </Link>
                        </div> */}
                      </div>
                    </PopoverContent>
                  </Popover>
                )
              } else {
                return (
                  <Link
                    href={item.href}
                    key={item.name}
                    className="relative px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-sky-600 rounded-lg group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-sky-600 transition-all duration-300 group-hover:left-4 hover:w-10"></span>
                  </Link>
                )
              }
            })}
          </div>
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/admin-auth/login"
              className="px-4 py-2 text-sm bg-gray-100 font-medium text-gray-900 transition-all duration-200 hover:text-sky-600 rounded-lg hover:bg-gray-50"
            >
              Login
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
              <SheetTrigger asChild>
                <button className="p-2 sm:p-4 rounded-md hover:bg-blue-100 transition-colors">
                  <Menu className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                  <span className="sr-only">Toggle menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0 bg-white/95 backdrop-blur-md">
                <div className="flex h-full flex-col">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <Link href="/" className="group flex transition-all duration-200" onClick={handleLinkClick}>
                      <h2 className="text-xl font-bold text-sky-600">
                        Q<span className="text-lg font-bold text-gray-900">HUUBE</span>
                      </h2>
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
                      {navItems.map((item, index) => {
                        if (item.name === "Contact") {
                          return (
                            <Collapsible key={item.name} open={isMobileContactOpen} onOpenChange={setIsMobileContactOpen}>
                              <CollapsibleTrigger asChild>
                                <button
                                  className="flex items-center justify-between w-full rounded-xl py-3 px-4 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-sky-600 hover:translate-x-1"
                                  style={{
                                    animationDelay: `${index * 50}ms`,
                                    animation: isOpen ? "slideInRight 0.3s ease-out forwards" : "none",
                                  }}
                                >
                                  <div className="flex items-center">
                                    <span className="flex h-2 w-2 rounded-full bg-sky-600 mr-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></span>
                                    {item.name}
                                  </div>
                                  {isMobileContactOpen ? (
                                    <ChevronUp className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                  )}
                                </button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="px-4 pb-2">
                                <div className="bg-gray-50 rounded-lg p-4 ml-5 space-y-3">
                                  <div className="font-semibold text-gray-900 text-sm">Contact Us</div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <a
                                      href={`mailto:${contactDetails.email}`}
                                      className="text-sky-600 hover:underline text-sm"
                                      onClick={handleLinkClick}
                                    >
                                      {contactDetails.email}
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <a
                                      href={`tel:${contactDetails.phone}`}
                                      className="text-gray-700 hover:underline text-sm"
                                      onClick={handleLinkClick}
                                    >
                                      {contactDetails.phone}
                                    </a>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                    <span className="text-gray-700 text-sm">{contactDetails.address}</span>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )
                        } else if (item.name === "Compliance") {
                          return (
                            <Collapsible key={item.name} open={isMobileComplianceOpen} onOpenChange={setIsMobileComplianceOpen}>
                              <CollapsibleTrigger asChild>
                                <button
                                  className="flex items-center justify-between w-full rounded-xl py-3 px-4 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-sky-600 hover:translate-x-1"
                                  style={{
                                    animationDelay: `${index * 50}ms`,
                                    animation: isOpen ? "slideInRight 0.3s ease-out forwards" : "none",
                                  }}
                                >
                                  <div className="flex items-center">
                                    <span className="flex h-2 w-2 rounded-full bg-sky-600 mr-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></span>
                                    {item.name}
                                  </div>
                                  {isMobileComplianceOpen ? (
                                    <ChevronUp className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                  )}
                                </button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="px-4 pb-2">
                                <div className="bg-gray-50 rounded-lg p-4 ml-5 space-y-3">
                                  <div className="font-semibold text-gray-900 text-sm mb-3">European Tax Compliance</div>
                                  {complianceServices.map((service) => {
                                    const IconComponent = service.icon
                                    return (
                                      <Link
                                        key={service.title}
                                        href={service.href}
                                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-white transition-colors group"
                                        onClick={handleLinkClick}
                                      >
                                        <div className="flex-shrink-0 w-6 h-6 bg-sky-100 rounded-md flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                                          <IconComponent className="h-3 w-3 text-sky-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-gray-900 text-sm group-hover:text-sky-600 transition-colors">
                                            {service.title}
                                          </div>
                                          <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            {service.description}
                                          </div>
                                        </div>
                                      </Link>
                                    )
                                  })}
                                  <div className="mt-3 pt-2 border-t border-gray-200">
                                    <Link
                                      href="/compliance"
                                      className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                                      onClick={handleLinkClick}
                                    >
                                      View all services →
                                    </Link>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )
                        } else {
                          return (
                            <Link
                              href={item.href}
                              key={item.name}
                              className="flex items-center rounded-xl py-3 px-4 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-sky-600 hover:translate-x-1"
                              onClick={handleLinkClick}
                              style={{
                                animationDelay: `${index * 50}ms`,
                                animation: isOpen ? "slideInRight 0.3s ease-out forwards" : "none",
                              }}
                            >
                              <span className="flex h-2 w-2 rounded-full bg-sky-600 mr-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></span>
                              {item.name}
                            </Link>
                          )
                        }
                      })}
                      <Link
                        href="/admin-auth/login"
                        className="flex items-center rounded-xl py-3 px-4 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-sky-600 hover:translate-x-1"
                        onClick={handleLinkClick}
                        style={{
                          animationDelay: `${navItems.length * 50}ms`,
                          animation: isOpen ? "slideInRight 0.3s ease-out forwards" : "none",
                        }}
                      >
                        <span className="flex h-2 w-2 rounded-full bg-sky-600 mr-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></span>
                        Login
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