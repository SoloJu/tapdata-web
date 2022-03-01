import { TOPOLOGY_MAP } from './const'
import moment from 'moment'

export function formatAgent(data) {
  let { regionMap, zoneMap } = window.__REGION__
  data.regionFmt = `${regionMap[data.region] || data.region} | ${zoneMap[data.zone] || data.zone}`
  data.topology = TOPOLOGY_MAP[data.spec?.direction]?.split('（')[0]
  data.endTimeStr = data.endTime ? moment(data.endTime).format('YYYY-DD-MM') : ''
  return data
}
export function queryParams(data, isPrefix) {
  isPrefix = isPrefix ? isPrefix : false
  let prefix = isPrefix ? '?' : ''
  let _result = []
  for (let key in data) {
    let value = data[key]
    // 去掉为空的参数
    if (['', undefined, null].includes(value)) {
      continue
    }
    if (value.constructor === Array) {
      value.forEach(_value => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
      })
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  }
  return _result.length ? prefix + _result.join('&') : ''
}
export function toDecimal2(x) {
  var float = parseFloat(x)
  if (isNaN(float)) {
    return false
  }
  var f = Math.round(x * 100) / 100
  var s = f.toString()
  var rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2) {
    s += '0'
  }
  return s
}
export function toRegExp(word) {
  let arr = ['\\', '$', '(', ')', '*', '+', '.', '[', ']', '?', '^', '{', '}', '|', '-']
  for (let i = 0; i < arr.length; i++) {
    let str = '\\' + arr[i]
    word = word.replace(new RegExp(str, 'g'), '\\' + arr[i])
  }
  return word
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

// 判断对象是否为空
export const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object
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
// cookie
export const cookie = {
  // 设置cookie
  set: (name, value, day) => {
    const date = new Date()
    date.setDate(date.getDate() + day)
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString()
  },
  // 获取cookie
  get: key => {
    var arr = document.cookie.split('; ')
    for (var i = 0; i < arr.length; i++) {
      var arr1 = arr[i].split('=')
      if (arr1[0] == key) {
        return arr1[1]
      }
    }
    return ''
  },
  // 删除cookie
  remove: name => {
    cookie.set(name, '', -1)
  }
}
let timeout = null
export function delayTrigger(func, t) {
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
// 支持的数据源 'mysql','mariadb','mysql pxc','mongodb','postgres','oracle','sqlserver','redis'
// 不支持 'rest api','db2','sybase','gbase','gaussdb200','kafka','elasticsearch'
export const TYPEMAP = {
  mysql: 'MySQL',
  oracle: 'Oracle',
  mongodb: 'MongoDB',
  elasticsearch: 'Elasticsearch',
  redis: 'Redis',
  postgres: 'PostgreSQL',
  sqlserver: 'SQL Server',
  'gbase-8s': 'GBase 8s',
  'sybase ase': 'Sybase ASE',
  gaussdb200: 'GaussDB200',
  db2: 'IBM Db2',
  mem_cache: 'Memory Cache',
  file: 'File(s)',
  custom_connection: 'Custom connection',
  'rest api': 'REST API',
  'dummy db': 'Dummy DB',
  gridfs: 'GridFS',
  kafka: 'Kafka',
  mariadb: 'MariaDB',
  'mysql pxc': 'MySQL PXC',
  jira: 'jira',
  clickhouse: 'ClickHouse'
}
// 转base64
export const urlToBase64 = url => {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.onload = function () {
      let canvas = document.createElement('canvas')
      canvas.width = this.naturalWidth
      canvas.height = this.naturalHeight
      // 将图片插入画布并开始绘制
      canvas.getContext('2d').drawImage(image, 0, 0)
      // result
      let result = canvas.toDataURL('image/png')
      resolve(result)
    }
    // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
    image.setAttribute('crossOrigin', 'Anonymous')
    image.src = url
    // 图片加载失败的错误处理
    image.onerror = () => {
      reject(new Error('urlToBase64 error'))
    }
  })
}
// 千分符
export const numToThousands = (num, index = 3, symbol = ',') => {
  let reg = new RegExp('(?!^)(?=(\\d{' + index + '})+$)', 'g')
  return String(num).replace(reg, symbol)
}
