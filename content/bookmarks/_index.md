---
collection: mainnav
title: Bookmarks
layout: bookmarks.njk
weight: 40
---

A collection of interesting things related to WWW development that I've found. 

## How does this work?

All these bookmarks are pulled directly from my [Pinboard](https://pinboard.in/) account into my Metalsmith-powered [static site](https://github.com/sonniesedge/sonniesedge-website) at build-time. Using [IFTT](https://ifttt.com), every time I add a new Pinboard link a webhook is triggered which causes [Netlify](https://www.netlify.com/) (my host) to rebuild the site, pulling in the new link. 

The original bookmarks can be found at https://pinboard.in/u:sonniesedge/t:web/.