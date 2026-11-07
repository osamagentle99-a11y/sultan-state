import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
import mongoose from 'mongoose';
import express from 'express';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: String,
  caption: String,
  isMain: { type: Boolean, default: false },
  order: Number
});

const legalMapSchema = new mongoose.Schema({
  kda: {
    imageUrl: String,
    pdfUrl: String,
    images: [imageSchema],
    verified: { type: Boolean, default: false },
    verifiedDate: Date,
    allotmentNo: String
  },
  sbca: {
    nocNumber: String,
    imageUrl: String,
    pdfUrl: String,
    images: [imageSchema],
    approvedDate: Date,
    verified: { type: Boolean, default: false }
  },
  survey: {
    surveyNo: String,
    imageUrl: String,
    pdfUrl: String,
    images: [imageSchema],
    demarcationDate: Date
  }
});

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  plotNo: { type: String, required: true, unique: true, uppercase: true, index: true },
  location: { type: String, default: "ALL OVER KARACHI", required: true },
  fullAddress: String,
  area: { type: String, required: true },
  price: { type: String, required: true },
  priceInNumber: Number,
  propertyType: { type: String, enum: ['House', 'Villa', 'Apartment', 'Plot', 'Commercial', 'Building'], default: 'House' },
  purpose: { type: String, enum: ['Sale', 'Rent'], default: 'Sale' },
  bedrooms: Number,
  bathrooms: Number,
  floors: Number,
  
  description: { type: String, required: true },
  features: [String],
  
  images: {
    type: [imageSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10']
  },
  mainImage: String,
  
  legalMaps: legalMapSchema,
  verificationStatus: { type: String, enum: ['verified', 'pending', 'unverified'], default: 'pending' },
  
  isFeatured: { type: Boolean, default: false },
  isSold: { type: Boolean, default: false },
  ownerName: String,
  ownerContact: String,
  ownerWhatsapp: String,
  
  tags: [String],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

function arrayLimit(val) {
  return val.length <= 10;
}

propertySchema.index({ plotNo: 'text', location: 'text', title: 'text', fullAddress: 'text', description: 'text' });
propertySchema.index({ location: 1, verificationStatus: 1, isFeatured: 1 });

propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.images && this.images.length > 0) {
    const main = this.images.find(img => img.isMain) || this.images[0];
    this.mainImage = main.url;
  }
  next();
});

export default mongoose.model('Property', propertySchema);