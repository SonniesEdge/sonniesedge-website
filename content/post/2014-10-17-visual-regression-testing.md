+++
title = "Visual Regression Testing"
date = "2014-10-17 11:00:16"
strapline = "Visual Regression Testing becomes more important the more complex a project becomes."
tags = ["web"]
categories = ["posts"]
+++

<h2>Why the hell do we need tests for CSS?</h2>

<p>Pulling down the latest code from your repo, you see that one of your team has added some new features. "Great!", you think, as you compile the code, switch to your browser and hit refresh.</p>

<p>But what.... <em>horror</em> is this? The site is <em>broken</em>. Elements look bloated, the navigation icons are wrapping around each other, the search box is making a break for the border and where the hell have your grids gone?</p>

<p>In a fury you dig into the code to seek the cause of this living hell and  discover this atrocity at the end of your compiled CSS file:</p>

```css
  div {
    padding: 5px;
  }
```

<p>It really doesn't matter how it was added. A poorly scoped partial in Sass, a junior developer seeking to quick fix a problem or those darned magic space pixies in the server. The effect is the same: the padding of every &lt;div> on the website is changed to 5px.</p>

<p>In Proper Software Land, this is called a <em>regression</em>, a bug introduced by something else changing on the system. In this case, that final rule was added, introducing the global padding problem - a <em>visual</em> regression.</p>

<p>Being an unscoped language, CSS is especially prone to these types of regressions. With everything effectively in the global context it takes an intimate knowledge of <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity">selector specificity</a> and code ordering to keep everything from falling over.</p>

<h2>Visual regression tools</h2>

<p>Catching these visual regressions has traditionally been achieved by eyeballing - everyone watches what their code does, and hopefully notices if it messes anything else up. This is fine for smaller sites, but once you start to scale above a certain point, it becomes unwieldy. There's simply no way that a few people can audit thousands of pages across a large site.</p>

<p>Pushing these duties to frontend leads and a QA team doesn't help either. In fact, you're just loading the team problem onto fewer people. Eyeballing is simply time-ineffective.</p>

<p>No, what you want to provide are methods for a team member to write code themselves and have confidence that their code doesn't introduce bugs. Other languages have these tools, so why doesn't CSS?</p>

<p>What we need is a way of <em>formally</em> testing for regressions. We need regression testing.</p>

<blockquote>
<p>The intent of regression testing is to ensure that changes have not introduced new faults. One of the main reasons for regression testing is to determine whether a change in one part of the software affects other parts of the software.</p>

<p>- <a href="http://en.wikipedia.org/wiki/Regression_testing">http://en.wikipedia.org/wiki/Regression_testing</a></p>
</blockquote>

<p>Back when I started down this road in January of this year, only a few references to CSS regression testing tools were out there. The big mama of the time was <a href="https://github.com/BBC-News/wraith">Wraith</a>, written by the BBC News team. There was some pioneering work done there, especially with regression testing of live sites (via comparisons of Git branches to live code). But time moves on, and the one that really caught my eye was <a href="https://github.com/Huddle/PhantomCSS">PhantomCSS</a>.</p>

<p>I'm going to talk about PhantomCSS a lot here, as it's my tool of choice. But remember, this is a rapidly moving field. Check out <a href="http://csste.st/">csste.st</a> for <em>lots</em> of information on other visual regression tools.</p>

<h2>A simple visual regression test with PhantomCSS</h2>

<p>Effectively an extension of the <a href="http://casperjs.org/">CasperJS</a> library, which is itself built upon the <a href="http://phantomjs.org/">PhantomJS</a> engine, PhantomCSS is a javascript library that allows fully automated regression testing of your stylesheets.</p>

<p>Given a unique CSS selector, PhantomCSS will use the headless Webkit browser provided by PhantomJS to take a screenshot of the selector target. This is referred to as the <em>Baseline</em> screenshot. Let's pinch an example from the PhantomCSS documentation and take a screenshot of the following code:</p>

```html
  <div class="machine" id="coffeemachine">
  <p>What would you like?</p>
  <button class="btn btn-large btn-primary" id="cappuccino-button" type="button">Cappuccino</button>
  <button class="btn btn-large btn-primary" id="espresso-button" type="button">Espresso</button>
  </div>
```

<p>Here's the resulting snapshot:</p>

<img src="/images/posts/visual-regression-testing/coffeemachine.png" alt="Screenshot of the previous code" />

