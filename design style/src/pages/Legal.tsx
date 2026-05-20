import React from 'react';
export function Legal() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-turf-emerald mb-12">
          Legal Information
        </h1>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 prose prose-emerald max-w-none">
          <h2>Terms of Service</h2>
          <p>Last updated: October 1, 2023</p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using the TurfMacha application and website, you
            accept and agree to be bound by the terms and provision of this
            agreement.
          </p>

          <h3>2. Booking and Cancellation Policy</h3>
          <p>
            All bookings made through TurfMacha are subject to availability.
            Users may cancel their bookings up to 4 hours prior to the scheduled
            slot time for a full refund. Cancellations made within 4 hours of
            the slot time are non-refundable.
          </p>

          <h3>3. User Conduct</h3>
          <p>
            Users are expected to maintain proper conduct at the turf
            facilities. Any damage caused to the property will be the sole
            responsibility of the user who made the booking.
          </p>

          <hr className="my-12 border-gray-200" />

          <h2>Privacy Policy</h2>
          <p>Last updated: October 1, 2023</p>

          <h3>1. Information Collection</h3>
          <p>
            We collect information you provide directly to us, such as when you
            create or modify your account, request on-demand services, contact
            customer support, or otherwise communicate with us. This information
            may include: name, email, phone number, postal address, profile
            picture, payment method, and other information you choose to
            provide.
          </p>

          <h3>2. Use of Information</h3>
          <p>We may use the information we collect about you to:</p>
          <ul>
            <li>Provide, maintain, and improve our Services</li>
            <li>
              Process and facilitate transactions and send related information
            </li>
            <li>Send support and administrative messages</li>
            <li>Respond to your comments, questions, and requests</li>
          </ul>

          <h3>3. Data Security</h3>
          <p>
            We take reasonable measures to help protect information about you
            from loss, theft, misuse and unauthorized access, disclosure,
            alteration and destruction.
          </p>
        </div>
      </div>
    </div>);

}