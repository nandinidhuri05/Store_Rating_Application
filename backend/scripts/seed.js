const { User, Store } = require('../models');
const { connectDB, sequelize } = require('../config/db');

const seed = async () => {
  try {
    await connectDB();
    await sequelize.sync({ force: true });
    
    // Create Admin
    await User.create({
      name: 'System Administrator Account',
      email: 'admin@test.com',
      password: 'Password123!',
      address: 'Admin Headquarters, Main St',
      role: 'admin'
    });

    // Create a Store Owner
    const owner = await User.create({
      name: 'John Doe Store Owner User',
      email: 'owner@test.com',
      password: 'Password123!',
      address: 'Owner Residence, Street 10',
      role: 'owner'
    });

    // Create a Normal User
    await User.create({
      name: 'Jane Smith Normal User Account',
      email: 'user@test.com',
      password: 'Password123!',
      address: 'User Apartment, Avenue 5',
      role: 'user'
    });

    // Create Stores
    await Store.create({
      name: 'The Artisan Coffee House & Roastery',
      email: 'coffee@test.com',
      address: 'Downtown, Block B, 45th Street',
      ownerId: owner.id,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop'
    });

    await Store.create({
      name: 'Modern Tech Solutions & Gadgets',
      email: 'tech@test.com',
      address: 'Silicon Plaza, High Street',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop'
    });

    await Store.create({
      name: 'Green Leaf Organic Market & Deli',
      email: 'market@test.com',
      address: 'Greenway Road, Eco District',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop'
    });

    await Store.create({
      name: 'The Fitness Hub Gym & Wellness',
      email: 'gym@test.com',
      address: 'Muscle Alley, Victory Park',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
    });

    await Store.create({
      name: 'Luxe Fashion & Boutique Center',
      email: 'fashion@test.com',
      address: 'Fashion Avenue, Suite 101',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop'
    });

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
