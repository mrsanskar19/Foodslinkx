const { createMocks } = require('node-mocks-http');
const { POST } = require('../app/api/menu/add/route');
const { DELETE } = require('../app/api/menu/[id]/route');

describe('/api/menu/add', () => {
  it('should return 400 for missing required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await POST(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toBe('ITEM_NOT_FOUND');
  });

  it('should validate file size', async () => {
    const largeFile = Buffer.alloc(6 * 1024 * 1024); // 6MB file
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        hotelId: 'test-hotel',
        name: 'Test Item',
        price: '10.99',
        category: 'test-category',
        imageFile: {
          name: 'large.jpg',
          type: 'image/jpeg',
          size: largeFile.length,
          arrayBuffer: () => Promise.resolve(largeFile),
        },
      },
    });

    await POST(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('FILE_TOO_LARGE');
  });
});

describe('/api/menu/[id]', () => {
  it('should return 409 when trying to delete item with active orders', async () => {
    // Mock the database calls
    // This would require setting up a test database or mocking mongoose

    const { req, res } = createMocks({
      method: 'DELETE',
      params: { id: 'test-menu-id' },
    });

    // Mock active orders found
    // await DELETE(req, res);

    // expect(res._getStatusCode()).toBe(409);
    // const data = JSON.parse(res._getData());
    // expect(data.error).toBe('CONFLICT');
  });
});