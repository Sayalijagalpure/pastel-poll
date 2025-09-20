import { Link } from 'react-router-dom';
import { Vote, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'How It Works', href: '/#how-it-works' },
      { name: 'Features', href: '/#features' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Report Issue', href: '/report' },
    ],
    social: [
      { name: 'GitHub', href: 'https://github.com/Sayalijagalpure/pastel-poll', icon: Github },
      { name: 'Twitter', href: 'https://twitter.com/pastelpoll', icon: Twitter },
      { name: 'LinkedIn', href: 'https://linkedin.com/company/pastel-poll', icon: Linkedin },
    ],
  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Vote className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">SecureVote</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Secure, anonymous voting platform built with privacy and transparency at its core.
              Make your voice heard with confidence.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-muted hover:bg-accent rounded-full flex items-center justify-center transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>© {currentYear} SecureVote. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for democracy.</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Version 1.0.0</span>
            <span>•</span>
            <a
              href="mailto:support@securevote.com"
              className="flex items-center space-x-1 hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
