const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { generateQRImage } = require('./utils/qrGenerator');

// Models
const Farmer = require('./models/Farmer');
const User = require('./models/User');
const Product = require('./models/Product');
const CropHistory = require('./models/CropHistory');
const Report = require('./models/Report');
const Notification = require('./models/Notification');

dotenv.config();

// --- Seed Data ---

const adminUsers = [
  {
    name: 'Admin User',
    email: 'admin@farmplatform.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Inspector Ravi',
    email: 'inspector@farmplatform.com',
    password: 'inspect123',
    role: 'inspector',
  },
];

const farmers = [
  {
    name: 'Ramesh Kumar',
    phoneNumber: '9876543210',
    aadhaarNumber: '123456789012',
    password: 'farmer123',
    district: 'Guntur',
    mandal: 'Tenali',
    village: 'Kollipara',
    acres: 5,
    soilType: 'Black',
  },
  {
    name: 'Suresh Reddy',
    phoneNumber: '9876543211',
    aadhaarNumber: '123456789013',
    password: 'farmer123',
    district: 'Krishna',
    mandal: 'Vijayawada',
    village: 'Gannavaram',
    acres: 10,
    soilType: 'Alluvial',
  },
  {
    name: 'Lakshmi Devi',
    phoneNumber: '9876543212',
    aadhaarNumber: '123456789014',
    password: 'farmer123',
    district: 'East Godavari',
    mandal: 'Kakinada',
    village: 'Samalkot',
    acres: 3,
    soilType: 'Red',
  },
  {
    name: 'Venkatesh Naidu',
    phoneNumber: '9876543213',
    aadhaarNumber: '123456789015',
    password: 'farmer123',
    district: 'Prakasam',
    mandal: 'Ongole',
    village: 'Chirala',
    acres: 8,
    soilType: 'Loamy',
  },
  {
    name: 'Anjali Sharma',
    phoneNumber: '9876543214',
    aadhaarNumber: '123456789016',
    password: 'farmer123',
    district: 'Anantapur',
    mandal: 'Dharmavaram',
    village: 'Kadiri',
    acres: 6,
    soilType: 'Sandy',
  },
];

