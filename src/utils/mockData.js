import { extraDestinations, extraHomestays } from './extraMockData.js';
import { moreDestinations } from './moreDestinations.js';

export const destinations = [
  {
    id: 1,
    name: 'Valley of Flowers National Park',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=300&q=80',
    ],
    rating: 4.8,
    reviews: 245,
    reviewsCount: 245,
    price: 'From $80/day',
    location: 'Chamoli, Uttarakhand, India',
    latitude: 30.7280,
    longitude: 79.6053,
    tags: ['Eco-Tourism', 'Alpine Meadows', 'Trekking'],
    description: 'Experience a vibrant UNESCO World Heritage alpine flower valley.',
    longDescription: 'The Valley of Flowers is a vibrant and splendid national park nestled in the West Himalayas. Known for its meadows of endemic alpine flowers and outstanding natural beauty, this eco-tour supports local conservation while offering unforgettable high-altitude trekking, bird watching, and botanical photography.',
    highlights: [
      'Valley of Flowers trek',
      'Ghangaria basecamp stay',
      'Hemkund Sahib visit',
      'Endemic flora spotting',
      'Lush waterfalls and mountain streams'
    ],
    amenities: [
      'Eco-tents',
      'Expert mountain guides',
      'Nutritious mountain meals',
      'Porters and pack mules',
      'Permits included'
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Sarah Johnson',
        rating: 5,
        date: '2024-01-15',
        title: 'Incredible experience!',
        text: 'This was the best trip of my life. The guides were knowledgeable and the flowers were amazing. Highly recommend!',
        images: [],
        helpful: 24
      },
      {
        id: 2,
        author: 'Michael Chen',
        rating: 4,
        date: '2024-01-10',
        title: 'Great but challenging',
        text: 'Beautiful scenery but quite physically demanding. Worth the effort. Excellent hospitality.',
        images: [],
        helpful: 18
      }
    ]
  },
  {
    id: 2,
    name: 'Rishikesh Eco-Zone',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'
    ],
    rating: 4.7,
    reviews: 189,
    reviewsCount: 189,
    price: 'From $60/day',
    location: 'Rishikesh, Uttarakhand, India',
    latitude: 30.0869,
    longitude: 78.2676,
    tags: ['Yoga', 'Water Rafting', 'Wellness'],
    description: 'Discover wellness and eco-adventure along the sacred Ganges river.',
    longDescription: 'Experience the spiritual and ecological heart of Uttarakhand in Rishikesh. Practice yoga at historical eco-ashrams, hike to beautiful jungle waterfalls, and participate in low-impact rafting on the clean waters of the upper Ganges. Our wellness programs focus on sustainable living and cultural preservation.',
    highlights: [
      'Daily riverside yoga',
      'Ganges eco-rafting',
      'Neer Garh waterfall hike',
      'Organic vegetarian meals',
      'Beatles Ashram forest walk'
    ],
    amenities: [
      'Riverside eco-lodges',
      'Certified yoga instructors',
      'Rafting safety gear',
      'Guided temple walks'
    ],
    reviewsList: [
      {
        id: 1,
        author: 'John Doe',
        rating: 5,
        date: '2024-02-12',
        title: 'Breathtaking Views!',
        text: 'The hikes were challenging but the views were unmatched. Excellent accommodations and guide.',
        images: [],
        helpful: 12
      }
    ]
  },
  {
    id: 3,
    name: 'Chopta Meadows',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80'
    ],
    rating: 4.6,
    reviews: 312,
    reviewsCount: 312,
    price: 'From $70/day',
    location: 'Rudraprayag, Uttarakhand, India',
    latitude: 30.4853,
    longitude: 79.1764,
    tags: ['Mountain', 'Trekking', 'Scenic'],
    description: 'Breathtaking green meadows surrounded by dense pine and rhododendron forests.',
    longDescription: 'Often referred to as the "Mini Switzerland" of Uttarakhand, Chopta offers scenic trails through lush green meadows and rhododendron forests. Take a moderate trek to Tungnath, the highest Shiva temple in the world, and enjoy stunning 360-degree views of majestic Himalayan peaks.',
    highlights: [
      'Tungnath temple trek',
      'Chandrashila summit hike',
      'Deoriatal lake walk',
      'Bird watching',
      'Kedarnath wildlife viewing'
    ],
    amenities: [
      'Alpine eco-camps',
      'Local wilderness guides',
      'Nutritious mountain lunches',
      'Trekking gear'
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Lina S.',
        rating: 4.5,
        date: '2024-03-01',
        title: 'Deeply cultural experience',
        text: 'Lush green landscapes and wonderful people. The cooking class was a major highlight!',
        images: [],
        helpful: 15
      }
    ]
  },
  {
    id: 4,
    name: 'Auli Himalayan Slopes',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=300&q=80'
    ],
    rating: 4.9,
    reviews: 178,
    reviewsCount: 178,
    price: 'From $90/day',
    location: 'Chamoli, Uttarakhand, India',
    latitude: 30.5284,
    longitude: 79.5658,
    tags: ['Snow Peaks', 'Cable Car', 'Scenic'],
    description: 'Ski, ride cable cars, and witness grand views of Nanda Devi peak.',
    longDescription: 'Auli is a top-tier ski destination in India, renowned for its pristine slopes and coniferous forests. The resort overlooks peaks like Nanda Devi, Mana Parvat, and Kamet. In the summer, Auli transforms into a lush green meadow, offering spectacular hiking paths and cable car rides.',
    highlights: [
      'Skiing lessons (seasonal)',
      'Auli ropeway journey',
      'Gorson Bugyal trek',
      'Sunset over Nanda Devi peak',
      'Local cultural evenings'
    ],
    amenities: [
      'Heated eco-cottages',
      'Ski instructors and gear',
      'Ropeway tickets',
      'All meals included'
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Arvid N.',
        rating: 5,
        date: '2024-02-28',
        title: 'Magical scenery',
        text: 'An outstanding experience. Walking next to towering cliffs was unforgettable.',
        images: [],
        helpful: 20
      }
    ]
  },
  {
    id: 5,
    name: 'Corbett Eco-Zone',
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1615959189197-484004337a85?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=300&q=80'
    ],
    rating: 4.7,
    reviews: 134,
    reviewsCount: 134,
    price: 'From $110/day',
    location: 'Ramnagar, Uttarakhand, India',
    latitude: 29.5300,
    longitude: 78.7747,
    tags: ['Wildlife', 'Tiger Safari', 'Nature'],
    description: 'Explore dense forests and wildlife habitats in India\'s oldest reserve.',
    longDescription: 'Visit the buffer zones of Corbett National Park, famous for its rich wildlife including Bengal Tigers, Asian Elephants, and diverse bird species. Our eco-tours practice conservation-first safaris, staying in eco-resorts built on sustainable principles to protect tiger habitats.',
    highlights: [
      'Jeep safari in eco-zones',
      'Bird watching walk',
      'Ramganga river trail',
      'Wildlife tracking workshops',
      'Conservation talks'
    ],
    amenities: [
      'Low-impact forest lodges',
      'Certified wildlife guides',
      'Safari vehicle passes',
      'Fresh local meals'
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Elena R.',
        rating: 5,
        date: '2024-03-05',
        title: 'A true adventure',
        text: 'Loved the safari tents and the guides were super professional. A lifetime memory.',
        images: [],
        helpful: 8
      }
    ]
  },
  {
    id: 6,
    name: 'Binsar Sanctuary',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&q=80'
    ],
    rating: 4.8,
    reviews: 267,
    reviewsCount: 267,
    price: 'From $65/day',
    location: 'Almora, Uttarakhand, India',
    latitude: 29.7042,
    longitude: 79.7490,
    tags: ['Bird Watching', 'Forest Walk', 'Serene'],
    description: 'Peaceful sanctuary with dense oak forests and panoramic mountain views.',
    longDescription: 'Binsar is a quiet mountain sanctuary nestled in the Kumaon region. Famous for its dense oak, pine, and rhododendron forests, it offers a peaceful retreat with bird watching and hiking trails leading to Zero Point for scenic views of Nanda Devi and Trishul.',
    highlights: [
      'Zero Point hiking trail',
      'Bird watching walk',
      'Kumaoni village tour',
      'Sunset photography',
      'Wildlife spot (deer, leopards)'
    ],
    amenities: [
      'Off-grid forest cabins',
      'Local nature guides',
      'Organic Kumaoni meals',
      'Entry passes'
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Thor H.',
        rating: 4.8,
        date: '2024-01-28',
        title: 'Geothermal paradise',
        text: 'Bathing in the natural surroundings while it was freezing outside is a must-do!',
        images: [],
        helpful: 19
      }
    ]
  },
  {
    id: 7,
    name: 'Nainital Lake Eco-Tours',
    image: 'https://images.unsplash.com/photo-1585828068970-87779d722d7d?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1585828068970-87779d722d7d?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'
    ],
    rating: 4.5,
    reviews: 154,
    reviewsCount: 154,
    price: 'From $50/day',
    location: 'Nainital, Uttarakhand, India',
    latitude: 29.3919,
    longitude: 79.4542,
    tags: ['Lakeside', 'Boating', 'Heritage'],
    description: 'Explore the lake city with sustainable boating and heritage walks.',
    longDescription: 'Nainital is a charming hill station nestled around a beautiful pear-shaped lake. Discover local heritage, enjoy eco-friendly paddle boating, and take a cable car ride to Snow View Point for a panoramic view of the majestic Himalayas.',
    highlights: [
      'Eco-friendly paddle boating',
      'Naina Devi Temple visit',
      'Snow View Point cable car',
      'Tiffin Top hike',
      'Heritage walks along the Mall Road'
    ],
    amenities: [
      'Heritage eco-stays',
      'Local history guides',
      'Boat passes',
      'Traditional local cuisine'
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Ravi T.',
        rating: 4.5,
        date: '2024-04-12',
        title: 'Peaceful lake vibes',
        text: 'A very relaxing trip. The heritage walk was eye-opening.',
        images: [],
        helpful: 11
      }
    ]
  },
  {
    id: 8,
    name: 'Kedarnath Valley Retreat',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=300&q=80'
    ],
    rating: 4.9,
    reviews: 320,
    reviewsCount: 320,
    price: 'From $85/day',
    location: 'Rudraprayag, Uttarakhand, India',
    latitude: 30.7352,
    longitude: 79.0669,
    tags: ['Spiritual', 'Trekking', 'High Altitude'],
    description: 'A spiritual eco-journey through the majestic Kedarnath valley.',
    longDescription: 'Embark on a spiritual and ecological trek to the revered Kedarnath Temple. Surrounded by snow-capped peaks and alpine meadows, this journey connects you with ancient traditions while supporting local sustainable eco-camps along the trekking route.',
    highlights: [
      'Kedarnath temple trek',
      'Mandakini river walk',
      'Bhairavnath Temple hike',
      'Alpine flora spotting',
      'Spiritual ceremonies'
    ],
    amenities: [
      'High-altitude eco-tents',
      'Experienced porters',
      'Oxygen cylinders available',
      'Hot vegetarian meals'
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Priya M.',
        rating: 5,
        date: '2024-05-02',
        title: 'A spiritual awakening',
        text: 'The trek is tough but the destination is heavenly. Excellent eco-camps.',
        images: [],
        helpful: 40
      }
    ]
  },
  {
    id: 9,
    name: 'Lansdowne Pine Retreat',
    image: 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&q=80'
    ],
    rating: 4.7,
    reviews: 142,
    reviewsCount: 142,
    price: 'From $45/day',
    location: 'Lansdowne, Uttarakhand, India',
    latitude: 29.8377,
    longitude: 78.6871,
    tags: ['Cantonment', 'Pine Forests', 'Quiet'],
    description: 'A serene cantonment town surrounded by thick oak and blue pine forests.',
    longDescription: 'Lansdowne is one of the quietest and most unspoiled hill stations of India. Originally a British cantonment, it retains a colonial charm mixed with the natural beauty of thick pine forests. Enjoy eco-friendly nature walks, bird watching, and a peaceful retreat away from city crowds.',
    highlights: [
      'Tip n Top viewpoint hike',
      'Bhulla Tal lake visit',
      'St. Mary\'s Church heritage tour',
      'Pine forest nature walks',
      'Bird watching'
    ],
    amenities: [
      'Eco-lodges',
      'Heritage walks',
      'Local cuisine',
      'Bicycle rentals'
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Sita D.',
        rating: 4.8,
        date: '2024-05-10',
        title: 'Extremely peaceful',
        text: 'The best place to disconnect. The pine forests are beautiful and the town is very clean.',
        images: [],
        helpful: 15
      }
    ]
  },
  {
    id: 10,
    name: 'Haridwar Ganges Walk',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1606298246186-08868ab77562?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80'
    ],
    rating: 4.6,
    reviews: 280,
    reviewsCount: 280,
    price: 'From $40/day',
    location: 'Haridwar, Uttarakhand, India',
    latitude: 29.9457,
    longitude: 78.1642,
    tags: ['Spiritual', 'River', 'Culture'],
    description: 'Experience the spiritual energy of the Ganges with sustainable community tourism.',
    longDescription: 'Haridwar is an ancient city and an important Hindu pilgrimage site where the River Ganges exits the Himalayan foothills. Our eco-walks focus on sustainable community tourism, connecting you with local artisans, responsible ashrams, and the mesmerising evening Ganga Aarti.',
    highlights: [
      'Har Ki Pauri evening Aarti',
      'Mansa Devi temple cable car',
      'Ashram community service',
      'Local artisan workshops',
      'Ganges river walks'
    ],
    amenities: [
      'Riverside ashram stays',
      'Spiritual guides',
      'Vegetarian local meals',
      'Community volunteering'
    ],
    reviewsList: [
      {
        id: 1,
        author: 'John K.',
        rating: 4.5,
        date: '2024-03-22',
        title: 'Deeply moving',
        text: 'The Aarti is a beautiful experience. Our guide was very knowledgeable about local sustainability.',
        images: [],
        helpful: 28
      }
    ]
  },
  ...extraDestinations,
  ...moreDestinations
];

