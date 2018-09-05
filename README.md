# Nuxt-Devless
A DevLess backend connector for NuxtJS (https://nuxtjs.org)

Connect your Nuxt app to the DevLess backend to store data.

## Requirments
1. [Axios Module - @nuxtjs/axios](https://github.com/nuxt-community/axios-module)

## Installation
1. Download or clone the `devless.js` lib into the plugins directory of your nuxt application
2. Open `nuxt.config.js` and include the lib in the plugin section. [Read more on how to add plugins here](https://nuxtjs.org/guide/plugins#codefund_ad)
3. Install the Nuxt Axios Module [@nuxtjs/axios](https://github.com/nuxt-community/axios-module)
4. Add `axios`  config to the `nuxt.config.js`.
Recommend to proxy all requests.
```javascript
axios: {
  proxy: true,
  https: true,
  retry: {
    retries: 3
  }
},
proxy: {
  '/api/v1/': {
    target: 'https://kpela.herokuapp.com/',
    changeOrigin: true
  }
}
```
5. Login into your DevLess instance, head to the App section to grab the instance details to config the nuxt app (`nuxt.config.js`)
Add the details to `devless` under the `env` key. [Read more](https://nuxtjs.org/api/configuration-env#the-env-property)
```javascript
env: {
  devless: {
    proxy: true, // When set to `true` would use the proxy url for all requests(ssr) but `false` would use the absolute path for the DevLess instance
    host: 'YOUR_DEVLESS_URL',
    'devless-token': 'YOUR_DEVLESS_TOKEN',
  }
}
```
6. Restart the dev server

## Usage
Refer to [JS Library](https://github.com/DevlessTeam/DV-JS-SDK) for more options
1. Query Data
```
this.$devless.queryData('service_name', 'table_name', extras_params)
  .then(res => console.log(res))
  .catch(e => console.log(e))
```
The `extras_params` can be ignored if not available.
2. Add Data
```javascript
let data = {
  name: 'Tsatsu'
}
this.$devless.addData('service_name', 'table_name', data)
  .then(res => console.log(res))
  .catch(e => console.log(e))
```
3. Update Data
```javascript
let data = {
  name: 'Tsatsu'
}
this.$devless.updateData('service_name', 'table_name', 'identifier', 'value', data)
  .then(res => console.log(res))
  .catch(e => console.log(e))
```
4. Delete Data
```javascript
this.$devless.updateData('service_name', 'table_name', 'identifier', 'value')
  .then(res => console.log(res))
  .catch(e => console.log(e))
```
5. Method Calls
```javascript
let params = []
this.$devless.call('service_name', 'method_name', params)
  .then(res => console.log(res))
  .catch(e => console.log(e))
```
`params` can be ignored if not available
6. Login
```javascript
let payload = {
  email: 'john@doe.com'
  password: '******'
}
this.$devless.login(payload)
  .then(res => console.log(res))
  .catch(e => console.log(e))
```
7. Register
```javascript
let payload = {
  first_name: 'John',
  last_name: 'Doe',
  phone_number: '233201234567',
  email: 'john@doe.com'
  password: '******'
}
this.$devless.register(payload)
  .then(res => console.log(res))
  .catch(e => console.log(e))
```
8. Logout
```javascript
let token = 'LOGGED_IN_USER_TOKEN'
this.$devless.logout(token)
  .then(res => console.log(res))
  .catch(e => console.log(e))
```

## Contribution
Submit PRs. Test & Improvements needed.

E-mail: [tsatsu@devless.io](mailto:tsatsu@devless.io)
