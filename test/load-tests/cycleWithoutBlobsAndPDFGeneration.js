import http from 'k6/http';
import encoding from 'k6/encoding';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

export const options = {
  // scenarios: {
  //   orderCycle: {
  //     executor: 'constant-vus',
  //     vus: 10,
  //     duration: 3000,
  //     gracefulStop: '5s'
  //   }
  // },
  stages: [
    { duration: '30s', target: 2 },
    { duration: '20s', target: 2 },
    { duration: '10s', target: 30 },
    { duration: '60s', target: 30 }
  ],
  thresholds: {
    'List Cards': ['p(95)<500'], // 95th percentile response time must be below 500 ms
    'Create Order': ['p(95)<800'], // 95th percentile response time must be below 800 ms
    'Update Order': ['p(95)<800'],
    'Confirm Print': ['p(95)<800']
  },
  summaryTrendStats: ['avg', 'min', 'max', 'p(70)', 'p(90)', 'p(95)'],
};

const ListCardsTrend = new Trend('List Cards');
const CreateOrderTrend = new Trend('Create Order');
const UpdateOrderTrend = new Trend('Update Order');
const PrintConfirmTrend = new Trend('Confirm Print');

const timestamp = Date.now().toString();
const token = encoding.b64encode(timestamp);

const BASE_URL = __ENV.API_HOST || 'https://printible-qa.netsolace.com/api';

export default function () {
  const storeNumbers = ['1137', '2826'];
  for (let i = 0; i < 8; i++) {
    const storeString = getRandomNum(1000, 2000).toString();
    storeNumbers.push(storeString);
  }

  const cards = getNotCustomCards().slice(10);

  for (const card of cards) {
    const start = Date.now();

    const order = createOrder(card);

    const printibleId = JSON.parse(order.body).data.printibleID;
    const storeIndex = getRandomNum(0, storeNumbers.length - 1);
    const storeNumber = storeNumbers[storeIndex];
    const orderNumber = `W2000-0${getRandomNum(25000, 99999)}-2-1`;

    confirmOrder(printibleId, orderNumber, JSON.stringify(storeNumber));
    confirmPrint(printibleId, JSON.stringify(storeNumber));
  }

  sleep(500);
}

function getNotCustomCards() {
  const urlListCards = `${BASE_URL}/init`;

  const response = http.get(urlListCards, { headers: { locale: 'en-US' } });

  check(response, { 'get /api/init status is 200': (r) => r.status === 200 });
  ListCardsTrend.add(response.timings.waiting);

  const cats = JSON.parse(response.body).data.categories;

  const cards = [];
  for (const cat of cats) {
    for (const card of cat.cards) {
      if (
        !cards.find((c) => c.id === card.id) &&
        !card.attributes.includes('overlay') &&
        !card.attributes.includes('photo')
      ) {
        cards.push(card);
      }
    }
  }

  return cards;
}

function createOrder(card) {
  const dataCreateOrder = {
    text: 'Edible your way!',
    cardID: card.id
  };

  const response = http.post(`${BASE_URL}/order`, dataCreateOrder, {
    headers: { token },
    tags: { name: 'PostOrder' }
  });

  check(response, { 'POST /api/order status is 201': (r) => r.status === 201 });
  CreateOrderTrend.add(response.timings.waiting);
  return response;
}

function confirmOrder(printibleId, orderNumber, storeNumber) {
  const dataUpdateOrder = {
    ea_order_number: orderNumber,
    ea_store_number: storeNumber
  };

  const response = http.put(`${BASE_URL}/order/${printibleId}`, dataUpdateOrder, { headers: { token } });

  check(response, {
    'PUT /api/order/{printible_id} status is 200': (r) => r.status === 200
  });

  UpdateOrderTrend.add(response.timings.waiting);
}

function confirmPrint(printibleId, storeNumber) {
  const dataPdf = {
    store_number: storeNumber,
    employee_id: '12345'
  };

  const response = http.put(`${BASE_URL}/pdf/${printibleId}/success`, JSON.stringify(dataPdf), { headers: { 'Content-Type': 'application/json', token } });

  check(response, {
    'PUT /api/pdf/{printible_id}/success status is 200': (r) => r.status === 200
  });

  PrintConfirmTrend.add(response.timings.waiting);
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
