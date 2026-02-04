import React, { useState } from 'react';
import { FaFacebookSquare, FaTwitterSquare, FaInstagramSquare, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  const [activeTab, setActiveTab] = useState('Popular');

  // Tabs data
  const tabs = [
    'Popular',
    'Arts & culture',
    'Beach',
    'Mountains',
    'Outdoors',
    'Things to do',
    'Travel tips & inspiration',
    'Airbnb-friendly apartments'
  ];

  // Cities data for each tab
  const citiesData = {
    'Popular': [
      { name: 'Cleveland', type: 'Monthly Rentals' },
      { name: 'Philadelphia', type: 'Apartment rentals' },
      { name: 'Gulf Shores', type: 'Villa rentals' },
      { name: 'Montreal', type: 'Vacation rentals' },
      { name: 'Tokyo', type: 'Condo rentals' },
      { name: 'Charleston', type: 'Apartment rentals' },
      { name: 'Amsterdam', type: 'Apartment rentals' },
      { name: 'Raleigh', type: 'House rentals' },
      { name: 'Kauai', type: 'Vacation rentals' },
      { name: 'Whistler', type: 'Monthly Rentals' },
      { name: 'Portland', type: 'Monthly Rentals' },
      { name: 'West Palm Beach', type: 'Monthly Rentals' },
      { name: 'Galveston', type: 'House rentals' },
      { name: 'Charlotte', type: 'Villa rentals' },
      { name: 'Playa del Carmen', type: 'House rentals' },
      { name: 'Kyoto', type: 'Apartment rentals' },
      { name: 'St. Petersburg', type: 'Cottage rentals' }
    ],
    'Arts & culture': [
      { name: 'Paris', type: 'Art galleries' },
      { name: 'Florence', type: 'Museum tours' },
      { name: 'New York', type: 'Broadway shows' },
      { name: 'London', type: 'Theatre rentals' },
      { name: 'Barcelona', type: 'Architecture tours' },
      { name: 'Rome', type: 'Historical sites' }
    ],
    'Beach': [
      { name: 'Malibu', type: 'Beach houses' },
      { name: 'Miami', type: 'Oceanfront condos' },
      { name: 'Cancun', type: 'Beach resorts' },
      { name: 'Bali', type: 'Villa rentals' },
      { name: 'Hawaii', type: 'Beach cottages' }
    ],
    'Mountains': [
      { name: 'Aspen', type: 'Ski lodges' },
      { name: 'Banff', type: 'Mountain cabins' },
      { name: 'Zermatt', type: 'Alpine chalets' },
      { name: 'Lake Tahoe', type: 'Mountain homes' }
    ],
    'Outdoors': [
      { name: 'Yosemite', type: 'Camping sites' },
      { name: 'Grand Canyon', type: 'Lodge rentals' },
      { name: 'Yellowstone', type: 'Cabin rentals' },
      { name: 'Banff', type: 'Nature retreats' }
    ],
    'Things to do': [
      { name: 'Los Angeles', type: 'City tours' },
      { name: 'San Francisco', type: 'Food experiences' },
      { name: 'Seattle', type: 'Adventure activities' },
      { name: 'Austin', type: 'Music venues' }
    ],
    'Travel tips & inspiration': [
      { name: 'Travel Blog', type: 'Latest articles' },
      { name: 'Destination Guides', type: 'Expert tips' },
      { name: 'Packing Lists', type: 'Travel essentials' },
      { name: 'Budget Travel', type: 'Money-saving tips' }
    ],
    'Airbnb-friendly apartments': [
      { name: 'San Diego', type: 'Pet-friendly' },
      { name: 'Denver', type: 'Family-friendly' },
      { name: 'Nashville', type: 'Group stays' },
      { name: 'Portland', type: 'Long-term rentals' }
    ]
  };

  // Footer links data
  const footerSections = [
    {
      title: 'Support',
      links: [
        'Help Center',
        'Get help with a safety issue',
        'AirCover',
        'Travel insurance',
        'Anti-discrimination',
        'Disability support',
        'Cancellation options',
        'Report neighborhood concern'
      ]
    },
    {
      title: 'Hosting',
      links: [
        'Airbnb your home',
        'Airbnb your experience',
        'Airbnb your service',
        'AirCover for Hosts',
        'Hosting resources',
        'Community forum',
        'Hosting responsibly',
        'Airbnb-friendly apartments',
        'Join a free hosting class',
        'Find a co-host',
        'Refer a host'
      ]
    },
    {
      title: 'Airbnb',
      links: [
        '2025 Summer Release',
        'Newsroom',
        'Careers',
        'Investors',
        'Gift cards',
        'Airbnb.org emergency stays'
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Inspiration Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Inspiration for future getaways
        </h2>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium pb-4 whitespace-nowrap transition ${
                activeTab === tab
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-6">
          {citiesData[activeTab]?.map((city, index) => (
            <div key={index} className="cursor-pointer hover:underline">
              <h3 className="text-sm font-medium text-gray-900">{city.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{city.type}</p>
            </div>
          ))}
        </div>

        {activeTab === 'Popular' && (
          <button className="mt-6 text-sm font-semibold text-gray-900 hover:underline">
            Show more →
          </button>
        )}
      </div>

      {/* Footer Links Section */}
      <div className="border-t border-gray-200 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-sm text-gray-700 hover:underline block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Left Side - Copyright */}
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-4 text-sm text-gray-700">
              <span>© 2026 Airbnb, Inc.</span>
              <span>·</span>
              <a href="#" className="hover:underline">Privacy</a>
              <span>·</span>
              <a href="#" className="hover:underline">Terms</a>
              <span>·</span>
              <a href="#" className="hover:underline flex items-center">
                Your Privacy Choices
                <span className="ml-1 text-blue-600">🔵</span>
              </a>
            </div>

            {/* Right Side - Language, Currency, Social */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-900 hover:underline">
                <FaGlobe />
                <span>English (US)</span>
              </button>
              <button className="text-sm font-medium text-gray-900 hover:underline">
                $ USD
              </button>
              <div className="flex items-center space-x-3">
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  <FaFacebookSquare size={18} />
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  <FaTwitterSquare size={18} />
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  <FaInstagramSquare size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;