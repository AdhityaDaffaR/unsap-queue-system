import bcrypt from 'bcrypt';

/**
 * Utility script to generate a bcrypt hash from a plaintext password.
 * Usage: node server/scripts/generateBcryptHash.js
 */
const generateHash = async () => {
  try {
    const plainTextPassword = '20041030';
    const saltRounds = 10;
    
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    
    console.log('\n=== BCRYPT HASH GENERATOR ===');
    console.log('Plaintext :', plainTextPassword);
    console.log('Hash      :', hashedPassword);
    console.log('=============================\n');
    
  } catch (error) {
    console.error('Error generating hash:', error);
  }
};

generateHash();