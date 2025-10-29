const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Newspaper = require('./models/newspaperModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI.replace('<PASSWORD>', process.env.MONGO_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const sampleNewspapers = [
  {
    name: 'The Times of India',
    description: 'India\'s largest selling English daily newspaper, offering comprehensive coverage of national and international news, business, sports, entertainment, and more.',
    publisher: 'Bennett, Coleman & Co. Ltd.',
    languages: ['English'],
    categories: ['daily', 'business', 'sports', 'entertainment'],
    price: {
      monthly: 300,
      quarterly: 850,
      yearly: 3200,
    },
    coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    images: [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      'https://images.unsplash.com/photo-1586339949216-35c2747e8dc2?w=800',
    ],
    ratingsAverage: 4.5,
    ratingsQuantity: 1250,
  },
  {
    name: 'The Hindu',
    description: 'One of India\'s most respected newspapers, known for its in-depth analysis, quality journalism, and comprehensive coverage of national and international affairs.',
    publisher: 'The Hindu Group',
    languages: ['English'],
    categories: ['daily', 'politics', 'business'],
    price: {
      monthly: 280,
      quarterly: 800,
      yearly: 3000,
    },
    coverImage: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800',
    images: [
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800',
    ],
    ratingsAverage: 4.7,
    ratingsQuantity: 980,
  },
  {
    name: 'Hindustan Times',
    description: 'Leading English daily providing latest news, breaking news, and current affairs from India and around the world.',
    publisher: 'HT Media Ltd.',
    languages: ['English'],
    categories: ['daily', 'sports', 'entertainment'],
    price: {
      monthly: 290,
      quarterly: 820,
      yearly: 3100,
    },
    coverImage: 'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800',
    images: [
      'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800',
    ],
    ratingsAverage: 4.4,
    ratingsQuantity: 850,
  },
  {
    name: 'Dainik Jagran',
    description: 'India\'s most widely read Hindi newspaper, providing comprehensive coverage of news, politics, sports, and entertainment.',
    publisher: 'Jagran Prakashan Ltd.',
    languages: ['Hindi'],
    categories: ['daily', 'politics', 'sports'],
    price: {
      monthly: 250,
      quarterly: 700,
      yearly: 2600,
    },
    coverImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
    images: [
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
    ],
    ratingsAverage: 4.6,
    ratingsQuantity: 1500,
  },
  {
    name: 'Amar Ujala',
    description: 'Popular Hindi daily newspaper covering news, sports, business, and entertainment from across India.',
    publisher: 'Amar Ujala Publications Ltd.',
    languages: ['Hindi'],
    categories: ['daily', 'business', 'sports'],
    price: {
      monthly: 240,
      quarterly: 680,
      yearly: 2500,
    },
    coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    images: [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    ],
    ratingsAverage: 4.3,
    ratingsQuantity: 720,
  },
  {
    name: 'The Economic Times',
    description: 'India\'s leading business newspaper providing latest news on economy, finance, markets, and corporate affairs.',
    publisher: 'Bennett, Coleman & Co. Ltd.',
    languages: ['English'],
    categories: ['daily', 'business', 'technology'],
    price: {
      monthly: 350,
      quarterly: 1000,
      yearly: 3800,
    },
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    ],
    ratingsAverage: 4.8,
    ratingsQuantity: 650,
  },
  {
    name: 'Mumbai Mirror',
    description: 'Mumbai\'s popular tabloid newspaper covering local news, entertainment, sports, and lifestyle.',
    publisher: 'The Times Group',
    languages: ['English'],
    categories: ['daily', 'entertainment', 'sports'],
    price: {
      monthly: 200,
      quarterly: 550,
      yearly: 2000,
    },
    coverImage: 'https://images.unsplash.com/photo-1586339949216-35c2747e8dc2?w=800',
    images: [
      'https://images.unsplash.com/photo-1586339949216-35c2747e8dc2?w=800',
    ],
    ratingsAverage: 4.2,
    ratingsQuantity: 450,
  },
  {
    name: 'Indian Express',
    description: 'Trusted source for latest news, breaking news, and current affairs from India and the world.',
    publisher: 'The Indian Express Group',
    languages: ['English'],
    categories: ['daily', 'politics', 'business'],
    price: {
      monthly: 270,
      quarterly: 770,
      yearly: 2900,
    },
    coverImage: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800',
    images: [
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800',
    ],
    ratingsAverage: 4.6,
    ratingsQuantity: 890,
  },
  {
    name: 'Deccan Chronicle',
    description: 'Leading English daily from South India covering news, sports, entertainment, and lifestyle.',
    publisher: 'Deccan Chronicle Holdings Limited',
    languages: ['English'],
    categories: ['daily', 'sports', 'entertainment'],
    price: {
      monthly: 260,
      quarterly: 740,
      yearly: 2800,
    },
    coverImage: 'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800',
    images: [
      'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800',
    ],
    ratingsAverage: 4.3,
    ratingsQuantity: 520,
  },
  {
    name: 'Business Standard',
    description: 'Premier business newspaper providing comprehensive coverage of Indian economy, finance, and corporate news.',
    publisher: 'Business Standard Private Ltd.',
    languages: ['English'],
    categories: ['daily', 'business', 'technology'],
    price: {
      monthly: 340,
      quarterly: 970,
      yearly: 3700,
    },
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    ],
    ratingsAverage: 4.7,
    ratingsQuantity: 430,
  },
];

const importData = async () => {
  try {
    await Newspaper.create(sampleNewspapers);
    console.log('✅ Sample newspapers imported successfully!');
    console.log(`📰 Total newspapers added: ${sampleNewspapers.length}`);
  } catch (err) {
    console.error('❌ Error importing data:', err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Newspaper.deleteMany();
    console.log('✅ All newspapers deleted successfully!');
  } catch (err) {
    console.error('❌ Error deleting data:', err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Please specify --import or --delete');
  process.exit();
}
