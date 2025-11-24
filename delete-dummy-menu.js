const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://root:root@foodslinkx.acsjpy1.mongodb.net/?retryWrites=true&w=majority&appName=FoodsLinkX";

async function deleteDummyMenu() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete menu items for the specific hotel
    const Menu = mongoose.model('Menu', new mongoose.Schema({}, { strict: false }));
    const result = await Menu.deleteMany({ hotelId: '691441068f3932d96eb9e830' });

    console.log(`Deleted ${result.deletedCount} menu items`);

    // Also check if there's embedded menu in the hotel document
    const Hotel = mongoose.model('Hotel', new mongoose.Schema({}, { strict: false }));
    const hotel = await Hotel.findById('691441068f3932d96eb9e830');

    if (hotel && hotel.menu && hotel.menu.length > 0) {
      await Hotel.updateOne(
        { _id: '691441068f3932d96eb9e830' },
        { $unset: { menu: 1 } }
      );
      console.log('Cleared embedded menu from hotel document');
    }

    console.log('Dummy menu deletion completed');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

deleteDummyMenu();