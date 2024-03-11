import bcrypt from 'bcryptjs';

// Hash a password
const hash = await bcrypt.hash('password', 11);

console.log(hash);
// Verify a password
const verified = await bcrypt.compare('password', hash);


console.log(verified);