// Element definitions, default styling tokens, and pre-built templates for the Visual Page Builder

export const ELEMENT_CATEGORIES = [
  { id: 'layout', name: 'Layout & Structure' },
  { id: 'typography', name: 'Text & Typography' },
  { id: 'media', name: 'Media & Visuals' },
  { id: 'commerce', name: 'E-Commerce & Sales' },
  { id: 'social', name: 'Social Proof & Trust' },
];

export const ELEMENT_DEFINITIONS = {
  // ==========================================
  // LAYOUT
  // ==========================================
  section: {
    type: 'section',
    name: 'Section',
    category: 'layout',
    icon: 'Layers',
    isContainer: true,
    description: 'Full-width section wrapper for organizing page content',
    defaultProps: {},
    defaultStyles: {
      backgroundColor: '#ffffff',
      paddingTop: '48px',
      paddingBottom: '48px',
      paddingLeft: '24px',
      paddingRight: '24px',
      marginTop: '0px',
      marginBottom: '0px',
    },
  },
  container: {
    type: 'container',
    name: 'Container Box',
    category: 'layout',
    icon: 'Box',
    isContainer: true,
    description: 'Boxed container with max-width and flex alignment',
    defaultProps: {},
    defaultStyles: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: 'transparent',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      alignItems: 'stretch',
    },
  },
  columns_2: {
    type: 'columns_2',
    name: '2 Columns (50/50)',
    category: 'layout',
    icon: 'Columns2',
    isContainer: true,
    description: 'Side-by-side two-column responsive layout',
    defaultProps: {},
    defaultStyles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      padding: '16px 0',
      alignItems: 'center',
    },
  },
  columns_3: {
    type: 'columns_3',
    name: '3 Columns (33/33/33)',
    category: 'layout',
    icon: 'Columns3',
    isContainer: true,
    description: 'Three-column responsive grid layout',
    defaultProps: {},
    defaultStyles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '24px',
      padding: '16px 0',
    },
  },
  divider: {
    type: 'divider',
    name: 'Divider Line',
    category: 'layout',
    icon: 'Minus',
    description: 'Subtle separator line between blocks',
    defaultProps: {
      width: '100%',
      thickness: '1px',
    },
    defaultStyles: {
      borderColor: '#e2e8f0',
      borderStyle: 'solid',
      margin: '24px 0',
    },
  },
  spacer: {
    type: 'spacer',
    name: 'Spacer',
    category: 'layout',
    icon: 'MoveVertical',
    description: 'Adjustable vertical blank space',
    defaultProps: {
      height: '40px',
    },
    defaultStyles: {
      height: '40px',
    },
  },

  // ==========================================
  // TYPOGRAPHY
  // ==========================================
  heading: {
    type: 'heading',
    name: 'Heading',
    category: 'typography',
    icon: 'Heading',
    description: 'Title header (H1, H2, H3)',
    defaultProps: {
      tag: 'h2',
      text: 'Design Your Signature Footwear',
    },
    defaultStyles: {
      color: '#0f172a',
      fontSize: '36px',
      fontWeight: '800',
      textAlign: 'left',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      margin: '0 0 12px 0',
    },
  },
  paragraph: {
    type: 'paragraph',
    name: 'Text / Paragraph',
    category: 'typography',
    icon: 'AlignLeft',
    description: 'Multi-line body text with customizable typography',
    defaultProps: {
      text: 'Engineered with aerodynamic comfort, lightweight precision soles, and breathable premium fabrics tailored for the modern trendsetter.',
    },
    defaultStyles: {
      color: '#64748b',
      fontSize: '16px',
      fontWeight: '400',
      textAlign: 'left',
      lineHeight: '1.6',
      margin: '0 0 16px 0',
    },
  },
  badge: {
    type: 'badge',
    name: 'Pill Badge',
    category: 'typography',
    icon: 'Sparkles',
    description: 'Eye-catching highlighted tag or announcement',
    defaultProps: {
      text: '★ NEW EXCLUSIVE DROP 2026',
    },
    defaultStyles: {
      backgroundColor: '#f1f5f9',
      color: '#4f46e5',
      fontSize: '12px',
      fontWeight: '700',
      padding: '6px 14px',
      borderRadius: '9999px',
      display: 'inline-block',
      border: '1px solid #e2e8f0',
      letterSpacing: '0.05em',
    },
  },

  // ==========================================
  // MEDIA
  // ==========================================
  image: {
    type: 'image',
    name: 'Image Box',
    category: 'media',
    icon: 'Image',
    description: 'High-res image with aspect ratio and rounded styling',
    defaultProps: {
      src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80',
      alt: 'Premium Red Performance Sneaker',
      aspectRatio: '16/9',
      fit: 'cover',
    },
    defaultStyles: {
      width: '100%',
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
  },
  video: {
    type: 'video',
    name: 'Video Player',
    category: 'media',
    icon: 'Video',
    description: 'Embedded video or YouTube player',
    defaultProps: {
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Showcase Video',
    },
    defaultStyles: {
      width: '100%',
      aspectRatio: '16/9',
      borderRadius: '16px',
      overflow: 'hidden',
    },
  },

  // ==========================================
  // COMMERCE & CONVERSION
  // ==========================================
  button: {
    type: 'button',
    name: 'Action Button',
    category: 'commerce',
    icon: 'MousePointerClick',
    description: 'Clickable call-to-action button with custom link',
    defaultProps: {
      text: 'Shop Collection Now',
      link: '/products',
      variant: 'solid',
    },
    defaultStyles: {
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      fontSize: '15px',
      fontWeight: '600',
      padding: '14px 28px',
      borderRadius: '12px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.35)',
      border: 'none',
      textAlign: 'center',
    },
  },
  product_card: {
    type: 'product_card',
    name: 'Shoe Product Card',
    category: 'commerce',
    icon: 'ShoppingBag',
    description: 'Showcase a featured shoe with price, badge, and CTA',
    defaultProps: {
      title: 'Shoezy Air Elite Neo',
      subtitle: 'Ultralight Responsive Cushioned Sole',
      price: '$149.00',
      originalPrice: '$199.00',
      discountBadge: '25% OFF',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
      buttonText: 'View Details',
      buttonLink: '/products',
    },
    defaultStyles: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
      maxWidth: '380px',
    },
  },
  countdown: {
    type: 'countdown',
    name: 'Countdown Timer',
    category: 'commerce',
    icon: 'Clock',
    description: 'Urgency countdown timer for flash sales and drops',
    defaultProps: {
      title: 'Limited Time Flash Drop Ends In:',
      targetHours: 48,
    },
    defaultStyles: {
      backgroundColor: '#0f172a',
      color: '#ffffff',
      padding: '24px',
      borderRadius: '20px',
      textAlign: 'center',
    },
  },
  discount_banner: {
    type: 'discount_banner',
    name: 'Discount Offer Strip',
    category: 'commerce',
    icon: 'Percent',
    description: 'Gradient announcement banner with bold headline and button',
    defaultProps: {
      badge: 'SEASON SPECIAL',
      headline: 'Get Flat 30% Off On All Running Shoes',
      subhead: 'Use promo code SHOEZY30 at checkout. Valid till midnight.',
      buttonText: 'Claim Offer',
      buttonLink: '/products',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=80',
    },
    defaultStyles: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      color: '#ffffff',
      padding: '40px',
      borderRadius: '24px',
      boxShadow: '0 10px 30px -10px rgba(79, 70, 229, 0.4)',
    },
  },

  // ==========================================
  // SOCIAL PROOF & TRUST
  // ==========================================
  testimonial: {
    type: 'testimonial',
    name: 'Testimonial Card',
    category: 'social',
    icon: 'MessageSquareQuote',
    description: 'Customer quote, reviewer photo, and verified star rating',
    defaultProps: {
      quote: '“The cushioning and arch support in these shoes completely transformed my daily runs. Incredible craftsmanship and lightning fast shipping!”',
      author: 'Alex Morgan',
      role: 'Marathon Athlete & Trainer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
    },
    defaultStyles: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '28px',
      color: '#1e293b',
    },
  },
  features_badges: {
    type: 'features_badges',
    name: 'Trust & Perks Badges',
    category: 'social',
    icon: 'ShieldCheck',
    description: '4-item trust guarantee row (Free Shipping, Returns, Authentic, 24/7)',
    defaultProps: {
      items: [
        { title: 'Free Global Express', subtitle: 'Orders over $120' },
        { title: '30-Day Easy Returns', subtitle: 'Zero hassle guarantee' },
        { title: '100% Authentic Quality', subtitle: 'Handcrafted precision' },
        { title: 'Dedicated 24/7 Support', subtitle: 'Always here to help' },
      ],
    },
    defaultStyles: {
      backgroundColor: '#ffffff',
      border: '1px solid #f1f5f9',
      borderRadius: '16px',
      padding: '20px 24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
    },
  },
  faq_accordion: {
    type: 'faq_accordion',
    name: 'FAQ Accordion',
    category: 'social',
    icon: 'HelpCircle',
    description: 'Collapsible frequently asked questions list',
    defaultProps: {
      faqs: [
        { q: 'How do I choose the right shoe size?', a: 'Our shoes follow standard true-to-size EU/US measurements. Check our interactive size guide for millimeter accuracy.' },
        { q: 'What is your return policy?', a: 'We offer an unconditional 30-day money-back guarantee with complimentary return shipping labels.' },
        { q: 'Are these suitable for marathon running?', a: 'Yes! Our Elite Neo series is specifically tested and rated for distances up to 42km.' },
      ],
    },
    defaultStyles: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '16px',
    },
  },
};

