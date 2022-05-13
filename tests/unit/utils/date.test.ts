import { generateDates, groupScoresByDateRanges } from 'src/utils';

describe('#generateDates', () => {
  it('returns correct list of dates in descending order', () => {
    const from = new Date('2022-01-01');
    const dates = generateDates(from, 5, 10);

    expect(dates).toEqual([
      '2022-02-10',
      '2022-01-31',
      '2022-01-21',
      '2022-01-11',
      '2022-01-01',
    ]);
  });

  it('returns correct list of dates in descending order when `step` is negative', () => {
    const from = new Date('2022-02-10');
    const dates = generateDates(from, 5, -10);

    expect(dates).toEqual([
      '2022-02-10',
      '2022-01-31',
      '2022-01-21',
      '2022-01-11',
      '2022-01-01',
    ]);
  });

  it('returns correct list of dates in descending order when length & step are float numbers', () => {
    const from = new Date('2022-01-01');
    const dates = generateDates(from, 5, 10.5);

    expect(dates).toEqual([
      '2022-02-10',
      '2022-01-31',
      '2022-01-21',
      '2022-01-11',
      '2022-01-01',
    ]);
  });
});

describe('#groupScoresByDateRanges', () => {
  it('returns correct groups of score', () => {
    const dates = ['2022-05-12', '2022-04-12', '2022-03-12'];
    const scoresWithDate = [
      { day: '2022-05-12', score: 3 },
      { day: '2022-05-10', score: 3 },
      { day: '2022-05-05', score: 3 },
      { day: '2022-04-22', score: 3 },
      { day: '2022-04-15', score: 3 },
      { day: '2022-03-25', score: 3 },
      { day: '2022-03-15', score: 3 },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expected: Record<string, any> = [];
    expected['2022-05-12'] = {
      name: '2022-05-12',
      data: [
        { day: '2022-05-12', score: 3 },
        { day: '2022-05-10', score: 3 },
        { day: '2022-05-05', score: 3 },
        { day: '2022-04-22', score: 3 },
        { day: '2022-04-15', score: 3 },
      ],
    };
    expected['2022-04-12'] = {
      name: '2022-04-12',
      data: [
        { day: '2022-03-25', score: 3 },
        { day: '2022-03-15', score: 3 },
      ],
    };
    expected['2022-03-12'] = { name: '2022-03-12', data: [] };

    const result = groupScoresByDateRanges(dates, scoresWithDate);
    expect(result).toEqual(expected);
  });
});
