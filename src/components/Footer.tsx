"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChefHat, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Blog', path: '/blog' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' }
    ],
    restaurants: [
      { name: 'Partner with Us', path: '/partner' },
      { name: 'Restaurant Dashboard', path: '/restaurant-dashboard' },
      { name: 'Delivery Areas', path: '/delivery' },
      { name: 'Menu Guidelines', path: '/guidelines' }
    ]
  };

  return (
    <footer className="bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl">
                <ChefHat className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-gradient">Eats Store</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Discover amazing flavors from the finest restaurants in your city. Premium dining experiences delivered fresh to your door.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors duration-300"
                >
                  <Icon className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.path} 
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.path} 
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Restaurants</h3>
            <ul className="space-y-3">
              {footerLinks.restaurants.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.path} 
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">hello@eatstore.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">San Francisco, CA</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              © 2024 Eats Store. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Crafted for culinary excellence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;