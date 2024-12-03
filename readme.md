# Google Authentication for React

Based on this repo https://github.com/MomenSherif/react-oauth
.. But I didn't quite like it and build my own

## Features

- Standalone authentication service
- Google authentication react, redux, redux-saga wrapper component
- Redux saga implementation
- Simplified types

## How to?

Use this as a submodule or clone it to your directory. I didn't build this one as a library (no idea why though)

```
// As submodule
git submodule add https://github.com/Blackxes/react-google-auth.git

// ..or clone
git clone https://github.com/Blackxes/react-google-auth.git
```

And do a little `<package-manager> <install-command>` magic

## Usage with react, redux and redux-saga

Configure the authentication provider with your client id
The provider allows only **one** child!

```jsx
<GoogleAuthProvider
    clientId={"<YOUR_CLIENT_ID>"}
    scope={"<YOUR_SCOPE>"}
    >
    <MyChildComponent>
</GoogleAuthProvider>
```

In your child component you can do something like this..

```jsx
interface MyChildComponentProps { ... }

const MyChildComponent: FunctionComponent<MyChildComponentProps> = () => {
  const dispatch = useDispatch();
  const onStartAuth = () => dispatch(StartAuthAction());
  const auth = useAppSelector((state) => state.auth);

  return (
    <div>
        <pre>{JSON.stringify(auth, undefined, 2)}</pre>
        <button onClick={onStartAuth}></button>
    </div>
  );
};

export default GoogleAuthServiceTester;
```

## Usage with stand alone service

```js
import GoogleSignInService from "..."

// OneTab variant
const oneTabResponse = await GoogleSignInService.oneTab(...)

// Implicit variant
const implicitGranResponse = await GoogleSignInService.implicitGrant({
    // This is mostly the email, but can as well be a name or else
    login_hint: "<LOGIN_HINT>",
    prompt: ""
})

// Consentual variant
const implicitGranResponse = await GoogleSignInService.implicitGrant({
    prompt: "consent",
})
```

## Service functions return promises

Each of those variants resolves into associative response rejects with error.
You can await them or use the goo'ol' 12th century way and use `.then` and `.catch`

```js
GoogleSignInService.oneTab(...)
    .then(response => console.log(response))
    .catch(error => console.log(error))
```

## Types

I created some type guards you can use to simplify code and make it more readable <br/>
@see [src/services/guards.ts](src/services/guards.ts)

Additional types and simplifications of the ridiculous namespaces google provided are here <br/>
@see [src/services/types.ts](src/services/types.ts)

## Advanced

If you want to trigger everything by hand, because you really love the details then don't forget to inject the google client script up front

```js
// Inside the html
<html>
  <head>
    <script src="https://accounts.google.com/gsi/client" async></script>
  </head>
</html>
```

Or use the injector hook

```jsx
const isInjected = useLoadGoogleSignInLibrary({
  onSuccess: () => console.log("Nice!"),
  onError: (error) => console.log(error),
});
```

## Sidenote for none-react-redux-redux-saga-users

You are free to not use redux or redux-saga to benefit from this authentication service class. A little bit of code extraction and you should be fine or simply use the service alone <br/>
@see [src/services/google-signin-service.ts](src/services/google-signin-service.ts)
