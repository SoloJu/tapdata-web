import moment from 'moment'
import i18n from '@/i18n'
import { ETL_STATUS_MAP, ETL_SUB_STATUS_MAP } from '@/const'

export function setPermission(list) {
  let permissions = []
  if (list) {
    list.forEach(permission => {
      if (permission.resources && permission.resources.length > 0) {
        permission.resources.forEach(res => {
          // if (res.type === 'page')
          permissions.push(res)
        })
      }
    })
  }
  sessionStorage.setItem('tapdata_permissions', JSON.stringify(permissions))
  return permissions
}

export function signOut() {
  let cookie = window.VueCookie

  cookie.delete('token')
  cookie.delete('user_id')
  cookie.delete('login')
  cookie.delete('isAdmin')
  cookie.delete('email')
  cookie.delete('username')
  cookie.delete('isReadonly')
  sessionStorage.setItem('lastLocationHref', location.href)
  if (window !== top) {
    top.window.location.href = '/login'
  } else {
    window.App.$router.push({
      name: 'login'
    })
  }
}

export function toRegExp(word) {
  let arr = ['\\', '$', '(', ')', '*', '+', '.', '[', ']', '?', '^', '{', '}', '|', '-']
  for (let i = 0; i < arr.length; i++) {
    let str = '\\' + arr[i]
    word = word.replace(new RegExp(str, 'g'), '\\' + arr[i])
  }
  return word
}

export function getUrlSearch(name) {
  // 未传参，返回空
  if (!name) return null
  // 查询参数：先通过search取值，如果取不到就通过hash来取
  var after = window.location.search
  after = after.substr(1) || window.location.hash.split('?')[1]
  // 地址栏URL没有查询参数，返回空
  if (!after) return null
  // 如果查询参数中没有"name"，返回空
  if (after.indexOf(name) === -1) return null
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  // 当地址栏参数存在中文时，需要解码，不然会乱码
  var r = decodeURI(after).match(reg)
  // 如果url中"name"没有值，返回空
  if (!r) return null
  return r[2]
}
let timeout = null
export function delayTrigger(func, t = 500) {
  if (t) {
    if (timeout) {
      window.clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func && func()
      timeout = null
    }, t)
  } else {
    func && func()
  }
}
export const getImgByType = function (type) {
  if (!type) {
    type = 'default'
  }
  return require(`@/assets/images/types/${type.toLowerCase()}.png`)
}
export const deepCopy = obj => JSON.parse(JSON.stringify(obj))
export const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return date ? moment(date).format(format) : ''
}
// 根据类型做时间格式化，精确到哪种级别
export const formatTimeByTime = (time, type) => {
  let result = time
  switch (type) {
    case 'second':
      result = moment(time).format('HH:mm:ss')
      break
    case 'minute':
      result = moment(time).format('HH:mm')
      break
    case 'hour':
      result = moment(time).format('HH:00')
      break
    case 'day':
      result = moment(time).format('MM-DD')
      break
  }
  return result
}
// 毫秒换算成时分秒
export const formatMs = (msTime = 0, type = 'time') => {
  let time = msTime / 1000
  let arr = []
  arr.push({
    label: i18n.t('task_info_d'),
    value: Math.floor(time / 60 / 60 / 24)
  }) // day
  arr.push({
    label: i18n.t('task_info_h'),
    value: Math.floor(time / 60 / 60) % 24
  }) // hour
  arr.push({
    label: i18n.t('task_info_m'),
    value: Math.floor(time / 60) % 60
  }) // minute
  arr.push({
    label: i18n.t('task_info_s'),
    value: Math.floor(time) % 60
  }) // second
  let result = ''
  if (type === 'time') {
    result = arr
      .slice(1)
      .map(t => (t.value + '').padStart(2, '0'))
      .join(':')
    return result
  }
  arr.forEach(el => {
    if (el.value) {
      result += el.value + el.label
    }
  })
  if (!result) {
    result = msTime + i18n.t('task_info_ms')
  }
  return result
}

// 判断对象是否为空
export const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object

const CLASSTYPES = [
  'String',
  'Number',
  'BigInt',
  'Boolean',
  'Symbol',
  'Function',
  'Array',
  'Date',
  'RegExp',
  'Object',
  'Error'
]

const CLASS2TYPE = CLASSTYPES.reduce((obj, t) => ((obj[`[object ${t}]`] = t.toLowerCase()), obj), {})

export function getClassType(obj) {
  return obj == null ? String(obj) : CLASS2TYPE[{}.toString.call(obj)] || 'object'
}

export function isObject(obj) {
  return getClassType(obj) === 'object'
}