export const homestays = [
  {
    id: 1,
    name: 'Eco-Lodge Mountain Retreat',
    image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=600&q=80',
    location: 'Kanatal, Uttarakhand, India',
    latitude: 30.4078,
    longitude: 78.3497,
    rating: 4.7,
    reviews: 156,
    reviewsCount: 156,
    pricePerNight: 95,
    maxGuests: 4,
    amenities: ['WiFi', 'Kitchen', 'Garden', 'Mountain View', 'Heating', 'Hot Water'],
    description: 'Cozy mountain lodge with stunning views and local hospitality.',
    longDescription: 'Welcome to our eco-friendly mountain lodge nestled in the heart of the Himalayas. Our homestay offers a perfect blend of comfort and sustainability. Enjoy breathtaking mountain views, homemade local cuisine, and warm hospitality from our family. Perfect for nature lovers and those seeking authentic cultural experiences.',
    facilities: [
      'Private rooms with mountain views',
      'Shared or private bathrooms',
      'Fully equipped kitchen',
      'Dining area',
      'Garden with seating',
      'WiFi connectivity',
      'Heating system',
      'Hot water supply'
    ],
    localExperiences: [
      {
        id: '1-aipan',
        title: 'Kumaoni Aipan Art Workshop',
        price: 15,
        duration: '2 Hours',
        instructor: 'Mamta Bisht',
        category: 'Art & Culture',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80',
        description: 'Learn the sacred, centuries-old geometric red-and-white ritual folk art of Kumaon painted on thresholds and courtyards.'
      },
      {
        id: '1-stargaze',
        title: 'High-Altitude Stargazing Session',
        price: 25,
        duration: '3 Hours',
        instructor: 'Deepak Joshi (Astronomer)',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=400&q=80',
        description: 'Observe distant galaxies, planets, and constellations through a high-powered telescope in Kanatal\'s crystal-clear night skies.'
      }
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Emma Wilson',
        rating: 5,
        date: '2024-01-20',
        title: 'Best stay in the mountains!',
        text: 'This homestay exceeded all expectations. The hosts are incredibly warm and welcoming. The views from the garden are absolutely stunning.',
        images: [],
        helpful: 32
      },
      {
        id: 2,
        author: 'John Smith',
        rating: 4,
        date: '2024-01-15',
        title: 'Great experience',
        text: 'Wonderful place to stay. Good food, beautiful surroundings. The only issue was internet connectivity was a bit spotty.',
        images: [],
        helpful: 18
      }
    ]
  },
  {
    id: 2,
    name: 'Himalayan Village Homestay',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80',
    location: 'Almora, Uttarakhand, India',
    latitude: 29.5892,
    longitude: 79.6467,
    rating: 4.8,
    reviews: 203,
    reviewsCount: 203,
    pricePerNight: 55,
    maxGuests: 6,
    amenities: ['Mountain View', 'Organic Meals', 'Traditional Fireplace', 'Hiking Trails', 'Kitchen', 'Local Activities'],
    description: 'Traditional stone house offering authentic Kumaoni farm-to-table experiences.',
    longDescription: 'Stay in a beautifully restored traditional Kumaoni stone house. Experience local village life, help harvest organic vegetables in the farm, cook traditional meals, and hike peaceful forest paths. Our family has lived in Almora for generations and looks forward to welcoming you.',
    facilities: [
      'Traditional stone rooms',
      'Outdoor courtyard',
      'Earthen fireplace',
      'Organic farm dining',
      'Village trails access',
      'Cooking utensils'
    ],
    localExperiences: [
      {
        id: '2-cooking',
        title: 'Traditional Kumaoni Cooking Masterclass',
        price: 20,
        duration: '3 Hours',
        instructor: 'Damyanti Devi',
        category: 'Culinary',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80',
        description: 'Cook authentic Pahadi delicacies like Dubuk (lentil paste stew), Bhatt ki Churkani, and Madua (finger millet) rotis over a traditional mud stove.'
      },
      {
        id: '2-pottery',
        title: 'Earthen Pottery Experience',
        price: 12,
        duration: '1.5 Hours',
        instructor: 'Harish Lal',
        category: 'Crafts',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=400&q=80',
        description: 'Try your hand at a potter\'s wheel using local Almora clay and learn to bake traditional cups and bowls.'
      }
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Clara M.',
        rating: 5,
        date: '2024-02-10',
        title: 'Paradise found',
        text: 'Stepping out of the cottage directly onto the paths was incredible. The organic food was yummy!',
        images: [],
        helpful: 14
      }
    ]
  },
  {
    id: 3,
    name: 'Ganga Riverside Bamboo Huts',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
    location: 'Shivpuri, Uttarakhand, India',
    latitude: 30.1372,
    longitude: 78.3881,
    rating: 4.5,
    reviews: 89,
    reviewsCount: 89,
    pricePerNight: 65,
    maxGuests: 8,
    amenities: ['Bonfire', 'Organic Food', 'River Access', 'Yoga Space', 'Rafting Start Point'],
    description: 'Sustainable bamboo huts located directly beside the river.',
    longDescription: 'Experience low-impact, peaceful living in our eco-friendly bamboo huts along the Ganges in Shivpuri. Gather around the nightly bonfire, practice yoga on the river bank, and enjoy fresh vegetarian meals prepared with locally sourced ingredients.',
    facilities: [
      'Earthen bamboo huts',
      'Outdoor dining area',
      'Riverside yoga shala',
      'Shared eco-bathrooms',
      'Rafting booking counter',
      'Bonfire pit'
    ],
    localExperiences: [
      {
        id: '3-yoga',
        title: 'Ganges Bank Sunrise Yoga & Meditation',
        price: 18,
        duration: '2 Hours',
        instructor: 'Swami Anand',
        category: 'Wellness',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
        description: 'Harmonize your mind and body with traditional Hatha yoga practices, pranayama, and meditation at sunrise beside the flowing Ganges.'
      },
      {
        id: '3-kayak',
        title: 'Guided River Kayaking Lessons',
        price: 35,
        duration: '3 Hours',
        instructor: 'Vikram Singh',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1471079688237-3ac9a55f1d6f?auto=format&fit=crop&w=400&q=80',
        description: 'Learn fundamental paddling techniques and self-rescue basics in calm waters before testing minor rapids in Shivpuri.'
      }
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Youssef B.',
        rating: 4.5,
        date: '2024-03-02',
        title: 'Unforgettable river nights',
        text: 'The stars were brighter than I have ever seen. Warm local hospitality.',
        images: [],
        helpful: 9
      }
    ]
  },
  {
    id: 4,
    name: 'Pine Forest Cabin',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
    location: 'Ranikhet, Uttarakhand, India',
    latitude: 29.6433,
    longitude: 79.4322,
    rating: 4.6,
    reviews: 142,
    reviewsCount: 142,
    pricePerNight: 80,
    maxGuests: 5,
    amenities: ['Fireplace', 'Garden', 'Hiking Trails', 'Wood-fired Oven', 'Balcony'],
    description: 'Cozy wooden cabin surrounded by high pine forests and snow views.',
    longDescription: 'Rest in a rustic wood cabin tucked away in a quiet pine forest near Ranikhet. Cozy up next to the stone fireplace, hike directly into the surrounding mountains, or read a book on the balcony overlooking the snow-covered Himalayan peaks.',
    facilities: [
      'Pine wood rooms',
      'Outdoor deck',
      'Living room fireplace',
      'Fully equipped kitchen',
      'Direct forest paths',
      'Local tea collection'
    ],
    localExperiences: [
      {
        id: '4-pinehike',
        title: 'Forest Bathing & Pine Resining Walk',
        price: 15,
        duration: '2.5 Hours',
        instructor: 'Govind Negi (Naturalist)',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80',
        description: 'Immerse yourself in the scent of pine forest trails, spot Himalayan birdlife, and learn about historical pine resin harvesting techniques.'
      },
      {
        id: '4-woodfired',
        title: 'Traditional Wood-Fired Bread Baking',
        price: 16,
        duration: '2 Hours',
        instructor: 'Champa Negi',
        category: 'Culinary',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
        description: 'Learn to bake traditional wheat breads and local Kumaoni sweet patties in a stone, wood-fired outdoor oven.'
      }
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Dieter K.',
        rating: 4.6,
        date: '2024-01-30',
        title: 'Perfect nature escape',
        text: 'Quiet, clean, and right next to beautiful forest paths. The fireplace was wonderful.',
        images: [],
        helpful: 7
      }
    ]
  },
  {
    id: 5,
    name: 'Nanda Devi View Cottage',
    image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=600&q=80',
    location: 'Munsiyari, Uttarakhand, India',
    latitude: 30.0682,
    longitude: 80.2372,
    rating: 4.9,
    reviews: 267,
    reviewsCount: 267,
    pricePerNight: 70,
    maxGuests: 4,
    amenities: ['Himalayan View', 'Trekking Guide', 'Hot Water', 'Traditional Tea', 'Kitchenette'],
    description: 'Stone cottage offering stunning views of Panchachuli and Nanda Devi peaks.',
    longDescription: 'Perched high in Munsiyari, this stone cottage provides breathtaking morning views of the Himalayan peaks. Perfect for bird watchers, trekkers, and travelers seeking high-altitude tranquility. Hosted by local guides who can organize low-impact treks.',
    facilities: [
      'Panoramic rooms',
      'Stone fireplace',
      'Hot water heaters',
      'Kitchenette setup',
      'Bird watching balcony',
      'Local trekking guide booking'
    ],
    localExperiences: [
      {
        id: '5-woolens',
        title: 'Bhotia Weaving & Woolcraft Workshop',
        price: 22,
        duration: '3 Hours',
        instructor: 'Savitri Devi',
        category: 'Crafts',
        image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=400&q=80',
        description: 'Discover the traditional woolcraft of the local Bhotia tribe, learn about sheep shearing, wool-spinning, and loom-weaving beautiful carpets.'
      },
      {
        id: '5-birding',
        title: 'Monal & Himalayan Birding Expedition',
        price: 30,
        duration: '4 Hours',
        instructor: 'Devendra Singh',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=400&q=80',
        description: 'Track the majestic, colorful Himalayan Monal (state bird of Uttarakhand) and other rare high-altitude species through rhododendron forests.'
      }
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Aisha A.',
        rating: 5,
        date: '2024-02-18',
        title: 'Unbelievable mountain life',
        text: 'Saw Himalayan eagles right from our balcony. Absolutely stunning location.',
        images: [],
        helpful: 25
      }
    ]
  },
  {
    id: 6,
    name: 'Oak Forest Farmhouse',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=600&q=80',
    location: 'Mukteshwar, Uttarakhand, India',
    latitude: 29.4722,
    longitude: 79.6467,
    rating: 4.7,
    reviews: 178,
    reviewsCount: 178,
    pricePerNight: 75,
    maxGuests: 6,
    amenities: ['Organic Orchards', 'Yoga Space', 'Traditional Kitchen', 'Bicycles', 'Veranda'],
    description: 'Serene farmhouse surrounded by organic fruit orchards and oak forests.',
    longDescription: 'Stay at our organic family farm in Mukteshwar. Wake up to views of the snow peaks, pick fresh seasonal apples and plums, participate in forest conservation walks, and enjoy home-cooked organic meals under the veranda.',
    facilities: [
      'Spacious farmhouse rooms',
      'Organic farm gardens',
      'Yoga platform',
      'Local bicycles',
      'Scenic view veranda',
      'Home-cooked dining hall'
    ],
    localExperiences: [
      {
        id: '6-jam',
        title: 'Organic Plum & Apricot Jam Making',
        price: 18,
        duration: '2 Hours',
        instructor: 'Preeti Shah',
        category: 'Culinary',
        image: 'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&w=400&q=80',
        description: 'Harvest organic stone fruits directly from our orchards and learn the family recipe for cooking, preserving, and bottling organic jams.'
      },
      {
        id: '6-beekeeping',
        title: 'Apiculture & Pahadi Honey Harvesting',
        price: 20,
        duration: '2 Hours',
        instructor: 'Ramesh Shah',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=400&q=80',
        description: 'Put on a safety suit and inspect beehives, learn about regional flora that shapes the unique bitter-sweet taste of local wildflower honey.'
      }
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Kadek W.',
        rating: 5,
        date: '2024-03-11',
        title: 'Authentic hills experience',
        text: 'It felt like staying with family. The farming activities were very insightful.',
        images: [],
        helpful: 12
      }
    ]
  },
  {
    id: 7,
    name: 'Nainital Lakeside Heritage Home',
    image: 'https://images.unsplash.com/photo-1566908829550-e6551b00979b?auto=format&fit=crop&w=600&q=80',
    location: 'Nainital, Uttarakhand, India',
    latitude: 29.3919,
    longitude: 79.4542,
    rating: 4.8,
    reviews: 112,
    reviewsCount: 112,
    pricePerNight: 85,
    maxGuests: 4,
    amenities: ['Lake View', 'Vintage Decor', 'Balcony', 'Library', 'Breakfast Included'],
    description: 'A beautifully restored British-era heritage home overlooking the Naini Lake.',
    longDescription: 'Step back in time at our carefully preserved heritage homestay. Wake up to the serene views of Naini Lake from your private balcony. Enjoy reading in our vintage library, savor authentic Kumaoni breakfast, and take leisurely strolls down the historic Mall Road just minutes away.',
    facilities: [
      'Heritage furnished rooms',
      'Lake-facing balconies',
      'In-house library',
      'Antique fireplace',
      'Complimentary breakfast',
      'Fast WiFi'
    ],
    localExperiences: [
      {
        id: '7-heritage',
        title: 'Guided Heritage Walk of Nainital',
        price: 25,
        duration: '2 Hours',
        instructor: 'Dr. Ajay Rawat',
        category: 'Culture',
        image: 'https://images.unsplash.com/photo-1585828068970-87779d722d7d?auto=format&fit=crop&w=400&q=80',
        description: 'Explore the colonial architecture, historical churches, and hidden stories of Nainital with a local historian.'
      }
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Samuel L.',
        rating: 5,
        date: '2024-04-20',
        title: 'Classic elegance',
        text: 'The view of the lake at night from the balcony is magical. Highly recommend!',
        images: [],
        helpful: 16
      }
    ]
  },
  {
    id: 8,
    name: 'Kedarnath Valley Guest House',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    location: 'Guptkashi, Uttarakhand, India',
    latitude: 30.5222,
    longitude: 79.0767,
    rating: 4.6,
    reviews: 95,
    reviewsCount: 95,
    pricePerNight: 45,
    maxGuests: 6,
    amenities: ['Mountain View', 'Spiritual Retreat', 'Local Food', 'Temple Access'],
    description: 'A peaceful resting place for pilgrims and trekkers heading to Kedarnath.',
    longDescription: 'Our humble guest house in Guptkashi serves as the perfect base camp for your spiritual journey to Kedarnath. We provide clean, warm rooms, nutritious local meals, and can arrange local transport and trekking guides for your temple visit.',
    facilities: [
      'Clean comfortable rooms',
      'Hot water available',
      'Vegetarian dining hall',
      'Trek planning assistance',
      'Luggage storage'
    ],
    localExperiences: [
      {
        id: '8-temple',
        title: 'Guptkashi Temple Tour & Aarti',
        price: 10,
        duration: '1.5 Hours',
        instructor: 'Pandit Sharma',
        category: 'Spiritual',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=400&q=80',
        description: 'Visit the ancient Vishwanath Temple of Guptkashi and participate in the evening Aarti ceremony.'
      }
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Amit P.',
        rating: 4.5,
        date: '2024-05-15',
        title: 'Great basecamp',
        text: 'Perfect place to rest before the big trek. The hosts were very helpful with arrangements.',
        images: [],
        helpful: 22
      }
    ]
  },
  {
    id: 9,
    name: 'Lansdowne Cantonment Homestay',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80',
    location: 'Lansdowne, Uttarakhand, India',
    latitude: 29.8377,
    longitude: 78.6871,
    rating: 4.8,
    reviews: 134,
    reviewsCount: 134,
    pricePerNight: 55,
    maxGuests: 4,
    amenities: ['Pine View', 'Heritage Property', 'Library', 'Garden', 'Home Cooked Meals'],
    description: 'A restored colonial-era bungalow surrounded by thick pine and oak forests.',
    longDescription: 'Experience the colonial charm of Lansdowne in our meticulously restored bungalow. Set amidst thick pine and oak forests, our homestay offers a tranquil retreat. Enjoy our curated library, relax in the expansive garden, and savor delicious Garhwali cuisine prepared by our family.',
    facilities: [
      'Colonial-era architecture',
      'Spacious pine-view rooms',
      'Large garden with seating',
      'Cozy reading room',
      'Authentic local meals',
      'Bonfire on request'
    ],
    localExperiences: [
      {
        id: '9-history',
        title: 'Garhwal Rifles Heritage Walk',
        price: 15,
        duration: '2 Hours',
        instructor: 'Col. Bisht (Retd.)',
        category: 'History',
        image: 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?auto=format&fit=crop&w=400&q=80',
        description: 'Take a guided walk through the cantonment area, learning about the rich history of the Garhwal Rifles and local colonial architecture.'
      }
    ],
    reviewsList: [
      {
        id: 1,
        author: 'Meera S.',
        rating: 5,
        date: '2024-05-18',
        title: 'Beautiful heritage stay',
        text: 'The house is gorgeous and the hosts are incredibly polite. The food was a major highlight.',
        images: [],
        helpful: 14
      }
    ]
  },
  {
    id: 10,
    name: 'Haridwar Riverside Ashram Stay',
    image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=600&q=80',
    location: 'Haridwar, Uttarakhand, India',
    latitude: 29.9457,
    longitude: 78.1642,
    rating: 4.7,
    reviews: 198,
    reviewsCount: 198,
    pricePerNight: 35,
    maxGuests: 2,
    amenities: ['River View', 'Yoga Classes', 'Vegetarian Meals', 'Meditation Hall', 'Spiritual Library'],
    description: 'A peaceful ashram experience right on the banks of the holy Ganges.',
    longDescription: 'Disconnect from the modern world and immerse yourself in spiritual living at our riverside ashram. We offer simple, clean accommodations with beautiful views of the Ganges. Join daily yoga and meditation sessions, and participate in our sustainable community initiatives.',
    facilities: [
      'Simple, clean rooms',
      'Riverside meditation hall',
      'Daily yoga classes',
      'Sattvic vegetarian dining',
      'Spiritual library',
      'Direct river access'
    ],
    localExperiences: [
      {
        id: '10-aarti',
        title: 'Private Ganga Aarti & Chanting',
        price: 12,
        duration: '1.5 Hours',
        instructor: 'Swami Govind',
        category: 'Spiritual',
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=400&q=80',
        description: 'Participate in a private, intimate Aarti ceremony by the riverbank, away from the main crowds, followed by Vedic chanting.'
      }
    ],
    reviewsList: [
      {
        id: 1,
        author: 'David W.',
        rating: 4.5,
        date: '2024-04-05',
        title: 'Transformative experience',
        text: 'A very authentic ashram stay. Simple living but very profound. The yoga classes are excellent.',
        images: [],
        helpful: 35
      }
    ]
  },
  ...extraHomestays
];
