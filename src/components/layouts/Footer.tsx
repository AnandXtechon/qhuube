"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, TwitterIcon as TikTok } from "lucide-react" // Import TikTok icon

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "Compliance", href: "/compliance" },
    { name: "Contact", href: "/contact" },
  ]
  const services = [
    { name: "VAT Compliance", href: "/compliance/vat" },
    { name: "OSS (One Stop Shop)", href: "/compliance/oss" },
    { name: "Tax Reporting", href: "/compliance/reporting" },
    { name: "Tax Calculation", href: "/compliance/calculation" },
  ]
  // Removed resources array as per request
  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    // { name: "GDPR Compliance", href: "/gdpr" },
  ]
  const socialLinks = [
    { name: "LinkedIn", href: "https://linkedin.com/company/qhuube", icon: Linkedin },
    { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61576978080779", icon: Facebook },
    { name: "Instagram", href: "https://instagram.com/qhuube", icon: Instagram },
    { name: "TikTok", href: "https://tiktok.com/@qhuube", icon: TikTok }, // Added TikTok
  ]
  const contactDetails = {
    email: "connect@qhuube.com",
    phone: "+353 1 963 0270",
    address: "Balheary Road, Swords, Dublin K67E5A0",
  }
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-sky-600">Q</span>
              <span className="text-xl font-bold text-gray-900">HUUBE</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Simplifying European tax compliance for modern businesses. Automate your VAT registration, OSS reporting,
              and stay compliant across all 27 EU member states.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-3" />
                <a href={`mailto:${contactDetails.email}`} className="hover:text-sky-600">
                  {contactDetails.email}
                </a>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-3" />
                <a href={`tel:${contactDetails.phone}`} className="hover:text-sky-600">
                  {contactDetails.phone}
                </a>
              </div>
              <div className="flex items-start text-gray-600">
                <MapPin className="w-4 h-4 mr-3 mt-1" />
                <address className="not-italic">{contactDetails.address}</address>
              </div>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-600 hover:text-sky-600">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link href={service.href} className="text-gray-600 hover:text-sky-600">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Follow Us Section (replaces Resources) */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
            <ul className="space-y-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      className="flex items-center text-gray-600 hover:text-sky-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {social.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        {/* Newsletter Section */}
        {/* <div className="py-8 border-t border-gray-200">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Get the latest updates on VAT regulations and compliance tips.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-600"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div> */}
        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600">
              <p>&copy; {currentYear} QHUUBE. All rights reserved.</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">
                Trusted technology partner <span className="text-gray-600">XTechon</span>
              </p>
            </div>
            <div className="flex space-x-6">
              {legal.map((item) => (
                <Link key={item.name} href={item.href} className="text-gray-600 hover:text-sky-600 text-sm">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
