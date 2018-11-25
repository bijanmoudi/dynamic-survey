
# Dynamic Survey

This repository is, in fact, an answer to the question initially raised by [LIQID Asset Management GmbH].

You can find a demo here:
https://bijanmoudi.github.io/dynamic-survey/dist/



## Extra Features

  - Survey questions are being loaded from remote address
  - Connections are being mocked so as to make the application able of being run without the need to any server
  - Multiple surveys can be loaded in a same page
  - React is used as a library to provide the application with the ability to be embedded in another framework
  - Prevent URL cheat


## Todos

  - Update readme file
  - Add comments
  - Changing folder structure and automation configuration to have absolute separate component for surveys
  - Extend browser compatibility by installing more polyfills or changing preprocessors' configuration
  - Use Webpack instead of Gulp and split separable bundles
  - Support remote validation for inputs
  - Make steps dynamic based on the answer of their previous step
  - Add support for i18n
  - Make tests more specific and more precise
  - Take care about zero IDs which can probably cause problems
  - Make PropType checking better
  - Filter questions with faulty data

[LIQID Asset Management GmbH]: <https://www.liqid.de/>
