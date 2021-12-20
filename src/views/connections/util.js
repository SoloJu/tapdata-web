/**
 * @author lg<lirufei0808@gmail.com>
 * @date 2020/12/9
 * @description
 */
export const getImgByType = function (type) {
  if (!type || type === 'jira') {
    type = 'default'
  }
  return require(`@/assets/images/databaseType/${type.toLowerCase()}.png`)
}

export const verify = function (value) {
  var arr = ['\\', '$', '(', ')', '*', '+', '.', '[', ']', '?', '^', '{', '}', '|', '-']
  for (var i = 0; i < arr.length; i++) {
    var str = '\\' + arr[i]
    value = value.replace(new RegExp(str, 'g'), '\\' + arr[i])
  }
  return value
}
//列表脱敏
export const desensitization = function (url) {
  let matchResult = url.match(/^mongodb(\+srv)?:\/\/(.+):(.+)@/)
  if (matchResult && matchResult[3]) {
    return url.replace(`:${matchResult[3]}@`, ':*********@')
  }
  return url
}

export const handleProgress = function (data) {
  let count = 0
  data.forEach(log => {
    if (log.status === 'passed') {
      count++
    }
  })
  let len = (100 / data.length) * count
  return Math.round(len) ? Math.round(len) : 0
}

//支持的数据源
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
  dameng: 'DM DB',
  hive: 'Hive',
  tcp_udp: 'TCP/IP',
  mq: 'MQ',
  hbase: 'HBase',
  kudu: 'KUDU',
  greenplum: 'Greenplum',
  tidb: 'TiDB',
  hana: 'SAP HANA',
  clickhouse: 'ClickHouse',
  kundb: 'KunDB',
  adb_mysql: 'ADB MySQL',
  adb_postgres: 'ADB PostgreSQL'
}
//特殊数据源
export const TYPEMAPCONFIG = {
  'gbase-8s': 'gbase8s',
  'sybase ase': 'sybasease',
  'dummy db': 'dummydb',
  'mysql pxc': 'mysqlpxc',
  'rest api': 'restapi'
}

//数据源基础字段
export const defaultModel = {
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
    initialReadSize: 100000, //dummy
    hiveConnType: 'Stream', // kafka
    schema: '',
    tidbPdServer: '' // TiDB
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
    kafkaIgnorePushError: false,
    krb5: false,
    krb5Keytab: '',
    krb5Conf: '',
    krb5KeytabName: '',
    krb5ConfName: '',
    krb5Principal: '',
    krb5ServiceName: '',
    kafkaSaslMechanism: 'PLAIN'
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
    // connectionTimeOut: '10',
    // readTimeOut: '30',
    jsEngineName: 'graal.js',
    custom_ondata_script: '',
    custom_cdc_script: '',
    custom_initial_script: '',
    custom_before_opr: false,
    custom_after_opr: false,
    custom_before_script: '',
    custom_after_script: ''
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
    mqPassword: '',
    mqQueueSet: '', //队列名集合
    mqTopicSet: '', //主题名称
    routeKeyField: '', //消息路由
    virtualHost: '' //虚拟主机
  }
}
export const defaultCloudModel = {
  default: {
    name: '',
    database_type: '',
    connection_type: '',
    database_host: '',
    database_port: '',
    database_name: '',
    database_username: '',
    database_password: '',
    plain_password: '',
    database_owner: '',
    database_uri: '',
    isUrl: false,
    ssl: false,
    sslKey: '',
    sslPass: '',
    sslValidate: false,
    sslCA: '',
    sslCAFile: null,
    sslKeyFile: null,
    pgsql_log_decorder_plugin_name: '',
    database_datetype_without_timezone: '',
    additionalString: ''
  },
  drs: {
    s_zone: '',
    s_region: '',
    sourceType: 'rds',
    database_type: 'source_and_target',
    region: '',
    zone: '',
    vpc: '',
    ecs: '',
    checkedVpc: '',
    platformInfo: {
      region: '',
      zone: '',
      sourceType: '',
      DRS_region: '',
      DRS_zone: '',
      DRS_instances: '',
      IP_type: '',
      vpc: '',
      ecs: '',
      checkedVpc: false,
      strategyExistence: false
    }
  }
}
