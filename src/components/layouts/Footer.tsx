import Link from "next/link"
import { Mail, Phone, MapPin, Twitter, Linkedin } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const services = [
    { name: "VAT Registration", href: "/services/vat-registration" },
    { name: "Cross-Border Compliance", href: "/services/cross-border" },
    { name: "Automated Filings", href: "/services/filings" },
    { name: "Audit Preparation", href: "/services/audit-support" },
  ]

  const socialLinks = [
    { name: "LinkedIn", href: "#", icon: Linkedin, ariaLabel: "Connect with us on LinkedIn" },
    { name: "Twitter", href: "#", icon: Twitter, ariaLabel: "Follow us on Twitter" },
  ]

  return (
    <footer className="bg-white border-t border-gray-200" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold tracking-tight text-black mb-4 inline-block">
              <span className="text-blue-500">Tax</span>Track
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              TaxTrack helps European businesses automate VAT registration, reporting, and compliance — all in one place.
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-gray-500 text-sm">
                <Mail className="w-4 h-4 mr-3 text-blue-600" />
                <a href="mailto:support@taxtrack.com" className="hover:text-blue-500 transition">
                  support@taxtrack.com
                </a>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Phone className="w-4 h-4 mr-3 text-blue-600" />
                <a href="tel:+442012345678" className="hover:text-blue-500 transition">
                  +44 20 1234 5678
                </a>
              </div>
              <div className="flex items-start text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-3 mt-0.5 text-blue-600" />
                <address className="not-italic">
                  45 Fintech Road<br />
                  London, UK EC1A 1AA
                </address>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-500 text-sm hover:text-blue-500 transition">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-black font-semibold mb-4">VAT Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link href={service.href} className="text-gray-500 text-sm hover:text-blue-500 transition">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="text-black font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-500 text-sm mb-4">
              Get updates on VAT rule changes and automation tips — straight to your inbox.
            </p>
            <form className="mb-6" aria-label="Newsletter signup">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-l-md text-sm placeholder-gray-500 focus:outline-none focus:border-blue-600"
                  required
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-r-md hover:bg-blue-700 transition"
                  aria-label="Subscribe"
                >
                  Subscribe
                </button>
              </div>
            </form>

            <div>
              <h4 className="text-black font-medium mb-3 text-sm">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="text-gray-500 hover:text-blue-600 transition"
                      aria-label={social.ariaLabel}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              <p>&copy; {currentYear} TaxTrack. All rights reserved.</p>
            </div>
            <nav aria-label="Legal navigation">
              <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-500 hover:text-blue-500 transition">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-500 hover:text-blue-500 transition">
                  Terms of Service
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
