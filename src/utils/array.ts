// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const groupBy = (array: Record<string, any>[], key: string) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
