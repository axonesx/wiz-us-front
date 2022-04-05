import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_ERROR, LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_ERROR  } from './mutation-types'
import { USER_LOGOUT, USER_SUCCESS } from '../user/mutation-types'
import { IAction } from '@/store/types/action'
import { IState } from './types'
import { httpClientApi } from '@/api/helpers/http-client-api'
import { removeTokenInLocalStorage, setTokenInLocalStorage } from '@/services/local-storage.service'

const loginUser: IAction<IState, string> = ({commit, dispatch }, user) => {
  return new Promise((resolve, reject) => {
    commit(AUTH_REQUEST)
    httpClientApi
    .post('/login', user)
      .then(resp => {
        const xsrfToken = resp.data.xsrfToken
        setTokenInLocalStorage(xsrfToken)
        commit(AUTH_SUCCESS, xsrfToken)
        commit(USER_SUCCESS, resp.data.findUser)
        resolve(resp)
      })
    .catch(err => {
      commit(AUTH_ERROR, err)
      removeTokenInLocalStorage()
      reject(err)
    })
  })
}

const logoutUser: IAction<IState, string> = ({commit }) => {
  return new Promise<void>((resolve, reject) => {
    commit(LOGOUT_REQUEST)
    httpClientApi
    .post('/logout')
      .then(resp => {
        commit(LOGOUT_SUCCESS)
        commit(USER_LOGOUT)
        removeTokenInLocalStorage()
        resolve()
      })
    .catch(err => {
      commit(LOGOUT_ERROR, err)
      removeTokenInLocalStorage()
      reject(err)
    })
  })
}

export default {
  loginUser,
  logoutUser,
}