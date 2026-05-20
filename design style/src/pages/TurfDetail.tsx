import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Clock,
  Users,
  CheckCircle2,
  ArrowLeft,
  Calendar as CalendarIcon,
  Info } from
'lucide-react';
export function TurfDetail() {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  // Mock data for the selected turf
  const turf = {
    name: 'Kazhakootam Sports Hub',
    location: 'Near Technopark Phase 1, Kazhakootam, Trivandrum',
    rating: 4.9,
    reviews: 128,
    price: 1200,
    image:
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=1200',
    description:
    'Premium 5v5 and 7v7 artificial grass turf with FIFA certified quality. Excellent floodlights for night matches, ample parking, and clean washrooms available.',
    amenities: [
    'FIFA Certified Grass',
    'LED Floodlights',
    'Drinking Water',
    'Washrooms',
    'Parking',
    'Bibs & Balls Provided']

  };
  const dates = [
  'Today',
  'Tomorrow',
  'Wed, 12 Oct',
  'Thu, 13 Oct',
  'Fri, 14 Oct'];

  const slots = [
  {
    time: '06:00 AM',
    available: true
  },
  {
    time: '07:00 AM',
    available: false
  },
  {
    time: '08:00 AM',
    available: true
  },
  {
    time: '04:00 PM',
    available: true
  },
  {
    time: '05:00 PM',
    available: true
  },
  {
    time: '06:00 PM',
    available: false
  },
  {
    time: '07:00 PM',
    available: false
  },
  {
    time: '08:00 PM',
    available: true
  },
  {
    time: '09:00 PM',
    available: true
  },
  {
    time: '10:00 PM',
    available: true
  }];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/turfs"
        className="inline-flex items-center gap-2 text-turf-charcoal/60 hover:text-turf-emerald mb-6 transition-colors">
        
        <ArrowLeft className="w-4 h-4" /> Back to Turfs
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="h-[400px] rounded-3xl overflow-hidden relative">
            <img
              src={turf.image}
              alt={turf.name}
              className="w-full h-full object-cover" />
            
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-lg">{turf.rating}</span>
              <span className="text-sm text-gray-500">
                ({turf.reviews} reviews)
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                  {turf.name}
                </h1>
                <p className="text-gray-500 flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-turf-lime" />
                  {turf.location}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <div className="flex items-center gap-2 bg-turf-cream px-4 py-2 rounded-lg text-turf-emerald font-medium">
                <Users className="w-5 h-5" /> 5v5 / 7v7
              </div>
              <div className="flex items-center gap-2 bg-turf-cream px-4 py-2 rounded-lg text-turf-emerald font-medium">
                <Clock className="w-5 h-5" /> 24/7 Open
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3">About this turf</h3>
              <p className="text-gray-600 leading-relaxed">
                {turf.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {turf.amenities.map((amenity) =>
                <div
                  key={amenity}
                  className="flex items-center gap-2 text-gray-700">
                  
                    <CheckCircle2 className="w-5 h-5 text-turf-lime" />
                    {amenity}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-turf-emerald/10 sticky top-32">
            <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-gray-500 text-sm mb-1">Price per hour</p>
                <div className="text-3xl font-bold text-turf-emerald">
                  ₹{turf.price}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-turf-emerald" /> Select
                  Date
                </h4>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {dates.map((date, idx) =>
                <button
                  key={date}
                  onClick={() => setSelectedDate(idx)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedDate === idx ? 'bg-turf-emerald text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                  
                    {date}
                  </button>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-turf-emerald" /> Select Slot
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) =>
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${!slot.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' : selectedSlot === slot.time ? 'bg-turf-lime text-turf-emerald border-2 border-turf-lime' : 'bg-white text-gray-700 border border-gray-200 hover:border-turf-emerald'}`}>
                  
                    {slot.time}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-turf-cream/50 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-turf-emerald shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 leading-relaxed">
                Full payment is required to confirm the booking. Cancellations
                allowed up to 4 hours before the slot time.
              </p>
            </div>

            <button
              disabled={!selectedSlot}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selectedSlot ? 'bg-turf-emerald text-white hover:bg-turf-emerald/90 shadow-lg shadow-turf-emerald/20 hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              
              {selectedSlot ? `Book for ₹${turf.price}` : 'Select a slot'}
            </button>
          </div>
        </div>
      </div>
    </div>);

}