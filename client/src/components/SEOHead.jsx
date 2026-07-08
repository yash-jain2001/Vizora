import { useEffect } from 'react';

const BASE_URL = 'https://vizora.app';

const DEFAULT_TITLE = 'Vizora — Real-Time IoT Monitoring & Analytics Dashboard';
const DEFAULT_DESCRIPTION = 'Monitor, visualize, and analyze IoT sensor data in real-time with Vizora. 100+ chart types, MQTT/HTTP data sources, smart alerts, and role-based dashboards.';

function setMetaTag(name, content) {
  // Try both name and property attributes
  let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      el.setAttribute('property', name);
    } else {
      el.setAttribute('name', name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

const SEOHead = ({ title, description, keywords, canonicalPath = '/', ogImage = '/logo.jpeg' }) => {
  useEffect(() => {
    const pageTitle = title ? `${title} — Vizora` : DEFAULT_TITLE;
    const pageDescription = description || DEFAULT_DESCRIPTION;
    
    document.title = pageTitle;
    setMetaTag('description', pageDescription);
    if (keywords) setMetaTag('keywords', keywords);
    setMetaTag('og:title', pageTitle);
    setMetaTag('og:description', pageDescription);
    setMetaTag('og:url', `${BASE_URL}${canonicalPath}`);
    setMetaTag('og:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);
    setMetaTag('twitter:title', pageTitle);
    setMetaTag('twitter:description', pageDescription);
    setMetaTag('twitter:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);
    
    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `${BASE_URL}${canonicalPath}`);
    
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, keywords, canonicalPath, ogImage]);
  
  return null;
};

export default SEOHead;
