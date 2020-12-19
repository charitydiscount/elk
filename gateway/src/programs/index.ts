import { client, indeces } from '../elastic';
import { Program } from '../models/program';

/**
 * Search the programs index based on the provied query (simple search term)
 * @param {String} query
 * @param {Boolean} exact
 */
export const searchPrograms = async (query: string) => {
  const productProgramIds = await searchRelevantProducts(query);
  return searchByProgramIds(productProgramIds);
};

const searchByProgramIds = async (ids: string[]): Promise<Program[]> => {
  if (!ids || ids.length === 0) {
    return [];
  }

  try {
    const { body } = await client.search({
      index: indeces.PROGRAMS_INDEX,
      body: {
        query: {
          terms: { id: ids },
        },
      },
    });

    return body.hits.hits.map((hit: any) => hit._source);
  } catch (e) {
    console.log(e.message);
  }

  return [];
};

/**
 * Search the programs index based on the provied query and query operator
 * @param {String} index e.g. products
 * @param {String} query E.g. mag
 */
export const search = async (index: string, query: string) => {
  try {
    const { body } = await client.search({
      index,
      body: {
        from: 0,
        size: 50,
        query: {
          multi_match: {
            query,
            fields: ['name^3', 'description'],
          },
        },
        _source: {
          excludes: 'description',
        },
      },
    });

    return body.hits;
  } catch (e) {
    console.log(e.message);
  }
};

const searchRelevantProducts = async (query: string): Promise<string[]> => {
  try {
    const { body } = await client.search({
      index: indeces.PRODUCTS_INDEX,
      body: {
        query: {
          match: {
            title: query,
          },
        },
        aggs: {
          dedup: {
            terms: {
              field: 'campaign_id.keyword',
            },
            aggs: {
              dedup_docs: {
                top_hits: {
                  _source: false,
                  size: 1,
                },
              },
            },
          },
        },
      },
    });

    body.aggregations.dedup.buckets.sort(
      (b1: any, b2: any) =>
        (b1.dedup_docs.hits.max_score as number) -
        (b2.dedup_docs.hits.max_score as number)
    );
    return body.aggregations.dedup.buckets.map((bucket: any) => bucket.key);
  } catch (e) {
    console.log(e.meta.body.error.reason);
  }

  return [];
};
