import { stringInject } from 'src/utils';

describe('stringInject', () => {
  describe('replace brackets with array items', () => {
    it('replaces brackets {0} in string with array[0]', () => {
      const str = stringInject('My username is {0}', ['tjcafferkey']);
      expect(str).toEqual('My username is tjcafferkey');
    });

    it('replaces brackets {0} and {1} in string with array[0] and array[1]', () => {
      const str = stringInject('I am {0} the {1} function', [
        'testing',
        'stringInject',
      ]);
      expect(str).toEqual('I am testing the stringInject function');
    });
  });

  describe('pass in a string with no {} with an array of items', () => {
    it('returns the same string as passed in', () => {
      const str = stringInject('This should be the same', [
        'testing',
        'stringInject',
      ]);
      expect(str).toEqual('This should be the same');
    });
  });

  describe('replace object values based on their keys', () => {
    it('replaces object values based on one key', () => {
      const str = stringInject('My username is {username}', {
        username: 'tjcafferkey',
      });
      expect(str).toEqual('My username is tjcafferkey');
    });

    it('replaces object values based on two keys', () => {
      const str = stringInject('My username is {username} on {platform}', {
        username: 'tjcafferkey',
        platform: 'GitHub',
      });
      expect(str).toEqual('My username is tjcafferkey on GitHub');
    });

    it('replaces object values although the keys are omitted', () => {
      const username = 'tjcafferkey';
      const platform = 'GitHub';
      const str = stringInject('My username is {username} on {platform}', {
        username,
        platform,
      });
      expect(str).toEqual('My username is tjcafferkey on GitHub');
    });

    it('replaces object values based on two keys in reverse order', () => {
      const str = stringInject('My username is {platform} on {username}', {
        username: 'tjcafferkey',
        platform: 'GitHub',
      });
      expect(str).toEqual('My username is GitHub on tjcafferkey');
    });

    it('does not replace in the string if the key does not exist in the object', () => {
      const str = stringInject('My username is {platform} on {username}', {
        username: 'tjcafferkey',
      });
      expect(str).toEqual('My username is {platform} on tjcafferkey');
    });

    it('replaces object values based on one nested key and one regular', function () {
      const str = stringInject('My username is {user.name} on {platform}', {
        user: { name: 'Robert' },
        platform: 'IRL',
      });
      expect(str).toEqual('My username is Robert on IRL');
    });

    it('returns the string if the object has no keys', () => {
      const str = stringInject('My username is {platform} on {username}', {});
      expect(str).toEqual('My username is {platform} on {username}');
    });
  });

  describe('pass in incorrect parameters', () => {
    it('returns false when passed a number instead of an array as second parameter', () => {
      const str = stringInject('hello', 1);
      expect(str).toEqual('hello');
    });

    it('if the data param is false bool', () => {
      const str = stringInject(
        'My username is {platform} on {username}',
        false
      );
      expect(str).toEqual('My username is {platform} on {username}');
    });

    it('if the data param is true bool', () => {
      const str = stringInject('My username is {platform} on {username}', true);
      expect(str).toEqual('My username is {platform} on {username}');
    });

    it('if the data param is a string', () => {
      const str = stringInject(
        'My username is {platform} on {username}',
        'string'
      );
      expect(str).toEqual('My username is {platform} on {username}');
    });
  });
});
