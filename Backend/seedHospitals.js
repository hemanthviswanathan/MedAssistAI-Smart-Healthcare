/**
 * seedHospitals.js
 * ----------------
 * One-time script to populate the hospitals collection with sample data.
 * Run once: node seedHospitals.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hospital from './models/Hospital.js';

dotenv.config();

const SAMPLE_HOSPITALS = [
    {
        name: 'City General Hospital',
        address: '12, Park Street, Chennai',
        location: { type: 'Point', coordinates: [80.2707, 13.0827] },
        capacity: 250,
        emergency_support: 1,
        wait_time_min: 15,
        rating: 4.5,
        phone: '044-11112222'
    },
    {
        name: 'Sunrise Clinic',
        address: '45, Anna Nagar, Chennai',
        location: { type: 'Point', coordinates: [80.2500, 13.0600] },
        capacity: 40,
        emergency_support: 0,
        wait_time_min: 60,
        rating: 3.1,
        phone: '044-33334444'
    },
    {
        name: 'Metro Hospital',
        address: '7, Velachery Road, Chennai',
        location: { type: 'Point', coordinates: [80.2800, 13.0900] },
        capacity: 400,
        emergency_support: 1,
        wait_time_min: 8,
        rating: 4.9,
        phone: '044-55556666'
    },
    {
        name: 'Apollo Specialty Care',
        address: '100, Greams Road, Chennai',
        location: { type: 'Point', coordinates: [80.2550, 13.0650] },
        capacity: 600,
        emergency_support: 1,
        wait_time_min: 20,
        rating: 4.7,
        phone: '044-77778888'
    },
    {
        name: 'Community Health Centre',
        address: '3, Tambaram, Chennai',
        location: { type: 'Point', coordinates: [80.1200, 12.9250] },
        capacity: 80,
        emergency_support: 0,
        wait_time_min: 45,
        rating: 3.8,
        phone: '044-99990000'
    },
];

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/emergency_app');
    console.log('Connected to MongoDB');

    await Hospital.deleteMany({});
    console.log('Cleared existing hospitals');

    await Hospital.insertMany(SAMPLE_HOSPITALS);
    console.log(`Seeded ${SAMPLE_HOSPITALS.length} hospitals`);

    await mongoose.disconnect();
    console.log('Done. Run your backend server now.');
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
