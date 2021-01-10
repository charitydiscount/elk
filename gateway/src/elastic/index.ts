import { Client } from '@elastic/elasticsearch';

if (
  !process.env.ELASTIC_ENDPOINT ||
  !process.env.ELASTIC_USERNAME ||
  !process.env.ELASTIC_PASSWORD
) {
  throw new Error('Missing env variables for elastic');
}

export const client: Client = new Client({
  node: process.env.ELASTIC_ENDPOINT,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
});

export const indeces = {
  get PROGRAMS_INDEX() {
    return 'programs';
  },
  get PRODUCTS_INDEX() {
    return 'products';
  },
  get PRICES_INDEX() {
    return 'prices-*';
  },
};
