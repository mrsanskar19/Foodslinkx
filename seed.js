import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://root:root@foodslinkx.acsjpy1.mongodb.net/?retryWrites=true&w=majority&appName=FoodsLinkX";
const DB_NAME = "hotel-orders";

/**
 * Seeds the database with sample data for hotels, orders, and feedback.
 * - Connects to the MongoDB database.
 * - Clears any existing data in the `hotels`, `orders`, and `feedbacks` collections.
 * - Inserts a predefined set of sample hotels with menus.
 * - Creates sample orders and feedback linked to the newly created hotels.
 * - Logs the success or failure of the seeding process to the console.
 */
async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);
    const hotelsCollection = db.collection("hotels");
    const ordersCollection = db.collection("orders");
    const feedbackCollection = db.collection("feedbacks");
    const usersCollection = db.collection("users");

    // Clear existing data
    await hotelsCollection.deleteMany({});
    await ordersCollection.deleteMany({});
    await feedbackCollection.deleteMany({});
    await usersCollection.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Create sample hotels
    const hotels = [
      {
        name: "The Golden Fork",
        address: "123 Main Street, Downtown",
        upiId: "goldenfork@upi",
        verified: true,
        menu: [
          {
            _id: new ObjectId(),
            name: "Butter Chicken",
            description: "Tender chicken in creamy tomato sauce",
            price: 350,
            category: "Main Course",
            available: true,
          },
          {
            _id: new ObjectId(),
            name: "Paneer Tikka",
            description: "Grilled cottage cheese with spices",
            price: 280,
            category: "Appetizers",
            available: true,
          },
          {
            _id: new ObjectId(),
            name: "Biryani",
            description: "Fragrant rice with meat and spices",
            price: 400,
            category: "Main Course",
            available: true,
          },
        ],
      },
      {
        name: "Pizza Paradise",
        address: "456 Oak Avenue, Midtown",
        upiId: "pizzaparadise@upi",
        verified: true,
        menu: [
          {
            _id: new ObjectId(),
            name: "Margherita Pizza",
            description: "Classic pizza with tomato and mozzarella",
            price: 450,
            category: "Pizza",
            available: true,
          },
          {
            _id: new ObjectId(),
            name: "Pepperoni Pizza",
            description: "Pizza with pepperoni and cheese",
            price: 500,
            category: "Pizza",
            available: true,
          },
        ],
      },
    ];

    const hotelInsert = await hotelsCollection.insertMany(hotels);
    console.log(`🍽️ Created ${hotelInsert.insertedCount} hotels`);

    // Extract IDs
    const [goldenForkId, pizzaParadiseId] = Object.values(hotelInsert.insertedIds);

    // Create sample users
    const salt = await bcrypt.genSalt(10);
    const users = [
      {
        username: "admin",
        passwordHash: await bcrypt.hash("admin", salt),
        role: "admin",
      },
      {
        username: "Ganesh Yadav",
        email: "ganesh@example.com",
        phone: "+91 9876543210",
        passwordHash: await bcrypt.hash("Yadav@123", salt),
        role: "hotel",
        hotelId: goldenForkId.toHexString(),
      },
      {
        username: "goldenfork",
        passwordHash: await bcrypt.hash("password", salt),
        role: "hotel",
        hotelId: goldenForkId.toHexString(),
      },
      {
        username: "pizzaparadise",
        passwordHash: await bcrypt.hash("password", salt),
        role: "hotel",
        hotelId: pizzaParadiseId.toHexString(),
      },
    ];
    await usersCollection.insertMany(users);
    console.log(`🧑‍💻 Created ${users.length} sample users`);


    // Create sample orders
    const orders = [
      {
        hotelId: goldenForkId,
        table: "T1",
        deviceId: "device-001",
        items: [
          {
            _id: hotels[0].menu[0]._id,
            name: "Butter Chicken",
            price: 350,
            quantity: 2,
            customization: "Extra spicy",
          },
          {
            _id: hotels[0].menu[1]._id,
            name: "Paneer Tikka",
            price: 280,
            quantity: 1,
            customization: "",
          },
        ],
        total: 980,
        status: "pending",
        createdAt: new Date(),
      },
      {
        hotelId: pizzaParadiseId,
        table: "T5",
        deviceId: "device-002",
        items: [
          {
            _id: hotels[1].menu[0]._id,
            name: "Margherita Pizza",
            price: 450,
            quantity: 1,
            customization: "Extra cheese",
          },
        ],
        total: 450,
        status: "cooking",
        createdAt: new Date(),
      },
    ];

    await ordersCollection.insertMany(orders);
    console.log(`🧾 Created ${orders.length} sample orders`);

    // Create sample feedback
    const feedback = [
      {
        hotelId: goldenForkId,
        table: "T1",
        rating: 5,
        message: "Excellent food and service!",
        createdAt: new Date(),
      },
      {
        hotelId: pizzaParadiseId,
        table: "T5",
        rating: 4,
        message: "Good pizza, could be faster",
        createdAt: new Date(),
      },
    ];

    await feedbackCollection.insertMany(feedback);
    console.log(`⭐ Created ${feedback.length} feedback entries`);

    console.log("\n✅ Seed data created successfully!");
    console.log("\n🏨 Sample Hotel IDs:");
    console.log(`1. The Golden Fork: ${goldenForkId}`);
    console.log(`2. Pizza Paradise: ${pizzaParadiseId}`);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();
