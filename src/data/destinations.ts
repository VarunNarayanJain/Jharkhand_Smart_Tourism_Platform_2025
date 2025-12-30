// import { Car, Bus, Train } from 'lucide-react';

// export interface Destination {
//   id: number;
//   name: string;
//   tagline: string;
//   description: string;
//   location: string;
//   coordinates: { lat: number; lng: number };
//   bestTime: string;
//   weather: {
//     temperature: number;
//     condition: string;
//     humidity: number;
//     windSpeed: number;
//   };
//   images: string[];
//   videos: string[];
//   reviews: {
//     id: number;
//     user: string;
//     rating: number;
//     comment: string;
//     date: string;
//     avatar: string;
//   }[];
//   localGuides: {
//     id: number;
//     name: string;
//     experience: string;
//     languages: string[];
//     specialties: string[];
//     rating: number;
//     hourlyRate: string;
//     avatar: string;
//     description: string;
//     contact: string;
//     verificationStatus?: 'verified' | 'pending' | 'unverified';
//   }[];
//   localEateries: {
//     name: string;
//     cuisine: string;
//     rating: number;
//     priceRange: string;
//     specialties: string[];
//     image: string;
//   }[];
//   transportation: {
//     mode: string;
//     details: string;
//     duration: string;
//     cost: string;
//     icon: any;
//   }[];
//   famousProducts: {
//     name: string;
//     description: string;
//     image: string;
//     price: string;
//     marketplaceId: string;
//   }[];
// }

// export const destinationsData: Destination[] = [
//   {
//     id: 1,
//     name: 'Netarhat',
//     tagline: 'Queen of Chotanagpur Plateau',
//     description: 'Netarhat, often called the "Queen of Chotanagpur Plateau," is a picturesque hill station located in the Latehar district of Jharkhand. Known for its breathtaking sunrise views, cool climate, and dense pine forests, it offers a perfect escape from the hustle and bustle of city life. The place gets its name from "Netar" meaning "eye" and "Hat" meaning "market," suggesting it was once a trading center.',
//     location: 'Latehar District, Jharkhand, India',
//     coordinates: { lat: 23.4707, lng: 84.2678 },
//     bestTime: 'October to March (Pleasant weather, clear skies for sunrise views)',
//     weather: {
//       temperature: 22,
//       condition: 'Partly Cloudy',
//       humidity: 65,
//       windSpeed: 12
//     },
//     images: [
//       '/n2.jpg',
//       '/n3.jpg',
//       '/n4.jpg',
//       // '/n5.jpg'
//     ],
//     videos: [
//       'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
//       'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
//     ],
//     reviews: [
//       {
//         id: 1,
//         user: 'Priya Sharma',
//         rating: 5,
//         comment: 'Absolutely breathtaking sunrise views! The pine forests and cool climate make it perfect for nature lovers. Highly recommend visiting during winter.',
//         date: '2024-01-15',
//         avatar: '/Priya.jpg'
//       },
//       {
//         id: 2,
//         user: 'Rahul Kumar',
//         rating: 4,
//         comment: 'Great place for photography. The sunset point offers amazing views. Local tribal culture is fascinating to explore.',
//         date: '2024-01-10',
//         avatar: '/Priya.jpg'
//       },
//       {
//         id: 3,
//         user: 'Anjali Patel',
//         rating: 5,
//         comment: 'Perfect weekend getaway from Ranchi. The Netarhat Dam and Magnolia Point are must-visit spots. Food at local dhabas is delicious!',
//         date: '2024-01-05',
//         avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
//       }
//     ],
//     localGuides: [
//       {
//         id: 1,
//         name: 'Rajesh Oraon',
//         experience: '8 years',
//         languages: ['Hindi', 'English', 'Oraon'],
//         specialties: ['Tribal Culture', 'Nature Trails', 'Photography Spots'],
//         rating: 4.8,
//         hourlyRate: '₹500/hour',
//         avatar: '/Oraon.jpg',
//         description: 'Local tribal guide with deep knowledge of Netarhat\'s culture, history, and hidden gems. Expert in sunrise photography and tribal village tours.',
//         contact: '+91 98765 43210',
//         verificationStatus: 'verified'
//       },
//       {
//         id: 2,
//         name: 'Priya Kumari',
//         experience: '5 years',
//         languages: ['Hindi', 'English', 'Bengali'],
//         specialties: ['Sunrise Tours', 'Local Cuisine', 'Adventure Activities'],
//         rating: 4.6,
//         hourlyRate: '₹400/hour',
//         avatar: '/Priya.jpg',
//         description: 'Certified tour guide specializing in sunrise viewing tours and local food experiences. Knows all the best viewpoints and local eateries.',
//         contact: '+91 98765 43211',
//         verificationStatus: 'pending'
//       },
//       {
//         id: 3,
//         name: 'Amit Kumar',
//         experience: '12 years',
//         languages: ['Hindi', 'English', 'Santhali'],
//         specialties: ['Historical Tours', 'Wildlife', 'Offbeat Trails'],
//         rating: 4.9,
//         hourlyRate: '₹600/hour',
//         avatar: '/Oraon.jpg',
//         description: 'Veteran guide with extensive knowledge of Netarhat\'s history, wildlife, and lesser-known trails. Perfect for adventure seekers and history buffs.',
//         contact: '+91 98765 43212',
//         verificationStatus: 'unverified'
//       }
//     ],
//     localEateries: [
//       {
//         name: 'Pine View Restaurant',
//         cuisine: 'Local & Continental',
//         rating: 4.5,
//         priceRange: '₹₹',
//         specialties: ['Local Tribal Dishes', 'Fresh Pine Honey', 'Organic Vegetables'],
//         image: '/FastFood.jpg'
//       },
//       {
//         name: 'Sunset Point Dhaba',
//         cuisine: 'North Indian',
//         rating: 4.2,
//         priceRange: '₹',
//         specialties: ['Puri Sabzi', 'Dal Khichdi', 'Local Tea'],
//         image: '/FastFood2.jpg'
//       },
//       {
//         name: 'Netarhat Tribal Kitchen',
//         cuisine: 'Tribal Cuisine',
//         rating: 4.8,
//         priceRange: '₹₹',
//         specialties: ['Bamboo Rice', 'Forest Honey', 'Wild Mushrooms'],
//         image: '/FastFood3.jpeg'
//       }
//     ],
//     transportation: [
//       {
//         mode: 'By Road',
//         details: 'Well-connected by NH-75 from Ranchi',
//         duration: '4-5 hours',
//         cost: '₹800-1200',
//         icon: Car
//       },
//       {
//         mode: 'By Bus',
//         details: 'Regular bus services from Ranchi Bus Stand',
//         duration: '5-6 hours',
//         cost: '₹300-500',
//         icon: Bus
//       },
//       {
//         mode: 'By Train',
//         details: 'Nearest station: Latehar (40 km away)',
//         duration: '3 hours + 1 hour taxi',
//         cost: '₹200-400 + ₹500 taxi',
//         icon: Train
//       }
//     ],
//     famousProducts: [
//       {
//         name: 'Pine Honey',
//         description: 'Pure honey collected from pine forests of Netarhat',
//         image: 'https://images.pexels.com/photos/42059/citrus-diet-fruits-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
//         price: '₹450',
//         marketplaceId: 'pine-honey-001'
//       },
//       {
//         name: 'Tribal Handicrafts',
//         description: 'Beautiful handcrafted items by local tribal artisans',
//         image: 'https://images.pexels.com/photos/42059/citrus-diet-fruits-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
//         price: '₹200-800',
//         marketplaceId: 'tribal-crafts-002'
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: 'Hundru Falls',
//     tagline: 'Thundering Beauty',
//     description: 'Hundru Falls is one of the most spectacular waterfalls in Jharkhand, where the Subarnarekha River creates a magnificent 98-meter cascade. The waterfall is surrounded by lush greenery and offers breathtaking views, especially during the monsoon season when the water flow is at its peak.',
//     location: 'Ranchi District, Jharkhand, India',
//     coordinates: { lat: 23.3441, lng: 85.3096 },
//     bestTime: 'July to January (Best water flow during monsoon)',
//     weather: {
//       temperature: 28,
//       condition: 'Sunny',
//       humidity: 70,
//       windSpeed: 8
//     },
//     images: [
//       '/h2.jpg',
//       '/h1.jpg',
//       '/h3.jpg'
//     ],
//     videos: [
//       'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
//     ],
//     reviews: [
//       {
//         id: 1,
//         user: 'Vikram Singh',
//         rating: 5,
//         comment: 'Amazing waterfall! The sound of water is mesmerizing. Perfect for nature photography.',
//         date: '2024-01-20',
//         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
//       },
//       {
//         id: 2,
//         user: 'Meera Patel',
//         rating: 4,
//         comment: 'Beautiful place but be careful during monsoon. The rocks can be slippery.',
//         date: '2024-01-18',
//         avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
//       }
//     ],
//     localGuides: [
//       {
//         id: 4,
//         name: 'Suresh Mahato',
//         experience: '6 years',
//         languages: ['Hindi', 'English'],
//         specialties: ['Waterfall Tours', 'Photography', 'Safety Guidance'],
//         rating: 4.7,
//         hourlyRate: '₹450/hour',
//         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
//         description: 'Local expert guide for Hundru Falls with deep knowledge of the best viewing spots, photography angles, and safety precautions.',
//         contact: '+91 98765 43213',
//         verificationStatus: 'verified'
//       },
//       {
//         id: 5,
//         name: 'Rekha Devi',
//         experience: '4 years',
//         languages: ['Hindi', 'English', 'Bengali'],
//         specialties: ['Nature Walks', 'Local History', 'Cultural Tours'],
//         rating: 4.5,
//         hourlyRate: '₹350/hour',
//         avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
//         description: 'Knowledgeable guide specializing in the natural history and cultural significance of Hundru Falls and surrounding areas.',
//         contact: '+91 98765 43214',
//         verificationStatus: 'pending'
//       }
//     ],
//     localEateries: [
//       {
//         name: 'Waterfall View Restaurant',
//         cuisine: 'Local Cuisine',
//         rating: 4.3,
//         priceRange: '₹₹',
//         specialties: ['Local Fish Curry', 'Rice Dishes', 'Fresh Coconut Water'],
//         image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
//       }
//     ],
//     transportation: [
//       {
//         mode: 'By Road',
//         details: '45 km from Ranchi city center',
//         duration: '1-1.5 hours',
//         cost: '₹300-500',
//         icon: Car
//       },
//       {
//         mode: 'By Bus',
//         details: 'Local bus services available',
//         duration: '2 hours',
//         cost: '₹50-100',
//         icon: Bus
//       }
//     ],
//     famousProducts: [
//       {
//         name: 'Local Handicrafts',
//         description: 'Traditional tribal handicrafts and souvenirs',
//         image: 'https://images.pexels.com/photos/42059/citrus-diet-fruits-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
//         price: '₹150-500',
//         marketplaceId: 'hundru-crafts-001'
//       }
//     ]
//   },
//   {
//     id: 3,
//     name: 'Betla National Park',
//     tagline: 'Wildlife Paradise',
//     description: 'Betla National Park, often called the "Wildlife Paradise," is a picturesque hill station located in the Latehar district of Jharkhand. Known for its breathtaking sunrise views, cool climate, and dense pine forests, it offers a perfect escape from the hustle and bustle of city life. The place gets its name from "Netar" meaning "eye" and "Hat" meaning "market," suggesting it was once a trading center.',
//     location: 'Latehar District, Jharkhand, India',
//     coordinates: { lat: 23.4707, lng: 84.2678 },
//     bestTime: 'October to March (Pleasant weather, clear skies for sunrise views)',
//     weather: {
//       temperature: 29,
//       condition: 'Partly Cloudy',
//       humidity: 65,
//       windSpeed: 12
//     },
//     images: [
//       '/b1.jpg',
//       '/b2.jpg',
//       // '/b3.jpg',
//       '/b4.jpg'
//     ],
//     videos: [
//       'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
//       'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
//     ],
//     reviews: [
//       {
//         id: 1,
//         user: 'Priya Sharma',
//         rating: 5,
//         comment: 'Absolutely breathtaking sunrise views! The pine forests and cool climate make it perfect for nature lovers. Highly recommend visiting during winter.',
//         date: '2024-01-15',
//         avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
//       },
//       {
//         id: 2,
//         user: 'Rahul Kumar',
//         rating: 4,
//         comment: 'Great place for photography. The sunset point offers amazing views. Local tribal culture is fascinating to explore.',
//         date: '2024-01-10',
//         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
//       },
//       {
//         id: 3,
//         user: 'Anjali Patel',
//         rating: 5,
//         comment: 'Perfect weekend getaway from Ranchi. The Netarhat Dam and Magnolia Point are must-visit spots. Food at local dhabas is delicious!',
//         date: '2024-01-05',
//         avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
//       }
//     ],
//     localGuides: [
//       {
//         id: 1,
//         name: 'Rajesh Oraon',
//         experience: '8 years',
//         languages: ['Hindi', 'English', 'Oraon'],
//         specialties: ['Tribal Culture', 'Nature Trails', 'Photography Spots'],
//         rating: 4.8,
//         hourlyRate: '₹500/hour',
//         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
//         description: 'Local tribal guide with deep knowledge of Netarhat\'s culture, history, and hidden gems. Expert in sunrise photography and tribal village tours.',
//         contact: '+91 98765 43210',
//         verificationStatus: 'verified'
//       },
//       {
//         id: 2,
//         name: 'Priya Kumari',
//         experience: '5 years',
//         languages: ['Hindi', 'English', 'Bengali'],
//         specialties: ['Sunrise Tours', 'Local Cuisine', 'Adventure Activities'],
//         rating: 4.6,
//         hourlyRate: '₹400/hour',
//         avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
//         description: 'Certified tour guide specializing in sunrise viewing tours and local food experiences. Knows all the best viewpoints and local eateries.',
//         contact: '+91 98765 43211',
//         verificationStatus: 'unverified'
//       },
//       {
//         id: 3,
//         name: 'Amit Kumar',
//         experience: '12 years',
//         languages: ['Hindi', 'English', 'Santhali'],
//         specialties: ['Historical Tours', 'Wildlife', 'Offbeat Trails'],
//         rating: 4.9,
//         hourlyRate: '₹600/hour',
//         avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
//         description: 'Veteran guide with extensive knowledge of Netarhat\'s history, wildlife, and lesser-known trails. Perfect for adventure seekers and history buffs.',
//         contact: '+91 98765 43212',
//         verificationStatus: 'pending'
//       }
//     ],
//     localEateries: [
//       {
//         name: 'Pine View Restaurant',
//         cuisine: 'Local & Continental',
//         rating: 4.5,
//         priceRange: '₹₹',
//         specialties: ['Local Tribal Dishes', 'Fresh Pine Honey', 'Organic Vegetables'],
//         image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
//       },
//       {
//         name: 'Sunset Point Dhaba',
//         cuisine: 'North Indian',
//         rating: 4.2,
//         priceRange: '₹',
//         specialties: ['Puri Sabzi', 'Dal Khichdi', 'Local Tea'],
//         image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
//       },
//       {
//         name: 'Netarhat Tribal Kitchen',
//         cuisine: 'Tribal Cuisine',
//         rating: 4.8,
//         priceRange: '₹₹',
//         specialties: ['Bamboo Rice', 'Forest Honey', 'Wild Mushrooms'],
//         image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
//       }
//     ],
//     transportation: [
//       {
//         mode: 'By Road',
//         details: 'Well-connected by NH-75 from Ranchi',
//         duration: '4-5 hours',
//         cost: '₹800-1200',
//         icon: Car
//       },
//       {
//         mode: 'By Bus',
//         details: 'Regular bus services from Ranchi Bus Stand',
//         duration: '5-6 hours',
//         cost: '₹300-500',
//         icon: Bus
//       },
//       {
//         mode: 'By Train',
//         details: 'Nearest station: Latehar (40 km away)',
//         duration: '3 hours + 1 hour taxi',
//         cost: '₹200-400 + ₹500 taxi',
//         icon: Train
//       }
//     ],
//     famousProducts: [
//       {
//         name: 'Pine Honey',
//         description: 'Pure honey collected from pine forests of Netarhat',
//         image: 'https://images.pexels.com/photos/42059/citrus-diet-fruits-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
//         price: '₹450',
//         marketplaceId: 'pine-honey-001'
//       },
//       {
//         name: 'Tribal Handicrafts',
//         description: 'Beautiful handcrafted items by local tribal artisans',
//         image: 'https://images.pexels.com/photos/42059/citrus-diet-fruits-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
//         price: '₹200-800',
//         marketplaceId: 'tribal-crafts-002'
//       }
//     ]
//   },
//   {
//     id: 4,
//     name: 'Deogarh',
//     tagline: 'Religious Gem for Jharkhand',
//     description: 'Deogarh, often called the "Religious GEM of Jharkhand," is a picturesque hill station located in the Latehar district of Jharkhand. Known for its breathtaking sunrise views, cool climate, and dense pine forests, it offers a perfect escape from the hustle and bustle of city life. The place gets its name from "Netar" meaning "eye" and "Hat" meaning "market," suggesting it was once a trading center.',
//     location: 'Latehar District, Jharkhand, India',
//     coordinates: { lat: 23.4707, lng: 84.2678 },
//     bestTime: 'October to March (Pleasant weather, clear skies for sunrise views)',
//     weather: {
//       temperature: 22,
//       condition: 'Partly Cloudy',
//       humidity: 65,
//       windSpeed: 12
//     },
//     images: [
//       '/deo2.jpg',
//       '/deo3.jpg',
//       '/deo4.jpg',
//       // '/deo5.jpg'
//     ],
//     videos: [
//       '/Deogarh.mp4',
//       'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
//     ],
//     reviews: [
//       {
//         id: 1,
//         user: 'Priya Sharma',
//         rating: 5,
//         comment: 'Absolutely breathtaking sunrise views! The pine forests and cool climate make it perfect for nature lovers. Highly recommend visiting during winter.',
//         date: '2024-01-15',
//         avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
//       },
//       {
//         id: 2,
//         user: 'Rahul Kumar',
//         rating: 4,
//         comment: 'Great place for photography. The sunset point offers amazing views. Local tribal culture is fascinating to explore.',
//         date: '2024-01-10',
//         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
//       },
//       {
//         id: 3,
//         user: 'Anjali Patel',
//         rating: 5,
//         comment: 'Perfect weekend getaway from Ranchi. The Netarhat Dam and Magnolia Point are must-visit spots. Food at local dhabas is delicious!',
//         date: '2024-01-05',
//         avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
//       }
//     ],
//     localGuides: [
//       {
//         id: 1,
//         name: 'Rajesh Oraon',
//         experience: '8 years',
//         languages: ['Hindi', 'English', 'Oraon'],
//         specialties: ['Tribal Culture', 'Nature Trails', 'Photography Spots'],
//         rating: 4.8,
//         hourlyRate: '₹500/hour',
//         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
//         description: 'Local tribal guide with deep knowledge of Netarhat\'s culture, history, and hidden gems. Expert in sunrise photography and tribal village tours.',
//         contact: '+91 98765 43210'
//       },
//       {
//         id: 2,
//         name: 'Priya Kumari',
//         experience: '5 years',
//         languages: ['Hindi', 'English', 'Bengali'],
//         specialties: ['Sunrise Tours', 'Local Cuisine', 'Adventure Activities'],
//         rating: 4.6,
//         hourlyRate: '₹400/hour',
//         avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
//         description: 'Certified tour guide specializing in sunrise viewing tours and local food experiences. Knows all the best viewpoints and local eateries.',
//         contact: '+91 98765 43211'
//       },
//       {
//         id: 3,
//         name: 'Amit Kumar',
//         experience: '12 years',
//         languages: ['Hindi', 'English', 'Santhali'],
//         specialties: ['Historical Tours', 'Wildlife', 'Offbeat Trails'],
//         rating: 4.9,
//         hourlyRate: '₹600/hour',
//         avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
//         description: 'Veteran guide with extensive knowledge of Netarhat\'s history, wildlife, and lesser-known trails. Perfect for adventure seekers and history buffs.',
//         contact: '+91 98765 43212'
//       }
//     ],
//     localEateries: [
//       {
//         name: 'Pine View Restaurant',
//         cuisine: 'Local & Continental',
//         rating: 4.5,
//         priceRange: '₹₹',
//         specialties: ['Local Tribal Dishes', 'Fresh Pine Honey', 'Organic Vegetables'],
//         image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
//       },
//       {
//         name: 'Sunset Point Dhaba',
//         cuisine: 'North Indian',
//         rating: 4.2,
//         priceRange: '₹',
//         specialties: ['Puri Sabzi', 'Dal Khichdi', 'Local Tea'],
//         image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
//       },
//       {
//         name: 'Netarhat Tribal Kitchen',
//         cuisine: 'Tribal Cuisine',
//         rating: 4.8,
//         priceRange: '₹₹',
//         specialties: ['Bamboo Rice', 'Forest Honey', 'Wild Mushrooms'],
//         image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
//       }
//     ],
//     transportation: [
//       {
//         mode: 'By Road',
//         details: 'Well-connected by NH-75 from Ranchi',
//         duration: '4-5 hours',
//         cost: '₹800-1200',
//         icon: Car
//       },
//       {
//         mode: 'By Bus',
//         details: 'Regular bus services from Ranchi Bus Stand',
//         duration: '5-6 hours',
//         cost: '₹300-500',
//         icon: Bus
//       },
//       {
//         mode: 'By Train',
//         details: 'Nearest station: Latehar (40 km away)',
//         duration: '3 hours + 1 hour taxi',
//         cost: '₹200-400 + ₹500 taxi',
//         icon: Train
//       }
//     ],
//     famousProducts: [
//       {
//         name: 'Pine Honey',
//         description: 'Pure honey collected from pine forests of Netarhat',
//         image: 'https://images.pexels.com/photos/42059/citrus-diet-fruits-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
//         price: '₹450',
//         marketplaceId: 'pine-honey-001'
//       },
//       {
//         name: 'Tribal Handicrafts',
//         description: 'Beautiful handcrafted items by local tribal artisans',
//         image: 'https://images.pexels.com/photos/42059/citrus-diet-fruits-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
//         price: '₹200-800',
//         marketplaceId: 'tribal-crafts-002'
//       }
//     ]
//   },
//   {
//     id: 5,
//     name: 'Hazaribagh',
//     tagline: 'Land of Thousand Gardens',
//     description: 'Hazaribagh, often called the "Land of Thousand Gardens," is a picturesque hill station located in the Latehar district of Jharkhand. Known for its breathtaking sunrise views, cool climate, and dense pine forests, it offers a perfect escape from the hustle and bustle of city life. The place gets its name from "Netar" meaning "eye" and "Hat" meaning "market," suggesting it was once a trading center.',
//     location: 'Latehar District, Jharkhand, India',
//     coordinates: { lat: 23.4707, lng: 84.2678 },
//     bestTime: 'October to March (Pleasant weather, clear skies for sunrise views)',
//     weather: {
//       temperature: 29,
//       condition: 'Partly Cloudy',
//       humidity: 65,
//       windSpeed: 12
//     },
//     images: [
//       '/haz1.jpg',
//       '/haz2.jpeg',
//       '/haz3.jpg',
//       // '/deo5.jpg'
//     ],
//     videos: [
//       'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
//       'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
//     ],
//     reviews: [
//       {
//         id: 1,
//         user: 'Priya Sharma',
//         rating: 5,
//         comment: 'Absolutely breathtaking sunrise views! The pine forests and cool climate make it perfect for nature lovers. Highly recommend visiting during winter.',
//         date: '2024-01-15',
//         avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
//       },
//       {
//         id: 2,
//         user: 'Rahul Kumar',
//         rating: 4,
//         comment: 'Great place for photography. The sunset point offers amazing views. Local tribal culture is fascinating to explore.',
//         date: '2024-01-10',
//         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
//       },
//       {
//         id: 3,
//         user: 'Anjali Patel',
//         rating: 5,
//         comment: 'Perfect weekend getaway from Ranchi. The Netarhat Dam and Magnolia Point are must-visit spots. Food at local dhabas is delicious!',
//         date: '2024-01-05',
//         avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
//       }
//     ],
//     localGuides: [
//       {
//         id: 1,
//         name: 'Rajesh Oraon',
//         experience: '8 years',
//         languages: ['Hindi', 'English', 'Oraon'],
//         specialties: ['Tribal Culture', 'Nature Trails', 'Photography Spots'],
//         rating: 4.8,
//         hourlyRate: '₹500/hour',
//         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
//         description: 'Local tribal guide with deep knowledge of Netarhat\'s culture, history, and hidden gems. Expert in sunrise photography and tribal village tours.',
//         contact: '+91 98765 43210'
//       },
//       {
//         id: 2,
//         name: 'Priya Kumari',
//         experience: '5 years',
//         languages: ['Hindi', 'English', 'Bengali'],
//         specialties: ['Sunrise Tours', 'Local Cuisine', 'Adventure Activities'],
//         rating: 4.6,
//         hourlyRate: '₹400/hour',
//         avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
//         description: 'Certified tour guide specializing in sunrise viewing tours and local food experiences. Knows all the best viewpoints and local eateries.',
//         contact: '+91 98765 43211'
//       },
//       {
//         id: 3,
//         name: 'Amit Kumar',
//         experience: '12 years',
//         languages: ['Hindi', 'English', 'Santhali'],
//         specialties: ['Historical Tours', 'Wildlife', 'Offbeat Trails'],
//         rating: 4.9,
//         hourlyRate: '₹600/hour',
//         avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
//         description: 'Veteran guide with extensive knowledge of Netarhat\'s history, wildlife, and lesser-known trails. Perfect for adventure seekers and history buffs.',
//         contact: '+91 98765 43212'
//       }
//     ],
//     localEateries: [
//       {
//         name: 'Pine View Restaurant',
//         cuisine: 'Local & Continental',
//         rating: 4.5,
//         priceRange: '₹₹',
//         specialties: ['Local Tribal Dishes', 'Fresh Pine Honey', 'Organic Vegetables'],
//         image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
//       },
//       {
//         name: 'Sunset Point Dhaba',
//         cuisine: 'North Indian',
//         rating: 4.2,
//         priceRange: '₹',
//         specialties: ['Puri Sabzi', 'Dal Khichdi', 'Local Tea'],
//         image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
//       },
//       {
//         name: 'Netarhat Tribal Kitchen',
//         cuisine: 'Tribal Cuisine',
//         rating: 4.8,
//         priceRange: '₹₹',
//         specialties: ['Bamboo Rice', 'Forest Honey', 'Wild Mushrooms'],
//         image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
//       }
//     ],
//     transportation: [
//       {
//         mode: 'By Road',
//         details: 'Well-connected by NH-75 from Ranchi',
//         duration: '4-5 hours',
//         cost: '₹800-1200',
//         icon: Car
//       },
//       {
//         mode: 'By Bus',
//         details: 'Regular bus services from Ranchi Bus Stand',
//         duration: '5-6 hours',
//         cost: '₹300-500',
//         icon: Bus
//       },
//       {
//         mode: 'By Train',
//         details: 'Nearest station: Latehar (40 km away)',
//         duration: '3 hours + 1 hour taxi',
//         cost: '₹200-400 + ₹500 taxi',
//         icon: Train
//       }
//     ],
//     famousProducts: [
//       {
//         name: 'Pine Honey',
//         description: 'Pure honey collected from pine forests of Netarhat',
//         image: 'https://images.pexels.com/photos/42059/citrus-diet-fruits-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
//         price: '₹450',
//         marketplaceId: 'pine-honey-001'
//       },
//       {
//         name: 'Tribal Handicrafts',
//         description: 'Beautiful handcrafted items by local tribal artisans',
//         image: 'https://images.pexels.com/photos/42059/citrus-diet-fruits-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
//         price: '₹200-800',
//         marketplaceId: 'tribal-crafts-002'
//       }
//     ]
//   }
// ];

// export const getDestinationById = (id: number): Destination | undefined => {
//   return destinationsData.find(dest => dest.id === id);
// };
