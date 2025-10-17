// src/data/mockData.js
export const mockCoupons = [
  {
    id: 1,
    title: "Flash Sale: 60% Off Smartphones",
    description: "Massive discount on latest smartphones from top brands. Limited stock available!",
    code: "PHONE60",
    discount: "60%",
    category: "Electronics",
    expiryDate: "2026-01-15", // Changed to future date
    store: "TechGalaxy",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 2,
    title: "Free Express Shipping",
    description: "Get free express shipping on all orders with no minimum purchase required",
    code: "EXPRESSFREE",
    discount: "FREE",
    category: "Shopping",
    expiryDate: "2026-02-20", // Changed to future date
    store: "QuickDeliver",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 3,
    title: "Summer Collection: 45% Off",
    description: "Huge discount on summer fashion collection. T-shirts, shorts, and accessories included",
    code: "SUMMER45",
    discount: "45%",
    category: "Fashion",
    expiryDate: "2026-03-30", // Changed to future date
    store: "FashionHub",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 4,
    title: "Family Pizza Deal - 50% Off",
    description: "Half price on family-sized pizzas with 3 toppings of your choice",
    code: "FAMILYPIZZA",
    discount: "50%",
    category: "Food",
    expiryDate: "2026-01-10", // Changed to future date
    store: "PizzaPalace",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 5,
    title: "Weekend Book Bonanza - 35% Off",
    description: "Perfect weekend read with 35% discount on all fiction and non-fiction books",
    code: "READWEEKEND",
    discount: "35%",
    category: "Books",
    expiryDate: "2026-02-25", // Changed to future date
    store: "BookNook",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 6,
    title: "Organic Groceries - $15 Off",
    description: "Save $15 on organic groceries order over $75. Fresh produce and dairy included",
    code: "ORGANIC15",
    discount: "$15",
    category: "Groceries",
    expiryDate: "2025-01-11", // Changed to future date
    store: "GreenMarket",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 7,
    title: "Gaming Laptops - 25% Off",
    description: "Exclusive discount on high-performance gaming laptops and accessories",
    code: "GAME25",
    discount: "25%",
    category: "Electronics",
    expiryDate: "2026-03-10", // Changed to future date
    store: "GameZone",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 8,
    title: "Coffee Lover's Deal - Buy 2 Get 1",
    description: "Buy two specialty coffees and get one free. Perfect for coffee enthusiasts!",
    code: "COFFEEBOGO",
    discount: "BOGO",
    category: "Food",
    expiryDate: "2026-01-20", // Changed to future date
    store: "BrewHouse",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 9,
    title: "Fitness Gear - 30% Off",
    description: "Get fit with 30% off on all fitness equipment, yoga mats, and workout gear",
    code: "FIT30",
    discount: "30%",
    category: "Sports",
    expiryDate: "2026-02-28", // Changed to future date
    store: "FitLife",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 10,
    title: "Home Decor - 40% Off",
    description: "Transform your space with 40% off on home decor, furniture, and lighting",
    code: "HOME40",
    discount: "40%",
    category: "Home",
    expiryDate: "2026-03-15", // Changed to future date
    store: "DecorMasters",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 11,
    title: "Beauty Products - 55% Off",
    description: "Pamper yourself with 55% off on premium skincare and beauty products",
    code: "BEAUTY55",
    discount: "55%",
    category: "Beauty",
    expiryDate: "2026-01-30", // Changed to future date
    store: "GlamourShop",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=250&fit=crop",
    isSaved: false
  },
  {
    id: 12,
    title: "Weekend Getaway - $100 Off",
    description: "Plan your escape with $100 off on hotel bookings for weekend stays",
    code: "ESCAPE100",
    discount: "$100",
    category: "Travel",
    expiryDate: "2026-02-14", // Changed to future date
    store: "TravelEase",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
    isSaved: false
  }
];

export const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Food",
  "Shopping",
  "Books",
  "Groceries",
  "Sports",
  "Home",
  "Beauty",
  "Travel"
];