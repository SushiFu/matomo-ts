# matomo-ts

A client wrapper for the Matomo JS library. Written in TypeScript, and compiled with `tsc` and `webpack`.

### Features

### Installation

```sh
yarn add matomo-ts
```

### Usage with TypeScript

```TypeScript
import Matomo from 'matomo-ts';

Matomo.default().init('https://your-matomo-tracker-endpoint', YOUR_SITE_ID, {/*** your optional args ***/});

Matomo.default().push(['any', 'matomo', 'raw', 'commands']);

Matomo.default().trackPageView('my-page-name');

// Call this after every DOM updates, if you want outlinks tracking.
Matomo.default().trackLinks();

Matomo.default().trackEvent('my-category', 'my-action', { name: 'optiona-name', value: 42 });

Matomo.default().setUserId('Anonymized userId');
Matomo.default().resetUserId();

Matomo.default().trackEcommerceOrder('my-orderId', 424242 /*** grandTotal ***/);
```

##### A/B testing

```TypeScript
import Matomo, { ABTest, Variation, IEvent } from 'matomo-ts';

Matomo.default().init('https://your-matomo-tracker-endpoint', YOUR_SITE_ID, {/*** your optional args ***/});

const original = new Variation('my-original');
original.setPercentage(50);
original.setActivate((event: IEvent) => {/*** do something ***/});

const variation = new Variation('my-variation');
variation.setPercentage(50);
variation.setActivate((event: IEvent) => {/*** do something ***/});

const abTest = new ABTest('my-ab-test');

abTest.setPercentage(100);
abTest.setStartTime('2017/08/25 00:00:00 UTC');
abTest.setEndTime('2020/05/21 23:59:59 UTC');

abTest.addIncludedTarget({
    attribute: 'url',
    inverted: '0',
    type: 'equals_simple',
    value: 'https://my-website-url',
});

abTest.addExludedTarget({ /*** other matomo rules ***/ });

abTest.setTrigger(() => true);

abTest.addVariation(original);
abTest.addVariation(variation);
Matomo.default().trackABTest(abTest);
```

### Development

[TSLint](https://palantir.github.io/tslint/) is used as a linter, you can run `yarn lint` to run it.

##### Build

Just run `yarn build`, it will clean and generate:

-   ES5: `/lib`
-   ES6: `/lib-esm`
-   Bundle: `/_bundles` (with minified version for the browser)
