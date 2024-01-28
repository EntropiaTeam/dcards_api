/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import encoding from 'k6/encoding';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const listErrorRate = new Rate('List Cards errors');
const createErrorRate = new Rate('Create Order errors');
const updateErrorRate = new Rate('Update Order errors');
const generateErrorRate = new Rate('Generate Pdf errors');
const printErrorRate = new Rate('Print Pdf errors');

const ListTrend = new Trend('List Cards');
const CreateTrend = new Trend('Create Order');
const UpdateTrend = new Trend('Update Order');
const GenerateTrend = new Trend('Generate Pdf');
const PrintTrend = new Trend('Print Pdf');

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    'List Cards': ['p(95)<500'], // 95th percentile response time must be below 500 ms
    'Create Order': ['p(95)<800'], // 95th percentile response time must be below 800 ms
    'Update Order': ['p(95)<800'],
    'Generate Pdf': ['p(95)<800'],
    'Print Pdf': ['p(95)<800']
  }
};

const BASE_URL = 'https://printible-qa.netsolace.com/api';

const timestamp = Date.now().toString();
const token = encoding.b64encode(timestamp);

export default function () {
  // fetches cards
  const cards = getCards();
  const card = getRandomElemFromArr(cards);
  // creates order
  const order = createOrder(card);
  const printibleId = JSON.parse(order.body).data.printibleID;

  // gets random store number between 1000 and 2000 inclusively
  const storeNumber = getRandomNum(1000, 2000);
  // gets random number between 25000 and 99999 (part of order number)
  const orderNumber = `W2000-0${getRandomNum(25000, 99999)}-2-1`;

  // confirms order
  confirmOrder(printibleId, orderNumber, JSON.stringify(storeNumber));
  // generates pdf
  generatePdf(printibleId, JSON.stringify(storeNumber));
  // confirms pdf
  confirmPrint(printibleId, JSON.stringify(storeNumber));

  // add sleep func after each check(); sleep for a second
  sleep(30);
}

function getCards() {
  const url = `${BASE_URL}/categories`;

  const params = {
    headers: {
      locale: 'en-US'
    }
  };
  const response = http.get(url, params);

  check(response, { 'GET /api/categories status is 200': (r) => r.status === 200 }) || listErrorRate.add(1);

  ListTrend.add(response.timings.duration);

  const { categories } = JSON.parse(response.body).data;

  const cards = [];
  for (const category of categories) {
    for (const card of category.cards) {
      if (!cards.find((c) => c.id === card.id)) {
        cards.push(card);
      }
    }
  }

  return cards;
}

function createOrder(card) {
  const url = `${BASE_URL}/order`;

  const params = {
    headers: {
      token
    }
  };

  const data = {
    text: 'Edible your way!',
    cardID: card.id
  };

  const response = http.post(url, data, params);

  console.log(JSON.stringify(response));

  check(response, {
    'POST /api/order status is 200': (r) => r.status === 200
  }) || createErrorRate.add(1);

  CreateTrend.add(response.timings.duration);

  return response;
}

function confirmOrder(printibleId, orderNumber, storeNumber) {
  const url = `${BASE_URL}/order/${printibleId}`;

  const data = {
    ea_order_number: orderNumber,
    ea_store_number: storeNumber
  };

  const response = http.put(url, data);

  check(response, {
    'PUT /api/order/{printible_id} status is 200': (r) => r.status === 200
  }) || updateErrorRate.add(1);

  UpdateTrend.add(response.timings.duration);
}

function generatePdf(printibleId, storeNumber) {
  const url = `${BASE_URL}/pdf/${printibleId}`;

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const data = {
    store_number: storeNumber,
    employee_id: '12345'
  };

  const stringifiedData = JSON.stringify(data);

  const response = http.put(url, stringifiedData, params);

  check(response, {
    'PUT /api/pdf/{printible_id} status is 200': (r) => r.status === 200
  }) || generateErrorRate.add(1);

  GenerateTrend.add(response.timings.duration);
}

function confirmPrint(printibleId, storeNumber) {
  const url = `${BASE_URL}/pdf/${printibleId}/success`;

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const data = {
    store_number: storeNumber,
    employee_id: '12345'
  };

  const stringifiedData = JSON.stringify(data);

  const response = http.put(url, stringifiedData, params);

  check(response, {
    'PUT /api/pdf/{printible_id}/success status is 200': (r) => r.status === 200
  }) || printErrorRate.add(1);

  PrintTrend.add(response.timings.duration);
}

// helpers
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElemFromArr(arr) {
  const random = Math.floor(Math.random() * arr.length);

  return arr[random];
}
