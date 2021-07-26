const Mock = require('mockjs')
const Random = Mock.Random

module.exports = {
  '/api/tcm/connection/create': {
    code: 'ok',
    msg: 'ok',
    data: {
      'databaseType|1': ['mysql', 'postgres', 'mongodb'], //数据库类型
      host: '192.168.' + Random.integer(0, 500) + '.' + Random.integer(0, 500), //数据库地址
      port: Random.integer(0, 5000), // 数据库端口
      username: '@name', // 数据库账号
      password: '@cuid', // 数据库密码
      db: '@name', // 数据库名称
      schema: '@cuid' // 数据库 schema
    }
  },
  '/tm/api/Connections/:id/customQuery': {
    data: {
      name: 'TLL_MONGO4_2_24212',
      connection_type: 'source_and_target',
      database_type: 'mongodb',
      database_host: '192.168.1.183:24212',
      database_username: 'root',
      database_port: 0,
      database_uri: '',
      database_name: 'test',
      database_owner: '',
      retry: 0,
      nextRetry: null,
      id: '60d557ebd3fdfa20ea143cd8',
      response_body: {
        validate_details: [
          {
            stage_code: 'validate-3000',
            show_msg: 'CHECK_CONNECT',
            status: 'passed',
            sort: 1,
            error_code: null,
            fail_message: null,
            required: true
          },
          {
            stage_code: 'validate-3100',
            show_msg: 'CHECK_AUTH',
            status: 'passed',
            sort: 2,
            error_code: null,
            fail_message: null,
            required: true
          },
          {
            stage_code: 'validate-3400',
            show_msg: 'CHECK_PERMISSION',
            status: 'passed',
            sort: 3,
            error_code: null,
            fail_message: null,
            required: true
          },
          {
            stage_code: 'validate-3200',
            show_msg: 'LOAD_SCHEMA',
            status: 'passed',
            sort: 4,
            error_code: null,
            fail_message: null,
            required: false
          }
        ],
        retry: 0
      },
      project: '',
      submit: true,
      plain_password: '',
      table_filter: '',
      additionalString: 'authSource=admin',
      thin_type: '',
      node_name: '',
      database_schema: '',
      plugin_name: '',
      pgsql_log_decorder_plugin_name: '',
      database_datetype_without_timezone: '',
      supportUpdatePk: false,
      ssl: false,
      sslKey: '',
      sslPass: '',
      schemaAutoUpdate: false,
      multiTenant: false,
      pdb: '',
      sslValidate: false,
      sslCA: '',
      search_databaseType: '',
      increamentalTps: 100,
      initialReadSize: 100000,
      sslCert: '',
      status: 'ready',
      fill: 'uri',
      transformed: true,
      user_id: '60acbe6b323d9d005723ea91',
      last_updated: '2021-06-25T11:14:59.633Z',
      createTime: '2021-06-25T04:13:31.851Z',
      testTime: 1624606160441,
      dbFullVersion: '4.2.12',
      db_version: 4,
      loadCount: 10,
      loadFieldsStatus: 'finished',
      loadSchemaField: false,
      schemaVersion: '40f3ecc8-67a5-44d4-a0eb-479faed9d8a4',
      tableCount: 10,
      everLoadSchema: true,
      schema: {
        tables: [
          {
            id: '60ef810a04d4fd0011d8474b',
            table_name: 'CAR_CLAIM'
          },
          {
            id: '60ef810a04d4fd0011d8474d',
            table_name: 'CUSTOMER_TEST'
          },
          {
            id: '60ef810a04d4fd0011d8474e',
            table_name: 'BIG_DATA'
          }
        ]
      }
    },
    code: 'ok',
    msg: 'ok'
  },
  '/tm/api/Connections/count': { data: { count: 232 }, code: 'ok', msg: 'ok' },
  '/tm/api/Connections': {
    code: 'ok',
    msg: 'ok',
    'data|0-1': [
      {
        name: '@name',
        connection_type: 'target',
        'database_type|1': ['mysql', 'oracle', 'mongodb'],
        database_host: '',
        database_username: '',
        database_port: Random.integer(0, 5000),
        database_uri: 'mongodb://192.168.1.191:27017/tapdata_test',
        database_name: '',
        id: '@id',
        sslCert: '',
        additionalString: '',
        'ssl|1': Boolean,
        sslKey: '',
        sslPass: '',
        'schemaAutoUpdate|1': Boolean,
        sslCA: '',
        search_databaseType: '',
        status: 'ready',
        fill: 'uri',
        user_id: '@id',
        last_updated: Random.datetime(),
        loadCount: Random.integer(0, 100),
        'loadFieldsStatus|1': ['loading', 'finished'],
        tableCount: Random.integer(0, 100),
        username: '@name'
      }
    ]
  },
  '/tm/api/Connections/:id': {
    data: {
      name: 'zed_huawei_mysql2',
      connection_type: 'source_and_target',
      database_type: 'mysql',
      database_host: '119.8.35.121',
      database_username: 'root',
      database_port: 3307,
      database_uri: '',
      database_name: 'test',
      database_owner: '',
      database_password: '259275a9f888a77f2acd8af488755875',
      retry: 0,
      nextRetry: null,
      id: '60d59186b1738d1d9a77c0c1',
      response_body: {
        validate_details: [
          {
            stage_code: 'validate-2000',
            show_msg: 'CHECK_CONNECT',
            status: 'passed',
            sort: 1,
            error_code: null,
            fail_message: null,
            required: true
          },
          {
            stage_code: 'validate-2100',
            show_msg: 'CHECK_AUTH',
            status: 'passed',
            sort: 2,
            error_code: null,
            fail_message: null,
            required: true
          },
          {
            stage_code: 'validate-2300',
            show_msg: 'CHECK_VERSION',
            status: 'passed',
            sort: 4,
            error_code: null,
            fail_message: null,
            required: true
          },
          {
            stage_code: 'validate-2400',
            show_msg: 'LOAD_SCHEMA',
            status: 'passed',
            sort: 5,
            error_code: null,
            fail_message: null,
            required: false
          },
          {
            stage_code: 'validate-2500',
            show_msg: 'CHECK_BIN_LOG',
            status: 'passed',
            sort: 6,
            error_code: null,
            fail_message: null,
            required: false
          },
          {
            stage_code: 'validate-2600',
            show_msg: 'CHECK_CDC_PERMISSION',
            status: 'passed',
            sort: 7,
            error_code: null,
            fail_message: null,
            required: false
          }
        ],
        retry: 0
      },
      project: '',
      submit: true,
      table_filter: '',
      additionalString: '',
      thin_type: '',
      node_name: '',
      database_schema: '',
      plugin_name: '',
      pgsql_log_decorder_plugin_name: '',
      database_datetype_without_timezone: '',
      supportUpdatePk: false,
      isUrl: true,
      ssl: false,
      sslKey: '',
      sslPass: '',
      schemaAutoUpdate: false,
      multiTenant: false,
      pdb: '',
      sslValidate: false,
      sslCA: '',
      search_databaseType: '',
      increamentalTps: 100,
      initialReadSize: 100000,
      sslCert: '',
      status: 'ready',
      transformed: true,
      user_id: '60d58d0ab1738d1d9a77b491',
      last_updated: '2021-06-25T14:40:04.328Z',
      createTime: '2021-06-25T08:19:18.863Z',
      testTime: 1624632004326,
      loadCount: 1,
      loadFieldsStatus: 'finished',
      loadSchemaField: false,
      schemaVersion: '0beb4e67-a89e-4d4c-a8e8-ea4ee0defe8c',
      tableCount: 1,
      everLoadSchema: true,
      username: 'zed',
      schema: {
        tables: [
          {
            table_name: 'user',
            cdc_enabled: true,
            meta_type: 'table',
            tableId: '60d59187b1738d1d9a77c0c8',
            fields: [
              {
                field_name: 'id',
                table_name: 'user',
                data_type: 'INT',
                primary_key_position: 1,
                key: 'PRI',
                dataType: 4,
                is_nullable: false,
                parent: null,
                original_field_name: 'id',
                original_java_type: 'Long',
                precision: 10,
                scale: null,
                oriPrecision: 10,
                oriScale: null,
                default_value: null,
                javaType: 'Long',
                columnSize: 10,
                autoincrement: false,
                id: '60d59187b1738d1d9a77c0cb',
                is_deleted: false
              },
              {
                field_name: 'name',
                table_name: 'user',
                data_type: 'VARCHAR',
                primary_key_position: 0,
                dataType: 12,
                is_nullable: false,
                parent: null,
                original_field_name: 'name',
                original_java_type: 'String',
                precision: 255,
                scale: null,
                oriPrecision: 255,
                oriScale: null,
                default_value: null,
                javaType: 'String',
                columnSize: 255,
                autoincrement: false,
                id: '60d59187b1738d1d9a77c0cc',
                is_deleted: false
              }
            ],
            indices: []
          }
        ]
      }
    },
    code: 'ok',
    msg: 'ok'
  }
}
