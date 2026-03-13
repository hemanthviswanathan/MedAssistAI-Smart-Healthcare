import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    severityLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    status: {
        type: String,
        enum: ['reported', 'assigned', 'resolved'],
        default: 'reported'
    }
}, {
    timestamps: true
});

// Index for geospatial queries
emergencySchema.index({ location: '2dsphere' });

const Emergency = mongoose.model('Emergency', emergencySchema);
export default Emergency;
