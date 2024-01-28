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
  vus: 5,
  duration: '30s',
  thresholds: {
    'List Cards': ['p(95)<500'], // 95th percentile response time must be below 500 ms
    'Create Order': ['p(95)<800'], // 95th percentile response time must be below 800 ms
    'Update Order': ['p(95)<800'],
    'Generate Pdf': ['p(95)<800'],
    'Print Pdf': ['p(95)<800']
  }
};

const BASE_URL = 'https://app-printible-api-dev-01-nest.azurewebsites.net/api';

const timestamp = Date.now().toString();
const token = encoding.b64encode(timestamp);

const cardIds = [
  'birthday_general_A',
  'birthday_general_B',
  'birthday_kids_A',
  'birthday_kids_B',
  'congrats_general_A',
  'congrats_general_B',
  'congrats_wedding_C',
  'getWell_A',
  'getWell_B',
  'justBecause_general_A',
  'justBecause_love_A',
  'justBecause_love_B',
  'sympathy_A',
  'thankYou_A',
  'thankYou_B',
  'thankYou_C',
  'congrats_general_C',
  'congrats_wedding_D',
  'congrats_wedding_E',
  'getWell_C',
  'justBecause_general_C',
  'sympathy_C',
  'sympathy_D',
  'birthday_his_B',
  'birthday_hers_B',
  'birthday_his_general',
  'birthday_hers_A'
];

function listCardsAndCreateOrder(cardId) {
  const urlListCards = `${BASE_URL}/categories`;
  const urlCreateOrder = `${BASE_URL}/order`;

  // params for GET /api/categories request
  const paramslistCards = {
    headers: {
      locale: 'en-US'
    }
  };

  // params for POST /api/order request
  const paramsCreateOrder = {
    headers: {
      token
    }
  };

  // data for POST /api/order request
  const dataCreateOrder = {
    text: 'Edible your way!',
    cardID: cardId
  };

  const requests = {
    'List Cards': {
      method: 'GET',
      url: urlListCards,
      params: paramslistCards
    },
    'Create Order': {
      method: 'POST',
      url: urlCreateOrder,
      body: dataCreateOrder,
      params: paramsCreateOrder
    }
  };

  const responses = http.batch(requests);
  const listCardsRes = responses['List Cards'];
  const createOrderRes = responses['Create Order'];

  check(listCardsRes, {
    // checks that every response to that API endpoint returns a status code of 200 or
    // we record any failed requests so that we will get the percentage of successful operations in the final output
    'GET /api/categories status is 200': (r) => r.status === 200
  }) || listErrorRate.add(1);

  ListTrend.add(listCardsRes.timings.duration);

  check(createOrderRes, {
    'POST /api/order status is 200': (r) => r.status === 200
  }) || createErrorRate.add(1);

  CreateTrend.add(createOrderRes.timings.duration);

  const printibleId = JSON.parse(createOrderRes.body).data.printibleID;

  return printibleId;
}

function generateAndPrintPdf(printibleId, storeNumber, orderNumber) {
  const urlUpdateOrderData = `${BASE_URL}/order/${printibleId}`;
  const urlGeneratePdf = `${BASE_URL}/pdf/${printibleId}`;
  const urlPrintPdf = `${BASE_URL}/pdf/${printibleId}/success`;

  // params for PUT /api/pdf/{ptintible_id} request
  const paramsPdf = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // data for PUT /api/order/{printible_id} request
  const dataUpdateOrder = {
    ea_order_number: orderNumber,
    ea_store_number: storeNumber
  };

  // data for PUT /api/pdf/{printible_id} request
  const dataPdf = {
    store_number: storeNumber,
    employee_id: '12345'
  };

  const stringifiedDataPdf = JSON.stringify(dataPdf);

  const requests = {
    'Update Order': {
      method: 'PUT',
      url: urlUpdateOrderData,
      body: dataUpdateOrder
    },
    'Generate Pdf': {
      method: 'PUT',
      url: urlGeneratePdf,
      body: stringifiedDataPdf,
      params: paramsPdf
    },
    'Print Pdf': {
      method: 'PUT',
      url: urlPrintPdf,
      body: stringifiedDataPdf,
      params: paramsPdf
    }
  };

  const responses = http.batch(requests);
  const updateOrderRes = responses['Update Order'];
  const generatePdfRes = responses['Generate Pdf'];
  const printPdfRes = responses['Print Pdf'];

  check(updateOrderRes, {
    'PUT /api/order/{printible_id} status is 200': (r) => r.status === 200
  }) || updateErrorRate.add(1);

  UpdateTrend.add(updateOrderRes.timings.duration);

  check(generatePdfRes, {
    'PUT /api/pdf/{printible_id} status is 200': (r) => r.status === 200
  }) || generateErrorRate.add(1);

  GenerateTrend.add(generatePdfRes.timings.duration);

  check(printPdfRes, {
    'PUT /api/pdf/{printible_id}/success status is 200': (r) => r.status === 200
  }) || printErrorRate.add(1);

  PrintTrend.add(printPdfRes.timings.duration);
}

export default function () {
  // gets random card id
  const cardId = getRandomStr(cardIds);
  const printibleId = listCardsAndCreateOrder(cardId);

  // gets random store number between 1000 and 2000 inclusively
  const storeNumber = getNumFromTwoVals(1137, 2826);

  // gets random number between 25000 and 99999 (part of order number)
  const orderNumber = `W2000-0${getRandomNum(25000, 99999)}-2-1`;

  generateAndPrintPdf(printibleId, storeNumber, orderNumber);

  // add sleep func after each check(); sleep for a second
  sleep(1);
}

function getNumFromTwoVals(value1, value2) {
  return Math.random() < 0.5 ? value1 : value2;
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomStr(arr) {
  const random = Math.floor(Math.random() * arr.length);

  return arr[random];
}
