import { groupBy } from 'src/utils';

describe('#groupBy', () => {
  const cars = [
    { brand: 'Audi', color: 'black' },
    { brand: 'Audi', color: 'white' },
    { brand: 'Ferarri', color: 'red' },
    { brand: 'Ford', color: 'white' },
    { brand: 'Peugot', color: 'white' },
  ];

  it('returns a correct array after grouping by key', () => {
    const expected = {
      Audi: [
        {
          brand: 'Audi',
          color: 'black',
        },
        {
          brand: 'Audi',
          color: 'white',
        },
      ],
      Ferarri: [
        {
          brand: 'Ferarri',
          color: 'red',
        },
      ],
      Ford: [
        {
          brand: 'Ford',
          color: 'white',
        },
      ],
      Peugot: [
        {
          brand: 'Peugot',
          color: 'white',
        },
      ],
    };
    const groupByBrand = groupBy(cars, 'brand');

    expect(groupByBrand).toEqual(expected);
  });

  it('returns a correct array after grouping by any keys', () => {
    const expected = {
      black: [
        {
          brand: 'Audi',
          color: 'black',
        },
      ],
      white: [
        {
          brand: 'Audi',
          color: 'white',
        },
        {
          brand: 'Ford',
          color: 'white',
        },
        {
          brand: 'Peugot',
          color: 'white',
        },
      ],
      red: [
        {
          brand: 'Ferarri',
          color: 'red',
        },
      ],
    };
    const groupByColor = groupBy(cars, 'color');

    expect(groupByColor).toEqual(expected);
  });
});