<p>This in itself isn't too useful, except perhaps as a fancy-schmancy screenshot tool. No, the power comes from making a code change to the screenshotted element (screenshotted is <em>so</em> a word), running PhantomCSS again and letting PhantomCSS look for differences.</p>

<p>Say another member of the team were to make a change to the ".machine" class, not realising that "#coffeemachine" depended upon ".machine" for most of its styling:</p>

```css
  .machine {
    font-size: 110%;
  }
```

<p>If this team member were to run PhantomCSS again (as part of their testing) they would get a great big stonking error alert in their console and the following diff image would be generated:</p>

<p><img src="/images/posts/visual-regression-testing/coffeemachine_diff.png" alt="" /></p>

<p>The pink areas show the visual diff between the original baseline image and the post-change  screenshot. Pretty neat, huh? A simple automated test shows that a CSS change has caused a regression in the page output.</p>

<h2>Getting started with PhantomCSS</h2>

<p>So how do we use Visual Regression Testing in a real world workflow?</p>

<h3>Installation</h3>

<p>PhantomCSS depends on the PhantomJS engine, so you need to get that installed on your system. If you wish, you can download and install it <a href="http://phantomjs.org/download.html">manually</a>. But I'm lazy, and on my Mac I prefer to install things like this via <a href="http://brew.sh/">Homebrew</a>:</p>


```bash
  brew install casperjs
```

<p>Carrying on the laziness theme, I'd recommend adding CasperJS and PhantomCSS libraries to your project via a project manager like npm or Bower. They're there to take the load off you, and it'll be easier to update them in the future. But you can do it manually, if you're into the kinky stuff.</p>

<p><em>Grunt-phantomcss</em> is a lovely wrapper around PhantomCSS and lets us avoid the hassle of setting up links to PhantomCSS and CasperJS. I'm going to use it here, but it's not necessary. I like it because I've got the Grunt bug.</p>

```bash
npm install grunt-phantomcss --save-dev
```

<p>This will install CasperJS, PhantomCSS, grunt-phantomcss and all their dependencies as npm modules into our project directory and will update the <strong>package.json</strong> resource file appropriately.</p>

<p>To finish up the installation, let's edit <strong>Gruntfile.js</strong> to tell Grunt to load the grunt-phantomcss task:</p>

```javascript
grunt.loadNpmTasks('grunt-phantomcss');
```

<p>Yeah baby! Now we've got the engines and libraries installed we're ready to start using PhantomCSS!</p>

<!-- BTW, if you'd like to follow along at home you can [download]() some demo files that I prepared earlier. -->


<h3>Configure your test subject</h3>

<p>Firstly, we need something to test. This is a simple demo, so let's just use a single HTML page, with some inline CSS.</p>


```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Visual Regression Testing</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    #aardvark {
      width: 200px;
      height: 200px;
      background-color: #dcdcdc;
    }
    </style>
  </head>
  <body>
    <div id="aardvark"></div>
  </body>
</html>

```

<p>The page should render like this in Chrome:</p>

<p><img src="/images/posts/visual-regression-testing/browser_initial.png" alt="" /></p>

<h3>Writing your first test</h3>

<p>Create a file called <strong>desktop.js</strong> (although this can be called whatever you want, as long as you reference it correctly). Populate it with the following:</p>

```javascript
var targeturi = 'http://locahost:4000'
casper.start('targeturi');

casper.then(function(){
  var title = 'aardvark';
  var testsubject = '#aardvark';
  phantomcss.screenshot(testsubject, title);
});
```

<p>where:</p>

<ul>
<li><strong>targeturi</strong> is a URI. (e.g. 'http://localhost' or 'file://C:\myfile.html'). Sorry, but it can't be a system path or a relative URL - these ain't valid URIs.</li>
<li><strong>title</strong> is a basic string. It will be used to save your screenshot files to disk, so make sure it's something compatible with your filesystem. No need to specify a path for now.</li>
<li><strong>testsubject</strong> is a CSS selector. We'll go over formal naming conventions for this later.</li>
</ul>


<p>That's your test written! But as we're using Grunt to control this test, we need to hook it up. In your <strong>Gruntfile.js</strong>, add the following <a href="http://gruntjs.com/configuring-tasks">config options</a>:</p>

```javascript
phantomcss: {
  desktop: {
    options: {
      screenshots: 'tests/visual/source/',
      results: 'tests/visual/results/',
      viewportSize: [1024, 768]
    },
    src: ['caspertests.js']
  }
},
```

