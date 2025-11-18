"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Subscribe:", email);
  };

  return (
    <footer className="bg-[#4a4a4a] text-white">
      {/* Main Footer Content */}
      <div className="container xl:max-w-7xl min-h-full m-auto text-gray-200 flex flex-wrap-reverse md:flex-wrap justify-between clear-both pt-5 px-5 2xl:px-0">
        {/* Left Section - Logo, Hero Text, Newsletter */}
        <div className="w-full md:w-auto">
          {/* Logo Section */}
          <div className="py-5">
            <h2 className="text-3xl font-serif text-white">
              CultureOwl<sup className="text-sm">®</sup>
            </h2>
          </div>

          {/* CultureOfCulture3_Bright */}
          <div className="w-full clear-both py-10 xl:py-20">
            <h2>
              <Image
                src="/images/culture_of_ culture_bright.png"
                alt="Creating a Culture of Culture"
                title="Creating a Culture of Culture"
                width={800}
                height={400}
                className="w-full max-w-xs h-auto mx-auto xl:mx-0"
              />
            </h2>
          </div>

          {/* Email Form */}
          <div className="w-full h-auto max-w-sm py-5 flex flex-col justify-end items-center lg:items-start">
            <form onSubmit={handleSubmit} className="min-w-full border-b-2 border-white overflow-hidden">
              <div className="flex items-center gap-3 pb-3">
                <Mail className="w-6 h-6 flex-shrink-0 text-gray-300" />
                <input
                  type="email"
                  placeholder="Discover the culture you crave in your inbox"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder:text-gray-300 w-full focus:outline-none text-sm"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Section - Browse, Partner, Owl and Social Icons */}
        <div className="flex flex-col items-end justify-between mb-3">
          {/* Browse and Partner with Us */}
          <div className="flex gap-8 md:gap-12">
            {/* Browse */}
            <div className="space-y-4">
              <h4 className="text-[#ff6b5a] text-xl font-semibold">Browse</h4>
              <nav className="flex flex-col gap-3 text-base">
                <Link href="/news/cultural" className="text-white/90 hover:text-white transition-colors">
                  Cultural News
                </Link>
                <Link href="/dining" className="text-white/90 hover:text-white transition-colors">
                  Dining Guide
                </Link>
                <Link href="/venues" className="text-white/90 hover:text-white transition-colors">
                  Venue Directory
                </Link>
              </nav>
            </div>

            {/* Partner with Us */}
            <div className="space-y-4">
              <h4 className="text-[#ff6b5a] text-xl font-semibold">Partner with Us</h4>
              <nav className="flex flex-col gap-3 text-base">
                <Link href="/ambassador" className="text-white/90 hover:text-white transition-colors">
                  Become an Ambassador
                </Link>
                <Link href="/advertise" className="text-white/90 hover:text-white transition-colors">
                  Advertise
                </Link>
                <Link href="/franchise" className="text-white/90 hover:text-white transition-colors">
                  Franchise
                </Link>
                <Link href="/editorial-calendar" className="text-white/90 hover:text-white transition-colors">
                  Editorial Calendar
                </Link>
              </nav>
            </div>
          </div>

          {/* Owl Mascot and Social Icons */}
          <div className="flex flex-col items-center gap-3 mt-auto">
            {/* Owl Image */}
            <div className="relative w-20 h-20">
              <Image
                src="/images/owl.png"
                alt="CultureOwl Mascot"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-4">
              <Link href="https://www.facebook.com/CultureOwl/" target="_blank" aria-label="Facebook" className="inline-block">
                <div className="w-8 h-8 rounded-full bg-[#d9534f] flex items-center justify-center hover:bg-[#c9302c] transition-colors">
                  <i aria-hidden="true" className="fab fa-facebook-f text-white text-sm" title="Facebook"></i>
                </div>
              </Link>
              <Link href="https://www.instagram.com/cultureOwl/" target="_blank" aria-label="Instagram" className="inline-block">
                <div className="w-8 h-8 rounded-full bg-[#d9534f] flex items-center justify-center hover:bg-[#c9302c] transition-colors">
                  <i aria-hidden="true" className="fab fa-instagram text-white text-base" title="Instagram"></i>
                </div>
              </Link>
              <Link href="https://www.linkedin.com/company/cultureowl" target="_blank" aria-label="LinkedIn" className="inline-block">
                <div className="w-8 h-8 rounded-full bg-[#d9534f] flex items-center justify-center hover:bg-[#c9302c] transition-colors">
                  <i aria-hidden="true" className="fab fa-linkedin-in text-white text-sm" title="LinkedIn"></i>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
            <nav className="flex flex-wrap gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </nav>
            <p>All Rights Reserved © {new Date().getFullYear()} CultureOwl ®</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
