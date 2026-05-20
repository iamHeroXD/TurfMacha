import React from 'react';
import { MapPin, Users, Target } from 'lucide-react';
export function About() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-turf-emerald mb-6">
            About TurfMacha
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We are on a mission to make sports accessible to everyone in Kerala,
            starting with our home city, Trivandrum.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative h-[400px] rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=1200"
              alt="Playing football"
              className="w-full h-full object-cover" />
            
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-turf-emerald mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              TurfMacha was born out of frustration. As avid football players in
              Trivandrum, we spent more time calling turf owners to check
              availability than actually playing on the ground.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We realized there had to be a better way. A platform that connects
              players with grounds instantly, transparently, and seamlessly.
              Today, TurfMacha is building the digital infrastructure for
              recreational sports in Kerala.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-turf-cream rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-turf-emerald" />
            </div>
            <h3 className="text-xl font-bold mb-3">Local First</h3>
            <p className="text-gray-600">
              Built in Kerala, for Kerala. We understand the local sports
              culture better than anyone else.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-turf-cream rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-turf-emerald" />
            </div>
            <h3 className="text-xl font-bold mb-3">Community Driven</h3>
            <p className="text-gray-600">
              We're not just a booking app; we're building a community of
              passionate sports enthusiasts.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-turf-cream rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-turf-emerald" />
            </div>
            <h3 className="text-xl font-bold mb-3">Seamless Experience</h3>
            <p className="text-gray-600">
              From finding a turf to splitting payments, we focus on removing
              friction from playing sports.
            </p>
          </div>
        </div>
      </div>
    </div>);

}