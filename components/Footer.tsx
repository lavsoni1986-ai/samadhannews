import Link from 'next/link';
import { Mail, Phone, MapPin, Rss } from 'lucide-react';
import Logo from './Logo';
import { YoutubeIcon, FacebookIcon, TwitterIcon, InstagramIcon } from './icons';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand + About */}
          <div>
            <Logo showTagline className="mb-4" forceDark />
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              समाधान NEWS – भारत की प्रमुख हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म। ताज़ा, निष्पक्ष और
              प्रामाणिक खबरें। खबर वही जो सही।
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              शहडोल, मध्य प्रदेश, भारत
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-lg">कंपनी</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">हमारे बारे में</Link></li>
              <li><Link href="/editorial-team" className="hover:text-white transition-colors">संपादक मंडल</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">संपर्क करें</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">गोपनीयता नीति</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">नियम और शर्तें</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">अस्वीकरण</Link></li>
              <li><Link href="/advertise" className="hover:text-white transition-colors">विज्ञापन दें</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-lg">श्रेणियां</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/category/rajneeti" className="hover:text-white transition-colors">राजनीति</Link></li>
              <li><Link href="/category/desh" className="hover:text-white transition-colors">राष्ट्रीय</Link></li>
              <li><Link href="/category/duniya" className="hover:text-white transition-colors">अंतर्राष्ट्रीय</Link></li>
              <li><Link href="/category/rajya" className="hover:text-white transition-colors">राज्य</Link></li>
              <li><Link href="/category/vyapar" className="hover:text-white transition-colors">व्यापार</Link></li>
              <li><Link href="/category/tech" className="hover:text-white transition-colors">तकनीक</Link></li>
              <li><Link href="/category/kheel" className="hover:text-white transition-colors">खेल</Link></li>
            </ul>
          </div>

          {/* Social + Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-lg">हमसे जुड़ें</h4>
            <div className="flex items-center gap-3 mb-5">
              <a href="https://www.youtube.com/@SamadhaanNews" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors">
                <YoutubeIcon className="w-5 h-5 text-white" />
              </a>
              <a href="https://www.facebook.com/samadhaannews" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors">
                <FacebookIcon className="w-5 h-5 text-white" />
              </a>
              <a href="https://twitter.com/samadhaannews" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center transition-colors">
                <TwitterIcon className="w-5 h-5 text-white" />
              </a>
              <a href="https://www.instagram.com/samadhaannews" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-pink-600 hover:bg-pink-500 flex items-center justify-center transition-colors">
                <InstagramIcon className="w-5 h-5 text-white" />
              </a>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary shrink-0" /> news@samadhaannews.in</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary shrink-0" /> +91 97532 39303</p>
              <a href="/rss.xml" className="flex items-center gap-2 hover:text-white transition-colors"><Rss className="w-4 h-4 text-primary shrink-0" /> RSS फ़ीड</a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-slate-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
            <p>© {year} समाधान NEWS | सर्वाधिकार सुरक्षित</p>
            <p className="flex items-center gap-1.5">
              Powered by
              <span className="font-semibold text-gray-300">BharatOS</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
