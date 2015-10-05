var gulp = require('gulp'),
  watch = require('gulp-watch'),
  newer = require('gulp-newer'),
  browserSync = require('browser-sync'),
  marked = require('marked'),
  nunjucks = require('gulp-nunjucks-render'),
  data = require('gulp-data'),
  rename = require('gulp-rename'),
  fm = require('front-matter'),
  fs = require('fs');

var frontMatterDefaults = {
  template: "default"
};

gulp.task('default', ['md', 'js', 'css', 'img', 'html', 'assets', 'il-img'])

gulp.task('md', function() {
  var templateCache = {};

  nunjucks.nunjucks.configure(['src/templates/'], {watch: false});

  return gulp.src(['**/*.md', '!node_modules/**'])
    .pipe(data(function(file) {
      var content;
      var body;

      // Extract Front Matter
      try {
        content = fm(String(file.contents));
        body = content.body
      } catch (e) {
        body = String(file.contents);
        content = {attributes: frontMatterDefaults};
      }

      // Set Default Values for Attributes not Set in Front Matter
      for (var attr in frontMatterDefaults) {
        if (content.attributes[attr] == undefined) {
          content.attributes[attr] = frontMatterDefaults[attr];
        };
      }

      // Get HTML Template
      try {
        if (templateCache[content.attributes.template] == undefined) {
          templateCache[content.attributes.template] =  new Buffer(
            fs.readFileSync(
              "_static/_layouts/"+content.attributes.template+".html"
          ));
        };
      } catch (e) {
        throw "Couldn't find template called '" +
          content.attributes.template + "'.";
      }

      // Nunjucks Expects the Template to be the File in the Pipe
      file.contents = templateCache[content.attributes.template];

      try {
        content.attributes.body = marked(body);
      } catch (e) {
        console.log(e)
        throw "Markdown File Can't Be Parsed as Markdown";
      }

      return content.attributes;
    }))
    .pipe(nunjucks())
    .pipe(rename(function(path){
      if (path.basename == "README") {
        path.basename = "index";
      } else {
        path.dirname += "/" + path.basename;
        path.basename = "index";
      }
    }))
    .pipe(gulp.dest('_site'));
})

gulp.task('html', function() {
  var templateCache = {};

  return gulp.src(['_static/**/*.html', '!_static/_*/**'])
    .pipe(data(function(file) {
      var content;
      var body;
      try {
        content = fm(String(file.contents));
        body = content.body
      } catch (e) {
        body = String(file.contents);
        content = {attributes: {}};
      }

      // Set Default Values for Attributes not Set in Front Matter
      for (var attr in frontMatterDefaults) {
        if (content.attributes[attr] == undefined) {
          content.attributes[attr] = frontMatterDefaults[attr];
        };
      }

      // Get HTML Template
      try {
        if (templateCache[content.attributes.template] == undefined) {
          templateCache[content.attributes.template] =  new Buffer(
            fs.readFileSync(
              "_static/_layouts/"+content.attributes.template+".html"
          ));
        };
      } catch (e) {
        throw "Couldn't find template called '" +
          content.attributes.template + "'.";
      }

      file.contents = templateCache[content.attributes.template];
      content.attributes.body = body;

      return content.attributes;
    }))
    .pipe(nunjucks())
    .pipe(gulp.dest('_site'));
})

gulp.task('js', function() {
  return gulp.src('_static/assets/**/*.js')
    //.pipe(jshint())
    //.pipe(jshint.reporter('default'))
    //.pipe(uglify())
    //.pipe(concat('app.js'))
    .pipe(gulp.dest('_site/assets'));
});

gulp.task('css', function() {
  return gulp.src('_static/assets/**/*.css')
    //.pipe(concat('app.css'))
    .pipe(gulp.dest('_site/assets'));
});

gulp.task('img', function() {
  return gulp.src(['_static/assets/**/*.png','_static/assets/**/*.jpg'])
    //.pipe(concat('app.css'))
    .pipe(gulp.dest('_site/assets'));
});

gulp.task('il-img', function() {
  return gulp.src(['**/*.png','**/*.jpg', '!_*/**', '!node_modules/**'])
    //.pipe(concat('app.css'))
    .pipe(gulp.dest('_site'));
});

gulp.task('assets', function() {
  return gulp.src(['_static/**/.*', '!_static/_*/**'])
    //.pipe(concat('app.css'))
    .pipe(gulp.dest('_site'));
});

gulp.task('watch', ['default'], function () {
  watch('_static/assets/**/*.css', function () {
    gulp.start('css');
  });
  watch('_static/assets/**/*.js', function () {
    gulp.start('js');
  });
  watch(['_static/**/*.html'], function () {
    gulp.start('html');
  });
  watch(['**/*.png','**/*.jpg', '!_site/**'], function () {
    gulp.start('assets');
  });
  watch(['**/*.md', "_static/_layouts/*.html"], function () {
    gulp.start('md');
  });
  watch(['gulpfile.js'], function () {
    gulp.start('default');
  });
});

gulp.task('serve', ['watch'], function () {
  var files = [
    '_site/**/*.html',
    '_site/**/*.png',
    '_site/assets/**/*.css',
    '_site/assets/**/*.js'
  ];

  browserSync.init(files, {
    server: {
      baseDir: '_site'
    }
  });
});
