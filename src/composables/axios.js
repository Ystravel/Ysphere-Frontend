import axios from 'axios'
import { useUserStore } from '@/stores/user'

// baseURL = http://localhost:4000
// axios.post('/user')
// baseURL = x
// axios.post('http://localhost:4000/user')

const api = axios.create({
  baseURL: import.meta.env.VITE_API
})

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API
})

// 1. axios.get / axios.post ...
// 2. interceptors.request
// 3. 送出
// 4. interceptors.response
// 5. .then() .catch()
apiAuth.interceptors.request.use(config => {
  const user = useUserStore()
  config.headers.Authorization = 'Bearer ' + user.token
  return config
})

// 1. apiAuth.get(/user/profile)
// 2. apiAuth.interceptors.request  自動加上 JWT
// 3. 傳送出去
// 4. apiAuth.interceptors.response(成功處理, 失敗處理)
// 5. 如果成功，回傳收到的資料，結束
// 6. 如果失敗，且是登入過期，自動傳送舊換新
// 7. 舊換新成功，修改 apiAuth.get(/user/profile) 的 jwt 後重新送出
// 8. 舊換新失敗，回傳 apiAuth.get(/user/profile) 的錯誤
apiAuth.interceptors.response.use(res => {
  return res
}, async error => {
  // 如果失敗有回應 (網路斷線也算是失敗，網路斷線不會有回應)
  if (error.response) {
    // 如果得到登入過期的回應訊息，且不是舊換新
    if (error.response.data.message === '登入過期' && error.config.url !== '/user/extend') {
      const user = useUserStore()
      try {
        // 傳送舊換新請求
        const { data } = await apiAuth.patch('/user/extend')
        // 舊換新成功，更新 store 的 token
        user.token = data.result
        // 修改原本發生錯誤的請求的設定
        error.config.headers.Authorization = 'Bearer ' + user.token
        // 重新傳送一次原本的請求
        return axios(error.config)
      } catch (_) {
        // 舊換新錯誤，登出
        user.logout()
      }
    }
  }
  // 回傳原本請求的錯誤到呼叫 apiAuth 的地方
  return Promise.reject(error)
})

export const useApi = () => {
  return { api, apiAuth }
}
