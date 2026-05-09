import { Recipe, PantryItem } from './types';

export const RECIPES: Recipe[] = [
  {
    id: 'salmon-bowl',
    title: 'Spicy Citrus Salmon Bowl',
    description: 'A lush, vibrant professional food photograph of a fresh salmon salad bowl with avocado and citrus. The lighting is bright and airy, reflecting a high-end gourmet kitchen aesthetic.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_I5-OxAqO8ogH-WMTUKlrpSAxHYH9WL7pZcCPhdSQR6XyPsxPX0QP2qdkhiExRQ0DojE03jf3uXsyoAJJrE8qihGlMd-YPGpJLMBR6ay6WOPkpJ_mcaSmBEV2soTERE2D9U05eRDbyYO0r1xfEFgkljBQSg-hW0aBWpYxQCJu_d1JD49MVHjQ5zKA7-4EKG-uC4RoWRjbs0kq5CF2G4loC36zkhCO_MYfqinoykZRrq3296iDoHE5LgsGSh0jpLADpbgJSeQBmTA',
    time: '15 MINS',
    calories: '520 KCAL',
    level: 'Intermediate',
    tags: ['HEALTHY', 'CITRUS'],
    trending: true,
    youtubeVideoId: '4jX6gR4V8Ao',
    ingredients: [
      { id: '1', name: 'Fresh Salmon fillet', amount: '200g', amountImperial: '7 oz', category: 'Meat', inStock: false },
      { id: '2', name: 'Ripe Avocado', amount: '1/2', amountImperial: '1/2', category: 'Produce', inStock: true },
      { id: '3', name: 'Brown Rice', amount: '200g', amountImperial: '1 cup', category: 'Pantry', inStock: true },
    ],
    steps: [
      { id: 1, title: 'Prepare the Salmon', description: 'Season with salt, pepper, and citrus juice.', timestamp: '0:45' },
    ]
  },
  {
    id: 'risotto',
    title: 'Saffron Infused Sage Butter Risotto',
    description: 'A masterful blend of aromatic saffron and crispy sage leaves, folded into a creamy Arborio base. Perfectly balanced for a sophisticated weeknight dinner.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCESQqkJMnIDd7trdU8tO0J896kgavnPeJZcKtULdGk0GAfoUJE2TwNXf1xNCiFC9F4b4-JTL893PfZE0Cc72xEQhOy-mJWeq2YPbWI03719CqpSOwKzuKnJ-1ztzMW8_C6mAwr-xuu5iWHXiPmhqRsxkVGLxScAwg6azu8PQ-ToOaLqt0H_ESgVJ7LgwQEXJB0boZbMnGE9wTpTRP9D3bzqV7YSIwPHyvw9bty9X1bCWAHKFfMibYzlEv_ti8uXWvP61czzL0sh6A',
    time: '45m',
    calories: '420',
    level: 'Intermediate',
    tags: ['HEALTHY', 'MEDITERRANEAN'],
    featured: true,
    youtubeVideoId: 'xnbnXgSQnnU',
    ingredients: [
      { id: '101', name: 'Arborio Rice', amount: '300g', amountImperial: '1 1/2 cups', category: 'Pantry', inStock: true },
      { id: '102', name: 'Saffron Threads', amount: '0.5g', amountImperial: 'pinch', category: 'Pantry', inStock: false },
      { id: '103', name: 'Organic Vegetable Broth', amount: '1L', amountImperial: '4 cups', category: 'Pantry', inStock: false },
      { id: '104', name: 'Fresh Sage Leaves', amount: '12 leaves', amountImperial: '12 leaves', category: 'Produce', inStock: false },
      { id: '105', name: 'Unsalted Butter', amount: '50g', amountImperial: '3 1/2 tbsp', category: 'Dairy', inStock: true },
      { id: '106', name: 'Grated Parmesan', amount: '60g', amountImperial: '1/2 cup', category: 'Dairy', inStock: true },
    ],
    steps: [
      { id: 1, title: 'Infuse the Saffron', description: 'Lightly toast the saffron threads in a small pan, then crumble them into 100ml of warm broth. Let it steep for at least 10 minutes to release the deep golden color.', timestamp: '0:45', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChoxnjV3xKSRO9Rkq9tRGA5bj8OAlbMFjaAwILIeaexV-kSLGso5Xgr8sjN4HaY20EIHujLyFNULR_T1UoLItj_lY2gLLvPEhgmqq4TQBRFEisqXjMzKPf-EprfoT0qpNC31vayhla1R1XfBZPAK0r_8Bts70sz9uLkhyadggxFi4wZXF8h1Un0uPDtydb7A0ExgP24bydc1Mq-ufIo42uBaM9_gpkSJuUPhY7onWxDWcyhp0fPfRHyw77NsNMF_BkSRRRKfqLgGg' },
      { id: 2, title: 'Toast the Rice', description: 'Melt half the butter in a wide pan. Add the rice and stir constantly until the edges become translucent and the rice smells slightly nutty.', timestamp: '2:15' },
      { id: 3, title: 'The Slow Stir', description: 'Begin adding warm broth one ladle at a time, stirring continuously. Wait until the liquid is fully absorbed before adding the next ladle.', timestamp: '5:30' },
      { id: 4, title: 'Browned Butter & Sage', description: 'Melt the butter in a large skillet over medium heat. Once it foams, add sage. Cook until butter is golden nutty brown and smells toasted.', timestamp: '8:45' },
    ]
  },
  {
    id: 'power-bowl',
    title: 'Mediterranean Power Bowl',
    description: 'A top-down view of a colorful mediterranean power bowl with hummus, olives, and fresh greens.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk8q-nMCipL0UQHye5a4-2iJEVmu8-8yfads9UBPdUznKZwfUHpbvQ9NM4s1FepMulJ8c7RPSNoh_vIP-oB69FZ4QDHh3E9BWY_-CBpxUteAdPZrfvnNK5ELUAoM9yBPngMJ4miQnzzhuyoKPqIFNR7OH_nKo-kK70R54gh8KBF_LoJJYq2PWpHmp4Avs6G6axCcyXk61kBEnTquSY46fV8UhHQ4H8FlOnXWEo1a3kfGJm3fDc3BuSSCV0iPA1VKcqbYCVIROjAz4',
    time: '10 MINS',
    calories: '450 KCAL',
    level: 'Easy',
    tags: ['QUICK', 'VEGGIE'],
    youtubeVideoId: 'O2wz9OpsQu8',
    ingredients: [
      { id: '201', name: 'Hummus', amount: '100g', amountImperial: '1/2 cup', category: 'Pantry', inStock: true },
      { id: '202', name: 'Kalamata Olives', amount: '50g', amountImperial: '1/4 cup', category: 'Pantry', inStock: true },
      { id: '203', name: 'Cherry Tomatoes', amount: '100g', amountImperial: '3 1/2 oz', category: 'Produce', inStock: false },
    ],
    steps: [
      { id: 1, title: 'Assemble base', description: 'Add greens, hummus and olives to a bowl.', timestamp: '0:30' }
    ]
  },
  {
    id: 'sourdough-pizza',
    title: 'Perfect Sourdough Crust',
    description: 'A slice of gourmet wood-fired pizza with melted mozzarella and fresh basil leaves.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEGL955-Wypglv8LaqAyFmd2FXnqtjbVdJJlmPG2Gw6mTUnqMNQgn9H-JsIDZ5ZSS7oze3p2KBdMTzQW-BnbrtpFcivJ1KTEltslOYDrxkxwnQHtWOWl5QBpH_S_xPwfjJl8eTSTkMEJUu5HcGwav1rVmaasq28tDESTcmaMsFImjvBBzzI_EdyjwkKmXEyVMx_AEFNJfyU5VwreOukWAMAOV2UScQ-1u_T45B0F4ahr1LglrB8vXfrfjKpz64cUm66YMc5-I1qvA',
    time: '25 MINS',
    calories: '600 KCAL',
    level: 'Hard',
    tags: ['BAKING', 'ARTISAN'],
    youtubeVideoId: 'atRoikyphAA',
    ingredients: [
      { id: '301', name: 'Sourdough Starter', amount: '100g', amountImperial: '1/2 cup', category: 'Pantry', inStock: true },
      { id: '302', name: 'Bread Flour', amount: '500g', amountImperial: '4 cups', category: 'Pantry', inStock: true },
      { id: '303', name: 'Fresh Basil', amount: '1 bunch', amountImperial: '1 bunch', category: 'Produce', inStock: false },
    ],
    steps: [
      { id: 1, title: 'Knead dough', description: 'Mix flour and water, then add starter.', timestamp: '1:00' }
    ]
  }
];

export const PANTRY_ITEMS: PantryItem[] = [
  { id: 'p1', name: 'Salt', category: 'Mineral • Sea Salt', level: 'Full', quantity: 500, unit: 'g', icon: 'salt', active: true },
  { id: 'p2', name: 'Olive Oil', category: 'Fats • Extra Virgin', level: 'Half', quantity: 250, unit: 'ml', icon: 'oil', active: true },
  { id: 'p3', name: 'Flour', category: 'Grain • All-Purpose', level: 'Low', quantity: 50, unit: 'g', icon: 'flour', active: true },
  { id: 'p4', name: 'Garlic', category: 'Produce • Bulbs', level: 'Low', quantity: 1, unit: 'unit', icon: 'garlic', active: false },
];
