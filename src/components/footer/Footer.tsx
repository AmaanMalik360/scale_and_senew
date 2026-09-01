const Footer = () => {
  return (
    <footer className="w-full bg-white text-black pt-8 pb-2 px-6 border-t border-[#e5e5e5] mt-48">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Brand - Left side */}
          <div>
            <img 
              src="/Scale & Senew.svg" 
              alt="Scale and Senew" 
              className="mb-4 h-6 w-auto"
            />
            <p className="text-sm font-light text-black/70 leading-relaxed max-w-md mb-6">
              Exotic leather wallets, bags, and card holders crafted for everyday luxury.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2 text-sm font-light text-black/70">
              <div>
                <p className="font-normal text-black mb-1">Visit Us</p>
                <p>Scale &amp; Senew Studio</p>
                <p>Pakistan</p>
              </div>
              <div>
                <p className="font-normal text-black mb-1 mt-3">Contact</p>
                <p>+92 300 0000000</p>
                <p>hello@scaleandsenew.com</p>
              </div>
            </div>
          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shop */}
            <div>
              <h4 className="text-sm font-normal mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="/category/wallets" className="text-sm font-light text-black/70 hover:text-black transition-colors">Wallets</a></li>
                <li><a href="/category/bags" className="text-sm font-light text-black/70 hover:text-black transition-colors">Bags</a></li>
                <li><a href="/category/card-holders" className="text-sm font-light text-black/70 hover:text-black transition-colors">Card Holders</a></li>
                <li><a href="/category/long-wallets" className="text-sm font-light text-black/70 hover:text-black transition-colors">Long Wallets</a></li>
                <li><a href="/category/new-arrivals" className="text-sm font-light text-black/70 hover:text-black transition-colors">New Arrivals</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-normal mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="/about/size-guide" className="text-sm font-light text-black/70 hover:text-black transition-colors">Size Guide</a></li>
                <li><a href="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Leather Care</a></li>
                <li><a href="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Returns</a></li>
                <li><a href="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Shipping</a></li>
                <li><a href="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-normal mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Instagram</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">WhatsApp</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - edge to edge separator */}
      <div className="border-t border-[#e5e5e5] -mx-6 px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-light text-black mb-1 md:mb-0">
            © 2026 Scale &amp; Senew. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/privacy-policy" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;