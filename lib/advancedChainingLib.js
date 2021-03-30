var Clarifai = require('clarifai');
var request = require('needle');
var Promise = require('bluebird');

var clarifaiApp = new Clarifai.App({
  apiKey: '83e117d9abbe424aa0055878cdf0bbe8'
});
/*
 * getIntersection(arrays) =>
 *   @param {Array} arrays - an array of arrays, each containing a set of values
 *   @return {Array} - a single array with the intersection of values from all arrays
 */

var getIntersection = function(arrays) {
  return arrays.shift().filter(function(v) {
    return arrays.every(function(a) {
      return a.indexOf(v) !== -1;
    });
  });
};

/**
 * getGitHubProfile(handle) =>
 *   @param {String} handle - the handle of a GitHub user
 *   @return {Promise} - resolves with the user's profile in the following format:
 *     {
 *       handle: 'danthareja',
 *       name: 'Dan Thareja',
 *       avatarUrl: 'https://avatars.githubusercontent.com/u/6980359?v=3.jpg'
 *     }
 */

var getGitHubProfile = function (user) {
  var url = 'https://api.github.com/users/' + user;
  var options = {
    headers: { 'User-Agent': 'request' },
  };

  return new Promise(function (resolve, reject) {
    request.get(url, options, function (err, res, body) {
      if (err) {
        return reject(err);
      }

      var simpleProfile = {
        handle: body.login,
        name: body.name,
        avatarUrl: body.avatar_url + '.jpg', // extension necessary for image tagger
      };
      resolve(simpleProfile);
    });
  });
};


/**
 * predictImage(imageUrl) =>
 *   @param {String} imageUrl - the url of the image you want to tag
 *   @return {Promise} - resolves with an array of tags
 */

var predictImage = function (imageUrl) {
  if (clarifaiApp._config.apiKey === 'FILL_ME_IN') {
    throw new Error('You must add your API key before you can predict an image');
  }

  return clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, imageUrl)
    .then(function (response) {
      return response.outputs[0].data.concepts.map(function ({ name }) {
        return name;
      });
    })
    .catch(function (err) {
      return err;
    });
};


module.exports = {
  predictImage: predictImage,
  getIntersection: getIntersection,
  getGitHubProfile: getGitHubProfile,
};
