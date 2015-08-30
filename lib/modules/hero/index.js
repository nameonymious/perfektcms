

module.exports = function(options, callback) {
  return new Construct(options, callback);
};

module.exports.Construct = Construct;

function Construct(options, callback) {
  var apos = options.apos;
  var app = options.app;
  if (!options.consumerKey) {
    console.error('WARNING: you must configure the consumerKey, consumerSecret, accessToken and accessTokenSecret options to use the Twitter widget.');
  }
  var consumerKey = options.consumerKey;
  var consumerSecret = options.consumerSecret;
  var accessToken = options.accessToken;
  var accessTokenSecret = options.accessTokenSecret;

  // How long to cache the feed, in seconds. Twitter's API rate limit is
  // rather generous at 300 requests per 15 minutes. We shouldn't get anywhere
  // near that, we'd make 30 requests. However with clustering we would have
  // separate caches and this might start to look like the right setting.

  var cacheLifetime = options.cacheLifetime || 30;
  var self = this;
  self._apos = apos;
  self._app = app;
  self._apos.mixinModuleAssets(self, 'hero', __dirname, options);

  // This widget should be part of the default set of widgets for areas
  // (this isn't mandatory)
  apos.defaultControls.push('hero');

  // Include our editor template in the markup when aposTemplates is called
  self.pushAsset('template', 'heroEditor', { when: 'user' });

  // Make sure that aposScripts and aposStylesheets summon our assets
  self.pushAsset('script', 'content', { when: 'always' });
  self.pushAsset('script', 'editor', { when: 'user' });
  self.pushAsset('stylesheet', 'content', { when: 'always' });

  // Serve our feeds. Be sure to cache them so we don't hit the rate limit.
  // TODO: consider using the streaming API for faster updates without hitting
  // the rate limit.

  var tweetCache = {};
  var url;


  self.widget = true;
  self.label = 'hero';
  self.css = 'hero';
  self.icon = 'icon-twitter';
  self.sanitize = function(item) {
    if (item.account) {
      var matches = item.account.match(/\w+/);
      item.account = matches[0];
    }
  };
  self.renderWidget = function(data) {
    return self.render('hero', data);
  };
  self._apos.addWidgetType('hero', self);

  return setImmediate(function() { return callback(null); });
}
