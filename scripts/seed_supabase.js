import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local
const envPath = path.join(__dirname, '../.env.local');
let envText = '';
try {
  envText = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error('Error reading .env.local file:', e.message);
  process.exit(1);
}

const env = {};
envText.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = env.SUPABASE_SECRET_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !secretKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local');
  process.exit(1);
}

console.log('Connecting to Supabase at:', url);
const supabase = createClient(url, secretKey);

// 7 Pre-Seeded Users
const USERS = [
  {
    id: 'STU-2026-8941',
    email: 'aarav.sharma@iitd.ac.in',
    password: 'Password@123',
    role: 'student',
    name: 'Aarav Sharma',
    student_id: '2022CSB1042',
    institution: 'Indian Institute of Technology Delhi',
    department: 'Computer Science & Engineering',
    aadhaar_last4: '8842',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    wallet_address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  },
  {
    id: 'STU-2026-8942',
    email: 'priya.patel@vjti.ac.in',
    password: 'Password@123',
    role: 'student',
    name: 'Priya Patel',
    student_id: '2023ECB2011',
    institution: 'Veermata Jijabai Technological Institute',
    department: 'Electronics & Communication Engineering',
    aadhaar_last4: '9102',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    wallet_address: '0x3C44CdD06a900c291838F728018061d4b8006093',
  },
  {
    id: 'STU-2026-8943',
    email: 'rahul.verma@nitt.edu',
    password: 'Password@123',
    role: 'student',
    name: 'Rahul Verma',
    student_id: '2021MEB3055',
    institution: 'National Institute of Technology Tiruchirappalli',
    department: 'Mechanical Engineering',
    aadhaar_last4: '4431',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    wallet_address: '0x90F79bf6EB2c4f80806530203660480564614392',
  },
  {
    id: 'STU-2026-8944',
    email: 'ananya.sen@ju.ac.in',
    password: 'Password@123',
    role: 'student',
    name: 'Ananya Sen',
    student_id: '2024CSE1089',
    institution: 'Jadavpur University Kolkata',
    department: 'Computer Science & Technology',
    aadhaar_last4: '6120',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    wallet_address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
  },
  {
    id: 'STU-2026-8945',
    email: 'vikram.singh@bits.edu',
    password: 'Password@123',
    role: 'student',
    name: 'Vikram Singh',
    student_id: '2022EEE4012',
    institution: 'BITS Pilani',
    department: 'Electrical & Electronics Engineering',
    aadhaar_last4: '3319',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    wallet_address: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
  },
  {
    id: 'COL-OFF-109',
    email: 'verifications@iitd.ac.in',
    password: 'Password@123',
    role: 'college',
    name: 'Dr. Rajeshwari Menon',
    institution: 'Indian Institute of Technology Delhi (AISHE: U-0100)',
    designation: 'Dean of Student Welfare & Nodal Verification Officer',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    wallet_address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  },
  {
    id: 'MIN-DIR-042',
    email: 'director.scholarships@education.gov.in',
    password: 'Password@123',
    role: 'ministry',
    name: 'Shri Vikramaditya Roy, IAS',
    institution: 'Ministry of Education, Govt. of India',
    department: 'Department of Higher Education',
    designation: 'Joint Secretary & Director General of Central Schemes',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    wallet_address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  },
];

async function seedDatabase() {
  console.log('--- Starting Supabase Database Seeding ---');

  const { data: userData, error: userError } = await supabase
    .from('users')
    .upsert(USERS, { onConflict: 'id' });

  if (userError) {
    console.error('Error seeding users:', userError.message);
    if (userError.code === 'PGRST205') {
      console.log('\n⚠️  Notice: The database tables have not been created in Supabase yet.');
      console.log('   Please run the SQL script in "supabase/schema_and_seed.sql" inside your Supabase Dashboard SQL Editor.');
    }
    return;
  }

  console.log('✅ Successfully seeded 7 User Accounts into Supabase!');
}

seedDatabase();
