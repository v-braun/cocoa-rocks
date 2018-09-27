var request = require('request');
var through = require('through2');
var PluginError = require('plugin-error');
var Vinyl = require('vinyl');
var fs = require('fs');
var ghUrl = require('parse-github-url');
var async = require('async');
var log = require('fancy-log');
var find = require('lodash.find');
var merge = require('lodash.merge');
var Ajv = require('ajv');


request = request.defaults({
  headers: {'User-Agent': 'v-braun/cocoa-rocks'}
})

const PLUGIN_NAME = 'gulp-compile-data';

function transformImpl(input, action, lastFile, cb){
  var js = JSON.parse(input);
  var jsLast = {};
  
  if(fs.existsSync(lastFile)){
    log.info('load', 'last file', lastFile);
    var lastContent = fs.readFileSync(lastFile).toString();
    jsLast = JSON.parse(lastContent);
  }
  else{
    log.info('not found', 'last file', lastFile);
  }

  actions[action](js, jsLast, (err, result) => {
    if(err){
      return cb(err);
    }

    var output = JSON.stringify(result, null, 2);
    return cb(null, output);
  });
}

function getRepoInfo(repo, done){
  var url = 'https://api.github.com/repos/' + repo;
  if(process.env.COCOA_ROCKS_GITHUB_TKN){
    url = url + '?access_token=' + process.env.COCOA_ROCKS_GITHUB_TKN;
  }
  else{
    log.warn('no COCOA_ROCKS_GITHUB_TKN specified, requests will be limited')
  }

  request(url, (err, response, body) => {
    if(err) return done(err);

    if(response.statusCode != 200) {
      
      if(response.headers && response.headers['x-ratelimit-remaining'] == 0){
        var limit = response.headers['x-ratelimit-limit'];
        var resetAt = response.headers['x-ratelimit-reset'] * 1000;
        var resetAtDate = new Date(resetAt);
        var diff = resetAtDate - new Date();
        
        log.warn('reached gh rate limit of', limit);
        log.warn('go sleep', diff / 1000 / 60, 'minutes');
        
        setTimeout(() => {
          log.info('awake after sleep');
          getRepoInfo(repo, done);
        }, diff);

        return;
      }
      else{
        return done(new Error('unexpected status code: ' + response.statusCode))
      }
    };

    if(response.statusCode == 200){
      return done(null, JSON.parse(body));
    }

  }, (err) => {
    return done(err)
  });
}

function compile(json, lastJson,  done){  
  async.eachSeries(json, function(entry, cb) {

    // only check if never updated
    var existing = find(lastJson, e => e.repo == entry.repo);
    if(!existing){
      log.info('found new entry', entry.repo);
      entry.created_at = new Date();
    }
    else{
      if(existing.github_updated_at){
        log.info('repo updated', 'skip', entry.repo);
        merge(entry, existing);
        return cb(null);
      }
    }
    

    var github = ghUrl(entry.repo);

    log.info('fetch', 'begin', github.repo);
    getRepoInfo(github.repo, (err, data) => {
      if(err) {
        log.error(`failed fetch from: ${github.repo}`, err);
        return cb(err);
      }

      log.info('fetch', 'done', github.repo);
      entry.github = {
        name: data.name,
        full_name: data.full_name,
        html_url: data.html_url,
        description: data.description,
        created_at: data.created_at,
        updated_at: data.updated_at,
        pushed_at: data.pushed_at,
        language: data.language,
        forks_count: data.forks_count,
        open_issues_count: data.open_issues_count,
        license: data.license ? data.license.spdx_id : '',
        watchers: data.watchers,
        owner: {
          login: data.owner.login,
          avatar_url: data.owner.avatar_url,
          gravatar_id: data.owner.gravatar_id,
          html_url: data.owner.html_url
        }
      };

      entry.github_updated_at = new Date();

      // process.exit(1);
      // cb(new Error('cancel!'));
      cb(null);
    });


  }, (err) => done(err, json));
}

function validate(json, lastJson,  cb){
  const ajv = new Ajv({
    allErrors: true
  });
  
  var schema = JSON.parse(fs.readFileSync('./data.schema.json'));
  var validate = ajv.compile(schema);
  var valid = validate(json);
  if (!valid){
    log.error(JSON.stringify(validate.errors, null, 2));
    // log.error(validate.errors);
    return cb(new Error('schema validation failed'));
  }
  else{
    log.info('schema validation successfull');
  }

  cb(null, json);
}

var actions = {
  compile: compile,
  validate: validate,
}

function transform(action, lastFile){
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
    transformImpl(input, action, lastFile, (err, output) => {
      if(err){
        this.emit('error', new PluginError(PLUGIN_NAME, err));
        return callback();        
      }

      var outputBfr = new Buffer(output);
      var result = new Vinyl();
      result.path = file.path;
      result.contents = outputBfr;
  
      callback(null, result);
    });

  });
}
  
module.exports = transform;