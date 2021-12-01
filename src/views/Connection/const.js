export const DEFAULT_MODEL = {
  default: {
    id: '',
    name: '',
    database_type: '',
    connection_type: '',
    database_host: '',
    database_port: '',
    database_name: '',
    database_username: '',
    database_password: '',
    plain_password: '',
    table_filter: '',
    additionalString: '',
    thin_type: '',
    database_owner: '',
    node_name: '',
    database_schema: '',
    plugin_name: '',
    pgsql_log_decorder_plugin_name: '',
    database_datetype_without_timezone: '',
    supportUpdatePk: false,
    isUrl: true,
    database_uri: '',
    ssl: false,
    sslKey: '',
    sslPass: '',
    schemaAutoUpdate: false,
    multiTenant: false,
    pdb: '',
    sslValidate: false,
    sslCA: '',
    sslCAFile: null,
    sslKeyFile: null,
    search_databaseType: '',
    increamentalTps: 100, //dummy
    initialReadSize: 100000 //dummy
  },
  kafka: {
    id: '',
    name: '',
    database_type: '',
    connection_type: '',
    kafkaBootstrapServers: '',
    kafkaPatternTopics: '',
    database_username: '',
    plain_password: '',
    kafkaIgnoreInvalidRecord: false,
    kafkaAcks: '',
    kafkaCompressionType: '',
    kafkaIgnorePushError: false
  },
  file: {
    name: '',
    database_type: '',
    connection_type: '',
    database_host: '',
    database_port: '',
    database_name: '',
    database_username: '',
    database_password: '',
    plain_password: '',
    database_uri: '',
    ftp_passive: true, // 连接方式
    connection_timeout_seconds: 60, //连接超时时间
    data_timeout_seconds: 60, //传输超时时间
    fileDefaultCharset: 'UTF8', // 编码格式
    file_upload_chunk_size: 261120, //文件上传文件块大小
    file_upload_mode: '', //文件上传模式
    overwriteSetting: '', //当同名文件存在时
    extendSourcePath: false, // 继承目录结构
    outputPath: '', // 文件输出绝对路径
    file_source_protocol: '', //协议类型
    vc_mode: '', // 版本管理
    file_sources: [
      {
        path: '',
        recursive: false,
        selectFileType: 'include',
        include_filename: '',
        exclude_filename: ''
      }
    ]
  },
  jira: {
    multiTenant: false,
    pdb: '',
    jiraUrl: '',
    jiraUsername: '',
    jiraPassword: ''
  },
  restApi: {
    name: '',
    auth_type: '',
    request_interval: '',
    collection_name: '',
    unique_keys: '',
    req_pre_process:
      " // Build-in function's MD5/SHA1/SHA256\n" +
      '    // example:\n' +
      "    // request_params.sign = MD5(request_params.id+request_params_name+'secret_key');",
    resp_pre_process: "// result: {'tapdata_offset': offset, 'response':<API RESPONSE>}",
    data_sync_mode: 'INCREMENTAL_SYNC',
    url_info: [
      {
        url: '',
        method: 'GET',
        url_type: 'INCREMENTAL_SYNC',
        headers: {},
        headerArray: [{ name: '', value: '' }],
        parameterArray: [{ name: '', value: '' }],
        request_parameters: {},
        offset_field: '',
        initial_offset: '',
        content_type: ''
      }
    ]
  },
  custom_connection: {
    name: '',
    connection_type: '',
    custom_type: '',
    collection_name: '',
    unique_keys: '',
    custom_ondata_script: '',
    custom_cdc_script: '',
    custom_initial_script: ''
  },
  gridfs: {
    connection_type: 'source',
    prefix: 'fs',
    database_uri: '',
    _password_for_url: '',
    plain_password: '',
    include_filename: '',
    exclude_filename: '',
    file_schema: '',
    file_type: 'csv',
    seperate: ',',
    gridfs_header_type: 'specified_line',
    gridfs_header_config: '',
    data_content_xpath: '',
    gridfsReadMode: 'data',
    json_type: 'ArrayBegin',
    tags_filter: '',
    gridfs_upload_chunk_size: '',
    file_upload_chunk_size: 261120,
    file_upload_mode: 'stream',
    project: '',
    projects: '',
    sheet_start: 1,
    sheet_end: 1,
    excel_header_type: 'index',
    excel_header_start: 'A1',
    excel_header_end: 'Z1',
    excel_value_start: '',
    excel_value_end: ''
  },
  tcp: {
    name: '',
    database_type: 'tcp_udp',
    connection_type: 'target',
    database_host: '',
    database_port: '',
    tcpUdpType: 'TCP',
    root_name: ''
  },
  mq: {
    name: '',
    database_type: '',
    connection_type: '',
    database_host: '',
    database_port: '',
    mqType: '0', //MQ类型
    brokerURL: '', //MQ连接串
    mqUserName: '',
    plain_password: '',
    mqQueueSet: '', //队列名集合
    mqTopicSet: '', //主题名称
    routeKeyField: '', //消息路由
    virtualHost: '', //虚拟主机
    nameSrvAddr: ''
  }
}
export const CONFIG_MODEL = {
  default: [
    {
      icon: 'time',
      items: [
        {
          label: '加载schema',
          key: 'last_updated'
        }
      ]
    },
    {
      icon: 'database',
      items: [
        {
          label: '数据库地址',
          key: 'database_host'
        }
      ]
    },
    {
      icon: 'port',
      items: [
        {
          label: '端口',
          key: 'database_port'
        }
      ]
    },
    {
      icon: 'name',
      items: [
        {
          label: '数据库名称',
          key: 'database_name'
        }
      ]
    },
    {
      icon: 'database-user-name',
      items: [
        {
          label: '账号',
          key: 'database_username'
        }
      ]
    },
    {
      icon: 'database-password',
      items: [
        {
          label: '密码',
          key: 'database_password'
        }
      ]
    },
    {
      icon: 'additional-string',
      items: [
        {
          label: '其他连接串参数',
          key: 'additionalString'
        }
      ]
    },
    {
      icon: 'origin-time',
      items: [
        {
          label: '时间类型的时区',
          key: 'database_datetype_without_timezone'
        }
      ]
    }
  ],
  kafka: [
    {
      icon: 'time',
      items: [
        {
          label: '加载schema',
          key: 'last_updated'
        }
      ]
    },
    {
      icon: 'database',
      items: [
        {
          label: '数据库地址',
          key: 'kafkaBootstrapServers'
        },
        {
          label: '主题表达式',
          key: 'kafkaPatternTopics'
        },
        {
          label: '忽略非JSON Object格式消息',
          key: 'kafkaIgnoreInvalidRecord'
        },
        {
          label: 'ACK 确认机制',
          key: 'kafkaAcks'
        },
        {
          label: '消息压缩类型',
          key: 'kafkaCompressionType'
        },
        {
          label: '忽略推送消息异常',
          key: 'kafkaIgnorePushError'
        }
      ]
    }
  ],
  mq: [
    {
      icon: 'time',
      items: [
        {
          label: '加载schema',
          key: 'last_updated'
        }
      ]
    },
    {
      icon: 'database',
      items: [
        {
          label: '数据库地址',
          key: 'database_host'
        }
      ]
    },
    {
      icon: 'port',
      items: [
        {
          label: '端口',
          key: 'database_port'
        },
        {
          label: 'MQ类型',
          key: 'mqType'
        },
        {
          label: 'MQ连接串',
          key: 'brokerURL'
        },
        {
          label: '队列名集合',
          key: 'mqQueueSet'
        },
        {
          label: '主题名称',
          key: 'mqTopicSet'
        },
        {
          label: '消息路由',
          key: 'routeKeyField'
        },
        {
          label: '虚拟主机',
          key: 'virtualHost'
        }
      ]
    },
    {
      icon: 'database-user-name',
      items: [
        {
          label: '账号',
          key: 'mqUserName'
        }
      ]
    },
    {
      icon: 'database-password',
      items: [
        {
          label: '密码',
          key: 'plain_password'
        }
      ]
    }
  ]
}
