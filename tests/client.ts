import { generateApolloClient } from "@deep-foundation/hasura/client";
import { DeepClient } from "../imports/client";
import { assert } from 'chai';

const apolloClient = generateApolloClient({
  path: `${process.env.HASURA_PATH}/v1/graphql`,
  ssl: !!+process.env.HASURA_SSL,
  secret: process.env.HASURA_SECRET,
});

const deepClient = new DeepClient({ apolloClient });

describe('serialize', () => {
  it(`{ id: 5 }`, () => {
    assert.deepEqual(deepClient.serialize({ id: 5 }), { id: { _eq: 5 } });
  });
  it(`{ id: { _eq: 5 } }`, () => {
    assert.deepEqual(deepClient.serialize({ id: { _eq: 5 } }), { id: { _eq: 5 } });
  });
  it(`{ value: 5 }`, () => {
    assert.deepEqual(deepClient.serialize({ value: 5 }), { number: { value: { _eq: 5 } } });
  });
  it(`{ value: 'a' }`, () => {
    assert.deepEqual(deepClient.serialize({ value: 'a' }), { string: { value: { _eq: 'a' } } });
  });
  it(`{ number: { value: { _eq: 5 } } }`, () => {
    assert.deepEqual(deepClient.serialize({ number: { value: { _eq: 5 } } }), { number: { value: { _eq: 5 } } });
  });
  it(`{ string: { value: { _eq: 'a' } } }`, () => {
    assert.deepEqual(deepClient.serialize({ string: { value: { _eq: 'a' } } }), { string: { value: { _eq: 'a' } } });
  });
  it(`{ object: { value: { _contains: { a: 'b' } } } }`, () => {
    assert.deepEqual(deepClient.serialize({ object: { value: { _contains: { a: 'b' } } } }), { object: { value: { _contains: { a: 'b' } } } });
  });
  it(`{ from: { value: 5 } }`, () => {
    assert.deepEqual(deepClient.serialize({ from: { value: 5 } }), { from: { number: { value: { _eq: 5 } } } });
  });
  it(`{ out: { type_id: Contain, value: item, from: where } }`, async () => {
    assert.deepEqual(deepClient.serialize(
      { out: { type_id: await deepClient.id('@deep-foundation/core', 'Contain'), value: 'b', from: { type_id: await deepClient.id('@deep-foundation/core', 'Package') , value: 'a' } } }
    ), {
      out: {
        from: {
          type_id: { _eq: await deepClient.id('@deep-foundation/core', 'Contain') },
          string: { value: { _eq: 'a' } },
        },
        type_id: { _eq: await deepClient.id('@deep-foundation/core', 'Package') },
        string: { value: { _eq: 'b' } },
      }
    });
  });
  it(`{ value: 5, link: { type_id: 7 } }`, () => {
    assert.deepEqual(deepClient.serialize(
      { value: 5, link: { type_id: 7 } },
      'value'
    ), {
      value: { _eq: 5 },
      link: {
        type_id: { _eq: 7 }
      },
    });
  });
  it(`id(packageName,contain)`, async () => {
    const id = await deepClient.id('@deep-foundation/core', 'Value');
    assert.equal(id, 3);
  });
});