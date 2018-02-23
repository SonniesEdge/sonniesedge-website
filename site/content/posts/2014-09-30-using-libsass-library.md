---
categories:
- webtech
date: 2014-09-30 11:00:16
slug: using-libsass-library
strapline: Sass is an essential part of any modern workflow, but the default compiler
  is let down by slow compilation times.
tags:
- sass
title: Using libsass
---

## Why use libsass?
The standard version of Sass is written in Ruby by [Hampton Catlin](http://www.hamptoncatlin.com/), [Natalie Weizenbaum](http://nex-3.com/) and [Chris Eppstein](http://chriseppstein.github.io/). It's fantastic - constantly adding new features whilst maintaining stability for existing ones.

However, it's a Ruby application. Which means that it can be slow. Very, very slow.

You might not notice it if you're just playing with Sass, but you'll certainly notice it on larger jobs, pulling in multiple Sass files and partials. On a recent project, Sass files were taking around 8 seconds to compile. If you're using a typical frontend workflow, Sass will be compiling every time you save the file. We were actually hitting scenarios where a developer would write some new code and hit save before the previous chunk of code had even finished being generated.

With libsass the compile time problem just goes away. Compile times on that enormous project went from 8 seconds to 800ms. Yowzer.

On this site, the one you're reading right now, the Sass builds so quickly that I can't measure it.

## Installation & Workflow

I'm using [Homebrew](http://brew.sh/) on OSX for this:

Install the core libsass library from Homebrew. Unfortunately, the version of libsass provided by Homebrew is v1.0.1 - workable, but very, very old. If you want to use that version just:

```bash
$ brew install libsass
```

However, if you want to use the latest, greatest, cutting-edge code, then use the following to install the [HEAD versions of the SassC and libsass libraries](https://github.com/benschwarz/homebrew-sassc):

```bash
$ brew tap benschwarz/homebrew-sassc
$ brew install benschwarz/sassc/sassc --HEAD
```

Now, libsass by itself isn't very useful. What's needed is an implementation that you can make use of. For that I'm using [node-sass](https://github.com/sass/node-sass), an npm library that allows node.js to interface with the libsass library.

```bash
$ npm install --save-dev node-sass
```

Again, if you're not writing node.js applications yourself, this isn't much use. What you need to is install grunt-sass.

```bash
$ npm install --save-dev node-sass
```

This allows you to call libsass from Grunt directly. I use the following for this site:

```javascript
// SASS
// Compile Sass files (in .scss format) into CSS files
sass: {
  develop: {
    options: {
      sourceMap: true
    },
    files: {
      '<%= globalConfig.dev %>/theme/css/main.css': '<%= globalConfig.dev %>/theme/stylesheets/main.scss'
    }
  },
  production: {
    files: {
      '<%= globalConfig.prod %>/theme/css/main.css': '<%= globalConfig.prod %>/theme/stylesheets/main.scss'
    }
  }
}

```



## Downsides

Libsass is kinda behind the Ruby version in feature implementation. While Sass 3.4 (Selective Steve) is out and being used, with the devs adding new features ready for 4.0, libsass 2.0 is still catching up with some of Sass's 3.3 features.

There are some documented problems with Sass @extends and Sass list maps, both of which have been [documented](http://benfrain.com/libsass-lightning-fast-sass-compiler-ready-prime-time/) superbly by [Ben Frain](http://benfrain.com/).

Good news is on the horizon though, as it was announced at NY's SassConf that libsass 3.0 is going to have these features [baked in](https://github.com/sass/libsass/releases/tag/3.0rc2). 3.0 is in RC right now, so the stable version should be out very soon. If you used the cutting edge code from above, you could even be using it right now. We'll just all have to wait for the official libsass build to use 3.0.
