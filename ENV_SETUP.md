# Environment Variables

Copy this into a `.env.local` file at the project root.

```bash
# Blockchain
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# Role private keys (Hardhat default accounts 0 and 1)
# These are publicly known Hardhat test accounts — NEVER use on mainnet.
MINISTRY_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
COLLEGE_PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

# Supabase (MANDATORY for Database Storage & Authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-key
```

### Supabase Database Setup & Seeding

Execute the SQL script located at `supabase/schema_and_seed.sql` in your Supabase SQL Editor.
This creates the required database tables and seeds the 7 authorized user logins (5 Students, 1 College Officer, 1 Ministry Officer).
