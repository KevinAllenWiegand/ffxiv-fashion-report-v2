# Summary

This project is version 2 of the FFXIV Fashion Report Tools: https://github.com/KevinAllenWiegand/ffxiv-fashion-report

This site is currently self-hosted at https://kevinallenwiegand.ddns.net/ffxivfashionreportv2; however, this may change in the future.

# Why a version 2?

The original version had some issues that needed addressing, and I didn't care to try to address them there.

* The old site was written in an archaic format. Yes, it worked, but maintenance was annoying. This brings the site up to a modern approach that makes it more maintainable, and easier to follow.
* The old site required embedding the master.json file, which meant re-building the site every time I wanted to just update the site for the current week. This new modernized version downloads the JSON file instead of embedding it, making maintenance so much nicer.
* The old version had some internal code that made things case-sensitive. I didn't feel  like trying to address that in the old version because it would have just been a chore. Cue in the new modern version, and I've removed this dumb, self-inflicted limitation.

## How to run this locally

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/ffxivfashionreportv2`. The application will automatically reload if you change any of the source files.

Note that the old version you could simply just open the index.html file and run the site locally. Switching to this new modern format, and you now have to `ng serve` if you want to run locally. Take it as a trade off for better code.

## How to generate the static files needed to host this as a site

Run `ng build` to build the project. The build artifacts will be stored in the `dist/ffxiv-fashion-report-v2` directory.

Please note that, until I figure out how to address this, hosting this site will require you to host it under a `ffxivfashionreportv2` virtual directory. Failure to do so will cause the site to not work because it won't be able to match the routes properly.

## Running unit tests

Normally you would run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io); however, I have not written/updated any tests beyond the default test files that `ng generate` make.

So just don't run them.