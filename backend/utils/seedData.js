const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tenant = require('../models/Tenant');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        // Clear existing data
        await Tenant.deleteMany();
        await User.deleteMany();

        // Create Tenants
        const tenants = await Tenant.insertMany([
            { name: 'Acme', slug: 'acme' },
            { name: 'Globex', slug: 'globex' },
        ]);

        const acmeTenant = tenants[0];
        const globexTenant = tenants[1];

        // Create Users
        await User.create([
            { email: 'admin@acme.test', password: 'password', role: 'Admin', tenant: acmeTenant._id },
            { email: 'user@acme.test', password: 'password', role: 'Member', tenant: acmeTenant._id },
            { email: 'admin@globex.test', password: 'password', role: 'Admin', tenant: globexTenant._id },
            { email: 'user@globex.test', password: 'password', role: 'Member', tenant: globexTenant._id },
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();