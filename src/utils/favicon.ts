/**
 * Favicon Theme Management
 * Updates favicon based on current theme
 */

export function updateFavicon(theme: 'light' | 'dark') {
  const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  
  if (favicon) {
    if (theme === 'dark') {
      favicon.href = '/favicon-dark.svg';
    } else {
      favicon.href = '/favicon-light.svg';
    }
  } else {
    // Create new favicon link if it doesn't exist
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';
    document.head.appendChild(link);
  }
  
  // Also update apple-touch-icon for iOS
  const appleIcon = document.querySelector("link[rel~='apple-touch-icon']") as HTMLLinkElement;
  if (appleIcon) {
    appleIcon.href = theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';
  }
}

