This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

The databraid dashboard widgets are to be imported and used inside this repo. the styling and arrangement of the widgets should be done using:

https://github.com/STRML/react-grid-layout

and

https://react.semantic-ui.com/

See the following trello board for developer tasks:

https://trello.com/b/GlhG504F/dashboard-spa

# Using the widgets inside the dashboard-spa

## creating widgets as libraries:
- modify `src/index.js`  to export the root component, excluding the `provider`, as the default export. Also export the root reducer as a named export labeled `rootReducer`.  By `rootReducer` we mean what goes in `state.widgets[widgetID]`. See the Widget Reducer in Dashboard SPA section below. 

- Also `src/index.js` should export the `api` that it uses inside thunks, as `WIDGETNAME_API`. The code for the widget should also be updated to use this new named object, i.e. instead of using `api`, it should use `WIDGETNAME_API`.

- Root shouldn't be a React Element, but rather a React Component, the dashboard will be responisble for actually rendering it.

```
export { rootReducer, TRANSIT_API };
export default Root
```
- create folder `libs` in root directory of widget SPA.

- create folder `widget-libs` under the `libs` directory.

- Modify `.gitignore` in the root folder of your app to add (since we don't want these folders to be tracked by github):

```
/libs/widget-libs/lib
/libs/widget-libs/node_modules
```

- run `npm init` with all defaults.

- copy the following contents into `package.json`:

```
{
  "name": "@databraid/your-widget-name",
  "version": "1.0.2",
  "description": "",
  "main": "index.js",
  "files": [
    "lib"
  ],
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "NODE_ENV=development babel --presets react-app -D -d lib ../../src/"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel-cli": "^6.24.1"
  },
  "dependencies": {
    "react": "^15.6.1",
    "react-dom": "^15.6.1",
    "react-redux": "^5.0.5",
    "redux": "^3.7.2",
    "redux-thunk": "^2.2.0"
  }
}
```
- replace `name` with the the correct name for your SPA widget in the npm org.

- replace `version` with "1.0.0"

- the `dependencies` may need to be updated if your code has any other js libary dependencies. `css` dependencies will be handled on the receiving side.

- run `echo package-lock=false > .npmrc`

- run `npm install`

- run `npm run build` which will generate the `lib` directory.

- publish your npm package, run `npm publish`.

- in the future to publish changes to the lib, run `npm version`.

- In each of widget SPAs, you should replicate the state shape that is present in the dashboard SPA, in order to test it properly. This means a total refactor of your app in the way that it looks for state in the redux store.

## using a widget lib on the importing side (i.e. in the dashboard-spa).

* run `npm install --save  @databraid/your-widget-name`

* then you use ` import DefaultExport from  '@databraid/your-widget-name/lib';` to work with the widget default export, which should be the root component (excluding the `provider`) from your widget.

* use `import { rootReducer  }  from '@databraid/your-widget-name/lib` to work with the root reducer exported by your widget.


## Widget Reducer in Dashboard SPA. 

* in the dashboard SPA create the `widgets` reducer, which is to be root level reducer of the redux store. Inside this reducer, for each widget create a key value pair for its reducer, like:

```
{
  widgets: {
    ids: [widgetName],
    byId: {
      [widgetName]: rootReducerOfTheImportedWidget
    }
  }
}
```

* The `key` (in the above example `widgetName` should be passed to the root level component of each widget as the prop `widgetId`. Then each widget can look in `state.widgets.byId[widgetId]` for the state corresponding to its widget in the redux store. This will obviously require a refactor of the widget SPAs. 

* note that `widgetId` prop needs to be passed down the widget SPA component hierarchy. a component that wants to pass its own props to a child can do this like so:

```
  //inside the render function of a component
  
  <ChildComponent {...this.props} />
```

* This passings down of `widgetId` prop can be avoided if `widgetId` is placed inside the context of the root level component of the widget.
