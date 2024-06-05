# WebTemplate

## REACT APP
From the project root run `yarn nx serve react-app`. Open your browser and navigate to http://localhost:4200/. (or the port that it's run on)

#### pspdfkit - https://pspdfkit.com/getting-started/web/?frontend=react&download=npm&integration=module&project=existing-project
cp -R cp -R ./node_modules/pspdfkit/dist/pspdfkit-lib apps/react-app/public/pspdfkit-lib


## Backend development

### Getting started
aws configure sso

```
sso_start_url = https://admiin.awsapps.com/start#
sso_region = us-east-1
sso_account_id = 035308050347
sso_role_name = AdministratorAccess
region = us-east-1
output = json
```

aws sso login --profile admiin


### NX cli usage in project 

See below how to create apps, libs, components, etc. Remove --dryRun flag to create files

How workspace was created
```
npx create-nx-workspace@latest web-template --preset=react-monorepo --appName=react-app --packageManager=yarn --bundler=vite --pascalCaseFiles=true --unitTestRunner=vitest --style=@emotion/styled --dryRun
```
Create an application
```
npx nx g @nx/react:application backoffice-app --bundler=vite  --style=@emotion/styled --pascalCaseFiles=true --dryRun
```

Create a react library
```
npx nx g @nx/react:library --bundler=vite --importPath=@admiin-com/ds-amplify-web --pascalCaseFiles=true --publishable=true --name=amplify-web  --style=@emotion/styled --dryRun
```

Create a library
```
npx nx g @nx/js:lib -bundler=vite --importPath=@admiin-com/ds-graphql --pascalCaseFiles=true --publishable=true --name=graphql --bundler=vite --unitTestRunner=vitest --dryRun
```

Create a component
```
npx nx g @nx/react:component --project=react-app --pascalCaseFiles=true --pascalCaseDirectory=true --export=false --directory=app/components componentName --dryRun
npx nx g @nx/react:component --project=react-app --pascalCaseFiles=true --pascalCaseDirectory=true --export=false --directory=app/pages XeroRedirect --dryRun
npx nx g @nx/react:component --project=design-system-web --pascalCaseFiles=true --pascalCaseDirectory=true --export=false --directory=lib/components/composites CollapsibleButton --dryRun
yarn nx g c --project=design-system-web --pascalCaseFiles=true --pascalCaseDirectory=true --directory=lib/components/transitions --export=false Collapse --dryRun
```
design-system-web
```

Test a specific file
```
yarn nx test design-system-web --testFile=lib/components/composites/CollapsibleButton.spec.tsx
yarn nx test backend --testFile=apps/backend/src/test/appsync/resolvers/createNotification.test.ts
yarn nx test react-app --testFile=apps/react-app/src/app/components/PdfSignature/PdfSignature.spec.tsx
yarn nx test react-app --testFile=apps/react-app/src/app/components/PdfViewer/PdfViewer.spec.tsx
```

## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators).

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

## Ready to deploy?

Just run `nx build demoapp` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.

## Basic tech debt notes

### eslintrc-custom-overrides.json
- imported as override for each eslint.
- resolveJsonModule is set for importing output.json which are values from cdk backend of aws resources
      
## Troubleshooting

### Xero SSO
- <ScrictMode> renders the app twice which prevents the Xero SSO from working. Comment <ScrictMode> out to work

### Backend
Error messages

_You can mark the path "@aws-crypto/util" as external to exclude it from the bundle, which will remove this error. You can also surround this "require" call with a try/catch block to handle this failure at run-time instead of bundle-time._
- Add as "external" to esbuild / buildSync commands
- OR check and delete yarn files from changing yarn version in root of laptop (global installation)

#### Frankeione types
yarn swagger-typescript-api -p https://apidocs.frankiefinancial.com/openapi/5f7ab68ad5793c0040d53186 -o /Users/dylanwestbury/Development/monorepos/adm-web/apps/backend/src/layers/dependencyLayer/opt/frankieone/ -n frankieone.types.ts

