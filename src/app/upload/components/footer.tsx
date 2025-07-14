const Footer = () => {
    return (
        <footer className="bg-gray-50/5 border-t border-gray-200 py-3 mt-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                <p className="mb-2 md:mb-0">
                    © {new Date().getFullYear()} Qhuube. Europe’s trusted tax compliance solution.
                </p>
                <div className="flex space-x-4">
                    <a href="/privacy" className="hover:text-sky-600 transition-colors">
                        Privacy Policy
                    </a>
                    <a href="/terms" className="hover:text-sky-600 transition-colors">
                        Terms of Service
                    </a>
                    <a href="/contact" className="hover:text-sky-600 transition-colors">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
