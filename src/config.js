// ASKMEBAG Central Configuration
export const COMPANY_CONFIG = {
  name: 'ASKMEBAG',
  tradeName: 'ASKMEBAG',
  gstNo: '27AEOPI4410A1ZZ',
  tagline: 'CUSTOM BAGS. BUILT AROUND YOUR IDEA.',
  // Official WhatsApp Business Number for direct order taking (+91 90044 08854)
  whatsappNumber: '919004408854',
  whatsappDisplay: '+91 90044 08854',
  email: 'askmebag@gmail.com',
  address: 'Parasnath Complex, Bldg B-13, Gala No 108, First Floor, Dapode Road, Bhiwandi, Mumbai - 421302, Maharashtra, India',
  shortAddress: 'Bhiwandi, Mumbai - 421302, India',
  location: 'Bhiwandi, Mumbai, India',
  leadTimeDefault: '2-3 Weeks',
  minOrderDefault: 50,
};

/**
 * Builds a direct WhatsApp chat link with an encoded pre-filled message
 */
export const buildWhatsAppUrl = (message, number = COMPANY_CONFIG.whatsappNumber) => {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};

/**
 * Generates an inquiry message for custom product ordering
 */
export const generateProductOrderMessage = ({
  productName,
  sku,
  quantity = 50,
  color = 'Custom Brand Palette / Pantone',
  material = 'Tactical Cordura 1000D',
  brandingMethod = '3D Embroidery / High-Density Print',
  logoPlacement = 'Front Center',
  hasCustomLogo = false,
  companyName = '',
  notes = '',
}) => {
  return [
    `*ASKMEBAG ORDER / CUSTOMIZATION INQUIRY*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📦 *Product:* ${productName} (SKU: ${sku})`,
    `🔢 *Quantity Required:* ${quantity} units`,
    `🎨 *Selected Color/Trim:* ${color}`,
    `🧵 *Fabric Material:* ${material}`,
    `🏷️ *Branding Method:* ${brandingMethod}`,
    `📍 *Logo Placement:* ${logoPlacement}`,
    companyName ? `🏢 *Brand / Company:* ${companyName}` : null,
    hasCustomLogo ? `📎 *Logo File:* Ready to share in this chat` : null,
    notes ? `📝 *Special Requirements:* ${notes}` : null,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `Please share pricing, production timeline, and sample prototyping options.`
  ].filter(Boolean).join('\n');
};

/**
 * Generates a bulk quote inquiry message
 */
export const generateBulkQuoteMessage = (productName, sku, quantity = 250) => {
  return [
    `*ASKMEBAG BULK ORDER INQUIRY*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `Hello ASKMEBAG team,`,
    `I would like a customized bulk quotation for:`,
    `• *Product:* ${productName} (${sku})`,
    `• *Estimated Volume:* ${quantity}+ units`,
    `• *Target Delivery:* 3-4 weeks`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `Could you please share your volume tiered pricing and digital mockup guidance?`
  ].join('\n');
};

/**
 * Generates a general quick inquiry message
 */
export const generateQuickInquiryMessage = (subject = 'Product Catalog Inquiry') => {
  return `Hello ASKMEBAG team, I'm reviewing your product catalogue on your website and would like to ask a few questions regarding ${subject}.`;
};
