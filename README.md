# story-squish.github.io

Landing page for [StorySquish](https://github.com/story-squish/storysquish),
served at <https://story-squish.github.io/>.

Static HTML, CSS and JS with no build step:

```sh
python3 -m http.server 8000   # preview at http://localhost:8000
```

The browser version of the app is published separately from the app repo's
`docs/` folder at <https://story-squish.github.io/storysquish/>.

## Deploy

1. Create the repository `story-squish/story-squish.github.io` and push this
   directory to it.
2. **Settings → Pages → Build and deployment**: source *Deploy from a branch*,
   branch `main`, folder `/ (root)`.

The latest release version and direct download links are fetched from the
GitHub API at page load; without it, the buttons fall back to the releases page.
