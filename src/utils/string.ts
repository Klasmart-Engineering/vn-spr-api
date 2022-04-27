// Reference: https://github.com/tjcafferkey/stringinject
/**
 * Replace placeholders in a string.
 *
 * Return `false` if the string is invalid.
 *
 * Usage:
 *
 * ```
 * import stringInject from 'string';
 *
 * Array:
 *  var string = stringInject("This is a {0} string for {1}", ["test", "stringInject"]);
 *
 * Object:
 *  var string = stringInject("My username is {username} on {platform}", { username: "tjcafferkey", platform: "GitHub" });
 *  var str = stringInject("My username is {user.name} on {platform}", { user: { name: "Robert" }, platform: "IRL" });
 * ```
 *
 * @param str string
 * @param data any
 * @returns string|Error
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringInject(str: string, data: any) {
  if (data instanceof Array) {
    return str.replace(/({\d})/g, (i) => {
      return data[Number(i.replace(/{/, '').replace(/}/, ''))];
    });
  } else if (data instanceof Object) {
    if (Object.keys(data).length === 0) {
      return str;
    }

    for (const _ in data) {
      return str.replace(/({([^}]+)})/g, (i) => {
        const key = i.replace(/{/, '').replace(/}/, '');

        const subKeys = key.split('.');
        if (subKeys.length > 1) {
          try {
            return subKeys.reduce((acc, k) => {
              acc = acc[k];
              return acc;
            }, data);
          } catch (e) {
            return `All data for ${key} does not exist!`;
          }
        }

        return data[key] || data[key] === 0 ? data[key] : i;
      });
    }
  } else if (
    data instanceof Array === false ||
    data instanceof Object === false
  ) {
    return str;
  } else {
    throw new Error('Failed to inject string');
  }
}
