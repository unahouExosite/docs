---
title: Contributing Guide
template: two-column
---

# Contributing to Exosite's Documentation

Thanks for helping make docs better!

## Technical Overview

Exosite's docs site is hosted on Github Pages, this means that it's just a bunch
of static HTML files. To make the docs easier to write this repo includes a
custom static site generator that reads markdown and transforms it into HTML.

### Directory Structure

When the site generator runs it will ingest all the markdown files, convert them
to HTML, apply the site template, and save the file with the same name, changing
the extension from `.md` to `.html`.

In an effort to make the doc readable both on the generated site and directly in
the GitHub web interface most pages should be named README.md. The site
generator will save the generated HTML from any README.md file into an
index.html file. This means that, for instance, the RPC doc, `/rpc/README.md`
will generate the page `/rpc/index.html` which can then be viewed at
docs.exosite.com/rpc

In addition to markdown files the generator will copy all .html, .png, and .jpg
files in place.

### Frontmatter

Both markdown files and HTML files can contain frontmatter. Frontmatter is
basically a set of variables that the generator uses to change exactly how it
processes the file. It must be the first thing in the file and be formatted
like:

```
---
title: UDP Single Shot
template: two-column
---
```

There are two variables that are currently supported. `title` is used to set the
HTML title tag in the template. `template` is used to set the HTML template that
is used, it can either be set to "two-column" or "default" (which is the
default).

Frontmatter is optional.

## Developing

When making changes that are more substantial than a technical or grammar fix
you'll probably want to fix preview your changes locally. You'll need three
tools to generate the site, Node.js, Node Package Manager, and Gulp.

Use your platform's tools to install Node and NPM, on OSX this can be done with:

```
brew install npm
```

Then install gulp globally with

```
npm install -g gulp
```

To actually build the site, first install the dependencies with 

```
npm install
```

and finally build the site with 

```
gulp
```

You can also startup a local server to see your changes in the browser with

```
gulp serve
```
