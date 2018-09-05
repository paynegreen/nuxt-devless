export default function (ctx, inject) {
  const hostUrl = (ctx.env.devless.proxy) ? '/api/v1/service/' : `${ctx.env.devless.host}/api/v1/service/`

  ctx.$axios.setHeader("content-type", "application/json");

  let header = {
    'devless-token': ctx.env.devless['devless-token']
  }

  const nonce = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const postProcessor = (url, data) => {
    ctx.$axios.onRequest(config => {
      config.headers.common = header
    })

    return ctx.$axios.post(url, data).then(res => {
      return res.data
    }).catch(e => console.log(e))
  }

  const updateProcessor = (url, data) => {
    ctx.$axios.onRequest(config => {
      config.headers.common = header
    })

    return ctx.$axios.patch(url, data).then(res => {
      return res.data
    }).catch(e => console.log(e))
  }

  const deleteProcessor = (url, data) => {
    ctx.$axios.onRequest(config => {
      config.headers.common = header
    })

    return ctx.$axios.delete(url, data).then(res => {
      return res.data
    }).catch(e => console.log(e))
  }

  const getProcessor = (url) => {
    ctx.$axios.onRequest(config => {
      config.headers.common = header
    })

    return ctx.$axios.get(url).then(res => {
      return res.data
    }).catch(e => console.log(e))
  }

  const Devless = {
    queryData: (service, table, params = null) => {
      let parameters = ''

      if (params !== null) {
        const innerParams = function (key, params) {
          for (var eachParam in params) {
            parameters = '&' + key + '=' + params[eachParam] + parameters
          }
        }

        for (var key in params) {
          if (!params.hasOwnProperty(key)) { /**/ }
          if (params[key] instanceof Array) {
            innerParams(key, params[key])
          } else {
            parameters = '&' + key + '=' + params[key] + parameters
          }
        }
      }

      const url = `${hostUrl}${service}/db?table=${table}${parameters}`

      let result = getProcessor(url)

      return result
    },
    addData: (service, table, data) => {
      const body = {
        resource: [{
          name: table,
          field: [data]
        }]
      }

      const url = `${hostUrl}${service}/db`

      let result = postProcessor(url, body)

      return result
    },
    updateData: (service, table, identifier, value, data) => {
      const body = {
        resource: [{
          name: table,
          params: [{
            where: `${identifier},${value}`,
            data: [data]
          }]
        }]
      }

      const url = `${hostUrl}${service}/db`

      let res = updateProcessor(url, body)

      return res
    },
    deleteData: (service, table, identifier, value) => {
      const body = {
        resource: [{
          name: table,
          params: [{
            delete: true,
            where: `${identifier},${value}`
          }]
        }]
      }

      const url = `${hostUrl}${service}/db`

      let res = deleteProcessor(url, body)

      return res
    },
    setToken: (token) => {
      header['devless-user-token'] = token
      return true
    },
    call: (service, method, data = []) => {
      const body = {
        jsonrpc: '2.0',
        method: service,
        id: nonce(1, 10000000),
        params: data
      }

      const url = `${hostUrl}${service}/rpc?action=${method}`

      let res = postProcessor(url, body)

      return res
    },
    login: async (payload) => {
      return await Devless.call('devless', 'login', [
        payload.username || null,
        payload.email || null,
        payload.phone_number || null,
        payload.password
      ]).then(res => {
        if (res.payload.result) {
          return res.payload.result;
        }
        return res;
      })
    },
    register: async (payload, extras) => {
      return await Devless.call('devless', 'signUp', [
        payload.email || null,
        payload.password,
        payload.username || null,
        payload.phone_number || null,
        payload.first_name || null,
        payload.last_name || null,
        '',
        '',
        extras || null,
      ]).then(res => {
        if (res.payload.result) {
          Devless.setToken(res.payload.result.token);
          return res.payload.result;
        }
        return res;
      });
    },
    logout: async (token) => {
      Devless.setToken(token);
      return Devless.call('devless', 'logout').then(res => {
        if (res.payload.result) {
          return res.payload.result
        }
        return res;
      })
    }
  }
  ctx.$devless = Devless
  inject('devless', Devless)
}
