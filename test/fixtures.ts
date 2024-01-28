import { ObjectId } from 'mongodb';

export const newlyCreateOrder = {
  _id: new ObjectId('5fe31520b531013abb4bbe71'),
  referrer_url: '',
  customer_text: 'Happy order testing - invalid token',
  definition_id: 'Photo_HappyHolidays_Test',
  client_ip: '::ffff:127.0.0.1',
  tos_agreed: true,
  ea_order_number: null,
  create_date: new Date(),
  update_date: new Date(),
  last_print_attempt_date: null,
  last_print_success_date: null,
  print_attempts_count: 0,
  print_successes_count: 0,
  printible_type: 'card',
  print_attempts: [],
  print_successes: [],
  origin_api_version: 'development',
  fulfillment_date: null,
  ea_store_number: null
};
export const card = {
  id: 'Photo_HappyHolidays_Test',
  name: 'Photo HappyHolidays Test',
  type: 'portrait',
  attributes: [],
  category: ['test'],
  tags: ['test'],
  culture: ['en-US', 'en-CA'],
  font: {
    family: 'Roboto Slab',
    size: '14',
    weight: '500',
    color: '#000'
  }
};
const image = 'ffd8ffe000104a46494600010100000100010000ffdb004300030202020202030202020303030304060404040404080606050609080a0a090809090a0c0f0c0a0b0e0b09090d110d0e0f101011100a0c12131210130f101010ffc0000b080001000101011100ffc40014000100000000000000000000000000000009ffc40014100100000000000000000000000000000000ffda0008010100003f0054dfffd9';
export const imageBuffer = Buffer.from(image, 'hex');
