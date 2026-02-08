// Sample phone data for BestUp API testing
// Use this to seed the database for testing

const samplePhones = [
  {
    name: "OnePlus 13",
    brand: "OnePlus",
    basePrice: 45999,
    specs: {
      performance: {
        processor: "Snapdragon 8 Gen 3",
        antutuScore: 2100000,
        ramOptions: [8, 12, 16],
        coolingSystem: "VC Cooling",
        gpu: "Adreno 8"
      },
      display: {
        size: 6.82,
        resolution: "2780x1264",
        refreshRate: 120,
        touchSamplingRate: 720,
        brightness: 1500,
        colorAccuracy: "DCI-P3"
      },
      camera: {
        rear: {
          main: {
            megapixels: 50,
            aperture: "f/1.6",
            ois: true,
            videoCapable4K: true
          },
          ultraWide: {
            megapixels: 48,
            fov: 120
          },
          telephoto: {
            megapixels: 50,
            zoom: "2x",
            ois: true
          }
        },
        front: {
          megapixels: 32,
          videoCapable4K: true,
          autofocus: true
        },
        videoRecording: {
          maxResolution: "4K",
          maxFPS: 120,
          stabilization: "OIS"
        }
      },
      battery: {
        capacity: 6000,
        chargingSpeed: 100,
        wirelessCharging: false
      },
      os: "Android 15",
      storage: [256, 512],
      biometrics: ["Fingerprint", "Face ID"],
      weight: 218,
      color: ["Black", "Midnight", "Blue"]
    },
    variants: [
      {
        ram: 12,
        storage: 256,
        color: "Black",
        price: 45999,
        sku: "OP13-12-256-BLK",
        stock: 50
      },
      {
        ram: 16,
        storage: 512,
        color: "Midnight",
        price: 55999,
        sku: "OP13-16-512-MID",
        stock: 30
      }
    ],
    overview: "Flagship killer with great value and excellent performance",
    pros: [
      "Amazing gaming performance",
      "Great camera system",
      "Fast 100W charging",
      "Excellent value",
      "Smooth 120Hz display"
    ],
    cons: [
      "No wireless charging",
      "Gets warm while gaming",
      "No microSD expansion"
    ],
    releaseDate: new Date("2025-12-01")
  },

  {
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    basePrice: 159999,
    specs: {
      performance: {
        processor: "A18 Pro",
        antutuScore: 1850000,
        ramOptions: [8, 12],
        gpu: "6-core GPU",
        apu: "16-core Neural Engine"
      },
      display: {
        size: 6.9,
        resolution: "2796x1290",
        refreshRate: 120,
        touchSamplingRate: 240,
        brightness: 2000,
        colorAccuracy: "DCI-P3"
      },
      camera: {
        rear: {
          main: {
            megapixels: 48,
            aperture: "f/1.9",
            ois: true,
            videoCapable4K: true
          },
          ultraWide: {
            megapixels: 12,
            fov: 120
          },
          telephoto: {
            megapixels: 12,
            zoom: "5x",
            ois: true
          }
        },
        front: {
          megapixels: 12,
          videoCapable4K: true,
          autofocus: false
        },
        videoRecording: {
          maxResolution: "4K",
          maxFPS: 240,
          stabilization: "OIS"
        }
      },
      battery: {
        capacity: 4685,
        chargingSpeed: 45,
        wirelessCharging: true
      },
      os: "iOS 18",
      storage: [256, 512, 1024],
      biometrics: ["Face ID"],
      weight: 236,
      color: ["Black", "Silver", "Gold", "Rose Gold"]
    },
    variants: [
      {
        ram: 8,
        storage: 256,
        color: "Black",
        price: 159999,
        sku: "IP16PM-8-256-BLK",
        stock: 20
      },
      {
        ram: 8,
        storage: 512,
        color: "Silver",
        price: 179999,
        sku: "IP16PM-8-512-SLV",
        stock: 15
      }
    ],
    overview: "Premium flagship with AI features and exceptional camera",
    pros: [
      "Excellent camera system",
      "Premium build quality",
      "Wireless charging",
      "Great performance",
      "5 years OS support"
    ],
    cons: [
      "Very expensive",
      "No charger in box",
      "No USB-C speed advantage",
      "Battery not great for size"
    ],
    releaseDate: new Date("2024-09-20")
  },

  {
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    basePrice: 129999,
    specs: {
      performance: {
        processor: "Snapdragon 8 Gen 3 Leading Version",
        antutuScore: 2200000,
        ramOptions: [12, 16],
        coolingSystem: "Vapor Chamber",
        gpu: "Adreno 8 Prime"
      },
      display: {
        size: 6.8,
        resolution: "3120x1440",
        refreshRate: 120,
        touchSamplingRate: 960,
        brightness: 2000,
        colorAccuracy: "DCI-P3"
      },
      camera: {
        rear: {
          main: {
            megapixels: 200,
            aperture: "f/1.7",
            ois: true,
            videoCapable4K: true
          },
          ultraWide: {
            megapixels: 50,
            fov: 120
          },
          telephoto: {
            megapixels: 10,
            zoom: "3x",
            ois: true
          },
          macro: {
            megapixels: 50
          }
        },
        front: {
          megapixels: 40,
          videoCapable4K: true,
          autofocus: true
        },
        videoRecording: {
          maxResolution: "8K",
          maxFPS: 120,
          stabilization: "OIS"
        }
      },
      battery: {
        capacity: 5000,
        chargingSpeed: 45,
        wirelessCharging: true
      },
      os: "Android 14",
      storage: [256, 512, 1024],
      biometrics: ["Fingerprint", "Face ID"],
      weight: 232,
      color: ["Titanium Black", "Titanium Gray", "Titanium Violet"]
    },
    variants: [
      {
        ram: 12,
        storage: 256,
        color: "Titanium Black",
        price: 129999,
        sku: "SGS24U-12-256-BLK",
        stock: 25
      },
      {
        ram: 16,
        storage: 512,
        color: "Titanium Gray",
        price: 149999,
        sku: "SGS24U-16-512-GRY",
        stock: 18
      }
    ],
    overview: "Premium flagship with incredible camera zoom capabilities",
    pros: [
      "200MP main camera",
      "3x and 10x zoom",
      "8K video recording",
      "Highest touch sampling rate",
      "S Pen included"
    ],
    cons: [
      "Expensive",
      "Battery not great",
      "Gets hot in gaming",
      "Heavy phone"
    ],
    releaseDate: new Date("2024-01-31")
  },

  {
    name: "Google Pixel 9 Pro XL",
    brand: "Google",
    basePrice: 139999,
    specs: {
      performance: {
        processor: "Google Tensor 4",
        antutuScore: 1950000,
        ramOptions: [16],
        coolingSystem: "Graphene cooling",
        gpu: "Mali-G715 MP7"
      },
      display: {
        size: 6.8,
        resolution: "2992x1344",
        refreshRate: 120,
        touchSamplingRate: 240,
        brightness: 1500,
        colorAccuracy: "DCI-P3"
      },
      camera: {
        rear: {
          main: {
            megapixels: 50,
            aperture: "f/1.7",
            ois: true,
            videoCapable4K: true
          },
          ultraWide: {
            megapixels: 42,
            fov: 126
          },
          telephoto: {
            megapixels: 30,
            zoom: "5x",
            ois: true
          }
        },
        front: {
          megapixels: 42,
          videoCapable4K: true,
          autofocus: false
        },
        videoRecording: {
          maxResolution: "4K",
          maxFPS: 60,
          stabilization: "OIS"
        }
      },
      battery: {
        capacity: 5890,
        chargingSpeed: 37,
        wirelessCharging: true
      },
      os: "Android 15",
      storage: [256, 512],
      biometrics: ["Fingerprint", "Face ID"],
      weight: 237,
      color: ["Obsidian", "Porcelain", "Hazel"]
    },
    variants: [
      {
        ram: 16,
        storage: 256,
        color: "Obsidian",
        price: 139999,
        sku: "GP9PXL-16-256-OBS",
        stock: 30
      },
      {
        ram: 16,
        storage: 512,
        color: "Porcelain",
        price: 159999,
        sku: "GP9PXL-16-512-PRC",
        stock: 20
      }
    ],
    overview: "AI-powered flagship with exceptional computational photography",
    pros: [
      "Best computational photography",
      "Great AI features",
      "Good battery life",
      "Large display",
      "Fast updates"
    ],
    cons: [
      "Expensive",
      "Slower charging",
      "Lower gaming performance",
      "No 5x optical zoom"
    ],
    releaseDate: new Date("2024-10-03")
  },

  {
    name: "Xiaomi 15 Ultra",
    brand: "Xiaomi",
    basePrice: 74999,
    specs: {
      performance: {
        processor: "Snapdragon 8 Gen 3",
        antutuScore: 2050000,
        ramOptions: [12, 16],
        coolingSystem: "VC Cooling",
        gpu: "Adreno 8"
      },
      display: {
        size: 6.73,
        resolution: "3200x1440",
        refreshRate: 120,
        touchSamplingRate: 960,
        brightness: 1200,
        colorAccuracy: "DCI-P3"
      },
      camera: {
        rear: {
          main: {
            megapixels: 50,
            aperture: "f/1.6",
            ois: true,
            videoCapable4K: true
          },
          ultraWide: {
            megapixels: 50,
            fov: 122
          },
          telephoto: {
            megapixels: 50,
            zoom: "3.2x",
            ois: true
          }
        },
        front: {
          megapixels: 32,
          videoCapable4K: true,
          autofocus: false
        },
        videoRecording: {
          maxResolution: "4K",
          maxFPS: 120,
          stabilization: "OIS"
        }
      },
      battery: {
        capacity: 5880,
        chargingSpeed: 120,
        wirelessCharging: 80
      },
      os: "MIUI 15",
      storage: [256, 512, 1024],
      biometrics: ["Fingerprint", "Face ID"],
      weight: 234,
      color: ["Black", "White", "Gray"]
    },
    variants: [
      {
        ram: 12,
        storage: 256,
        color: "Black",
        price: 74999,
        sku: "XM15U-12-256-BLK",
        stock: 40
      },
      {
        ram: 16,
        storage: 512,
        color: "White",
        price: 84999,
        sku: "XM15U-16-512-WHT",
        stock: 25
      }
    ],
    overview: "Great value flagship with excellent specs and charging",
    pros: [
      "Excellent charging speed",
      "Wireless charging too",
      "Triple 50MP camera",
      "Great performance",
      "Better value than competitors"
    ],
    cons: [
      "MIUI can be bloated",
      "Slower OS updates",
      "Less premium feel",
      "Average battery life"
    ],
    releaseDate: new Date("2025-10-01")
  }
];

module.exports = samplePhones;

/*
HOW TO USE THIS DATA:

1. Import this file in your database seeding script:
   const samplePhones = require('./samplePhones.js');

2. Connect to MongoDB and insert:
   const Phone = require('./models/Phone');
   await Phone.insertMany(samplePhones);

3. Or create a seed script (backend/seed.js):
   
   const mongoose = require('mongoose');
   require('dotenv').config();
   const Phone = require('./models/Phone');
   const samplePhones = require('./samplePhones');

   async function seed() {
     try {
       await mongoose.connect(process.env.MONGO_URI);
       console.log('Connected to MongoDB');

       // Clear existing phones
       await Phone.deleteMany({});
       
       // Insert sample phones
       const result = await Phone.insertMany(samplePhones);
       console.log(`✓ ${result.length} phones seeded`);

       // Verify scores were calculated
       const allPhones = await Phone.find();
       allPhones.forEach(phone => {
         console.log(`${phone.name}: Gaming ${phone.scores.gaming}, Camera ${phone.scores.camera}, Value ${phone.scores.valueForMoney}`);
       });

       mongoose.connection.close();
     } catch (error) {
       console.error('Seed error:', error);
       process.exit(1);
     }
   }

   seed();

4. Run it: node seed.js
*/
