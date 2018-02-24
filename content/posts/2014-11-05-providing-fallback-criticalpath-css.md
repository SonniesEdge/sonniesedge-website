---
categories:
- webtech
date: 2014-11-05 11:00:16
slug: providing-fallback-criticalpath-css
strapline: tl;dr make sure you do it.
tags:
- web
title: Providing a fallback for critical-path CSS
---

The method I recently talked about using, for <a href="/2014-10-27/critical-css.html">loading non-critical CSS asynchronously</a> via javascript, has one blindingly obvious fatal flaw: it fails when javascript is disabled.

<img src="/images/posts/providing-a-fallback-for-criticalpath-css/shutup.gif" alt="Shut up.">

This is why you test things, kids.

But there's a simple way around it: provide a regular link to your CSS, but wrap it in a &lt;noscript&gt; tag.

So, in addition to the existing LoadCSS chunk:

```javascript
<script>
// Async CSS loader
  function loadCSS( href, before, media ){
    "use strict";
    var ss = window.document.createElement( "link" );
    var ref = before || window.document.getElementsByTagName( "script" )[ 0 ];
    ss.rel = "stylesheet";
    ss.href = href;
    ss.media = "only x";
    ref.parentNode.insertBefore( ss, ref );
    setTimeout( function(){
      ss.media = media || "all";
    } );
    return ss;
  }
  loadCSS( "/theme/dist/stylesheets/main.css" );
</script>
```

we just have to add:

```html
<noscript>
  <link rel="stylesheet" href="/theme/dist/stylesheets/main.css">
</noscript>
```

Now the criticalpath CSS is no longer reliant on javascript executing. Just as it should be.
