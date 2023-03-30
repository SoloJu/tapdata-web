import i18n from '@tap/i18n'

export const CONNECTION_STATUS_MAP = {
  ready: { text: i18n.t('public_status_ready'), type: 'success' },
  invalid: { text: i18n.t('public_status_invalid'), type: 'danger' },
  testing: { text: i18n.t('public_status_testing'), type: 'warning' }
}

export const CONNECTION_TYPE_MAP = {
  source: { text: i18n.t('public_connection_type_source') },
  target: { text: i18n.t('public_connection_type_target') },
  source_and_target: { text: i18n.t('public_connection_type_source_and_target') }
}

export const TASK_STATUS_MAP = {
  running: { text: i18n.t('public_status_running'), icon: 'yunxingzhong', type: 'success' },
  paused: { text: i18n.t('public_status_wait_run'), icon: 'daiqidong' },
  error: { text: i18n.t('public_status_error'), icon: 'cuowu', type: 'warning' },
  draft: { text: i18n.t('public_status_wait_run'), icon: 'daiqidong' },
  scheduled: { text: i18n.t('public_status_starting'), icon: 'qidongzhong', type: 'success' },
  stopping: { text: i18n.t('public_status_stopping'), icon: 'tingzhizhong', type: 'success' },
  'force stopping': {
    text: i18n.t('public_status_force_stopping'),
    icon: 'qiangzhitingzhi',
    type: 'success'
  },
  finished: { text: i18n.t('public_status_finished'), icon: 'yiwancheng', type: 'success' }
}

export const MILESTONE_STATUS_MAP = {
  waiting: { text: i18n.t('packages_business_milestone_list_status_waiting'), icon: 'daizhixing' },
  running: { text: i18n.t('packages_business_milestone_list_status_progressing'), icon: 'jinxingzhong' },
  error: { text: i18n.t('public_status_error'), icon: 'cuowu' },
  finish: { text: i18n.t('public_status_finished'), icon: 'yiwancheng' },
  paused: { text: i18n.t('public_status_stopping'), icon: 'yizanting' }
}

export const ETL_STATUS_MAP = {
  running: { text: i18n.t('packages_business_task_status_running'), type: 'success' },
  not_running: { text: i18n.t('packages_business_task_status_not_running'), type: 'disable' },
  error: { text: i18n.t('public_status_error'), type: 'danger' }
}

export const ETL_SUB_STATUS_MAP = {
  ready: { text: i18n.t('public_status_wait_run'), type: 'ready' },
  edit: { text: i18n.t('public_status_edit'), type: 'edit' },
  scheduling: { text: i18n.t('public_status_starting'), type: 'scheduling' },
  schedule_failed: { text: i18n.t('public_status_error'), type: 'schedule_failed' },
  wait_run: { text: i18n.t('public_status_starting'), type: 'wait_run' },
  running: { text: i18n.t('public_status_running'), type: 'running' },
  stopping: { text: i18n.t('public_status_stopping'), type: 'stopping' },
  stop: { text: i18n.t('public_status_stop'), type: 'stop' },
  complete: { text: i18n.t('public_status_finished'), type: 'complete' },
  error: { text: i18n.t('public_status_error'), type: 'error' }
}

export const SHARECDC_MAP = {
  running: { text: i18n.t('public_status_running'), icon: 'running', type: 'success' },
  stop: { text: i18n.t('public_status_stop'), icon: 'stop' },
  error: { text: i18n.t('public_status_error'), icon: 'error', type: 'warning' },
  edit: { text: i18n.t('public_status_edit'), icon: 'edit' },
  scheduling: { text: i18n.t('public_status_starting'), icon: 'scheduling', type: 'success' },
  stopping: { text: i18n.t('public_status_stopping'), icon: 'stopping', type: 'warning' }
}

export const ALARM_STATUS_MAP = {
  ING: { text: i18n.t('packages_business_shared_const_gaojingzhong'), type: 'waiting' },
  RECOVER: { text: i18n.t('packages_business_shared_const_yihuifu'), type: 'finish' },
  CLOESE: { text: i18n.t('packages_business_components_alert_yiguanbi'), type: 'success' }
}

export const ALARM_LEVEL_MAP = {
  RECOVERY: { text: i18n.t('packages_business_components_alert_huifu'), type: 'finish' },
  NORMAL: { text: i18n.t('packages_business_shared_const_yiban'), type: 'edit' },
  WARNING: { text: i18n.t('packages_business_shared_const_jinggao'), type: 'waiting' },
  CRITICAL: { text: i18n.t('packages_business_shared_const_yanzhong'), type: 'stop' },
  EMERGENCY: { text: i18n.t('packages_business_shared_const_jinji'), type: 'error' }
}

export const ALARM_LEVEL_SORT = ['EMERGENCY', 'CRITICAL', 'WARNING', 'NORMAL', 'RECOVERY']

export const ORDER_STATUS_MAP = {
  unPay: '未支付',
  pay: '已支付',
  payFail: '支付失败',
  refund: '已退款',
  refundFail: '退款失败',
  refunding: '退款中',
  expire: '失效',
  cancelSubscribe: '已取消'
}

export const CURRENCY_SYMBOL_MAP = {
  usd: '$',
  hkd: 'HK$',
  cny: '¥'
}

export const NUMBER_MAP = {
  0: '零',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
  10: '十',
  11: '十一',
  12: '十二'
}
