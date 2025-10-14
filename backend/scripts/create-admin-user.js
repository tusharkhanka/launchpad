const bcrypt = require('bcrypt');
const { Test } = require('../src/db/models');

async function createAdminUser() {
    try {
        console.log('Creating admin user...');
        
        // Check if user already exists
        const existingUser = await Test.findOne({
            where: { email: 'launchpad_admin@gmail.com' }
        });
        
        if (existingUser) {
            console.log('Admin user already exists:', existingUser.email);
            return existingUser;
        }
        
        // Create admin user
        const hashedPassword = await bcrypt.hash('launchpad_admin', 10);
        const adminUser = await Test.create({
            username: 'launchpad_admin',
            email: 'launchpad_admin@gmail.com',
            password: hashedPassword
        });
        
        console.log('Admin user created successfully:', adminUser.email);
        return adminUser;
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw error;
    }
}

// Run the script
createAdminUser()
    .then(() => {
        console.log('Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });

