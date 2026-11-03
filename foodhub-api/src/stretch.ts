import { encode } from '@msgpack/msgpack';

const order = {
  id: '8cd3396b-849e-4260-909e-b8d3ff77a586',
  status: 'PLACED',
  restaurantId: 1,
  items: ['amok'],
};

const jsonSize = JSON.stringify(order).length;
const msgpackSize = encode(order).length;

console.log('Order:', order);
console.log(`JSON size:        ${jsonSize} bytes`);
console.log(`MessagePack size: ${msgpackSize} bytes`);

