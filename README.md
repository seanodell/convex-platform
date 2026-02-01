# Convex + Next.js

A full-stack application template combining Convex (backend) with Next.js (frontend).

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or your preferred package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

   This command:
   - Starts the Convex backend at `http://127.0.0.1:3210`
   - Starts the Next.js frontend at `http://localhost:3000`
   - The preview will automatically connect to `http://localhost:3000`

   > **Note:** The frontend needs access to the Convex backend. Make sure both are running!

### Environment Setup

The project uses a local `.env.local` file that's automatically created by Convex during startup. It contains:
- `NEXT_PUBLIC_CONVEX_URL` - Connection URL for the Convex backend (needed by frontend)
- `CONVEX_DEPLOYMENT` - Your local deployment ID

If you need to manually configure it, set `NEXT_PUBLIC_CONVEX_URL` to the Convex backend URL.

## Available Scripts

- `npm run dev` - Run both frontend and backend in parallel (recommended)
- `npm run dev:frontend` - Run Next.js frontend only
- `npm run dev:backend` - Run Convex backend only
- `npm run build` - Build the Next.js application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   ├── myFunctions.ts     # Backend functions
│   └── _generated/        # Auto-generated (do not edit)
├── components/            # React components
└── public/                # Static assets
```

## Making Changes

### Backend Changes
Edit files in the `convex/` directory:
- `convex/myFunctions.ts` - Add/modify backend functions
- `convex/schema.ts` - Define your database schema

Changes are automatically picked up by the Convex dev server.

### Frontend Changes
Edit files in the `app/` directory:
- `app/page.tsx` - Modify the home page
- Create new files in `app/` to add routes

Changes are automatically hot-reloaded by Next.js.

## Troubleshooting

### "I see nothing" / Blank page
- Make sure **both** backend and frontend are running: `npm run dev`
- Check that `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`
- Try refreshing the page in your browser

### Backend connection errors
- Verify the Convex backend is running (check terminal for "Convex functions ready!")
- Confirm `NEXT_PUBLIC_CONVEX_URL` matches the Convex backend URL
- Clear browser cache and restart both servers

### Port already in use
If port 3000 or 3210 is already in use:
- Kill existing processes using those ports
- Or modify the scripts in `package.json` to use different ports

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Convex + Next.js Guide](https://docs.convex.dev/home)
