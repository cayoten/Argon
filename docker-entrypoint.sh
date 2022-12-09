#!/bin/sh
npm install
# npm rebuild
# ^ Install dependencies.
# Add anything else you need to do when you restart the container.


exec node index.js

# ^ Continue with execution of docker image
