import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaGoogle,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaMobileAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-black)] text-white pt-16 pb-8">
      <div className="container mx-auto grid md:grid-cols-4 gap-8 px-6">
        {/* Store Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Store Information</h3>
          <div className="w-12 h-[2px] bg-white mb-10"></div>
          <ul className="space-y-5 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1" />
              60 29th Street San Francisco, 507-Union Trade Center, United
              States America - 94110.
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> (+00) 123-456-7890
            </li>
            <li className="flex items-center gap-2">
              <FaMobileAlt /> (+91)-012-345-6789
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> demo@example.com
            </li>
          </ul>
          <div className="flex gap-3 mt-6">
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700"
            >
              <FaSquareXTwitter />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700"
            >
              <FaGoogle />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Help & Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Help & Information</h3>
          <div className="w-12 h-[2px] bg-white mb-10"></div>
          <ul className="space-y-5 text-sm text-gray-300">
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Shipping</a>
            </li>
            <li>
              <a href="#">Sitemap</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">Store Us</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h3 className="text-lg font-semibold mb-2">About Us</h3>
          <div className="w-12 h-[2px] bg-white mb-10"></div>
          <ul className="space-y-5 text-sm text-gray-300">
            <li>
              <a href="#">Term & Policy</a>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Delivery</a>
            </li>
            <li>
              <a href="#">Service</a>
            </li>
            <li>
              <a href="#">Sitemap</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
          <div className="w-12 h-[2px] bg-white mb-10"></div>
          <p className="text-sm text-gray-300 mb-6">
            Subscribe to receive inspiration, ideas & News in your inbox.
          </p>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full p-2 mb-3 border border-gray-400 rounded text-white placeholder:text-gray-500"
          />
          <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-300">
            SUBSCRIBE
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 p-10">
        <p>© 2025 Shoesvibe Demo - WordPress Theme by Avanam</p>
        <div className="flex gap-2 mt-4 md:mt-0">
          <img
            src="/assets/images/payment/visa.png"
            alt="Visa"
            className="h-6"
          />
          <img
            src="/assets/images/payment/americanexpress.png"
            alt="Amex"
            className="h-6"
          />
          <img
            src="/assets/images/payment/maestro.png"
            alt="Maestro"
            className="h-6"
          />
          <img
            src="/assets/images/payment/mastercard.png"
            alt="Mastercard"
            className="h-6"
          />
          <img
            src="/assets/images/payment/paypal.png"
            alt="PayPal"
            className="h-6"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