// ==========================================
// PRE-BUILT TEMPLATES
// ==========================================
export const PREBUILT_TEMPLATES = [
  {
    id: 'sneaker_drop',
    name: 'Sneaker Drop Launch Landing',
    description: 'High conversion launch page with countdown timer, 2-column feature, and product card',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
    content: [
      {
        id: 'sec_1',
        type: 'section',
        styles: { backgroundColor: '#090d16', paddingTop: '60px', paddingBottom: '60px', paddingLeft: '24px', paddingRight: '24px' },
        children: [
          {
            id: 'c_hero',
            type: 'container',
            styles: { maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' },
            children: [
              {
                id: 'b_1',
                type: 'badge',
                props: { text: '⚡ LIMITED RELEASE • 500 PAIRS WORLDWIDE' },
                styles: { backgroundColor: '#1e1b4b', color: '#818cf8', fontSize: '13px', fontWeight: '700', padding: '8px 18px', borderRadius: '9999px', border: '1px solid #3730a3' },
              },
              {
                id: 'h_1',
                type: 'heading',
                props: { tag: 'h1', text: 'The Future of Motion: Shoezy Velocity Pro' },
                styles: { color: '#ffffff', fontSize: '48px', fontWeight: '900', textAlign: 'center', letterSpacing: '-0.03em', margin: '0' },
              },
              {
                id: 'p_1',
                type: 'paragraph',
                props: { text: 'Crafted with aerospace-grade carbon fiber plating and dual-density foam. Experience frictionless energy return with every stride.' },
                styles: { color: '#94a3b8', fontSize: '18px', textAlign: 'center', maxWidth: '700px', margin: '0' },
              },
              {
                id: 'cnt_1',
                type: 'countdown',
                props: { title: 'GLOBAL DROP CLOSES IN:', targetHours: 36 },
                styles: { backgroundColor: '#1e293b', color: '#ffffff', padding: '20px 32px', borderRadius: '20px', margin: '10px 0', border: '1px solid #334155' },
              },
              {
                id: 'btn_1',
                type: 'button',
                props: { text: 'Reserve Your Pair Now ($189)', link: '/products' },
                styles: { backgroundColor: '#6366f1', color: '#ffffff', fontSize: '16px', fontWeight: '700', padding: '16px 36px', borderRadius: '14px', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' },
              },
              {
                id: 'img_1',
                type: 'image',
                props: { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80', alt: 'Shoezy Velocity Pro' },
                styles: { width: '100%', maxWidth: '900px', borderRadius: '24px', marginTop: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
              },
            ],
          },
        ],
      },
      {
        id: 'sec_2',
        type: 'section',
        styles: { backgroundColor: '#ffffff', paddingTop: '64px', paddingBottom: '64px', paddingLeft: '24px', paddingRight: '24px' },
        children: [
          {
            id: 'c_features',
            type: 'container',
            styles: { maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' },
            children: [
              {
                id: 'fb_1',
                type: 'features_badges',
                props: {
                  items: [
                    { title: 'Free Worldwide Delivery', subtitle: 'Express DHL tracking' },
                    { title: 'Carbon Plate Certified', subtitle: 'Tested for marathon racing' },
                    { title: '30-Day Fit Guarantee', subtitle: 'Free exchanges if tight' },
                    { title: 'Exclusive Collector Box', subtitle: 'Numbered verification tag' },
                  ],
                },
                styles: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' },
              },
              {
                id: 'col_2',
                type: 'columns_2',
                styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center', marginTop: '20px' },
                children: [
                  {
                    id: 'img_detail',
                    type: 'image',
                    props: { src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80', alt: 'Sole Detail' },
                    styles: { width: '100%', borderRadius: '20px', boxShadow: '0 15px 30px -5px rgba(0,0,0,0.1)' },
                  },
                  {
                    id: 'c_text',
                    type: 'container',
                    styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
                    children: [
                      {
                        id: 'h_tech',
                        type: 'heading',
                        props: { tag: 'h3', text: 'Dual-Core Cushioning Meets Precision Grip' },
                        styles: { color: '#0f172a', fontSize: '32px', fontWeight: '800', margin: '0' },
                      },
                      {
                        id: 'p_tech',
                        type: 'paragraph',
                        props: { text: 'Our proprietary honeycomb outsole structure channels shock away from joints, enabling longer endurance with zero foot fatigue. Perfect for road running or all-day streetwear.' },
                        styles: { color: '#64748b', fontSize: '16px', lineHeight: '1.7', margin: '0' },
                      },
                      {
                        id: 'btn_tech',
                        type: 'button',
                        props: { text: 'Explore All Tech Specs →', link: '/products' },
                        styles: { backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px', fontWeight: '600', padding: '12px 24px', borderRadius: '10px' },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'flash_sale',
    name: 'Flash Sale & Promo Discount Page',
    description: 'Vibrant promotional page with discount banners, shoe cards, and FAQs',
    thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&auto=format&fit=crop&q=80',
    content: [
      {
        id: 'sec_sale_hero',
        type: 'section',
        styles: { backgroundColor: '#f8fafc', paddingTop: '48px', paddingBottom: '48px', paddingLeft: '24px', paddingRight: '24px' },
        children: [
          {
            id: 'c_sale',
            type: 'container',
            styles: { maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' },
            children: [
              {
                id: 'disc_strip',
                type: 'discount_banner',
                props: {
                  badge: 'MID-SEASON CLEARANCE',
                  headline: 'UP TO 50% OFF TOP PERFORMANCE SNEAKERS',
                  subhead: 'Limited stock remaining. Use discount code FLASH50 at checkout.',
                  buttonText: 'Claim 50% Discount',
                  buttonLink: '/products',
                  image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
                },
                styles: { background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: '#ffffff', padding: '48px', borderRadius: '24px' },
              },
              {
                id: 'col_cards',
                type: 'columns_3',
                styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' },
                children: [
                  {
                    id: 'card_1',
                    type: 'product_card',
                    props: {
                      title: 'Shoezy Retro Runner 90',
                      subtitle: 'Vintage silhouette with modern foam',
                      price: '$89.00',
                      originalPrice: '$160.00',
                      discountBadge: '45% OFF',
                      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=80',
                      buttonText: 'Buy Now',
                      buttonLink: '/products',
                    },
                    styles: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px' },
                  },
                  {
                    id: 'card_2',
                    type: 'product_card',
                    props: {
                      title: 'Shoezy Aero Glide',
                      subtitle: 'Super-cushioned city sneaker',
                      price: '$99.00',
                      originalPrice: '$180.00',
                      discountBadge: '45% OFF',
                      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=80',
                      buttonText: 'Buy Now',
                      buttonLink: '/products',
                    },
                    styles: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px' },
                  },
                  {
                    id: 'card_3',
                    type: 'product_card',
                    props: {
                      title: 'Shoezy Trail Blazer X',
                      subtitle: 'Waterproof all-terrain grip',
                      price: '$110.00',
                      originalPrice: '$210.00',
                      discountBadge: '48% OFF',
                      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
                      buttonText: 'Buy Now',
                      buttonLink: '/products',
                    },
                    styles: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px' },
                  },
                ],
              },
              {
                id: 't_review',
                type: 'testimonial',
                props: {
                  quote: '“Grabbed two pairs during the last flash sale. The comfort is second to none, and they arrived in Dhaka within 48 hours!”',
                  author: 'Tanvir Hossain',
                  role: 'Sneakerhead & Runner',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                  rating: 5,
                },
                styles: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px' },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'brand_story',
    name: 'Brand Story & Artisan Heritage',
    description: 'Clean editorial story page with brand ethos, high-res photography, and FAQs',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=80',
    content: [
      {
        id: 'sec_about_1',
        type: 'section',
        styles: { backgroundColor: '#ffffff', paddingTop: '64px', paddingBottom: '64px', paddingLeft: '24px', paddingRight: '24px' },
        children: [
          {
            id: 'c_about',
            type: 'container',
            styles: { maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' },
            children: [
              {
                id: 'b_about',
                type: 'badge',
                props: { text: 'OUR CRAFT & PHILOSOPHY' },
                styles: { backgroundColor: '#ecfdf5', color: '#059669', fontSize: '12px', fontWeight: '700', padding: '6px 16px', borderRadius: '9999px', border: '1px solid #a7f3d0' },
              },
              {
                id: 'h_about',
                type: 'heading',
                props: { tag: 'h1', text: 'Footwear Handcrafted for Perfection' },
                styles: { color: '#0f172a', fontSize: '42px', fontWeight: '900', textAlign: 'center', margin: '0' },
              },
              {
                id: 'p_about',
                type: 'paragraph',
                props: { text: 'At Shoezy, we believe that shoes are more than just footwear—they are an extension of your lifestyle, ambition, and daily movement.' },
                styles: { color: '#475569', fontSize: '18px', textAlign: 'center', lineHeight: '1.7', margin: '0' },
              },
              {
                id: 'img_story',
                type: 'image',
                props: { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80', alt: 'Shoezy Workshop' },
                styles: { width: '100%', borderRadius: '24px', marginTop: '20px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' },
              },
              {
                id: 'faq_block',
                type: 'faq_accordion',
                props: {
                  faqs: [
                    { q: 'Where are Shoezy products manufactured?', a: 'Every pair is crafted in small artisan batches using sustainable vegan and genuine top-grain leathers with zero toxic adhesives.' },
                    { q: 'How do you ensure fair labor standards?', a: 'We pay 2.5x the regional minimum wage with healthcare and educational subsidies for all artisan families.' },
                    { q: 'What is your carbon offset commitment?', a: 'For every pair shipped, we plant 2 mangrove trees in the coastal Sundarbans to offset our transit footprint.' },
                  ],
                },
                styles: { width: '100%', backgroundColor: '#f8fafc', borderRadius: '20px', padding: '24px', marginTop: '30px' },
              },
            ],
          },
        ],
      },
    ],
  },
];
