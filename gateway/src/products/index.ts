import { client, indeces } from '../elastic';
import { flatMap, flatten } from 'lodash';

export interface ProductsQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  min?: string;
  max?: string;
  field?: string;
}

/**
 * Search the programs index based on the provied query (simple search term)
 * @param {String} query
 * @param {ProductsQueryParams} params
 */
export const searchProducts = async (
  query: string,
  { page = 0, size = 50, sort, min, max, field = 'title' }: ProductsQueryParams
) => {
  const searchBody: any = {
    from: page,
    size: size,
    query: {
      bool: {
        must: {
          match_phrase: {
            [field]: { query, slop: 1 },
          },
        },
      },
    },
  };

  if (sort === 'asc' || sort === 'desc') {
    searchBody.sort = [{ price: sort }];
  }

  let minPrice;
  let maxPrice;

  if (min) {
    minPrice = parseInt(min);
  }
  if (max) {
    maxPrice = parseInt(max);
  }

  if (minPrice || maxPrice) {
    searchBody.query.bool.filter = {
      range: { price: {} },
    };

    if (minPrice) {
      searchBody.query.bool.filter.range.price.gte = minPrice;
    }

    if (maxPrice) {
      searchBody.query.bool.filter.range.price.lte = maxPrice;
    }
  }

  try {
    const { body } = await client.search({
      index: indeces.PRODUCTS_INDEX,
      body: searchBody,
    });

    return body.hits;
  } catch (e) {
    console.error(e);
  }
};

export const getFeaturedProducts = async () => {
  const categories = [
    'rochii',
    'telefone',
    'carte',
    'pantofi',
    'ochelari',
    'animale',
  ];
  try {
    const { body } = await client.msearch({
      body: flatten([
        ...categories.map((category) => [
          { index: indeces.PRODUCTS_INDEX },
          {
            size: 20,
            query: {
              function_score: {
                query: { match: { category } },
                random_score: {},
              },
            },
          },
        ]),
      ]),
    });

    return {
      hits: flatMap(body.responses.map((r: any) => r.hits.hits)),
    };
  } catch (e) {
    console.error(e.message || e);
    return undefined;
  }
};

export const getSimilarProducts = async (
  productId: string,
  { page = 0, size = 20 }
) => {
  if (!productId) {
    return { hits: [] };
  }
  try {
    const { body } = await client.search({
      index: indeces.PRODUCTS_INDEX,
      body: {
        query: {
          more_like_this: {
            fields: ['title', 'category'],
            like: [
              {
                _index: 'products',
                _id: productId.trim(),
              },
            ],
            min_term_freq: 1,
          },
        },
        size,
        from: page,
      },
    });

    return body.hits;
  } catch (error) {
    console.log(error.message);
  }

  return { hits: [] };
};

export const getPriceHistory = async (productId: string) => {
  if (!productId) {
    return { hits: [] };
  }
  try {
    const { body } = await client.search({
      index: indeces.PRICES_INDEX,
      body: {
        query: {
          term: {
            _id: { value: productId },
          },
        },
        size: 45,
      },
    });

    return body.hits;
  } catch (error) {
    console.log(error.message);
  }

  return { hits: [] };
};
