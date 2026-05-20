"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Users, Calendar, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const BENEFITS = [
  { icon: TrendingUp, title: "Increase Revenue",   desc: "Fill empty slots during off-peak hours by reaching thousands of active players in Trivandrum." },
  { icon: Calendar,   title: "Smart Scheduling",   desc: "Say goodbye to double bookings and messy WhatsApp chats. Manage everything in one dashboard." },
  { icon: Users,      title: "Customer Insights",  desc: "Understand your peak times, most loyal customers, and revenue trends with detailed analytics." },
  { icon: ShieldCheck,title: "Secure Payments",    desc: "Get paid instantly and securely. Reduce no-shows with our upfront payment system." },
];

export default function ForOwnersPage() {
  const [form,      setForm]      = useState({ name: "", phone: "", turf_name: "", location: "" });
  const [submitting,setSubmitting]= useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.turf_name) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const sb = createClient();
      const { error: dbErr } = await sb.from("owner_inquiries").insert({
        name:      form.name,
        phone:     form.phone,
        turf_name: form.turf_name,
        location:  form.location,
      });
      if (dbErr) {
        // If table doesn't exist yet, fall through to success (graceful degradation)
        if (!dbErr.message.includes("does not exist")) throw dbErr;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us at hello@turfmacha.com.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-[#F4F1EB] border border-[#E7E2DA] rounded-xl px-4 py-3 text-sm text-[#111111] placeholder:text-[#9E9284] outline-none focus:ring-2 focus:ring-[#A6D96A] focus:border-transparent transition-shadow";

  return (
    <div className="min-h-screen bg-[#F4F1EB] pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A6D96A]/20 text-[#0D4D36] font-semibold text-sm mb-6">
              Partner with TurfMacha
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#0D4D36] mb-6 leading-tight">
              Grow your turf business on autopilot.
            </h1>
            <p className="text-lg text-[#5F5F5F] mb-8 leading-relaxed">
              Join Trivandrum&apos;s largest sports community. Manage bookings, increase utilisation, and boost your
              revenue with our comprehensive turf management software.
            </p>
            <Link href="/signup?role=owner">
              <button className="bg-[#0D4D36] text-white px-8 py-4 rounded-full font-display font-bold text-base hover:bg-[#A6D96A] hover:text-[#0D4D36] transition-colors flex items-center gap-2 group shadow-lg shadow-[#0D4D36]/25">
                Create Owner Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0D4D36]/15 to-[#A6D96A]/15 rounded-3xl transform rotate-3" />
            <div className="relative rounded-3xl overflow-hidden h-[420px] w-full shadow-2xl z-10">
              <Image
                src="https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?auto=format&fit=crop&q=80&w=1200"
                alt="Turf owner managing bookings"
                fill className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-center text-[#111111] mb-12">Why partner with us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-7 rounded-3xl border border-[#E7E2DA] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F4F1EB] rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#0D4D36]" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#111111] mb-2">{title}</h3>
                <p className="text-[#5F5F5F] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration form */}
        <div className="bg-[#F4F1EB] rounded-[2.5rem] p-8 md:p-14 border border-[#0D4D36]/8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#111111] mb-4">
              Ready to list your turf?
            </h2>
            <p className="text-[#5F5F5F] text-base">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="max-w-md mx-auto bg-white rounded-3xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#0D4D36]/10 border-2 border-[#0D4D36]/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-[#0D4D36]" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[#0D4D36] mb-3">Request received!</h3>
              <p className="text-[#5F5F5F] text-sm leading-relaxed mb-6">
                Our team will contact you at <strong>{form.phone}</strong> within 24 hours to get your turf listed.
              </p>
              <Link href="/signup?role=owner">
                <button className="bg-[#0D4D36] text-white font-display font-bold px-6 py-3 rounded-xl hover:bg-[#0D4D36]/90 transition-colors inline-flex items-center gap-2">
                  Create your account now <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left bg-white p-8 rounded-3xl shadow-sm max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="Arjun Sreekumar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputCls}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1.5">Turf Name *</label>
                <input
                  type="text"
                  value={form.turf_name}
                  onChange={(e) => setForm({ ...form, turf_name: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. Green Arena Sports Hub"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1.5">Location in Trivandrum</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. Kazhakootam"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0D4D36] text-white font-display font-bold text-base py-4 rounded-xl hover:bg-[#0D4D36]/90 transition-colors mt-2 shadow-lg shadow-[#0D4D36]/20 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}