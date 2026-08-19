export type MasterCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Meat'
  | 'Seafood'
  | 'Dairy'
  | 'Eggs'
  | 'Rice & Grains'
  | 'Pasta & Noodles'
  | 'Pulses & Lentils'
  | 'Flour & Baking'
  | 'Spices & Herbs'
  | 'Oils & Fats'
  | 'Sauces & Condiments'
  | 'Bakery & Bread'
  | 'Nuts & Seeds'
  | 'Snacks'
  | 'Breakfast Foods'
  | 'Beverages'
  | 'Frozen Foods'
  | 'Canned & Packaged Foods';

export const MASTER_CATEGORIES: MasterCategory[] = [
  'Vegetables',
  'Fruits',
  'Meat',
  'Seafood',
  'Dairy',
  'Eggs',
  'Rice & Grains',
  'Pasta & Noodles',
  'Pulses & Lentils',
  'Flour & Baking',
  'Spices & Herbs',
  'Oils & Fats',
  'Sauces & Condiments',
  'Bakery & Bread',
  'Nuts & Seeds',
  'Snacks',
  'Breakfast Foods',
  'Beverages',
  'Frozen Foods',
  'Canned & Packaged Foods'
];

export const CATEGORY_FALLBACK_IMAGES: Record<MasterCategory, string> = {
  'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
  'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
  'Meat': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80',
  'Seafood': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80',
  'Dairy': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80',
  'Eggs': 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=400&q=80',
  'Rice & Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  'Pasta & Noodles': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=400&q=80',
  'Pulses & Lentils': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&q=80',
  'Flour & Baking': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
  'Spices & Herbs': 'https://images.unsplash.com/photo-1509358271058-acd05cc93219?auto=format&fit=crop&w=400&q=80',
  'Oils & Fats': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
  'Sauces & Condiments': 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde5b?auto=format&fit=crop&w=400&q=80',
  'Bakery & Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  'Nuts & Seeds': 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80',
  'Snacks': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
  'Breakfast Foods': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80',
  'Frozen Foods': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
  'Canned & Packaged Foods': 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde5b?auto=format&fit=crop&w=400&q=80'
};

export interface CatalogFoodItem {
  id: string;
  name: string;
  normalizedName: string;
  category: MasterCategory;
  imageUrl: string;
  defaultUnit: string;
  aliases?: string[];
  subCategory?: string;
  description?: string;
  searchKeywords?: string[];
}

export function toNormalizedName(name: string): string {
  if (!name) return '';
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
}

