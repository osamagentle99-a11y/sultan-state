import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Property from '../models/Property.js';

const router = express.Router();

const uploadDir = 'uploads/properties';
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// GET ALL
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    res.json({ properties, count: properties.length });
  } catch(err){
    res.status(500).json({ error: err.message });
  }
});

// GET BY PLOT NO
router.get('/:plotNo', async (req, res) => {
  try {
    const prop = await Property.findOne({ plotNo: req.params.plotNo.toUpperCase() });
    if(!prop) return res.status(404).json({ error: 'Property nahi mili' });
    res.json({ property: prop });
  } catch(err){
    res.status(500).json({ error: err.message });
  }
});

// POST - 10 PICS + 3 LEGAL MAPS - FINAL FIX
router.post('/', upload.fields([
  { name: 'propertyImages', maxCount: 10 },
  { name: 'kdaMap', maxCount: 1 },
  { name: 'sbcaNocDoc', maxCount: 1 },
  { name: 'surveyMap', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    const { plotNo, title, location, fullAddress, area, price, propertyType, bedrooms, bathrooms, description, features, ownerName, ownerContact, kdaAllotment, sbcaNoc, surveyNo } = req.body;

    if(!plotNo || !title) return res.status(400).json({ error: 'Plot No or Title missing' });

    // 1. Property Images - 10 Pics
    let images = [];
    if(req.files['propertyImages']){
      images = req.files['propertyImages'].map((file, index) => ({
        url: `http://localhost:5000/${file.path.replace(/\\/g, '/')}`,
        publicId: file.filename,
        caption: index === 0 ? 'Main Image' : `Image ${index+1}`,
        isMain: index === 0,
        order: index
      }));
    }
    const mainImage = images.length > 0 ? images[0].url : '';

    // 2. Legal Maps Images
    const getFileUrl = (fieldName) => {
      if(req.files[fieldName] && req.files[fieldName][0]){
        const file = req.files[fieldName][0];
        return `http://localhost:5000/${file.path.replace(/\\/g, '/')}`;
      }
      return '';
    };

    const legalMaps = {
      kda: {
        imageUrl: getFileUrl('kdaMap'),
        allotmentNo: kdaAllotment || '',
        verified: !!kdaAllotment || !!getFileUrl('kdaMap')
      },
      sbca: {
        imageUrl: getFileUrl('sbcaNocDoc'),
        nocNumber: sbcaNoc || '',
        verified: !!sbcaNoc || !!getFileUrl('sbcaNocDoc')
      },
      survey: {
        imageUrl: getFileUrl('surveyMap'),
        surveyNo: surveyNo || '',
        verified: !!surveyNo || !!getFileUrl('surveyMap')
      }
    };

    // Features
    let featuresArray = [];
    if(features){
      try {
        featuresArray = typeof features === 'string' ? features.split(',').map(s=>s.trim()).filter(Boolean) : features;
      } catch { featuresArray = []; }
    }

    const property = new Property({
      plotNo: plotNo.toUpperCase(),
      title,
      location: location || 'ALL OVER KARACHI',
      fullAddress,
      area,
      price,
      propertyType: propertyType || 'House',
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      description,
      features: featuresArray,
      ownerName,
      ownerContact,
      images,
      mainImage,
      legalMaps,
      verificationStatus: (kdaAllotment || sbcaNoc) ? 'verified' : 'pending'
    });

    await property.save();
    console.log('Saved:', property.plotNo, 'with', images.length, 'pics + legalMaps');
    res.status(201).json({ success: true, property });

  } catch(err){
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch(err){
    res.status(500).json({ error: err.message });
  }
});

export default router;