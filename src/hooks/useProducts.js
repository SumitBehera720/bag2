import { useState, useEffect } from 'react';
import { PRODUCTS as LOCAL_PRODUCTS } from '../data/productsData';

/**
 * Hook to provide curated ASKMEBAG products catalog.
 * Uses local curated catalog as instant initial state (zero flickers),
 * and syncs with Laravel CMS API when available for live updates from admin panel.
 */
export const useProducts = () => {
  const [products, setProducts] = useState(LOCAL_PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('API returned ' + res.status);
        return res.json();
      })
      .then(data => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;

        // Map database model to product component contract
        const mapped = data.map((p, idx) => {
          const primaryImg = p.primary_image || (p.images?.[0]?.path) || '/products/cutout/1.png';
          const imgList = (p.images && p.images.length > 0)
            ? p.images.map(img => ({ label: img.label || 'Image', url: img.path }))
            : [{ label: 'Studio Front', url: primaryImg }];

          return {
            id: p.string_id || `amb-${p.id}`,
            dbId: p.id,
            index: p.sort_order ?? idx + 1,
            name: p.name,
            sku: p.sku || `AMB-${p.id}`,
            category: (p.category || 'backpacks').toLowerCase(),
            tagline: p.tagline || p.description || '',
            description: p.description || p.tagline || '',
            capacity: p.capacity ? `${p.capacity}L` : '',
            laptopFit: p.laptop_fit || '',
            images: imgList,
            cutoutImage: primaryImg,
            styledImage: primaryImg,
            defaultImage: primaryImg,
            minOrder: p.min_order || 50,
            leadTime: p.lead_time || '7-10 Days',
            logoPosition: p.logo_position || 'Front Center',
            isCustomizable: Boolean(p.is_customizable ?? true),
            materials: Array.isArray(p.materials) ? p.materials : ['Tactical Cordura 1000D', 'Heavy Cotton Twill', 'Matte Weatherproof Poly'],
            colorOptions: Array.isArray(p.color_options) ? p.color_options : ['Tactical Black', 'Navy Blue', 'Charcoal'],
            features: Array.isArray(p.features) ? p.features : ['Water-resistant exterior', 'Padded ergonomic straps'],
            brandingOptions: Array.isArray(p.branding_options) ? p.branding_options : ['Screen Printing', '3D Embroidery', 'Metal Badge'],
          };
        });

        setProducts(mapped);
      })
      .catch(() => {
        // Fall back gracefully to LOCAL_PRODUCTS on network error
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading };
};
