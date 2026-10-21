<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SiteSetting;
use App\Models\Category;
use App\Models\PageSection;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin User ────────────────────────────────────────────
        User::updateOrCreate(
            ['email' => 'admin@askmebag.com'],
            [
                'name' => 'ASKMEBAG Admin',
                'password' => Hash::make('Admin@2026'),
                'role' => 'super_admin',
                'is_active' => true,
            ]
        );

        // ── Site Settings (from existing config.js) ───────────────
        $settings = [
            // Contact
            ['key' => 'business_name', 'value' => 'ASKMEBAG', 'type' => 'text', 'group' => 'contact', 'label' => 'Business Name'],
            ['key' => 'whatsapp_number', 'value' => '919004408854', 'type' => 'text', 'group' => 'whatsapp', 'label' => 'WhatsApp Number'],
            ['key' => 'whatsapp_display', 'value' => '+91 90044 08854', 'type' => 'text', 'group' => 'whatsapp', 'label' => 'WhatsApp Display'],
            ['key' => 'secondary_whatsapp', 'value' => '918757601990', 'type' => 'text', 'group' => 'whatsapp', 'label' => 'Secondary WhatsApp Number'],
            ['key' => 'email', 'value' => 'askmebag@gmail.com', 'type' => 'text', 'group' => 'contact', 'label' => 'Business Email'],
            ['key' => 'phone', 'value' => '+91 90044 08854', 'type' => 'text', 'group' => 'contact', 'label' => 'Phone Number'],
            ['key' => 'secondary_phone', 'value' => '+91 87576 01990', 'type' => 'text', 'group' => 'contact', 'label' => 'Secondary Phone Number'],
            ['key' => 'address', 'value' => 'Parasnath Complex, Bldg B-13, Gala No 108, First Floor, Dapode Road, Bhiwandi, Mumbai - 421302, Maharashtra, India', 'type' => 'textarea', 'group' => 'contact', 'label' => 'Full Address'],
            ['key' => 'gst_no', 'value' => '27AEOPI4410A1ZZ', 'type' => 'text', 'group' => 'contact', 'label' => 'GST Number'],
            ['key' => 'min_order_qty', 'value' => '50', 'type' => 'number', 'group' => 'general', 'label' => 'Minimum Order Quantity'],
            ['key' => 'lead_time', 'value' => '7-10 Days', 'type' => 'text', 'group' => 'general', 'label' => 'Default Lead Time'],
            // Social
            ['key' => 'social_instagram', 'value' => '', 'type' => 'text', 'group' => 'social', 'label' => 'Instagram URL'],
            ['key' => 'social_facebook', 'value' => '', 'type' => 'text', 'group' => 'social', 'label' => 'Facebook URL'],
            ['key' => 'social_linkedin', 'value' => '', 'type' => 'text', 'group' => 'social', 'label' => 'LinkedIn URL'],
            // SEO
            ['key' => 'seo_title', 'value' => 'ASKMEBAG — Custom Bulk Bags & Corporate Gifting', 'type' => 'text', 'group' => 'seo', 'label' => 'SEO Title'],
            ['key' => 'seo_description', 'value' => 'ASKMEBAG manufactures premium customized bulk bags for corporates, events, and institutions. Custom branding, embroidery, MOQ 50 units.', 'type' => 'textarea', 'group' => 'seo', 'label' => 'Meta Description'],
            // Homepage Hero
            ['key' => 'hero_eyebrow', 'value' => 'DIRECT OEM BAG MANUFACTURER', 'type' => 'text', 'group' => 'homepage', 'label' => 'Hero Eyebrow Text'],
            ['key' => 'hero_heading', 'value' => 'Custom Bags. Built Around Your Idea.', 'type' => 'text', 'group' => 'homepage', 'label' => 'Hero Heading'],
            ['key' => 'hero_description', 'value' => 'From boardroom briefcases to field-ready duffels — fully custom, MOQ 50 units, factory-direct pricing.', 'type' => 'textarea', 'group' => 'homepage', 'label' => 'Hero Description'],
            ['key' => 'hero_cta_primary', 'value' => 'GET A BULK QUOTE', 'type' => 'text', 'group' => 'homepage', 'label' => 'Hero Primary CTA'],
            ['key' => 'hero_cta_secondary', 'value' => 'VIEW CATALOG', 'type' => 'text', 'group' => 'homepage', 'label' => 'Hero Secondary CTA'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }

        // ── Product Categories ────────────────────────────────────
        $categories = [
            ['name' => 'Backpacks', 'slug' => 'backpacks', 'display_order' => 1, 'is_active' => true],
            ['name' => 'Laptop Bags', 'slug' => 'laptop-bags', 'display_order' => 2, 'is_active' => true],
            ['name' => 'Duffels', 'slug' => 'duffels', 'display_order' => 3, 'is_active' => true],
            ['name' => 'Sling Bags', 'slug' => 'sling-bags', 'display_order' => 4, 'is_active' => true],
            ['name' => 'Tote Bags', 'slug' => 'tote-bags', 'display_order' => 5, 'is_active' => true],
            ['name' => 'Briefcases', 'slug' => 'briefcases', 'display_order' => 6, 'is_active' => true],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // ── Homepage Sections (CMS structure) ─────────────────────
        $sections = [
            [
                'page' => 'homepage',
                'section_key' => 'hero',
                'section_type' => 'hero',
                'title' => 'Custom Bags. Built Around Your Idea.',
                'subtitle' => 'DIRECT OEM BAG MANUFACTURER',
                'description' => 'From boardroom briefcases to field-ready duffels — fully custom, MOQ 50 units, factory-direct pricing.',
                'is_visible' => true,
                'sort_order' => 1,
                'content' => [
                    'chapters' => [
                        [
                            'id' => 1,
                            'num' => '01',
                            'phase' => 'RAW WEAVE CUTTING',
                            'headline' => "BUILT AROUND\nYOUR IDEA.",
                            'title' => 'Precision Pattern Geometry & Ballistic Weaves',
                            'description' => 'Every bespoke fleet commission starts with hand-calibrated pattern cutting. Industrial 1000D ballistic weaves are sliced to 0.2mm tolerance for unmatched structural integrity.',
                            'badge' => 'STAGE 01 // CORDURA® 1000D / 45° BIAS'
                        ],
                        [
                            'id' => 2,
                            'num' => '02',
                            'phase' => 'HARDWARE INTEGRATION',
                            'headline' => "HEAVY HARDWARE.\nZERO COMPROMISE.",
                            'title' => 'Reinforced Zips & Stress Anchoring',
                            'description' => 'Main luggage gussets fitted with high-gauge matte industrial zipper tracks, bar-tacked with 42-stitch stress reinforcement to withstand 15,000 continuous opening cycles.',
                            'badge' => 'STAGE 02 // INDUSTRIAL NO. 8 SBS HARDWARE'
                        ],
                        [
                            'id' => 3,
                            'num' => '03',
                            'phase' => 'BRAND EMBLEM ALIGNMENT',
                            'headline' => "YOUR EMBLEM.\nFLAWLESSLY CRAFTED.",
                            'title' => 'Bespoke Corporate Insignia Debossing',
                            'description' => 'Watch the atelier production floor personalize each unit with corporate identity. Debossed badges, dual logo placements, and pantone-matched embroidery created for modern enterprise teams.',
                            'badge' => 'STAGE 03 // PMS COLOR EMBLEM & DEBOSS'
                        ],
                        [
                            'id' => 4,
                            'num' => '04',
                            'phase' => 'ATELIER PRESENTATION',
                            'headline' => "EXECUTIVE TIER\nGIFT PRESENTATION.",
                            'title' => 'Custom VIP Onboarding Kitting',
                            'description' => 'Bespoke bags nestled inside rigid presentation packaging, paired with matching debossed leather executive journals and weighted aluminum writing instruments for immediate gifting.',
                            'badge' => 'STAGE 04 // 680G RIGID GIFT PRESENTATION'
                        ],
                        [
                            'id' => 5,
                            'num' => '05',
                            'phase' => 'ENTERPRISE PALLETIZATION',
                            'headline' => "FLEET SCALE.\nGLOBAL DISPATCH.",
                            'title' => 'Volume Deployment & QC Verification',
                            'description' => 'Mass scale completed fleet units stacked and sealed for international corporate deployment. Full inventory tracking, batch QC audit certificates, and direct desk delivery.',
                            'badge' => 'STAGE 05 // MOQ 50 UNITS • GLOBAL FREIGHT'
                        ]
                    ]
                ]
            ],
            ['page' => 'homepage', 'section_key' => 'bags', 'section_type' => 'product_carousel', 'title' => 'Different Needs. Same Quality.', 'subtitle' => 'OUR MANUFACTURED BAGS', 'description' => 'Explore our 47-model production catalog', 'is_visible' => true, 'sort_order' => 2],
            ['page' => 'homepage', 'section_key' => 'customization', 'section_type' => 'feature_cards', 'title' => 'Every Detail. Your Brand.', 'subtitle' => 'CUSTOMIZATION', 'description' => 'Full customization on materials, colors, branding, and hardware.', 'is_visible' => true, 'sort_order' => 3],
            ['page' => 'homepage', 'section_key' => 'industries', 'section_type' => 'grid', 'title' => 'Built for Every Industry', 'subtitle' => 'INDUSTRIES WE SERVE', 'description' => 'Corporate, events, logistics, military, hospitality, and more.', 'is_visible' => true, 'sort_order' => 4],
            ['page' => 'homepage', 'section_key' => 'process', 'section_type' => 'timeline', 'title' => 'From Idea to Fleet', 'subtitle' => 'OUR PROCESS', 'description' => 'A simple 4-step process from inquiry to delivery.', 'is_visible' => true, 'sort_order' => 5],
            ['page' => 'homepage', 'section_key' => 'portfolio', 'section_type' => 'portfolio', 'title' => 'Made for Brands, Teams & Institutions.', 'subtitle' => 'CLIENT ARCHIVE', 'description' => 'Direct OEM production runs engineered to exact corporate specs.', 'is_visible' => true, 'sort_order' => 6],
            ['page' => 'homepage', 'section_key' => 'comfort', 'section_type' => 'banner', 'title' => 'Engineered for Comfort. Designed for Style.', 'subtitle' => '', 'description' => '', 'is_visible' => true, 'sort_order' => 7],
            ['page' => 'homepage', 'section_key' => 'testimonials', 'section_type' => 'testimonials', 'title' => 'Reliability at Scale.', 'subtitle' => 'THE VERDICT', 'description' => '', 'is_visible' => true, 'sort_order' => 8],
            ['page' => 'homepage', 'section_key' => 'scale', 'section_type' => 'stats', 'title' => 'Scale Built In', 'subtitle' => 'WHY ASKMEBAG', 'description' => '', 'is_visible' => true, 'sort_order' => 9, 'content' => json_encode([
                ['label' => 'Corporate Clients', 'value' => '500+'],
                ['label' => 'Bags Delivered', 'value' => '1M+'],
                ['label' => 'Years Experience', 'value' => '15+'],
                ['label' => 'Production Models', 'value' => '47'],
            ])],
            ['page' => 'homepage', 'section_key' => 'tiers', 'section_type' => 'pricing_tiers', 'title' => 'Volume Pricing Tiers', 'subtitle' => 'BULK ORDER TIERS', 'description' => '', 'is_visible' => true, 'sort_order' => 10],
            ['page' => 'homepage', 'section_key' => 'instagram', 'section_type' => 'gallery', 'title' => 'Inside the Production Fleet.', 'subtitle' => 'ATELIER SOCIAL // @ASKMEBAG', 'description' => 'Follow our daily production runs, material tests, and bespoke fleet deliveries.', 'is_visible' => true, 'sort_order' => 11],
            ['page' => 'homepage', 'section_key' => 'cta', 'section_type' => 'cta', 'title' => 'Ready to Engineer Custom Carry?', 'subtitle' => 'GET STARTED', 'description' => 'Physical sampling and single prototypes to volume fleet manufacturing.', 'is_visible' => true, 'sort_order' => 12],
        ];

        foreach ($sections as $section) {
            PageSection::updateOrCreate(['section_key' => $section['section_key']], $section);
        }

        // Seed products from products.json
        $this->call(ProductSeeder::class);
    }
}
