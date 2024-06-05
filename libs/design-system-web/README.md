# design-system-web


## Install

### In target repo
Add apptractive scope to yarnrc.yml
Add peer resolutions to package it's being installed in ( to prevent No candidates found error, need to resolve this)
App.tsx




This library was generated with [Nx](https://nx.dev).

## Storybook 

`npx nx storybook design-system-web`

## Running unit tests

Run `nx test design-system-web` to execute the unit tests via [Vitest](https://vitest.dev/).

## generate component

primatives example
nx g c --project=design-system-web --pascalCaseFiles=true --pascalCaseDirectory=true --directory=lib/components/primatives xxxx
nx g c --project=design-system-web --pascalCaseFiles=true --pascalCaseDirectory=true --directory=lib/components/primatives box

composites component example
nx g c --project=design-system-web --pascalCaseFiles=true --pascalCaseDirectory=true --directory=lib/components/composites xxxx
nx g c --project=design-system-web --pascalCaseFiles=true --pascalCaseDirectory=true --directory=lib/components/composites PersistentDrawer



## TODO

Remove icon component and dependencies on it. Pass as a prop to components from application
