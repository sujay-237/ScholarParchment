# Environment Variables Setup

Copy this into a `.env.local` file at the project root.

```bash
# Blockchain
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Role private keys
MINISTRY_PRIVATE_KEY=0xYOUR_MINISTRY_ADMIN_PRIVATE_KEY_HERE
COLLEGE_PRIVATE_KEY=0xYOUR_COLLEGE_VERIFIER_PRIVATE_KEY_HERE

# Supabase (MANDATORY for Database Storage & Authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-key
```

### Supabase Database Setup & Seeding

Execute the SQL script located at `supabase/schema_and_seed.sql` in your Supabase SQL Editor.
This creates the required database tables and seeds the 7 authorized user logins (5 Students, 1 College Officer, 1 Ministry Officer).
