// generate-signature.mjs
import { createHmac } from 'crypto';

const SECRET = "test@key@123";// ← your UBER_SIGNING_SECRET
const payload = JSON.stringify({
  "event_id": "test-123",
  "event_type": "orders.notification",
  "event_time": 1758727855000,
  "resource_href": "https://api.uber.com/v2/eats/order/test-id",
  "meta": {
    "user_id": "user-123",
    "resource_id": "test-id",
    "status": "pos"
  },
  "webhook_meta": {
    "client_id": "your-client-id",
    "webhook_config_id": "test-config",
    "webhook_msg_timestamp": 1758727856,
    "webhook_msg_uuid": "uuid-123"
  }
});

const signature = createHmac('sha256', SECRET)
  .update(payload)
  .digest('hex');

console.log('x-uber-signature:', signature);