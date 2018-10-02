const gulp = require('gulp');
const conf = require('../conf');
const through = require('through2');
const PluginError = require('plugin-error');
const Vinyl = require('vinyl');
const Feed = require('feed').Feed;
const PLUGIN_NAME = 'GEN_FEED';
const uniqby = require('lodash.uniqby');
const moment = require('moment');

module.exports.defaultAuthor = {
  name: "cocoa.rocks",
  link: "https://cocoa.rocks"
}
module.exports.feedSettings = {
  title: "Cocoa Rocks",
  description: "Awesome Cocoa Controls",
  id: "https://cocoa.rocks",
  link: "https://cocoa.rocks",
  image: "https://cocoa.rocks/assets/logo_txt_white.png",
  favicon: "",
  copyright: "All rights reserved 2018, Viktor Braun",
  //updated: new Date(2013, 6, 14), 
  generator: "cocoa-rocks generator", // optional, default = 'Feed for Node.js'
  feedLinks: {
    // json: "https://cocoa.rocks/json",
    atom: "https://cocoa.rocks/atom.xml"
  },
  author: module.exports.defaultAuthor
};


function gen_feed_impl(json, done){
  const feed = new Feed(module.exports.feedSettings);
  var categories = [];
  
  for(var p of json){
    if(!p.repo) return done(new Error('could not find repo field'));
    if(!p.created_at) return done(new Error('could not find created_at field for: ' + p.repo));
    if(!p.github) return done(new Error('could not find github field for: ' + p.repo));

    categories = categories.concat(p.tags);
    categories = categories.concat(p.paltforms);
    if(p.github.language){
      categories.push(p.github.language);
    }

    feed.addItem({
      title: p.github.name,
      id: p.repo,
      link: p.github.html_url,
      description: p.github.description,
      content: `
        <h1>${p.github.name}</h1>
        <p>from <a href="${p.github.owner.html_url}">${p.github.owner.login}</a></p>
        <p>${p.github.description}</p>
        <p>
        <img src="${p.banner}" />
        </p>
        <p>
        <strong>View on <a href="${p.github.html_url}">GitHub</a></strong>
        </p>
      `,
      author: [
        module.exports.defaultAuthor
      ],
      contributor: [
        {
          name: p.github.owner.login,
          link: p.github.owner.html_url
        }
      ],
      date: moment(p.created_at).toDate(),
      image: p.banner
    })
  }


  categories = uniqby(categories, t => t);
  for(var cat of categories){
    feed.addCategory(cat);
  }

  var rss2 = feed.rss2();
  var atom1 = feed.atom1();
  var json1 = feed.json1();
  return done(null, {rss2: rss2, atom1, json1: json1});
}

function gen_feed(){
  return through.obj(function (file, enc, callback) {
    if (file === null || file.isDirectory()) {
      this.push(file);
      return callback();
    }
    
    if(!file.isBuffer()){
      this.emit('error', new PluginError(PLUGIN_NAME, 'Only Buffer format is supported'));
      return callback();
    }
    
    
    var input = new String(file.contents);
    var json = JSON.parse(input);
    gen_feed_impl(json, (err, output) => {
      if(err){
        this.emit('error', new PluginError(PLUGIN_NAME, err));
        return callback();        
      }
      

      // var rss2 = new Vinyl();
      // rss2.path = 'rss-feed.xml',
      // rss2.contents = new Buffer(output.rss2);

      var atom1 = new Vinyl();
      atom1.path = 'atom-feed.xml',
      atom1.contents = new Buffer(output.atom1);      

      // var json1 = new Vinyl();
      // json1.path = 'json-feed.xml',
      // json1.contents = new Buffer(output.json1);            

      // this.push(rss2);
      this.push(atom1);
      // this.push(json1);
      
      callback();
    });
    
  });
}

gulp.task('feeds', function() {
  return gulp.src(conf.path.src('data/data.compiled.json'))
    .pipe(gen_feed())
    .pipe(gulp.dest(conf.path.dist()));
})