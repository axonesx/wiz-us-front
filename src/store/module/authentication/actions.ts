import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_ERROR, LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_ERROR  } from './/mutation-types'
import { USER_LOGIN, USER_LOGOUT, TOKEN_LOGIN } from '../../module/user/mutation-types'
import { isActiveToken, removeTokenInLocalStorage, setTokenInLocalStorage } from '@/services/local-storage.service'
import { IAction, IActionWithoutPayload } from '@/store/types/action'
import { httpClientApi } from '@/api/helpers/http-client-api'
import { IState } from './types'

const loginUser: IAction<IState, string> = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    commit(AUTH_REQUEST)
    httpClientApi
    .post('/login', user)
      .then(resp => {
        const xsrfToken = resp.data.xsrfToken
        const maxAge = resp.data.maxAge
        setTokenInLocalStorage(xsrfToken, maxAge)
        commit(AUTH_SUCCESS)
        commit(USER_LOGIN, resp.data.findUser)
        commit(TOKEN_LOGIN, resp.data.xsrfToken)
        resolve(resp)
      })
    .catch(err => {
      commit(AUTH_ERROR, err)
      removeTokenInLocalStorage()
      reject(err)
    })
  })
}

const logoutUser: IActionWithoutPayload<IState> = ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit(LOGOUT_REQUEST)
    httpClientApi
    .post('/logout')
        .then(resp => {
          removeTokenInLocalStorage()
          commit(USER_LOGOUT)
          commit(LOGOUT_SUCCESS)
          resolve(resp)
      })
    .catch(err => {
      commit(LOGOUT_ERROR, err)
      reject(err)
    })
  })
}

const logoutUserFromFront: IActionWithoutPayload<IState> = ({ commit }) => {
  removeTokenInLocalStorage()
  commit(USER_LOGOUT)
  commit(LOGOUT_SUCCESS)
}

export default {
    loginUser,
    logoutUserFromFront,
    logoutUser,

}
