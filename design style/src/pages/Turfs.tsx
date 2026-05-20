import React, { useState } from 'react';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
const TURFS = [
{
  id: 1,
  name: 'Kazhakootam Sports Hub',
  location: 'Kazhakootam, Trivandrum',
  distance: '2.1 km',
  rating: 4.9,
  reviews: 128,
  price: 1200,
  image:
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800',
  tags: ['5v5', '7v7', 'Cricket']
},
{
  id: 2,
  name: 'Kowdiar Turf Arena',
  location: 'Kowdiar, Trivandrum',
  distance: '4.5 km',
  rating: 4.7,
  reviews: 89,
  price: 1500,
  image:
  'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba6?auto=format&fit=crop&q=80&w=800',
  tags: ['5v5', 'Football Only']
},
{
  id: 3,
  name: 'Technopark Green Field',
  location: 'Technopark Phase 3, Trivandrum',
  distance: '1.2 km',
  rating: 4.8,
  reviews: 210,
  price: 1000,
  image:
  'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=800',
  tags: ['7v7', 'Cricket', '24/7']
},
{
  id: 4,
  name: 'Pattom Play Zone',
  location: 'Pattom, Trivandrum',
  distance: '6.0 km',
  rating: 4.5,
  reviews: 64,
  price: 1100,
  image:
  'https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?auto=format&fit=crop&q=80&w=800',
  tags: ['5v5']
}];

export function Turfs() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-turf-emerald mb-2">
            Turfs in Trivandrum
          </h1>
          <p className="text-turf-charcoal/70">
            Find and book the best grounds near you.
          </p>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
              className="w-full bg-white border border-turf-emerald/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-turf-lime focus:border-transparent transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
            
          </div>
          <button className="bg-white border border-turf-emerald/10 p-3 rounded-xl hover:bg-turf-cream transition-colors flex items-center justify-center">
            <Filter className="w-5 h-5 text-turf-emerald" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TURFS.map((turf) =>
        <Link
          to={`/turfs/${turf.id}`}
          key={turf.id}
          className="bg-white rounded-3xl overflow-hidden shadow-sm border border-turf-emerald/5 hover:shadow-xl hover:border-turf-lime/50 transition-all group">
          
            <div className="relative h-56 overflow-hidden">
              <img
              src={turf.image}
              alt={turf.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-sm">{turf.rating}</span>
                <span className="text-xs text-gray-500">({turf.reviews})</span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-2 mb-3 flex-wrap">
                {turf.tags.map((tag) =>
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-wider bg-turf-cream text-turf-emerald px-2 py-1 rounded-md">
                
                    {tag}
                  </span>
              )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {turf.name}
              </h3>

              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-6">
                <MapPin className="w-4 h-4 text-turf-lime" />
                {turf.location} • {turf.distance}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div>
                  <span className="text-2xl font-bold text-turf-emerald">
                    ₹{turf.price}
                  </span>
                  <span className="text-gray-400 text-sm">/hr</span>
                </div>
                <button className="bg-turf-emerald text-white px-5 py-2 rounded-xl font-medium group-hover:bg-turf-lime group-hover:text-turf-emerald transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>);

}