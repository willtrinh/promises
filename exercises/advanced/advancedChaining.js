/**
 * Your task is to write a function that uses a deep learning
 * algorithm to determine the common set of concepts between
 * multiple github profile pictures
 *
 * Given an array of github handles, searchCommonConceptsFromGitHubProfiles should:
 *   1) get the public profile associated with each handle
 *   2) extract the avatarUrl of each profile
 *   3) get the set of concepts for each avatarUrl (requires API key)
 *   4) find the intersection of the concepts
 *
 * Much of the heavy lifting has been done already in `lib/advancedChainingHelpers`,
 * you just have to wire everything up together! Once you pass this one, you'll
 * be a promise chaining master! Have fun!
 */

// clarifai key 83e117d9abbe424aa0055878cdf0bbe8

var Promise = require('bluebird');
var lib = require('../../lib/advancedChainingLib');

// We're using Clarifai's API to recognize concepts in an image into a list of concepts
// Visit the following url to sign up for a free account
//     https://portal.clarifai.com/signup
// Once you're in, create a new application on your Clarifai User Dashboard. Clarifai will
// automatically generate an API key which you can find by opening up the new
// application tile.  Accept the default 'all scopes' setting for the key or modify it
// to give it the `Predict on Public and Custom Models` scope. When your key
// is ready, copy and add it to the `advancedChainingLib.js` file.

var searchCommonConceptsFromGitHubProfiles = function (githubHandles) {
  let p = Promise.all(githubHandles.map(githubHandle => lib.getGitHubProfile(githubHandle)));

  p = p.then((users) => users.map((user) => user.avatarUrl));

  p = p.then((avatarUrls) => avatarUrls.map((url) => lib.predictImage(url)));

  // p.then(x => Promise.all(x).then(x => console.log('*****', x)));

  p = Promise.all(p);

  return p.then(lib.getIntersection);
};

// Export these functions so we can unit test them
module.exports = {
  searchCommonConceptsFromGitHubProfiles,
};
