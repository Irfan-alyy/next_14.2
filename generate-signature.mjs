// generate-signature.mjs
import { createHmac } from 'crypto';

const SECRET = 'test@key@123'; // ← your UBER_SIGNING_SECRET
const payload = JSON.stringify({
  event_id: "evt_12345",
  event_type: "order.created",
  data: {
    order_id: "ord_67890",
    status: "confirmed"
  }
});

const signature = createHmac('sha256', SECRET)
  .update(payload)
  .digest('hex');

console.log('x-uber-signature:', signature);