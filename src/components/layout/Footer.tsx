import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Github } from 'lucide-react';

export function Footer() {
  const { language } = useLanguage();

  const footerLinks = {
    product: {
      title: language === 'fr' ? 'Produit' : 'Product',
      links: [
        { label: language === 'fr' ? 'Fonctionnalités' : 'Features', href: '/#features' },
        { label: language === 'fr' ? 'Tarification' : 'Pricing', href: '/pricing' },
        { label: language === 'fr' ? 'Comment ça marche' : 'How it Works', href: '/#how-it-works' },
      ],
    },
    company: {
      title: language === 'fr' ? 'Entreprise' : 'Company',
      links: [
        { label: language === 'fr' ? 'À propos' : 'About', href: '/about' },
        { label: language === 'fr' ? 'Blog' : 'Blog', href: '/blog' },
        { label: language === 'fr' ? 'Carrières' : 'Careers', href: '/careers' },
        { label: language === 'fr' ? 'Contact' : 'Contact', href: '/contact' },
      ],
    },
    legal: {
      title: language === 'fr' ? 'Légal' : 'Legal',
      links: [
        { label: language === 'fr' ? 'Conditions d\'utilisation' : 'Terms of Service', href: '/terms' },
        { label: language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy', href: '/privacy' },
        { label: language === 'fr' ? 'Cookies' : 'Cookies', href: '/cookies' },
      ],
    },
    support: {
      title: language === 'fr' ? 'Support' : 'Support',
      links: [
        { label: language === 'fr' ? 'Centre d\'aide' : 'Help Center', href: '/help' },
        { label: language === 'fr' ? 'Documentation' : 'Documentation', href: '/docs' },
        { label: language === 'fr' ? 'Support' : 'Support', href: '/contact' },
      ],
    },
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/riadprix', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/riadprix', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com/riadprix', label: 'Facebook' },
    { icon: Github, href: 'https://github.com/riadprix', label: 'GitHub' },
  ];

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Section - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-orange-light flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg transition-shadow">
                  <span className="text-lg font-bold text-primary-foreground">R</span>
                </div>
                <div>
                  <span className="font-display text-xl font-bold text-foreground block">RiadPrix</span>
                  <p className="text-xs text-muted-foreground -mt-0.5">Revenue Intelligence</p>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                {language === 'fr' 
                  ? 'Optimisez vos revenus locatifs avec des analyses de marché en temps réel pour les riads et propriétés au Maroc.'
                  : 'Optimize your rental revenue with real-time market insights for riads and properties in Morocco.'}
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Product Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                {footerLinks.product.title}
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                {footerLinks.company.title}
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                {footerLinks.legal.title}
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                {footerLinks.support.title}
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Contact Information */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground">
              <a 
                href="mailto:contact@riadprix.com" 
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">contact@riadprix.com</span>
                <span className="sm:hidden">Email</span>
              </a>
              <a 
                href="tel:+212600000000" 
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">+212 600 000 000</span>
                <span className="sm:hidden">Phone</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Marrakech, Morocco</span>
                <span className="sm:hidden">Morocco</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()} RiadPrix. {language === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