<p>What we've done here is tell Grunt to create a main PhantomCSS task, with a "desktop" subtask inside that, and to supply both with a bunch of config options. As normal with Grunt, we can extend this any number of subtasks, all of which you can access via <strong>"grunt taskname:subtaskname"</strong>. Very useful for testing different viewport sizes!</p>

<p>Config options for this are:</p>

<ul>
<li><strong>screenshots</strong> is a system path. Tells PhantomCSS where to save the baseline screenshots.</li>
<li><strong>results</strong>: is a system path. Tells PhantomCS where to save the screenshots of every subsequent test run.</li>
<li><strong>viewportSize</strong> is an array. Indicates the size of the viewport for testing, in pixels.</li>
<li><strong>src</strong>: is a path. Tells PhantomCSS where to grab the actual tests from.</li>
</ul>


<p>Once this is done we're ready to run our first PhantomCSS test.</p>

<h3>Bringing it all together</h3>

<p>Excited? Tell Grunt to kick off the PhantomCSS desktop task by running the following in the project directory:</p>

```bash
grunt phantomcss:desktop
```

<p>Boop.</p>

<p>Boop..</p>

<p>Beeeep...</p>

<p><img src="/images/posts/visual-regression-testing/cli_baseline.png" alt="" /></p>

<p>Woohoo! In the above, the <em>#aardvark</em> element has been screenshotted (still a word) and the file saved to disk as <strong>aardvark_0.png</strong>.</p>

<p>If we do as the command output suggests, and look inside the <strong>tests/source</strong> directory, we can see that <strong>aardvark_0.png</strong> is sitting in there, happy as can be.</p>

<p>Let's run the Grunt command again, to see what happens:</p>

<p><img src="/images/posts/visual-regression-testing/cli_pass.png" alt="" /></p>

<p>The test passed, because there are no differences between the baseline screenshot and the newly generated result file. In fact, if we look in <strong>tests/results</strong> now, we see an identical copy of <strong>aardvark_0.png</strong> sitting there.</p>

<p>If you were to run these tests over and over again, they'd just keep passing. So let's mix things up a bit and make a change to the styling of the test subject:</p>

```css
#aardvark {
  width: 300px;
}
```

<p>If we reload the test subject page in a browser, we can see that the div is now wider than before.</p>

<p><img src="/images/posts/visual-regression-testing/browser_postchange.png" alt="" /></p>

<p>Let's see if the automated testing picks up this relatively subtle difference. Once more unto Grunt, my friend, once more:</p>

<p><img src="/images/posts/visual-regression-testing/cli_fail.png" alt="" /></p>

