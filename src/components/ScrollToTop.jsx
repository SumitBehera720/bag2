import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from './SmoothScroll';

/**
 * ScrollToTop ensures whenever a route or product changes,
 * the page view starts immediately at the very top (y = 0),
 * resetting both window and Lenis smooth scroll instances.
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    // If a hash anchor is provided, let it scroll to that element
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, { immediate: true });
        } else {
          el.scrollIntoView();
        }
        return;
      }
    }

    // If returning back to products catalog with saved scroll state, do not force scroll to top
    const isReturningToCatalog = (pathname === '/products' || pathname === '/bags') && 
      sessionStorage.getItem('abag_restore_products_scroll') === 'true';

    if (isReturningToCatalog) {
      return;
    }

    // Force immediate scroll position reset to the top
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search, hash, lenis]);

  return null;
};

export default ScrollToTop;
