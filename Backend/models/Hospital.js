import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    capacity: {
        type: Number,
        default: 100
    },
    emergency_support: {
        type: Number,   // 1 = yes, 0 = no
        enum: [0, 1],
        default: 1
    },
    wait_time_min: {
        type: Number,
        default: 30
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3.5
    },
    phone: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// 2dsphere index required for $near / $geoWithin queries
hospitalSchema.index({ location: '2dsphere' });

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;
