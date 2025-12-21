import React from 'react';

// Simple add property modal/page stub
export default function AddProperty({ onClose }: { onClose?: () => void }) {
  return (
    <div className="p-6 w-full max-w-md bg-background rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Add New Property</h2>
      <form className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Property Name" type="text" required />
        <input className="w-full border p-2 rounded" placeholder="City" type="text" required />
        <select className="w-full border p-2 rounded">
          <option value="">Select Property Type</option>
          <option value="riad">Riad</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="hotel">Hotel</option>
        </select>
        <input className="w-full border p-2 rounded" placeholder="Rooms/Beds" type="number" min="1" />
        <button className="btn btn-primary w-full" type="submit">Save Property</button>
      </form>
      {onClose && <button className="mt-4 text-sm underline" onClick={onClose}>Cancel</button>}
    </div>
  )
}

