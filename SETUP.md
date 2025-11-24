# Hotel Order Management System - Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- npm or yarn package manager

### 2. Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd hotel-order-system

# Install dependencies
npm install
\`\`\`

### 3. Environment Setup

Create `.env.local` file:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/hotel-orders
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
\`\`\`

### 4. Seed Sample Data

\`\`\`bash
npm run seed
\`\`\`

This creates:
- 2 sample hotels with menus
- 2 sample orders
- 2 sample feedback entries

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

## Access Points

### Customer Menu
- URL: `http://localhost:3000/hotels/[hotelId]`
- Example: `http://localhost:3000/hotels/YOUR_HOTEL_ID`
- Get hotel ID from seed output

### Hotel Dashboard
- URL: `http://localhost:3000/dashboard/hotels/[hotelId]`
- Login required
- Username: any (demo mode)
- Password: any (demo mode)
- Role: Hotel Staff

### Admin Panel
- URL: `http://localhost:3000/admin`
- Login required
- Username: any (demo mode)
- Password: any (demo mode)
- Role: Admin

## Features to Test

### Customer Flow
1. Visit hotel menu page
2. Search and filter items by category
3. Click item to view details
4. Add customizations and quantity
5. Add to cart
6. View cart and proceed to payment
7. Scan UPI QR code (demo)
8. Confirm payment
9. Track order status
10. Submit feedback

### Hotel Staff Flow
1. Login to dashboard
2. View real-time orders
3. Click "Mark as Cooking"
4. Click "Mark as Served"
5. Click "Mark as Paid"
6. Watch stats update in real-time

### Admin Flow
1. Login to admin panel
2. View all hotels
3. Verify pending hotels
4. View analytics (orders, revenue)

## Real-time Updates

The system uses Server-Sent Events (SSE) for real-time updates:
- Open hotel dashboard in one tab
- Place order from customer menu in another tab
- Watch order appear instantly on dashboard
- Update order status and see it update on customer's order page

## Database

### MongoDB Collections

**hotels**
- Stores hotel information and menus
- Indexed by: _id, verified

**orders**
- Stores all orders
- Indexed by: hotelId, deviceId, status

**feedbacks**
- Stores customer feedback
- Indexed by: hotelId

**users**
- Stores admin and staff accounts
- Indexed by: username

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env.local
- For MongoDB Atlas, use connection string from dashboard

### Port 3000 Already in Use
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Seed Script Fails
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- Clear existing data: `db.dropDatabase()` in MongoDB

### SSE Not Working
- Check browser console for errors
- Ensure hotel dashboard is open
- Try refreshing the page
- Check network tab for `/api/events/sse` connection

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables:
   - MONGODB_URI (MongoDB Atlas)
   - JWT_SECRET (strong random string)
4. Deploy

### Self-hosted

1. Set up MongoDB instance
2. Deploy to Node.js hosting (Railway, Render, etc.)
3. Set environment variables
4. Run: `npm run build && npm start`

## API Documentation

See README.md for complete API endpoint documentation.

## Support

For issues or questions, check:
- README.md for feature overview
- API endpoint documentation
- Browser console for error messages
- MongoDB logs for database issues
