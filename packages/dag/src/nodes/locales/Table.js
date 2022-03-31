export const Table = {
  'zh-cn': {
    connectionId: '数据库',
    tableName: '表',
    totalReadMethod: {
      title: '全量数据读取',
      dataSource: ['全量读取', '自定义sql']
    },
    increasePoll: {
      title: '增量数据读取',
      dataSource: ['日志CDC', '自定义sql']
    },
    initialOffset: 'sql增量条件',
    increaseSyncInterval: '增量同步间隔(ms)',
    increaseReadSize: '每次读取数量(行)',
    maxTransactionDuration: '事务最大时长(小时)',
    existDataProcessMode: {
      title: '已有数据处理',
      dataSource: ['保持已存在的数据', '运行前删除已存在的数据', '运行前删除表结构']
    },
    writeStrategy: {
      title: '数据写入模式',
      dataSource: ['更新写入', '追加写入', '更新已存在或者插入新数据']
    },
    updateConditionFields: '更新条件字段'
  },
  'zh-tw': {
    connectionId: '數據庫',
    tableName: '表',
    totalReadMethod: {
      title: '全量數據讀取',
      dataSource: ['全量讀取', '自定義sql']
    },
    increasePoll: {
      title: '增量數據讀取',
      dataSource: ['日誌CDC', '自定義sql']
    },
    initialOffset: 'sql增量條件',
    increaseSyncInterval: '增量同步間隔(ms)',
    increaseReadSize: '每次讀取數量(行)',
    maxTransactionDuration: '事務最大時長(小時)',
    existDataProcessMode: {
      title: '已有數據處理',
      dataSource: ['保持已存在的數據', '運行前刪除已存在的數據', '運行前刪除表結構']
    },
    writeStrategy: {
      title: '數據寫入模式',
      dataSource: ['更新寫入', '追加寫入', '更新已存在或者插入新數據']
    },
    updateConditionFields: '更新條件字段'
  },
  'en-us': {
    connectionId: 'Database',
    tableName: 'Table',
    totalReadMethod: {
      title: 'Total Read Method',
      dataSource: ['Full Read', 'Customize Sql']
    },
    increasePoll: {
      title: 'Increase Poll',
      dataSource: ['CDC', 'Customize Sql']
    },
    initialOffset: 'Increment Condition',
    increaseSyncInterval: 'Increase Sync Interval (ms)',
    increaseReadSize: 'Increase Read Size (row)',
    maxTransactionDuration: 'Max Transaction Duration (h)',
    existDataProcessMode: {
      title: 'Exist Data Process Mode',
      dataSource: ['Keep Data', 'Remove Data', 'Drop Table']
    },
    writeStrategy: {
      title: 'Write Strategy',
      dataSource: ['Update Write', 'Append Write', 'Update Or Insert']
    },
    updateConditionFields: 'Update Condition Fields'
  }
}