const products = [
  {
    productName: 'NPK 20-20-20 Fertilizer',
    brand: 'IFFCO',
    batchCode: 'IFFCO-NPK-2025-001',
    manufacturer: 'IFFCO Ltd',
    qrCode: 'QR-IFFCO-001',
    category: 'Fertilizer',
    price: 1200,
    mfgDate: new Date('2025-01-15'),
    expiryDate: new Date('2027-01-15'),
    authenticityStatus: 'Genuine',
  },
  {
    productName: 'DAP Fertilizer 50kg',
    brand: 'Coromandel',
    batchCode: 'CORO-DAP-2025-002',
    manufacturer: 'Coromandel International',
    qrCode: 'QR-CORO-002',
    category: 'Fertilizer',
    price: 1350,
    mfgDate: new Date('2025-02-10'),
    expiryDate: new Date('2027-02-10'),
    authenticityStatus: 'Genuine',
  },
  {
    productName: 'Imidacloprid 17.8% SL',
    brand: 'Bayer',
    batchCode: 'BAYER-IMID-2025-003',
    manufacturer: 'Bayer CropScience',
    qrCode: 'QR-BAYER-003',
    category: 'Pesticide',
    price: 680,
    mfgDate: new Date('2025-03-01'),
    expiryDate: new Date('2027-03-01'),
    authenticityStatus: 'Genuine',
  },
  {
    productName: 'Chlorpyrifos 20% EC',
    brand: 'FakePest',
    batchCode: 'FAKE-CHLOR-2025-004',
    manufacturer: 'Unknown',
    qrCode: 'QR-FAKE-004',
    category: 'Pesticide',
    price: 200,
    mfgDate: new Date('2024-06-01'),
    expiryDate: new Date('2025-06-01'),
    authenticityStatus: 'Counterfeit',
  },
  {
    productName: 'Hybrid Paddy Seeds BPT-5204',
    brand: 'Kaveri Seeds',
    batchCode: 'KAV-BPT-2025-005',
    manufacturer: 'Kaveri Seed Company',
    qrCode: 'QR-KAV-005',
    category: 'Seed',
    price: 450,
    mfgDate: new Date('2025-04-01'),
    expiryDate: new Date('2026-04-01'),
    authenticityStatus: 'Genuine',
  },
  {
    productName: 'Urea 46% N',
    brand: 'IFFCO',
    batchCode: 'IFFCO-UREA-2025-006',
    manufacturer: 'IFFCO Ltd',
    qrCode: 'QR-IFFCO-006',
    category: 'Fertilizer',
    price: 266,
    mfgDate: new Date('2025-01-20'),
    expiryDate: new Date('2027-01-20'),
    authenticityStatus: 'Genuine',
  },
  {
    productName: 'Mancozeb 75% WP',
    brand: 'SuspectBrand',
    batchCode: 'SUS-MANC-2025-007',
    manufacturer: 'Unverified Manufacturer',
    qrCode: 'QR-SUS-007',
    category: 'Pesticide',
    price: 300,
    mfgDate: new Date('2025-02-15'),
    expiryDate: new Date('2026-08-15'),
    authenticityStatus: 'Suspicious',
  },
  {
    productName: 'Cotton Seeds Bt-2',
    brand: 'Mahyco',
    batchCode: 'MAH-COT-2025-008',
    manufacturer: 'Mahyco Seeds',
    qrCode: 'QR-MAH-008',
    category: 'Seed',
    price: 930,
    mfgDate: new Date('2025-05-01'),
    expiryDate: new Date('2026-05-01'),
    authenticityStatus: 'Genuine',
  },
  {
    productName: 'Potash MOP 60%',
    brand: 'IFFCO',
    batchCode: 'IFFCO-MOP-2025-009',
    manufacturer: 'IFFCO Ltd',
    qrCode: 'QR-IFFCO-009',
    category: 'Fertilizer',
    price: 1700,
    mfgDate: new Date('2025-03-10'),
    expiryDate: new Date('2027-03-10'),
    authenticityStatus: 'Genuine',
  },
  {
    productName: 'Sprinkler Nozzle Set',
    brand: 'Jain Irrigation',
    batchCode: 'JAIN-SPR-2025-010',
    manufacturer: 'Jain Irrigation Systems',
    qrCode: 'QR-JAIN-010',
    category: 'Equipment',
    price: 2500,
    mfgDate: new Date('2025-04-15'),
    expiryDate: new Date('2030-04-15'),
    authenticityStatus: 'Genuine',
  },
];