<p>Hoopla, the test has failed! (not something you'll hear said too often). PhantomCSS was lovely, and notified us where and why it has failed. In fact, let's go have a look inside the <strong>tests/results</strong> folder again. There we can see the diff file that was generated by the failure:</p>

<p><img src="/images/posts/visual-regression-testing/aardvark_0.fail.png" alt="" /></p>

<p>As before, the pink is the diff between the baseline and the latest test run.</p>

<p>A completely automated test of a visual regression. Not bad!</p>

<h2>Advanced usage - integrating into a workflow</h2>

<p>So how do we make use this amazing testing skill that we've just acquired?</p>

<p>Well, if we were to try to get PhantomCSS to screenshot an entire webpage and test it later on, we wouldn't get very far. A live page, hell, even a development page, is far too volatile for visual testing. Content changes, third-party widgets and whizzy animated elements all cause constant change. Because of all this the second screenshot of a live page will be different from the first screenshot, and so PhantomCSS will signal a fail, even if there isn't anything that we'd think of as a regression.</p>

<h3>Building a component library</h3>

<blockquote><p>"Screenshot based regression testing can only work when UI is predictable."</p>

<p><em>- PhantomCSS documentation</em></p></blockquote>

<p>If we can't test entire pages of a site, then what <em>can</em> we test? To answer that we have to talk about Atomic Components.</p>

<p>Not to be confused with <a href="http://webcomponents.org/">Web Components</a>, <a href="http://bradfrostweb.com/blog/post/atomic-web-design/">Atomic Components Components</a> are small, single-purpose, reusable chunks of HTML and CSS that can be used over and over again to present a consistent UI element. No matter where it's placed in a page, the component will look and work the same. Importantly, it's self-contained - its CSS effects only itself, and it exists independently of everything else.</p>

<p>It's gathering examples of these atomic components into a single area that enables us to use Visual Regression Testing effectively. Each component can be fleshed out with fixed content, thereby giving us a static baseline to work against. We can take a screenshot of each component and, because we control it, be sure that it will remain as it is.</p>

<h3>Style Guide vs Component Library</h3>

<p>We should perhaps differentiate between what I'm calling a component library, and the common term, Style Guide (a wonderful example of which is the one for <a href="http://govuk-elements.herokuapp.com/">GOV.UK</a>). While there's a good deal of overlap between a component library and a style guide, I consider them to be separate entities.</p>

<p>Some big differentiating factors are:</p>

<h4>A component library</h4>

<ul>
<li>Shows <em>how</em> to build a component.</li>
<li>Is primarily a <strong>technical</strong> resource.</li>
<li>Can be considered as an internal resource, as it's for the benefit of developers building a site.</li>
<li>Is part of the site documentation.</li>
<li>Shows all the variations of each component</li>
<li>And, of course, is there for testing</li>
</ul>


<h4>A style guide</h4>

<ul>
<li>Shows <em>when</em> to use a component.</li>
<li>Is a <strong>non-technical</strong> resource.</li>
<li>Is not only for developers, but also aimed at, and hopefully built by, UX experts, designers and marketing personnel, all working together.</li>
<li>Is built from components, and this depends upon the component library.</li>
<li>Shows how components are used in context.</li>
</ul>


<h3>Using a component library for testing</h3>

<p>I've found that building component libraries with a static site generator like <a href="http://jekyllrb.com/">Jekyll</a> is by far the easiest way of doing things. But whatever you use, however you build it, just make sure that the outputted code is <em>stable</em>. It shouldn't change unless <em>you</em> change it.</p>

<p>To get going, start bringing together definitive examples of all of your components onto one page.</p>

<p>Examples of each component should be isolated, and wrapped in their own unique selector. I use the following format:</p>

```html
 <div id="testsubject-COMPONENTNAMEHERE" class="testsubject">
   ... component lives here ...
 </div>
```

<p>Whatever you end up using, keep it consistent and obvious. You should be able to guess what a component name will be when you come to reference it later.</p>

<h4>Git versioning</h4>

<p>To make the these tests truly effective for all members of your team, you will need add the component examples, the tests you've written and the baseline screenshots to your repo.</p>

<p>Try <strong>not</strong> to store your results and diff images in the repo. Whatever directory you keep those in, make sure that add it to your .gitignore file. They get created and destroy during your tests, so adding them to the repo will only create confusion.</p>

<p>To update a test or a component, you will need to delete the associated baseline file and rerun PhantomCSS. When PhantomCSS sees that there is no baseline file, it will treat this as a first run, and generate a brand spanking new one. Once that new baseline is generated, it can be added to the repo.</p>

<h4>Extending the library</h4>

<p>We could get clever and in our test script start looping over every incidence of ".testsubject". There's a snag waiting for us if we do that. Remember the "_0" that got appended to the end of the baseline file in our previous demo? It's incremented every time a new test is added. PhantomCSS names files in this way so that a unique filename is generated every time. Two tests, both with the same title, won't overwrite each other.</p>

<p>Say we have the following tests:</p>

```javascript

casper.then(function(){
  var title = 'aardvark';
  var testsubject = '#testsubject-aardvark';
  phantomcss.screenshot(testsubject, title);
});

casper.then(function(){
  var title = 'bison';
  var testsubject = '#testsubject-bison';
  phantomcss.screenshot(testsubject, title);
});

casper.then(function(){
  var title = 'capybara';
  var testsubject = '#testsubject-bison';
  phantomcss.screenshot(testsubject, title);
});

casper.then(function(){
  var title = 'donkey';
  var testsubject = '#testsubject-donkey';
  phantomcss.screenshot(testsubject, title);
});
```

<p>These would generate the following baseline files:</p>

<ul>
<li>aardvark_0.png</li>
<li>bison_1.png</li>
<li>capybara_2.png</li>
<li>donkey_3.png</li>
</ul>


<p>But if we now try altering the order of our tests, swapping Aardvark to the end:</p>

```javascript
casper.then(function(){
  var title = 'bison';
  var testsubject = '#testsubject-bison';
  phantomcss.screenshot(testsubject, title);
});

casper.then(function(){
  var title = 'capybara';
  var testsubject = '#testsubject-bison';
  phantomcss.screenshot(testsubject, title);
});

casper.then(function(){
  var title = 'donkey';
  var testsubject = '#testsubject-donkey';
  phantomcss.screenshot(testsubject, title);
});

casper.then(function(){
  var title = 'aardvark';
  var testsubject = '#testsubject-aardvark';
  phantomcss.screenshot(testsubject, title);
});

```

<p>then we get the following outputted:</p>

<ul>
<li>bison_0.png</li>
<li>capybara_1.png</li>
<li>donkey_2.png</li>
<li>aardvark_3.png</li>
</ul>


<p>This effectively produces new baseline files for not only Aardvark, but every other test in the series. Yuck. Having the baseline files regenerated isn't a total disaster, but it produces a lot of noise for your process and is going to clutter up your Git commits. For the sake of consistency best practise should be for new tests to only be added at the end of the PhantomCSS file, and to avoid reordering tests, unless you <em>really</em> have to.</p>

<h2>Limitations of Visual Regression Testing</h2>

<p>This isn't a panacea for all your testing problems. I think that it only becomes useful at scale, and still used alongside functional tests fro your interfaces, and unit tests for your frontend application code.</p>

<p>Critically, PhantomCSS only runs on Webkit, so this won't check for browser variations. In fact, someone could cause a Firefox-only regression and this technique wouldn't pick it up. As a workaround, perhaps this could be combined with a third-party testing service, such as <a href="http://www.browserstack.com/">Browserstack</a>, so that it could collect component screenshots from across a variety of devices, and we could use those for baselines and testing. If anyone knows how to grab component-level screenshots from such a service, and not just page-level ones, <a href="https://twitter.com/sonniesedge">let me know on Twitter</a>.</p>

<h2>The future</h2>

<p>So far I've only used this for local developer testing in a team. Developers write their code in a feature branch and, before they merge it in to the central tree, they run the PhantomCSS tests on it. It's a confidence raising tool.</p>

<p>The real aim is to get this hooked into a continuous integration cycle, so that code is not accepted if it causes a regression in visuals.</p>

<p>Perhaps a more formal system could be developed around these techniques. Component Driven Development could be a possibility. Components are designed initially in a graphics program, with input from all teams. These graphics are used as baseline screenshots which Frontend coders could then write code against until it matches the screenshots and the related tests pass.</p>

<p>Personally, I wouldn't be a fan of this approach. I'm sold on designing rapidly in the browser. But it might work for more formal team workflows.</p>

<p>However it develops, I suspect that CSS testing is about to become big.</p>

<p><strong>[UPDATE:]</strong> Just as I was about to publish this, I heard about <a href="http://webuild.envato.com/blog/styleguide-driven-development/">Styleguide Driven Development</a>. I think there's a large overlap between these methodologies, and it would be great to start using the techniques outlined there to start reliably automating the production of static components.</p>

<h2>References</h2>

<h3>Articles</h3>

<ul>
<li><a href="https://www.lullabot.com/blog/article/css-regression-testing-resemblejs/">https://www.lullabot.com/blog/article/css-regression-testing-resemblejs/</a></li>
<li><a href="http://www.smashingmagazine.com/2013/06/11/front-end-ops/">http://www.smashingmagazine.com/2013/06/11/front-end-ops/</a></li>
<li><a href="http://www.smashingmagazine.com/2012/10/23/road-reusable-html-components/">http://www.smashingmagazine.com/2012/10/23/road-reusable-html-components/</a></li>
<li><a href="http://govuk-elements.herokuapp.com/">http://govuk-elements.herokuapp.com/</a></li>
<li><a href="http://webuild.envato.com/blog/styleguide-driven-development/">http://webuild.envato.com/blog/styleguide-driven-development/</a></li>
</ul>


<h3>Tools</h3>

<ul>
<li><a href="http://huddle.github.io/Resemble.js">http://huddle.github.io/Resemble.js</a></li>
<li><a href="http://phantomjs.org">http://phantomjs.org</a></li>
<li><a href="http://casperjs.org">http://casperjs.org</a></li>
<li><a href="https://github.com/Huddle/PhantomCSS">https://github.com/Huddle/PhantomCSS</a></li>
<li><a href="https://github.com/chrisgladd/grunt-phantomcss">https://github.com/chrisgladd/grunt-phantomcss</a></li>
<li><a href="http://jekyllrb.com">http://jekyllrb.com</a></li>
<li><a href="http://csste.st">http://csste.st</a></li>
</ul>