export function isString(obj) {
  return getClassType(obj) === 'string'
}

export function isFunction(func) {
  return typeof func === 'function' || getClassType(func) === 'function'
}

/**
 * 按key给数组分组
 * @param data
 * @param key
 * @returns {*}
 */
export function groupBy(data, key) {
  return data.reduce((storage, item) => {
    const g = item[key]
    storage[g] = storage[g] || []
    storage[g].push(item)
    return storage
  }, {})
}

export const uuid = function () {
  // credit: http://stackoverflow.com/posts/2117523/revisions

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0
    let v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function escapeHTML(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * 比较两个数字是否近似相等
 * 0.1 + 0.2 === 0.3 => false
 * sameNumber(0.1+0.2, 0.3) => true
 * @param num1
 * @param num2
 * @param tolerance 宽松度
 * @returns {boolean}
 */
export function sameNumber(num1, num2, tolerance = Number.EPSILON) {
  return Math.abs(num1 - num2) <= tolerance || num1 === num2
}
// 数组去重
export function uniqueArr(arr = [], key = 'id') {
  if (typeof arr[0] !== 'object') {
    return Array.from(new Set(arr))
  }
  let obj = {}
  return arr.reduce((cur, next) => {
    if (!obj[next[key]]) {
      obj[next[key]] = true
      cur.push(next)
    }
    return cur
  }, [])
}

// 获取子任务状态统计
export function getSubTaskStatus(rows = []) {
  const statusMap = {
    running: ['wait_run', 'scheduling', 'running', 'stopping'],
    not_running: ['edit', 'stop', 'complete'],
    error: ['error', 'schedule_failed']
  }
  const len = rows.length
  let result = [],
    item = {}
  if (len === 0) {
    result = [
      Object.assign({ count: 1 }, ETL_SUB_STATUS_MAP['edit'], {
        status: 'edit'
      })
    ]
  } else {
    let tempMap = {}
    rows.forEach(r => {
      tempMap[r.status] = true
    })
    if (Object.keys(tempMap).length === 1) {
      let status = rows[0]?.status
      status = status === 'edit' ? 'ready' : status
      result = [
        Object.assign({ count: 1 }, ETL_SUB_STATUS_MAP[status], {
          status: status
        })
      ]
    } else {
      for (let key in ETL_STATUS_MAP) {
        item = Object.assign({}, ETL_STATUS_MAP[key])
        item.status = key
        item.count = 0
        rows.forEach(el => {
          if (statusMap[key].includes(el.status)) {
            item.count++
          }
        })
        result.push(item)
      }
    }
  }
  return result
}

// 同步主任务，按钮的禁用逻辑
export function getTaskBtnDisabled(row, or) {
  let result = {
    start: false,
    stop: false,
    edit: false,
    reset: false,
    delete: false
  }
  let statusResult = []
  if (row.statusResult) {
    statusResult = row.statusResult
  } else {
    statusResult = getSubTaskStatus(row.statuses)
  }
  let filterArr = statusResult.filter(t => t.count > 0)
  // 统计出3种状态：运行中running、未运行not_running、错误error
  if (statusResult.length > 1) {
    // 启动禁用：运行中
    // 停止禁用：未运行、错误
    // 编辑禁用：运行中
    // 重置禁用：运行中
    // 删除禁用：运行中
    result.start = filterArr.every(t => ['running'].includes(t.status))
    result.stop = filterArr.every(t => ['not_running', 'error'].includes(t.status))
    result.edit = filterArr.every(t => ['running'].includes(t.status))
    result.reset = filterArr.every(t => ['running'].includes(t.status))
    result.delete = filterArr.every(t => ['running'].includes(t.status))
  } else {
    // 启动可用：待启动、已完成、错误、已停止
    // 停止可用：运行中、停止中
    // 编辑可用：编辑中、待启动、已完成、错误、已停止 或者 未运行状态
    // 重置可用：已完成、错误、已停止
    // 删除可用：编辑中、待启动、已完成、错误、已停止
    result.start = !filterArr.every(t => ['ready', 'complete', 'error', 'stop'].includes(t.status))
    result.stop = !filterArr.every(t => ['running', 'stopping'].includes(t.status))
    result.edit = !filterArr.every(t => ['edit', 'ready', 'complete', 'error', 'stop'].includes(t.status))
    result.reset = !filterArr.every(t => ['complete', 'error', 'stop'].includes(t.status))
    result.delete = !filterArr.every(t => ['edit', 'ready', 'complete', 'error', 'stop'].includes(t.status))
  }
  if (or) {
    for (let key in result) {
      result[key] = or || result[key]
    }
  }
  return result
}
