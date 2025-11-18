"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RegistrationWizard } from "./components";

export default function RegisterPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Top Bar - Only visible on mobile/tablet */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#E94B3C] to-[#E94B3C] h-14 flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl">🦉</span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link href="/" className="text-lg hover:text-primary">Home</Link>
              <Link href="/auth/login" className="text-lg hover:text-primary">Login</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 lg:flex-none lg:w-1/2 flex items-center justify-center p-6 md:p-8 pt-20 lg:pt-8 bg-white">
        <div className="w-full" style={{ maxWidth: '28rem' }}>

          {/* Main Title */}
          <div className="mb-8">
            <h3 className="text-2xl  leading-tight tracking-tight">
              <span className="text-gray-900">JOIN</span>
              <span className="text-blue-600">THE</span>
              <span className="text-gray-900">MOVEMENT!</span>
            </h3>

            <h1 className="text-6xl font-anton text-gray-900">
              CREATE AN ACCOUNT
            </h1>

            <p className="text-sm text-gray-500">Complete the following steps:</p>
          </div>

          {/* Registration Form */}
          <RegistrationWizard />
        </div>
      </div>

      {/* Right Side - Hero/Branding (Hidden on mobile, shown on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#E94B3C] via-[#D64236] to-[#E94B3C] relative overflow-hidden">
        {/* Hamburger Menu - Desktop */}
        <div className="absolute top-6 right-6 z-20">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-lg hover:text-primary">Home</Link>
                <Link href="/auth/login" className="text-lg hover:text-primary">Login</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
          {/* Main Headline */}
          <div className="text-center mb-8">
            <h2 className="text-7xl font-anton tracking-tight mb-2">
              CULTURE
            </h2>
            <h3 className="text-6xl font-anton tracking-tight">
              AWAITS
            </h3>
          </div>

          {/* Tagline */}
          <p className="text-xl text-center max-w-md mb-12 leading-relaxed">
            Discover unique cultural experiences crafted by top producers in your area
          </p>

          {/* Hero Visual Element */}
          <div className="relative">
            <div className="w-72 h-72 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
              <div className="text-9xl">🎭</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
