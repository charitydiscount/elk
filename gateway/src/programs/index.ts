import { client, indeces } from '../elastic';

/**
 * Search the programs index based on the provied query (simple search term)
 * @param {String} query
 * @param {Boolean} exact
 */
export const searchPrograms = async (query: string, exact: boolean = false) => {
  let queryOperator = 'prefix';
  if (exact) {
    queryOperator = 'term';
  }

  return search(indeces.PROGRAMS_INDEX, query, queryOperator, 'name');
};

/**
 * Search the programs index based on the provied query and query operator
 * @param {String} index e.g. products
 * @param {String} query E.g. mag
 * @param {String} queryOperator E.g. term
 * @param {String} field E.g. name
 */
const search = async (
  index: string,
  query: string,
  queryOperator: string,
  field: string
) => {
  try {
    const { body } = await client.search({
      index,
      body: {
        from: 0,
        size: 50,
        query: {
          [queryOperator]: {
            [field]: {
              value: query,
            },
          },
        },
      },
    });

    return body.hits;
  } catch (e) {
    console.log(e);
  }
};