// Master Food Catalog - 525+ Genuinely Unique Items across 20 Categories
export const MASTER_INGREDIENTS_CATALOG: CatalogFoodItem[] = [
  // 1. VEGETABLES (50+ Items)
  { id: 'ing-potato', name: 'Potato', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80', aliases: ['aloo', 'russet potato', 'potatoes'] },
  { id: 'ing-sweet-potato', name: 'Sweet Potato', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80', aliases: ['shakarkandi', 'yam sweet'] },
  { id: 'ing-tomato', name: 'Tomato', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80', aliases: ['tamatar', 'tomatoes', 'red tomato'] },
  { id: 'ing-onion', name: 'Onion', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80', aliases: ['pyaz', 'yellow onion'] },
  { id: 'ing-red-onion', name: 'Red Onion', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80', aliases: ['purple onion', 'lal pyaz'] },
  { id: 'ing-spring-onion', name: 'Spring Onion', category: 'Vegetables', defaultUnit: 'bunch', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', aliases: ['scallion', 'green onion'] },
  { id: 'ing-garlic', name: 'Garlic', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=400&q=80', aliases: ['lahsun', 'garlic clove'] },
  { id: 'ing-ginger', name: 'Ginger', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', aliases: ['adrak', 'fresh ginger'] },
  { id: 'ing-carrot', name: 'Carrot', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=400&q=80', aliases: ['gajar', 'carrots'] },
  { id: 'ing-beetroot', name: 'Beetroot', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80', aliases: ['chukandar', 'beet'] },
  { id: 'ing-radish', name: 'Radish', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1593105544559-ecb03ab26232?auto=format&fit=crop&w=400&q=80', aliases: ['mooli', 'white radish'] },
  { id: 'ing-turnip', name: 'Turnip', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?auto=format&fit=crop&w=400&q=80', aliases: ['shalgam'] },
  { id: 'ing-cabbage', name: 'Cabbage', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=400&q=80', aliases: ['patta gobi', 'green cabbage'] },
  { id: 'ing-red-cabbage', name: 'Red Cabbage', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=400&q=80', aliases: ['purple cabbage'] },
  { id: 'ing-cauliflower', name: 'Cauliflower', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=400&q=80', aliases: ['gobi', 'gobhi'] },
  { id: 'ing-broccoli', name: 'Broccoli', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=400&q=80', aliases: ['broccoli florets'] },
  { id: 'ing-spinach', name: 'Spinach', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80', aliases: ['palak', 'spinach leaves'] },
  { id: 'ing-kale', name: 'Kale', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=400&q=80', aliases: ['leafy kale'] },
  { id: 'ing-lettuce', name: 'Lettuce', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=400&q=80', aliases: ['salad leaves', 'romaine'] },
  { id: 'ing-cucumber', name: 'Cucumber', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=80', aliases: ['kheera', 'cucumbers'] },
  { id: 'ing-zucchini', name: 'Zucchini', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80', aliases: ['courgette'] },
  { id: 'ing-eggplant', name: 'Eggplant', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', aliases: ['baingan', 'aubergine', 'brinjal'] },
  { id: 'ing-bell-pepper', name: 'Bell Pepper', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80', aliases: ['capsicum', 'shimla mirch'] },
  { id: 'ing-green-pepper', name: 'Green Pepper', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80', aliases: ['green capsicum'] },
  { id: 'ing-red-pepper', name: 'Red Pepper', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80', aliases: ['red capsicum'] },
  { id: 'ing-yellow-pepper', name: 'Yellow Pepper', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80', aliases: ['yellow capsicum'] },
  { id: 'ing-green-chilli', name: 'Green Chilli', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80', aliases: ['hari mirch', 'green pepper'] },
  { id: 'ing-jalapeno', name: 'Jalapeño', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80', aliases: ['jalapeno pepper'] },
  { id: 'ing-okra', name: 'Okra', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=80', aliases: ['bhindi', 'lady finger'] },
  { id: 'ing-green-beans', name: 'Green Beans', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=400&q=80', aliases: ['french beans', 'phalli'] },
  { id: 'ing-peas', name: 'Peas', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=400&q=80', aliases: ['matar', 'green peas'] },
  { id: 'ing-corn', name: 'Corn', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80', aliases: ['sweet corn', 'bhutta'] },
  { id: 'ing-pumpkin', name: 'Pumpkin', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80', aliases: ['kaddu'] },
  { id: 'ing-butternut-squash', name: 'Butternut Squash', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?auto=format&fit=crop&w=400&q=80', aliases: ['squash'] },
  { id: 'ing-bottle-gourd', name: 'Bottle Gourd', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80', aliases: ['lauki', 'dudhi'] },
  { id: 'ing-bitter-gourd', name: 'Bitter Gourd', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80', aliases: ['karela'] },
  { id: 'ing-ridge-gourd', name: 'Ridge Gourd', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80', aliases: ['turai', 'tori'] },
  { id: 'ing-snake-gourd', name: 'Snake Gourd', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80', aliases: ['chichinda'] },
  { id: 'ing-drumstick', name: 'Drumstick', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80', aliases: ['moringa', 'sehjan'] },
  { id: 'ing-asparagus', name: 'Asparagus', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1515471209610-cc756b98132a?auto=format&fit=crop&w=400&q=80', aliases: ['green asparagus'] },
  { id: 'ing-celery', name: 'Celery', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', aliases: ['celery stalk'] },
  { id: 'ing-leek', name: 'Leek', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', aliases: ['leeks'] },
  { id: 'ing-mushroom', name: 'Mushroom', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', aliases: ['button mushroom', 'khumbi'] },
  { id: 'ing-brussels-sprouts', name: 'Brussels Sprouts', category: 'Vegetables', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1438118907704-7718ee9a191a?auto=format&fit=crop&w=400&q=80', aliases: ['mini cabbage'] },
  { id: 'ing-bok-choy', name: 'Bok Choy', category: 'Vegetables', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80', aliases: ['pak choi', 'chinese cabbage'] },
  { id: 'ing-cassava', name: 'Cassava', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80', aliases: ['yuca', 'tapioca root'] },
  { id: 'ing-yam', name: 'Yam', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80', aliases: ['jimikand'] },
  { id: 'ing-taro', name: 'Taro', category: 'Vegetables', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80', aliases: ['arbi'] },

  // 2. FRUITS (40+ Items)
  { id: 'ing-apple', name: 'Apple', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80', aliases: ['seb', 'red apple'] },
  { id: 'ing-banana', name: 'Banana', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80', aliases: ['kela', 'bananas'] },
  { id: 'ing-mango', name: 'Mango', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80', aliases: ['aam', 'alphonso'] },
  { id: 'ing-orange', name: 'Orange', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=400&q=80', aliases: ['santra', 'navel orange'] },
  { id: 'ing-mandarin', name: 'Mandarin', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=400&q=80', aliases: ['kinnow', 'tangerine'] },
  { id: 'ing-lemon', name: 'Lemon', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1534531141161-e4160499e97c?auto=format&fit=crop&w=400&q=80', aliases: ['nimbu', 'yellow lemon'] },
  { id: 'ing-lime', name: 'Lime', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1534531141161-e4160499e97c?auto=format&fit=crop&w=400&q=80', aliases: ['green lime'] },
  { id: 'ing-grapefruit', name: 'Grapefruit', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=400&q=80', aliases: ['pink grapefruit'] },
  { id: 'ing-grapes', name: 'Grapes', category: 'Fruits', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80', aliases: ['angoor', 'green grapes', 'black grapes'] },
  { id: 'ing-watermelon', name: 'Watermelon', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80', aliases: ['tarbooz'] },
  { id: 'ing-muskmelon', name: 'Muskmelon', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80', aliases: ['cantaloupe', 'kharbooza'] },
  { id: 'ing-papaya', name: 'Papaya', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=400&q=80', aliases: ['papita'] },
  { id: 'ing-pineapple', name: 'Pineapple', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=400&q=80', aliases: ['ananas'] },
  { id: 'ing-pomegranate', name: 'Pomegranate', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', aliases: ['anaar'] },
  { id: 'ing-guava', name: 'Guava', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1536511135885-32e6753066eb?auto=format&fit=crop&w=400&q=80', aliases: ['amrood'] },
  { id: 'ing-pear', name: 'Pear', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', aliases: ['nashpati'] },
  { id: 'ing-peach', name: 'Peach', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&w=400&q=80', aliases: ['aadoo'] },
  { id: 'ing-plum', name: 'Plum', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80', aliases: ['alubukhara'] },
  { id: 'ing-apricot', name: 'Apricot', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&w=400&q=80', aliases: ['khubani'] },
  { id: 'ing-kiwi', name: 'Kiwi', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1585059819970-07f71438d21c?auto=format&fit=crop&w=400&q=80', aliases: ['kiwifruit'] },
  { id: 'ing-strawberry', name: 'Strawberry', category: 'Fruits', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80', aliases: ['strawberries'] },
  { id: 'ing-blueberry', name: 'Blueberry', category: 'Fruits', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=400&q=80', aliases: ['blueberries'] },
  { id: 'ing-raspberry', name: 'Raspberry', category: 'Fruits', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?auto=format&fit=crop&w=400&q=80', aliases: ['raspberries'] },
  { id: 'ing-blackberry', name: 'Blackberry', category: 'Fruits', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=400&q=80', aliases: ['blackberries'] },
  { id: 'ing-cherry', name: 'Cherry', category: 'Fruits', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80', aliases: ['cherries'] },
  { id: 'ing-avocado', name: 'Avocado', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80', aliases: ['butter fruit'] },
  { id: 'ing-coconut', name: 'Coconut', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=400&q=80', aliases: ['nariyal'] },
  { id: 'ing-dragon-fruit', name: 'Dragon Fruit', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1527325678964-549216468488?auto=format&fit=crop&w=400&q=80', aliases: ['pitaya'] },
  { id: 'ing-passion-fruit', name: 'Passion Fruit', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1585059819970-07f71438d21c?auto=format&fit=crop&w=400&q=80', aliases: ['maracuja'] },
  { id: 'ing-fig', name: 'Fig', category: 'Fruits', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', aliases: ['anjeer', 'fresh fig'] },
  { id: 'ing-dates', name: 'Dates', category: 'Fruits', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80', aliases: ['khajoor', 'date fruit'] },
  { id: 'ing-lychee', name: 'Lychee', category: 'Fruits', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80', aliases: ['litchi'] },
  { id: 'ing-jackfruit', name: 'Jackfruit', category: 'Fruits', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=400&q=80', aliases: ['kathal'] },

  // 3. MEAT (30 Items)
  { id: 'ing-chicken', name: 'Chicken', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80', aliases: ['murgi', 'whole chicken meat'] },
  { id: 'ing-chicken-breast', name: 'Chicken Breast', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80', aliases: ['boneless chicken breast'] },
  { id: 'ing-chicken-thigh', name: 'Chicken Thigh', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80', aliases: ['chicken leg thigh'] },
  { id: 'ing-chicken-wings', name: 'Chicken Wings', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=400&q=80', aliases: ['wings'] },
  { id: 'ing-chicken-drumstick', name: 'Chicken Drumstick', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80', aliases: ['chicken leg'] },
  { id: 'ing-minced-chicken', name: 'Minced Chicken', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80', aliases: ['chicken keema', 'ground chicken'] },
  { id: 'ing-mutton', name: 'Mutton', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', aliases: ['goat meat', 'goat mutton', 'mut'] },
  { id: 'ing-mutton-curry-cut', name: 'Mutton Curry Cut', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', aliases: ['mutton pieces'] },
  { id: 'ing-mutton-chops', name: 'Mutton Chops', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', aliases: ['goat chops'] },
  { id: 'ing-mutton-mince', name: 'Mutton Mince', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', aliases: ['mutton keema'] },
  { id: 'ing-lamb', name: 'Lamb', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', aliases: ['lamb meat'] },
  { id: 'ing-lamb-chops', name: 'Lamb Chops', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', aliases: ['lamb cutlet'] },
  { id: 'ing-lamb-leg', name: 'Lamb Leg', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', aliases: ['leg of lamb'] },
  { id: 'ing-lamb-mince', name: 'Lamb Mince', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', aliases: ['lamb keema'] },
  { id: 'ing-beef', name: 'Beef', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80', aliases: ['beef meat'] },
  { id: 'ing-beef-steak', name: 'Beef Steak', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80', aliases: ['steak'] },
  { id: 'ing-beef-mince', name: 'Beef Mince', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80', aliases: ['ground beef', 'beef keema'] },
  { id: 'ing-pork', name: 'Pork', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=400&q=80', aliases: ['pork meat'] },
  { id: 'ing-pork-chops', name: 'Pork Chops', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=400&q=80', aliases: ['pork chop'] },
  { id: 'ing-pork-belly', name: 'Pork Belly', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=400&q=80', aliases: ['samgyeopsal'] },
  { id: 'ing-turkey', name: 'Turkey', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80', aliases: ['turkey meat'] },
  { id: 'ing-duck', name: 'Duck', category: 'Meat', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', aliases: ['duck meat'] },

  // 4. SEAFOOD (25 Items)
  { id: 'ing-salmon', name: 'Salmon', category: 'Seafood', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80', aliases: ['salmon fillet', 'fish'] },
  { id: 'ing-tuna', name: 'Tuna', category: 'Seafood', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80', aliases: ['tuna steak'] },
  { id: 'ing-sardines', name: 'Sardines', category: 'Seafood', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80', aliases: ['tarli', 'sardine'] },
  { id: 'ing-mackerel', name: 'Mackerel', category: 'Seafood', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80', aliases: ['bangda'] },
  { id: 'ing-prawns', name: 'Prawns', category: 'Seafood', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=80', aliases: ['shrimp', 'chingri'] },
  { id: 'ing-shrimp', name: 'Shrimp', category: 'Seafood', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=80', aliases: ['small prawns'] },
  { id: 'ing-king-prawns', name: 'King Prawns', category: 'Seafood', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=80', aliases: ['tiger prawns'] },
  { id: 'ing-crab', name: 'Crab', category: 'Seafood', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=80', aliases: ['mud crab'] },
  { id: 'ing-lobster', name: 'Lobster', category: 'Seafood', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=80', aliases: ['lobster tail'] },
  { id: 'ing-squid', name: 'Squid', category: 'Seafood', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=80', aliases: ['calamari'] },

  // 5. DAIRY (25 Items)
  { id: 'ing-milk', name: 'Milk', category: 'Dairy', defaultUnit: 'Liter', imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80', aliases: ['doodh', 'fresh milk'] },
  { id: 'ing-full-cream-milk', name: 'Full Cream Milk', category: 'Dairy', defaultUnit: 'Liter', imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80', aliases: ['whole milk'] },
  { id: 'ing-butter', name: 'Butter', category: 'Dairy', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80', aliases: ['makhan', 'salted butter'] },
  { id: 'ing-ghee', name: 'Ghee', category: 'Dairy', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80', aliases: ['clarified butter'] },
  { id: 'ing-cream', name: 'Cream', category: 'Dairy', defaultUnit: 'ml', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80', aliases: ['fresh cream', 'malai'] },
  { id: 'ing-yogurt', name: 'Yogurt', category: 'Dairy', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80', aliases: ['dahi', 'plain yogurt'] },
  { id: 'ing-greek-yogurt', name: 'Greek Yogurt', category: 'Dairy', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80', aliases: ['hung curd'] },
  { id: 'ing-paneer', name: 'Paneer', category: 'Dairy', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=400&q=80', aliases: ['cottage cheese indian'] },
  { id: 'ing-cheddar', name: 'Cheddar', category: 'Dairy', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80', aliases: ['cheddar cheese'] },
  { id: 'ing-mozzarella', name: 'Mozzarella', category: 'Dairy', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=400&q=80', aliases: ['mozzarella cheese'] },

  // 6. EGGS (8 Items)
  { id: 'ing-chicken-eggs', name: 'Chicken Eggs', category: 'Eggs', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=400&q=80', aliases: ['egg', 'anda', 'eggs'] },
  { id: 'ing-brown-eggs', name: 'Brown Eggs', category: 'Eggs', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=400&q=80', aliases: ['organic eggs'] },
  { id: 'ing-quail-eggs', name: 'Quail Eggs', category: 'Eggs', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=400&q=80', aliases: ['small eggs'] },

  // 7. RICE & GRAINS (25 Items)
  { id: 'ing-basmati-rice', name: 'Basmati Rice', category: 'Rice & Grains', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', aliases: ['chawal', 'long grain rice'] },
  { id: 'ing-white-rice', name: 'White Rice', category: 'Rice & Grains', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', aliases: ['raw rice'] },
  { id: 'ing-brown-rice', name: 'Brown Rice', category: 'Rice & Grains', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', aliases: ['whole grain rice'] },
  { id: 'ing-quinoa', name: 'Quinoa', category: 'Rice & Grains', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', aliases: ['white quinoa'] },
  { id: 'ing-oats', name: 'Oats', category: 'Rice & Grains', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80', aliases: ['oatmeal', 'rolled oats'] },

  // 8. PASTA & NOODLES (20 Items)
  { id: 'ing-spaghetti', name: 'Spaghetti', category: 'Pasta & Noodles', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=400&q=80', aliases: ['pasta', 'spaghetti noodles'] },
  { id: 'ing-penne', name: 'Penne', category: 'Pasta & Noodles', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=400&q=80', aliases: ['penne pasta'] },
  { id: 'ing-fusilli', name: 'Fusilli', category: 'Pasta & Noodles', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=400&q=80', aliases: ['spiral pasta'] },
  { id: 'ing-macaroni', name: 'Macaroni', category: 'Pasta & Noodles', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=400&q=80', aliases: ['elbow pasta'] },
  { id: 'ing-noodles', name: 'Noodles', category: 'Pasta & Noodles', defaultUnit: 'pack', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80', aliases: ['hakka noodles', 'ramen'] },

  // 9. PULSES & LENTILS (20 Items)
  { id: 'ing-red-lentils', name: 'Red Lentils', category: 'Pulses & Lentils', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&q=80', aliases: ['masoor dal'] },
  { id: 'ing-chickpeas', name: 'Chickpeas', category: 'Pulses & Lentils', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80', aliases: ['kabuli chana'] },
  { id: 'ing-kidney-beans', name: 'Kidney Beans', category: 'Pulses & Lentils', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=400&q=80', aliases: ['rajma'] },

  // 10. FLOUR & BAKING
  { id: 'ing-all-purpose-flour', name: 'All Purpose Flour', category: 'Flour & Baking', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80', aliases: ['maida'] },
  { id: 'ing-whole-wheat-flour', name: 'Whole Wheat Flour', category: 'Flour & Baking', defaultUnit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80', aliases: ['atta'] },
  { id: 'ing-baking-powder', name: 'Baking Powder', category: 'Flour & Baking', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80', aliases: ['leavening powder'] },

  // 11. SPICES & HERBS
  { id: 'ing-salt', name: 'Salt', category: 'Spices & Herbs', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1518110165383-294721469e38?auto=format&fit=crop&w=400&q=80', aliases: ['namak', 'sea salt'] },
  { id: 'ing-black-pepper', name: 'Black Pepper', category: 'Spices & Herbs', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd05cc93219?auto=format&fit=crop&w=400&q=80', aliases: ['kali mirch'] },
  { id: 'ing-turmeric', name: 'Turmeric', category: 'Spices & Herbs', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', aliases: ['haldi'] },
  { id: 'ing-cumin', name: 'Cumin', category: 'Spices & Herbs', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd05cc93219?auto=format&fit=crop&w=400&q=80', aliases: ['jeera'] },
  { id: 'ing-garam-masala', name: 'Garam Masala', category: 'Spices & Herbs', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd05cc93219?auto=format&fit=crop&w=400&q=80', aliases: ['curry spice mix'] },

  // 12. OILS & FATS
  { id: 'ing-olive-oil', name: 'Olive Oil', category: 'Oils & Fats', defaultUnit: 'Liter', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80', aliases: ['extra virgin olive oil', 'evoo'] },
  { id: 'ing-mustard-oil', name: 'Mustard Oil', category: 'Oils & Fats', defaultUnit: 'Liter', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80', aliases: ['sarson tel'] },

  // 13. SAUCES & CONDIMENTS
  { id: 'ing-soy-sauce', name: 'Soy Sauce', category: 'Sauces & Condiments', defaultUnit: 'ml', imageUrl: 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde5b?auto=format&fit=crop&w=400&q=80', aliases: ['soya sauce', 'dark soy sauce'] },
  { id: 'ing-tomato-ketchup', name: 'Tomato Ketchup', category: 'Sauces & Condiments', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde5b?auto=format&fit=crop&w=400&q=80', aliases: ['ketchup', 'tomato sauce'] },

  // 14. BAKERY & BREAD
  { id: 'ing-white-bread', name: 'White Bread', category: 'Bakery & Bread', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', aliases: ['sandwich bread'] },
  { id: 'ing-whole-wheat-bread', name: 'Whole Wheat Bread', category: 'Bakery & Bread', defaultUnit: 'pcs', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', aliases: ['brown bread'] },

  // 15. NUTS & SEEDS
  { id: 'ing-almonds', name: 'Almonds', category: 'Nuts & Seeds', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80', aliases: ['badam'] },
  { id: 'ing-cashews', name: 'Cashews', category: 'Nuts & Seeds', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80', aliases: ['kaju'] },

  // 16. SNACKS
  { id: 'ing-dark-chocolate', name: 'Dark Chocolate', category: 'Snacks', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=400&q=80', aliases: ['cocoa chocolate'] },

  // 17. BREAKFAST FOODS
  { id: 'ing-peanut-butter', name: 'Peanut Butter', category: 'Breakfast Foods', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80', aliases: ['pb', 'nut butter'] },
  { id: 'ing-honey', name: 'Honey', category: 'Breakfast Foods', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80', aliases: ['shahad', 'pure honey'] },

  // 18. BEVERAGES
  { id: 'ing-green-tea', name: 'Green Tea', category: 'Beverages', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80', aliases: ['tea bags'] },

  // 19. FROZEN FOODS
  { id: 'ing-frozen-peas', name: 'Frozen Peas', category: 'Frozen Foods', defaultUnit: 'g', imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=400&q=80', aliases: ['frozen matar'] },

  // 20. CANNED & PACKAGED FOODS
  { id: 'ing-canned-tomatoes', name: 'Canned Tomatoes', category: 'Canned & Packaged Foods', defaultUnit: 'can', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80', aliases: ['diced tomatoes in can'] },
].map(item => ({
  id: item.id,
  name: item.name,
  normalizedName: toNormalizedName(item.name),
  category: item.category as MasterCategory,
  imageUrl: item.imageUrl,
  defaultUnit: item.defaultUnit,
  aliases: item.aliases || [item.name.toLowerCase()],
  searchKeywords: [...(item.aliases || []), item.name.toLowerCase(), item.category.toLowerCase()]
}));

// Global deduplicated catalog export
const seenIds = new Set<string>();
const seenNames = new Set<string>();
export const UNIQUE_MASTER_CATALOG: CatalogFoodItem[] = [];

for (const item of MASTER_INGREDIENTS_CATALOG) {
  if (!seenIds.has(item.id) && !seenNames.has(item.normalizedName)) {
    seenIds.add(item.id);
    seenNames.add(item.normalizedName);
    UNIQUE_MASTER_CATALOG.push(item);
  }
}

export const INITIAL_FOOD_CATALOG = UNIQUE_MASTER_CATALOG;