// --- Seed Functions ---

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Farmer.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    await CropHistory.deleteMany();
    await Report.deleteMany();
    await Notification.deleteMany();

    console.log('Data cleared...');

    // Create admin users
    const salt = await bcrypt.genSalt(10);
    const createdAdmins = await User.insertMany(
      await Promise.all(
        adminUsers.map(async (u) => ({
          ...u,
          password: await bcrypt.hash(u.password, salt),
        }))
      )
    );
    console.log(`${createdAdmins.length} admin users created`);

    // Create farmers
    const createdFarmers = await Farmer.insertMany(
      await Promise.all(
        farmers.map(async (f) => ({
          ...f,
          password: await bcrypt.hash(f.password, salt),
        }))
      )
    );
    console.log(`${createdFarmers.length} farmers created`);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    // Create sample crop history
    const cropData = [
      { farmerId: createdFarmers[0]._id, cropType: 'Paddy', yieldAmount: 25, cultivationDuration: '120 days', year: '2025', season: 'Kharif', status: 'Harvested' },
      { farmerId: createdFarmers[0]._id, cropType: 'Groundnut', yieldAmount: 8, cultivationDuration: '105 days', year: '2025', season: 'Rabi', status: 'Growing' },
      { farmerId: createdFarmers[1]._id, cropType: 'Cotton', yieldAmount: 15, cultivationDuration: '180 days', year: '2025', season: 'Kharif', status: 'Harvested' },
      { farmerId: createdFarmers[2]._id, cropType: 'Paddy', yieldAmount: 12, cultivationDuration: '120 days', year: '2025', season: 'Kharif', status: 'Harvested' },
      { farmerId: createdFarmers[3]._id, cropType: 'Chilli', yieldAmount: 5, cultivationDuration: '150 days', year: '2025', season: 'Rabi', status: 'Planted' },
    ];
    const createdCrops = await CropHistory.insertMany(cropData);
    console.log(`${createdCrops.length} crop history entries created`);

    // Link crop history to farmers
    await Farmer.findByIdAndUpdate(createdFarmers[0]._id, {
      $push: { cropHistory: { $each: [createdCrops[0]._id, createdCrops[1]._id] } },
    });
    await Farmer.findByIdAndUpdate(createdFarmers[1]._id, {
      $push: { cropHistory: createdCrops[2]._id },
    });
    await Farmer.findByIdAndUpdate(createdFarmers[2]._id, {
      $push: { cropHistory: createdCrops[3]._id },
    });
    await Farmer.findByIdAndUpdate(createdFarmers[3]._id, {
      $push: { cropHistory: createdCrops[4]._id },
    });

    // Create sample reports
    const reportData = [
      {
        farmerId: createdFarmers[0]._id,
        productName: 'Chlorpyrifos 20% EC',
        brand: 'FakePest',
        batchCode: 'FAKE-CHLOR-2025-004',
        description: 'Purchased from local shop, label looks different from original. Suspected counterfeit.',
        priority: 'High',
        location: 'Tenali Market',
        reportStatus: 'Pending',
      },
      {
        farmerId: createdFarmers[1]._id,
        productName: 'Mancozeb 75% WP',
        brand: 'SuspectBrand',
        batchCode: 'SUS-MANC-2025-007',
        description: 'Package seal was broken when purchased. Product smells different.',
        priority: 'Critical',
        location: 'Vijayawada Agricultural Store',
        reportStatus: 'Reviewed',
      },
      {
        farmerId: createdFarmers[2]._id,
        productName: 'Unknown Fertilizer',
        brand: 'No Brand',
        description: 'Roadside vendor selling unlabeled fertilizer at very low price.',
        priority: 'Medium',
        location: 'Kakinada Roadside',
        reportStatus: 'Pending',
      },
    ];
    const createdReports = await Report.insertMany(reportData);
    console.log(`${createdReports.length} reports created`);

    // Create sample notifications
    const notificationData = [
      {
        farmerId: createdFarmers[0]._id,
        type: 'Warning',
        title: 'Counterfeit Alert',
        message: 'A counterfeit batch of Chlorpyrifos has been reported in your district. Be cautious while purchasing.',
        relatedModel: 'Product',
        relatedId: createdProducts[3]._id,
      },
      {
        farmerId: createdFarmers[0]._id,
        type: 'Info',
        title: 'Report Update',
        message: 'Your report #1 is being reviewed by our inspection team.',
        relatedModel: 'Report',
        relatedId: createdReports[0]._id,
      },
      {
        farmerId: createdFarmers[1]._id,
        type: 'Success',
        title: 'Crop Harvest Recorded',
        message: 'Your cotton crop harvest of 15 quintals has been successfully recorded.',
        relatedModel: 'CropHistory',
        relatedId: createdCrops[2]._id,
      },
      {
        farmerId: createdFarmers[2]._id,
        type: 'Alert',
        title: 'New Product Advisory',
        message: 'New genuine products have been added to the verification database. Verify your recent purchases.',
      },
    ];
    await Notification.insertMany(notificationData);
    console.log(`${notificationData.length} notifications created`);

    console.log('\n✅ Data seeded successfully!');
    console.log('\n--- Login Credentials ---');
    console.log('Admin:     admin@farmplatform.com / admin123');
    console.log('Inspector: inspector@farmplatform.com / inspect123');
    console.log('Farmer:    9876543210 / farmer123');
    console.log('Farmer:    9876543211 / farmer123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Farmer.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    await CropHistory.deleteMany();
    await Report.deleteMany();
    await Notification.deleteMany();

    console.log('✅ All data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
