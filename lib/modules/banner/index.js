
var cache = {};
var pending = {};

module.exports = function(options, callback) {
  return new Construct(options, callback);
};

module.exports.Construct = Construct;

function Construct(options, callback) {
  var apos = options.apos;
  var app = options.app;
  var self = this;
  self._apos = apos;
  self._app = app;
  var lifetime = options.lifetime ? options.lifetime : 60000;

  self._apos.mixinModuleAssets(self, 'banner', __dirname, options);

  // This widget should be part of the default set of widgets for areas
  // (this isn't mandatory)
  apos.defaultControls.push('banner');

  // Include our editor template in the markup when aposTemplates is called
  self.pushAsset('template', 'bannerEditor', { when: 'user' });

  // Make sure that aposScripts and aposStylesheets summon our assets

  // We need the editor for banner feeds. (TODO: consider separate script lists for
  // resources needed also by non-editing users.)
  self.pushAsset('script', 'content', { when: 'always' });
  self.pushAsset('script', 'editor', { when: 'user' });
  self.pushAsset('stylesheet', 'content', { when: 'always' });

  self.widget = true;
  self.label = options.label || 'banner Feed';
  self.css = options.css || 'banner';
  self.icon = options.icon || 'icon-banner';

  self.jsonProperties = [ '_ajax' ];

  self.sanitize = function(item) {
    if (!item.feed.match(/^https?\:\/\//)) {
      item.feed = 'http://' + item.feed;
    }
    item.limit = parseInt(item.limit, 10);
  };

  self.renderWidget = function(data) {
    try {
      if (data.item._ajax) {
        // We've decided to let the browser
        // fetch this with a separate AJAX request.
        // Provide a target div so we don't blow
        // up the widget's controls by replacing the
        // entire thing. -Tom
        return '<div data-banner-content></div>';
      } else {
        // We're rendering it now, during the page load,
        // server side
        return self.render('banner', data);
      }
    } catch (e) {
      // No fatal crashes on other people's bad data please
      console.error('banner feed rendering error:');
      console.error(e);
      console.error(data.item);
      return '';
    }
  };

  app.get('/apos-banner/render-feed', function(req, res) {
    self.sanitize(req.query);
    delete req.query._ajax;
    return self.loadFeed(req.query, function() {
      return res.send(self.renderWidget({ item: req.query }));
    });
  });

  // Loader method for the widget
  self.load = function(req, item, callback) {
    var key = self.getKey(item);
    // If it's in the cache, "load" it now. Avoid a separate
    // AJAX request.
    if (cache[key]) {
      return self.loadFeed(item, callback);
    }
    // It's not in the cache. Mark it as needing to be
    // loaded by the browser so we don't block the
    // rest of the page from loading now. We can do that
    // because it's not important for Google to see
    // banner content on the page.
    item._ajax = true;
    return setImmediate(callback);
  };

  // Generate a cache key for this item
  self.getKey = function(item) {
    return JSON.stringify({ feed: item.feed, limit: item.limit });
  };

  // Load the feed. Shared by self.load and the render-feed route
  self.loadFeed = function(item, callback) {

    // Asynchronously load the actual banner feed
    // The properties you add should start with an _ to denote that
    // they shouldn't become data attributes or get stored back to MongoDB
    item._entries = [];

    var now = Date.now();
    // Take all properties into account, not just the feed, so the cache
    // doesn't prevent us from seeing a change in the limit property right away

    var key = self.getKey(item);

    // If we already have it, deliver it
    if (cache[key] && ((cache[key].when + lifetime) > now)) {
      item._entries = cache[key].data;
      item._failed = cache[key].failed;
      return callback();
    }

    // If we're already waiting for it, wait for it
    if (pending[key]) {
      pending[key].push({
        item: item,
        callback: function() {
          return callback();
        }
      });
      return;
    }

    // Start a pending queue for this request
    pending[key] = [];

  };

  apos.addWidgetType('banner', self);

  return setImmediate(function() { return callback(null); });
}
