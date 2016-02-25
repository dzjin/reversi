# Reversi

[![Build Status](https://travis-ci.org/loonkwil/reversi.png)](https://travis-ci.org/loonkwil/reversi)

Online strategy board game for two players.

# Contribute

## Gulp tasks

List all gulp task: `gulp --tasks`

### Dev server

`gulp webpack-dev-server` or just `gulp`.

### Test

Run the linting (jscs, jshint, jsonlint, csslint, htmllint) scripts:
`gulp lint`, `gulp test` or `npm test`

### Release

Bumping the version number and creating a release commit, use the
`gulp bump [--version <version>|-v <version>]` task.

Version could be: major (1.0.0), minor (0.1.0), patch (0.0.2) (this one is the
default), or a specific version number like: 1.2.3 or 1.0.0-alpha

More about the Semantic Versioning: [http://semver.org](http://semver.org)

## pre-push

`.git/hooks/pre-push`:
```bash
#!/bin/bash

# Check if we actually have commits to push
commits=`git log @{u}..`;
if [ -z "$commits" ]; then
    exit 0;
fi

npm test;
result=$?;

if [ ${result} -ne 0 ]; then
    echo "FAILD!";
    exit 1;
fi
exit 0;
```
