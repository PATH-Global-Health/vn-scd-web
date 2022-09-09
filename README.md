# Facility-Web

## Technologies used:

- [React](http://reactjs.org/)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux](https://redux.js.org/), [Redux Thunk](https://github.com/reduxjs/redux-thunk)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Semantic UI](https://react.semantic-ui.com/)

## Folder Structures:

```
|---📂 src
    |
    |---📂 @app -> Shared modules here
    |
    |---📂 admin -> Admin module
    |
    |---📂 csyt -> All of other modules for hospital listed above
    |   |
    |   |---📂 catalog -> Catalog module
    |   |   |
    |   |   |---📂 doctor -> Doctor Page
    |   |   |   |
    |   |   |   |---📂 components -> Components for module
    |   |   |   |
    |   |   |   |---📄 doctor.model.ts -> Model for Catalog/Doctor module
    |   |   |   |
    |   |   |   |---📄 doctor.service.ts -> Service
    |   |   |   |
    |   |   |   |---📄 doctor.slice.ts -> Redux slice
    |   |   |   |
    |   |   |   |---📄 index.ts -> Doctor page
    |   |   |
    |   |   |---📂 service
    |   |   |
    |   |   |---📂 other sub modules...
    |   |
    |   |---📂 working-schedule
    |   |
    |   |---📂 other modules...
    |   |
    |---📂 smd -> All of other modules for subcontract monitoring dashboard
    |   |
    |   |---📂 components -> SMD Components
    |   |   |
    |   |   |---📂 cbo-table -> CBO Table
    |   |   |   |
    |   |   |   |---📄 cbo-table.tsx -> Components for module
    |   |   |   |
    |   |   |   |---📄 index.ts -> Index file
    |   |   |
    |   |   |---📂 contract-table -> Contract Table
    |   |   |
    |   |   |---📂 dashboard -> Dashboard
    |   |   |
    |   |   |---📂 efficiency-table -> Efficiency Table
    |   |   |
    |   |   |---📂 implement-package-table -> Implement Package Table
    |   |   |
    |   |   |---📂 kpi-table -> KPI Table
    |   |   |
    |   |   |---📂 package-table -> Package Table
    |   |   |
    |   |   |---📂 personal-data-table -> Personal Data Table
    |   |   |
    |   |   |---📂 project-table -> Project Table
    |   |   |
    |   |   |---📂 report-table -> Report Table
    |   |   |
    |   |   |---📂 target-table -> Target Table
    |   |
    |   |---📂 models -> Includes all models used in SMD Module
    |   |   |
    |   |   |---📄 cbo.ts -> CBO model
    |   |   |
    |   |   |---📄 contract.ts -> Contract model
    |   |   |
    |   |   |---📄 implement-package.ts -> Implement Package model
    |   |   |
    |   |   |---📄 index.ts -> Index file
    |   |   |
    |   |   |---📄 indicator.ts -> Indicator model
    |   |   |
    |   |   |---📄 kpi.ts -> Kpi model
    |   |   |
    |   |   |---📄 patient-info.ts -> Patient Info model
    |   |   |
    |   |   |---📄 project.ts -> Project model
    |   |   |
    |   |   |---📄 report.ts -> Report model
    |   |   |
    |   |   |---📄 shared.ts -> Shared model
    |   |   |
    |   |   |---📄 smd-package.ts -> Package model
    |   |   |
    |   |   |---📄 target.ts -> Target model
    |   |
    |   |---📂 pages -> All SMD's pages
    |   |   |
    |   |   📂---cbo -> CBO Page
    |   |   |   |
    |   |   |   |---📄 cbo.tsx -> CBO Page
    |   |   |   |
    |   |   |   |---📄 index.ts -> Index file
    |   |   |
    |   |   📂---dashboard -> Dashboard Page
    |   |   |
    |   |   📂---indicator -> Indicator Page
    |   |   |
    |   |   📂---kpi -> KPI Page
    |   |   |
    |   |   📂---personal-data -> Personal Data Page
    |   |   |
    |   |   📂---project -> Project Page
    |   |   |
    |   |   📂---report -> Report Page
    |   |   |
    |   |   📂---smd-package -> Package Page
    |   |   
    |   |---📂 redux -> Component's Redux
    |   |   |
    |   |   |---📄 cbo.ts -> Cbo redux
    |   |   |
    |   |   |---📄 contract.ts -> Contract redux
    |   |   |
    |   |   |---📄 implement-package.ts -> Implement Package redux
    |   |   |
    |   |   |---📄 index.ts -> Index file
    |   |   |
    |   |   |---📄 indicator.ts -> Indicator redux
    |   |   |
    |   |   |---📄 kpi.ts -> Kpi redux
    |   |   |
    |   |   |---📄 patient-info.ts -> Patient Info redux
    |   |   |
    |   |   |---📄 project.ts -> Project redux
    |   |   |
    |   |   |---📄 report.ts -> Report redux
    |   |   |
    |   |   |---📄 shared.ts -> Shared redux
    |   |   |
    |   |   |---📄 smd-package.ts -> Package redux
    |   |   |
    |   |   |---📄 target.ts -> Target redux
    |   |
    |   |---📂 utils -> All SMD's Utils
    |   |   |
    |   |   |---📄 helper.ts -> SMD's helper

```

- Every modules/sub-module should have:
  - An index page file (`index.ts`)
  - A redux slice file (`[module-name].slice.ts`)
  - A service file (`[module-name].service.ts`)
  - A model file (`[module-name].model.ts`)
  - A components folder

## Convention:

- Folders and Files naming convention: kebab-case
- TypeScript: ESLint with Airbnb' rules _(Please **DO NOT** disable ESLint extension)_
- Git: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

## Others:

- All API links should be declare inside `apiLinks` from `src/@app/utils/api-links.ts`
- Only use `useSelector` and `useDispatch` from `'@app/hooks'` for TypeScript supports
- Don't touch folder `src/semantic-ui` (this folder is for UI customization)
- Declare all pages in `componentTree` from `'@app/utils/component-tree.tsx'`
- Every page has its own `GroupKey` and `ComponentKey` declared in enums for app tab interaction and app tab refresh
- Use `useAuth.hasPermission` from `'@app/hooks/use-auth'` for authorization in UI
- `componentTree` also use the `hasPermission` to display corresponding menu for each permission list
- Permissions should be declare in the state of `auth` slice from `'src/@app/slices/auth.ts'`
