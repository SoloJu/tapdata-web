// const Mock = require('mockjs')
// const Random = Mock.Random

module.exports = {
  '/tm/api/Inspects/count': { data: { count: 65 }, code: 'ok', msg: 'ok' },
  '/tm/api/Inspects': {
    data: [
      {
        id: '6110c8e725d71e00512d916d',
        flowId: '6110a6f6b4cfba0051dc7d1a',
        name: '数据校验测试--全字段new',
        mode: 'manual',
        inspectMethod: 'field',
        timing: { intervals: 1440, intervalsUnit: 'minute', start: 1628489939439, end: 1628576339439 },
        limit: { keep: 100 },
        enabled: true,
        tasks: [
          {
            source: {
              connectionId: '61052dbc2e7c8d004f2bca22',
              table: 'CLAIM',
              sortColumn: 'CLAIM_ID',
              fields: [
                { field_name: 'SETTLED_DATE', primary_key_position: 0, id: '61052dec2e7c8d004f2bd254' },
                { field_name: 'SETTLED_AMOUNT', primary_key_position: 0, id: '61052dec2e7c8d004f2bd256' },
                { field_name: 'POLICY_ID', primary_key_position: 0, id: '61052dec2e7c8d004f2bd259' },
                { field_name: 'LAST_CHANGE', primary_key_position: 0, id: '61052dec2e7c8d004f2bd25b' },
                { field_name: 'CLAIM_TYPE', primary_key_position: 0, id: '61052dec2e7c8d004f2bd258' },
                { field_name: 'CLAIM_REASON', primary_key_position: 0, id: '61052dec2e7c8d004f2bd257' },
                { field_name: 'CLAIM_ID', primary_key_position: 1, id: '61052dec2e7c8d004f2bd255' },
                { field_name: 'CLAIM_DATE', primary_key_position: 0, id: '61052dec2e7c8d004f2bd25a' },
                { field_name: 'CLAIM_AMOUNT', primary_key_position: 0, id: '61052dec2e7c8d004f2bd25c' }
              ],
              connectionName: 'jason-oracle12c'
            },
            target: {
              connectionId: '61052dbc2e7c8d004f2bca22',
              table: 'VERI_CLAIM',
              sortColumn: 'CLAIM_ID',
              fields: [
                { field_name: 'SETTLED_DATE', primary_key_position: 0, id: '61052dec2e7c8d004f2bd254' },
                { field_name: 'SETTLED_AMOUNT', primary_key_position: 0, id: '61052dec2e7c8d004f2bd256' },
                { field_name: 'POLICY_ID', primary_key_position: 0, id: '61052dec2e7c8d004f2bd259' },
                { field_name: 'LAST_CHANGE', primary_key_position: 0, id: '61052dec2e7c8d004f2bd25b' },
                { field_name: 'CLAIM_TYPE', primary_key_position: 0, id: '61052dec2e7c8d004f2bd258' },
                { field_name: 'CLAIM_REASON', primary_key_position: 0, id: '61052dec2e7c8d004f2bd257' },
                { field_name: 'CLAIM_ID', primary_key_position: 1, id: '61052dec2e7c8d004f2bd255' },
                { field_name: 'CLAIM_DATE', primary_key_position: 0, id: '61052dec2e7c8d004f2bd25a' },
                { field_name: 'CLAIM_AMOUNT', primary_key_position: 0, id: '61052dec2e7c8d004f2bd25c' }
              ],
              connectionName: 'jason-oracle12c'
            },
            fullMatch: true,
            showAdvancedVerification: false,
            script: '',
            webScript: '',
            taskId: '60ded447412e0b08d632d9c3-'
          }
        ],
        dataFlowName: '数据校验测试',
        status: 'done',
        ping_time: 1628490933149,
        user_id: '60fe2770bc5ed6eb0fa469b9',
        last_updated: '2021-08-09T06:35:34.167Z',
        createTime: '2021-08-09T06:19:19.614Z',
        agentId: 'e55e4e74-fbd6-4a6d-b529-f9e2d9afd269',
        lastStartTime: 1628490933149,
        scheduleTime: 1628490933169,
        scheduleTimes: 2,
        errorMsg: '',
        result: 'failed',
        byFirstCheckId: '6110c8fa25d71e00512d9210',
        difference_number: 1,
        InspectResult: {
          status: 'done',
          id: '6110ccb525d71e00512d9cd6',
          inspect_id: '6110c8e725d71e00512d916d',
          threads: 1,
          agentId: '',
          errorMsg: null,
          progress: 1,
          source_total: 0,
          target_total: 0,
          stats: [
            {
              taskId: '6110cb2b25d71e00512d9888-',
              source: {
                connectionId: '61052dbc2e7c8d004f2bca22',
                connectionName: 'jason-oracle12c',
                table: 'CLAIM',
                sortColumn: 'CLAIM_ID',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              target: {
                connectionId: '61052dbc2e7c8d004f2bca22',
                connectionName: 'jason-oracle12c',
                table: 'VERI_CLAIM',
                sortColumn: 'CLAIM_ID',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              start: 1628490933529,
              end: 1628490933907,
              status: 'done',
              errorMsg: null,
              result: 'failed',
              progress: 1,
              cycles: 1,
              source_total: 0,
              target_total: 0,
              both: 1,
              source_only: 0,
              target_only: 0,
              row_passed: 0,
              row_failed: 1,
              speed: 1
            }
          ],
          spendMilli: 0,
          inspect: {
            id: '6110c8e725d71e00512d916d',
            name: '数据校验测试--全字段new',
            status: 'scheduling',
            mode: 'manual',
            inspectMethod: 'field',
            timing: { intervals: 1440, intervalsUnit: 'minute', start: '1628489939439', end: '1628576339439' },
            limit: { keep: 100, fullMatchKeep: 100, action: 'stop' },
            tasks: [
              {
                taskId: '6110c8e725d71e00512d916c-',
                fullMatch: true,
                compareFn: null,
                confirmFn: null,
                batchSize: 10000,
                source: {
                  connectionId: '61052dbc2e7c8d004f2bca22',
                  connectionName: 'jason-oracle12c',
                  table: 'CLAIM',
                  sortColumn: 'CLAIM_ID',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                target: {
                  connectionId: '61052dbc2e7c8d004f2bca22',
                  connectionName: 'jason-oracle12c',
                  table: 'VERI_CLAIM',
                  sortColumn: 'POLICY_ID',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                limit: null,
                script: '',
                showAdvancedVerification: false
              }
            ],
            customId: null,
            user_id: '60fe2770bc5ed6eb0fa469b9',
            byFirstCheckId: null
          },
          start: 1628490933350,
          end: 1628490934048,
          user_id: '60fe2770bc5ed6eb0fa469b9',
          customId: null,
          firstCheckId: '6110c8fa25d71e00512d9210',
          parentId: '6110cc9725d71e00512d9c83',
          ttlTime: '2021-11-07T06:35:33.449Z',
          last_updated: '2021-08-09T06:35:34.104Z',
          createTime: '2021-08-09T06:35:33.452Z'
        }
      },
      {
        id: '60e0677a650161005779cd96',
        flowId: '60dc4135fdbc9e17646317b5',
        name: 'js处理错误 (1)2',
        mode: 'manual',
        inspectMethod: 'field',
        timing: { intervals: 1440, intervalsUnit: 'minute', start: 1625319272412, end: 1625405672412 },
        limit: { keep: 100 },
        enabled: true,
        tasks: [
          {
            source: {
              connectionId: '60cda022f0e73a0067428c38',
              connectionName: 'jason-mysql-3306',
              table: 'CLAIM',
              sortColumn: 'CLAIM_ID',
              fields: [
                { field_name: 'SETTLED_DATE', primary_key_position: 0, id: '60cda024f0e73a0067428ca8' },
                { field_name: 'SETTLED_AMOUNT', primary_key_position: 0, id: '60cda024f0e73a0067428cab' },
                { field_name: 'POLICY_ID', primary_key_position: 0, id: '60cda024f0e73a0067428ca6' },
                { field_name: 'P2', primary_key_position: 0, id: '60dc35712340b60e00088d2b' },
                { field_name: 'LAST_CHANGE', primary_key_position: 0, id: '60cda024f0e73a0067428cad' },
                { field_name: 'CLAIM_TYPE', primary_key_position: 0, id: '60cda024f0e73a0067428ca9' },
                { field_name: 'CLAIM_REASON', primary_key_position: 0, id: '60cda024f0e73a0067428cac' },
                { field_name: 'CLAIM_ID', primary_key_position: 1, id: '60cda024f0e73a0067428ca5' },
                { field_name: 'CLAIM_DATE', primary_key_position: 0, id: '60cda024f0e73a0067428ca7' },
                { field_name: 'CLAIM_AMOUNT', primary_key_position: 0, id: '60cda024f0e73a0067428caa' }
              ]
            },
            target: {
              connectionId: '60cda022f0e73a0067428c38',
              connectionName: 'jason-mysql-3306',
              table: 'CLAIM_C1',
              sortColumn: 'CLAIM_ID',
              fields: [
                { field_name: 'SETTLED_DATE', primary_key_position: 0, id: '60dc35712340b60e00088d23' },
                { field_name: 'SETTLED_AMOUNT', primary_key_position: 0, id: '60dc35712340b60e00088d26' },
                { field_name: 'POLICY_ID', primary_key_position: 0, id: '60dc35712340b60e00088d21' },
                { field_name: 'P2', primary_key_position: 0, id: '60dc35712340b60e00088d2a' },
                { field_name: 'P1', primary_key_position: 0, id: '60dc35712340b60e00088d29' },
                { field_name: 'LAST_CHANGE', primary_key_position: 0, id: '60dc35712340b60e00088d28' },
                { field_name: 'CLAIM_TYPE', primary_key_position: 0, id: '60dc35712340b60e00088d24' },
                { field_name: 'CLAIM_REASON', primary_key_position: 0, id: '60dc35712340b60e00088d27' },
                { field_name: 'CLAIM_ID', primary_key_position: 1, id: '60dc35712340b60e00088d20' },
                { field_name: 'CLAIM_DATE', primary_key_position: 0, id: '60dc35712340b60e00088d22' },
                { field_name: 'CLAIM_AMOUNT', primary_key_position: 0, id: '60dc35712340b60e00088d25' }
              ]
            },
            fullMatch: true,
            showAdvancedVerification: false,
            script: '',
            webScript: '',
            taskId: '60e0677a650161005779cd95-'
          }
        ],
        dataFlowName: 'js处理错误 (1)',
        status: 'error',
        ping_time: 1627458910604,
        user_id: '60cd992ff0e73a006742801b',
        last_updated: '2021-07-28T07:55:10.914Z',
        createTime: '2021-07-03T13:34:50.895Z',
        agentId: '25a2cf17-61be-479b-a9f3-e786907e789f',
        lastStartTime: 1627458910604,
        scheduleTime: 1627458910619,
        scheduleTimes: 1,
        errorMsg:
          'Communications link failure\n\nThe last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.',
        result: 'passed',
        difference_number: 0,
        InspectResult: {
          status: 'error',
          id: '61010d5e209f9e0058faf9ab',
          inspect_id: '60e0677a650161005779cd96',
          threads: 1,
          agentId: '',
          errorMsg:
            'Communications link failure\n\nThe last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.',
          progress: 0,
          source_total: 0,
          target_total: 0,
          stats: [
            {
              taskId: '60e0677a650161005779cd95-',
              source: {
                connectionId: '60cda022f0e73a0067428c38',
                connectionName: 'jason-mysql-3306',
                table: 'CLAIM',
                sortColumn: 'CLAIM_ID',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              target: {
                connectionId: '60cda022f0e73a0067428c38',
                connectionName: 'jason-mysql-3306',
                table: 'CLAIM_C1',
                sortColumn: 'CLAIM_ID',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              start: 1627458910796,
              end: null,
              status: 'error',
              errorMsg:
                'Communications link failure\n\nThe last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.',
              result: '',
              progress: 0,
              cycles: 0,
              source_total: 0,
              target_total: 0,
              both: 0,
              source_only: 0,
              target_only: 0,
              row_passed: 0,
              row_failed: 0,
              speed: 0
            }
          ],
          spendMilli: 0,
          inspect: {
            id: '60e0677a650161005779cd96',
            name: 'js处理错误 (1)2',
            status: 'scheduling',
            mode: 'manual',
            inspectMethod: 'field',
            timing: { intervals: 1440, intervalsUnit: 'minute', start: '1625319272412', end: '1625405672412' },
            limit: { keep: 100, fullMatchKeep: 100, action: 'stop' },
            tasks: [
              {
                taskId: '60e0677a650161005779cd95-',
                fullMatch: true,
                compareFn: null,
                confirmFn: null,
                batchSize: 10000,
                source: {
                  connectionId: '60cda022f0e73a0067428c38',
                  connectionName: 'jason-mysql-3306',
                  table: 'CLAIM',
                  sortColumn: 'CLAIM_ID',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                target: {
                  connectionId: '60cda022f0e73a0067428c38',
                  connectionName: 'jason-mysql-3306',
                  table: 'CLAIM_C1',
                  sortColumn: 'CLAIM_ID',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                limit: null,
                script: '',
                showAdvancedVerification: false
              }
            ],
            customId: null,
            user_id: '60cd992ff0e73a006742801b'
          },
          start: 1627458910733,
          end: 1627458910893,
          user_id: '60cd992ff0e73a006742801b',
          customId: '',
          ttlTime: '2021-10-26T07:55:10.741Z',
          last_updated: '2021-07-28T07:55:10.903Z',
          createTime: '2021-07-28T07:55:10.743Z'
        }
      },
      {
        id: '60e01f97b845410057c00b33',
        flowId: '60e0014393a8b565b679e09b',
        name: 'PG-2-MySQL-db-clone-all',
        mode: 'manual',
        inspectMethod: 'field',
        timing: { intervals: 1440, intervalsUnit: 'minute', start: 1625300873385, end: 1625387273385 },
        limit: { keep: 100 },
        enabled: true,
        tasks: [
          {
            source: {
              connectionId: '60df0b2b5fba4c0ae613c583',
              connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
              table: 'claim',
              sortColumn: 'claim_id',
              fields: [
                { field_name: 'settled_date', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c651' },
                { field_name: 'settled_amount', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c654' },
                { field_name: 'policy_id', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c64f' },
                { field_name: 'last_change', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c656' },
                { field_name: 'claim_type', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c652' },
                { field_name: 'claim_reason', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c655' },
                { field_name: 'claim_id', primary_key_position: 1, id: '60df0b2e5fba4c0ae613c64e' },
                { field_name: 'claim_date', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c650' },
                { field_name: 'claim_amount', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c653' }
              ]
            },
            target: {
              connectionId: '60dfe0291bc5f7202a3dccf2',
              connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
              table: 'claim',
              sortColumn: 'claim_id',
              fields: [
                { field_name: 'settled_date', primary_key_position: 0, id: '60e005ae51a5080057a77698' },
                { field_name: 'settled_amount', primary_key_position: 0, id: '60e005ae51a5080057a7769b' },
                { field_name: 'policy_id', primary_key_position: 0, id: '60e005ae51a5080057a77696' },
                { field_name: 'last_change', primary_key_position: 0, id: '60e005ae51a5080057a7769d' },
                { field_name: 'claim_type', primary_key_position: 0, id: '60e005ae51a5080057a77699' },
                { field_name: 'claim_reason', primary_key_position: 0, id: '60e005ae51a5080057a7769c' },
                { field_name: 'claim_id', primary_key_position: 1, id: '60e005ae51a5080057a77695' },
                { field_name: 'claim_date', primary_key_position: 0, id: '60e005ae51a5080057a77697' },
                { field_name: 'claim_amount', primary_key_position: 0, id: '60e005ae51a5080057a7769a' }
              ]
            },
            fullMatch: true,
            showAdvancedVerification: false,
            script: '',
            webScript: '',
            taskId: '60e01f97b845410057c00b31-'
          },
          {
            source: {
              connectionId: '60df0b2b5fba4c0ae613c583',
              connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
              table: 'customer',
              sortColumn: 'customer_id',
              fields: [
                { field_name: 'zip', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f5' },
                { field_name: 'street', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f4' },
                { field_name: 'phone', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f0' },
                { field_name: 'number_children', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f1' },
                { field_name: 'nationality', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f8' },
                { field_name: 'marital_status', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f2' },
                { field_name: 'last_name', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9ec' },
                { field_name: 'last_change', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f9' },
                { field_name: 'job', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9ee' },
                { field_name: 'gender', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9ed' },
                { field_name: 'first_name', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9eb' },
                { field_name: 'email', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9ef' },
                { field_name: 'date_of_birth', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f3' },
                { field_name: 'customer_id', primary_key_position: 1, id: '60df0b2f5fba4c0ae613c9ea' },
                { field_name: 'country_code', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f7' },
                { field_name: 'city', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f6' }
              ]
            },
            target: {
              connectionId: '60dfe0291bc5f7202a3dccf2',
              connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
              table: 'customer',
              sortColumn: 'customer_id',
              fields: [
                { field_name: 'zip', primary_key_position: 0, id: '60e01f59b845410057c00a52' },
                { field_name: 'street', primary_key_position: 0, id: '60e01f59b845410057c00a51' },
                { field_name: 'phone', primary_key_position: 0, id: '60e01f59b845410057c00a4d' },
                { field_name: 'number_children', primary_key_position: 0, id: '60e01f59b845410057c00a4e' },
                { field_name: 'nationality', primary_key_position: 0, id: '60e01f59b845410057c00a55' },
                { field_name: 'marital_status', primary_key_position: 0, id: '60e01f59b845410057c00a4f' },
                { field_name: 'last_name', primary_key_position: 0, id: '60e01f59b845410057c00a49' },
                { field_name: 'last_change', primary_key_position: 0, id: '60e01f59b845410057c00a56' },
                { field_name: 'job', primary_key_position: 0, id: '60e01f59b845410057c00a4b' },
                { field_name: 'gender', primary_key_position: 0, id: '60e01f59b845410057c00a4a' },
                { field_name: 'first_name', primary_key_position: 0, id: '60e01f59b845410057c00a48' },
                { field_name: 'email', primary_key_position: 0, id: '60e01f59b845410057c00a4c' },
                { field_name: 'date_of_birth', primary_key_position: 0, id: '60e01f59b845410057c00a50' },
                { field_name: 'customer_id', primary_key_position: 1, id: '60e01f59b845410057c00a47' },
                { field_name: 'country_code', primary_key_position: 0, id: '60e01f59b845410057c00a54' },
                { field_name: 'city', primary_key_position: 0, id: '60e01f59b845410057c00a53' }
              ]
            },
            fullMatch: true,
            showAdvancedVerification: false,
            script: '',
            webScript: '',
            taskId: '60e01f97b845410057c00b32-'
          }
        ],
        dataFlowName: 'PG-2-MySQL-db-clone',
        status: 'done',
        ping_time: 1625300889137,
        user_id: '5fe442543be62700959d27ca',
        last_updated: '2021-07-03T08:28:09.805Z',
        createTime: '2021-07-03T08:28:07.147Z',
        agentId: '20184e5b-0faa-43ac-bf46-3a94187e4fdd',
        lastStartTime: 1625300889137,
        scheduleTime: 1625300889142,
        scheduleTimes: 1,
        errorMsg: '',
        result: 'passed',
        difference_number: 0,
        InspectResult: {
          status: 'done',
          id: '60e01f99b845410057c00b3c',
          inspect_id: '60e01f97b845410057c00b33',
          threads: 1,
          agentId: '',
          errorMsg: '',
          progress: 1,
          source_total: 1704,
          target_total: 1704,
          stats: [
            {
              taskId: '60e01f97b845410057c00b31-',
              source: {
                connectionId: '60df0b2b5fba4c0ae613c583',
                connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
                table: 'claim',
                sortColumn: 'claim_id',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              target: {
                connectionId: '60dfe0291bc5f7202a3dccf2',
                connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
                table: 'claim',
                sortColumn: 'claim_id',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              start: 1625300889381,
              end: 1625300889618,
              status: 'done',
              errorMsg: null,
              result: 'passed',
              progress: 1,
              cycles: 1064,
              source_total: 1064,
              target_total: 1064,
              both: 1064,
              source_only: 0,
              target_only: 0,
              row_passed: 1064,
              row_failed: 0,
              speed: 1064
            },
            {
              taskId: '60e01f97b845410057c00b32-',
              source: {
                connectionId: '60df0b2b5fba4c0ae613c583',
                connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
                table: 'customer',
                sortColumn: 'customer_id',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              target: {
                connectionId: '60dfe0291bc5f7202a3dccf2',
                connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
                table: 'customer',
                sortColumn: 'customer_id',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              start: 1625300889660,
              end: 1625300889764,
              status: 'done',
              errorMsg: null,
              result: 'passed',
              progress: 1,
              cycles: 640,
              source_total: 640,
              target_total: 640,
              both: 640,
              source_only: 0,
              target_only: 0,
              row_passed: 640,
              row_failed: 0,
              speed: 640
            }
          ],
          spendMilli: 0,
          inspect: {
            id: '60e01f97b845410057c00b33',
            name: 'PG-2-MySQL-db-clone-all',
            status: 'scheduling',
            mode: 'manual',
            inspectMethod: 'field',
            timing: { intervals: 1440, intervalsUnit: 'minute', start: '1625300873385', end: '1625387273385' },
            limit: { keep: 100, fullMatchKeep: 100, action: 'stop' },
            tasks: [
              {
                taskId: '60e01f97b845410057c00b31-',
                fullMatch: true,
                compareFn: null,
                confirmFn: null,
                batchSize: 10000,
                source: {
                  connectionId: '60df0b2b5fba4c0ae613c583',
                  connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
                  table: 'claim',
                  sortColumn: 'claim_id',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                target: {
                  connectionId: '60dfe0291bc5f7202a3dccf2',
                  connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
                  table: 'claim',
                  sortColumn: 'claim_id',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                limit: null,
                script: '',
                showAdvancedVerification: false
              },
              {
                taskId: '60e01f97b845410057c00b32-',
                fullMatch: true,
                compareFn: null,
                confirmFn: null,
                batchSize: 10000,
                source: {
                  connectionId: '60df0b2b5fba4c0ae613c583',
                  connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
                  table: 'customer',
                  sortColumn: 'customer_id',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                target: {
                  connectionId: '60dfe0291bc5f7202a3dccf2',
                  connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
                  table: 'customer',
                  sortColumn: 'customer_id',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                limit: null,
                script: '',
                showAdvancedVerification: false
              }
            ],
            customId: null,
            user_id: '5fe442543be62700959d27ca'
          },
          start: 1625300889317,
          end: 1625300889783,
          user_id: '5fe442543be62700959d27ca',
          customId: '',
          ttlTime: '2021-10-01T08:28:09.331Z',
          last_updated: '2021-07-03T08:28:09.795Z',
          createTime: '2021-07-03T08:28:09.332Z'
        }
      },
      {
        id: '60e01f97b845410057c00b32',
        flowId: '60e0014393a8b565b679e09b',
        name: 'PG-2-MySQL-db-clone-all',
        mode: 'manual',
        inspectMethod: 'field',
        timing: { intervals: 1440, intervalsUnit: 'minute', start: 1625300873385, end: 1625387273385 },
        limit: { keep: 100 },
        enabled: true,
        tasks: [
          {
            source: {
              connectionId: '60df0b2b5fba4c0ae613c583',
              connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
              table: 'claim',
              sortColumn: 'claim_id',
              fields: [
                { field_name: 'settled_date', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c651' },
                { field_name: 'settled_amount', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c654' },
                { field_name: 'policy_id', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c64f' },
                { field_name: 'last_change', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c656' },
                { field_name: 'claim_type', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c652' },
                { field_name: 'claim_reason', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c655' },
                { field_name: 'claim_id', primary_key_position: 1, id: '60df0b2e5fba4c0ae613c64e' },
                { field_name: 'claim_date', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c650' },
                { field_name: 'claim_amount', primary_key_position: 0, id: '60df0b2e5fba4c0ae613c653' }
              ]
            },
            target: {
              connectionId: '60dfe0291bc5f7202a3dccf2',
              connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
              table: 'claim',
              sortColumn: 'claim_id',
              fields: [
                { field_name: 'settled_date', primary_key_position: 0, id: '60e005ae51a5080057a77698' },
                { field_name: 'settled_amount', primary_key_position: 0, id: '60e005ae51a5080057a7769b' },
                { field_name: 'policy_id', primary_key_position: 0, id: '60e005ae51a5080057a77696' },
                { field_name: 'last_change', primary_key_position: 0, id: '60e005ae51a5080057a7769d' },
                { field_name: 'claim_type', primary_key_position: 0, id: '60e005ae51a5080057a77699' },
                { field_name: 'claim_reason', primary_key_position: 0, id: '60e005ae51a5080057a7769c' },
                { field_name: 'claim_id', primary_key_position: 1, id: '60e005ae51a5080057a77695' },
                { field_name: 'claim_date', primary_key_position: 0, id: '60e005ae51a5080057a77697' },
                { field_name: 'claim_amount', primary_key_position: 0, id: '60e005ae51a5080057a7769a' }
              ]
            },
            fullMatch: true,
            showAdvancedVerification: false,
            script: '',
            webScript: '',
            taskId: '60e01f97b845410057c00b31-'
          },
          {
            source: {
              connectionId: '60df0b2b5fba4c0ae613c583',
              connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
              table: 'customer',
              sortColumn: 'customer_id',
              fields: [
                { field_name: 'zip', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f5' },
                { field_name: 'street', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f4' },
                { field_name: 'phone', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f0' },
                { field_name: 'number_children', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f1' },
                { field_name: 'nationality', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f8' },
                { field_name: 'marital_status', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f2' },
                { field_name: 'last_name', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9ec' },
                { field_name: 'last_change', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f9' },
                { field_name: 'job', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9ee' },
                { field_name: 'gender', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9ed' },
                { field_name: 'first_name', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9eb' },
                { field_name: 'email', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9ef' },
                { field_name: 'date_of_birth', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f3' },
                { field_name: 'customer_id', primary_key_position: 1, id: '60df0b2f5fba4c0ae613c9ea' },
                { field_name: 'country_code', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f7' },
                { field_name: 'city', primary_key_position: 0, id: '60df0b2f5fba4c0ae613c9f6' }
              ]
            },
            target: {
              connectionId: '60dfe0291bc5f7202a3dccf2',
              connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
              table: 'customer',
              sortColumn: 'customer_id',
              fields: [
                { field_name: 'zip', primary_key_position: 0, id: '60e01f59b845410057c00a52' },
                { field_name: 'street', primary_key_position: 0, id: '60e01f59b845410057c00a51' },
                { field_name: 'phone', primary_key_position: 0, id: '60e01f59b845410057c00a4d' },
                { field_name: 'number_children', primary_key_position: 0, id: '60e01f59b845410057c00a4e' },
                { field_name: 'nationality', primary_key_position: 0, id: '60e01f59b845410057c00a55' },
                { field_name: 'marital_status', primary_key_position: 0, id: '60e01f59b845410057c00a4f' },
                { field_name: 'last_name', primary_key_position: 0, id: '60e01f59b845410057c00a49' },
                { field_name: 'last_change', primary_key_position: 0, id: '60e01f59b845410057c00a56' },
                { field_name: 'job', primary_key_position: 0, id: '60e01f59b845410057c00a4b' },
                { field_name: 'gender', primary_key_position: 0, id: '60e01f59b845410057c00a4a' },
                { field_name: 'first_name', primary_key_position: 0, id: '60e01f59b845410057c00a48' },
                { field_name: 'email', primary_key_position: 0, id: '60e01f59b845410057c00a4c' },
                { field_name: 'date_of_birth', primary_key_position: 0, id: '60e01f59b845410057c00a50' },
                { field_name: 'customer_id', primary_key_position: 1, id: '60e01f59b845410057c00a47' },
                { field_name: 'country_code', primary_key_position: 0, id: '60e01f59b845410057c00a54' },
                { field_name: 'city', primary_key_position: 0, id: '60e01f59b845410057c00a53' }
              ]
            },
            fullMatch: true,
            showAdvancedVerification: false,
            script: '',
            webScript: '',
            taskId: '60e01f97b845410057c00b32-'
          }
        ],
        dataFlowName: 'PG-2-MySQL-db-clone',
        status: 'running',
        ping_time: 1625300889137,
        user_id: '5fe442543be62700959d27ca',
        last_updated: '2021-07-03T08:28:09.805Z',
        createTime: '2021-07-03T08:28:07.147Z',
        agentId: '20184e5b-0faa-43ac-bf46-3a94187e4fdd',
        lastStartTime: 1625300889137,
        scheduleTime: 1625300889142,
        scheduleTimes: 1,
        errorMsg: '',
        result: 'passed',
        difference_number: 0,
        InspectResult: {
          status: 'done',
          id: '60e01f99b845410057c00b3c',
          inspect_id: '60e01f97b845410057c00b33',
          threads: 1,
          agentId: '',
          errorMsg: '',
          progress: 1,
          source_total: 1704,
          target_total: 1704,
          stats: [
            {
              taskId: '60e01f97b845410057c00b31-',
              source: {
                connectionId: '60df0b2b5fba4c0ae613c583',
                connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
                table: 'claim',
                sortColumn: 'claim_id',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              target: {
                connectionId: '60dfe0291bc5f7202a3dccf2',
                connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
                table: 'claim',
                sortColumn: 'claim_id',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              start: 1625300889381,
              end: 1625300889618,
              status: 'done',
              errorMsg: null,
              result: 'passed',
              progress: 1,
              cycles: 1064,
              source_total: 1064,
              target_total: 1064,
              both: 1064,
              source_only: 0,
              target_only: 0,
              row_passed: 1064,
              row_failed: 0,
              speed: 1064
            },
            {
              taskId: '60e01f97b845410057c00b32-',
              source: {
                connectionId: '60df0b2b5fba4c0ae613c583',
                connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
                table: 'customer',
                sortColumn: 'customer_id',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              target: {
                connectionId: '60dfe0291bc5f7202a3dccf2',
                connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
                table: 'customer',
                sortColumn: 'customer_id',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              start: 1625300889660,
              end: 1625300889764,
              status: 'done',
              errorMsg: null,
              result: 'passed',
              progress: 1,
              cycles: 640,
              source_total: 640,
              target_total: 640,
              both: 640,
              source_only: 0,
              target_only: 0,
              row_passed: 640,
              row_failed: 0,
              speed: 640
            }
          ],
          spendMilli: 0,
          inspect: {
            id: '60e01f97b845410057c00b33',
            name: 'PG-2-MySQL-db-clone-all',
            status: 'scheduling',
            mode: 'manual',
            inspectMethod: 'field',
            timing: { intervals: 1440, intervalsUnit: 'minute', start: '1625300873385', end: '1625387273385' },
            limit: { keep: 100, fullMatchKeep: 100, action: 'stop' },
            tasks: [
              {
                taskId: '60e01f97b845410057c00b31-',
                fullMatch: true,
                compareFn: null,
                confirmFn: null,
                batchSize: 10000,
                source: {
                  connectionId: '60df0b2b5fba4c0ae613c583',
                  connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
                  table: 'claim',
                  sortColumn: 'claim_id',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                target: {
                  connectionId: '60dfe0291bc5f7202a3dccf2',
                  connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
                  table: 'claim',
                  sortColumn: 'claim_id',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                limit: null,
                script: '',
                showAdvancedVerification: false
              },
              {
                taskId: '60e01f97b845410057c00b32-',
                fullMatch: true,
                compareFn: null,
                confirmFn: null,
                batchSize: 10000,
                source: {
                  connectionId: '60df0b2b5fba4c0ae613c583',
                  connectionName: 'postgres-9_4_26-source-192_168_1_183-TAPDATA-insurance',
                  table: 'customer',
                  sortColumn: 'customer_id',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                target: {
                  connectionId: '60dfe0291bc5f7202a3dccf2',
                  connectionName: 'mysql-target-5-7-33_192-168-1-183-insurance_target',
                  table: 'customer',
                  sortColumn: 'customer_id',
                  direction: 'DESC',
                  columns: null,
                  limit: 0,
                  skip: 0,
                  where: null
                },
                limit: null,
                script: '',
                showAdvancedVerification: false
              }
            ],
            customId: null,
            user_id: '5fe442543be62700959d27ca'
          },
          start: 1625300889317,
          end: 1625300889783,
          user_id: '5fe442543be62700959d27ca',
          customId: '',
          ttlTime: '2021-10-01T08:28:09.331Z',
          last_updated: '2021-07-03T08:28:09.795Z',
          createTime: '2021-07-03T08:28:09.332Z'
        }
      }
    ],
    code: 'ok',
    msg: 'ok'
  },
  '/tm/api/Inspects/update': { data: { count: 1 }, code: 'ok', msg: 'ok' },
  '/tm/api/Inspects/findOne': {
    data: {
      id: '60dc5bf4fdbc9e17646376be',
      flowId: '60dc5941fdbc9e1764636842',
      name: 'test js ',
      mode: 'cron',
      inspectMethod: 'field',
      timing: { intervals: 1440, intervalsUnit: 'minute', start: 1625054183742, end: 1625140583742 },
      limit: { keep: 100 },
      enabled: true,
      tasks: [
        {
          source: {
            connectionId: '60cda022f0e73a0067428c38',
            connectionName: 'jason-mysql-3306',
            table: 'CLAIM',
            sortColumn: 'CLAIM_ID',
            fields: [
              { field_name: 'SETTLED_DATE', primary_key_position: 0, id: '60cda024f0e73a0067428ca8' },
              { field_name: 'SETTLED_AMOUNT', primary_key_position: 0, id: '60cda024f0e73a0067428cab' },
              { field_name: 'POLICY_ID', primary_key_position: 0, id: '60cda024f0e73a0067428ca6' },
              { field_name: 'P2', primary_key_position: 0, id: '60dc35712340b60e00088d2b' },
              { field_name: 'LAST_CHANGE', primary_key_position: 0, id: '60cda024f0e73a0067428cad' },
              { field_name: 'CLAIM_TYPE', primary_key_position: 0, id: '60cda024f0e73a0067428ca9' },
              { field_name: 'CLAIM_REASON', primary_key_position: 0, id: '60cda024f0e73a0067428cac' },
              { field_name: 'CLAIM_ID', primary_key_position: 1, id: '60cda024f0e73a0067428ca5' },
              { field_name: 'CLAIM_DATE', primary_key_position: 0, id: '60cda024f0e73a0067428ca7' },
              { field_name: 'CLAIM_AMOUNT', primary_key_position: 0, id: '60cda024f0e73a0067428caa' }
            ]
          },
          target: {
            connectionId: '60cda022f0e73a0067428c38',
            connectionName: 'jason-mysql-3306',
            table: 'CLAIM_C1',
            sortColumn: 'CLAIM_ID',
            fields: [
              { field_name: 'SETTLED_DATE', primary_key_position: 0, id: '60dc35712340b60e00088d23' },
              { field_name: 'SETTLED_AMOUNT', primary_key_position: 0, id: '60dc35712340b60e00088d26' },
              { field_name: 'POLICY_ID', primary_key_position: 0, id: '60dc35712340b60e00088d21' },
              { field_name: 'P2', primary_key_position: 0, id: '60dc35712340b60e00088d2a' },
              { field_name: 'P1', primary_key_position: 0, id: '60dc35712340b60e00088d29' },
              { field_name: 'LAST_CHANGE', primary_key_position: 0, id: '60dc35712340b60e00088d28' },
              { field_name: 'CLAIM_TYPE', primary_key_position: 0, id: '60dc35712340b60e00088d24' },
              { field_name: 'CLAIM_REASON', primary_key_position: 0, id: '60dc35712340b60e00088d27' },
              { field_name: 'CLAIM_ID', primary_key_position: 1, id: '60dc35712340b60e00088d20' },
              { field_name: 'CLAIM_DATE', primary_key_position: 0, id: '60dc35712340b60e00088d22' },
              { field_name: 'CLAIM_AMOUNT', primary_key_position: 0, id: '60dc35712340b60e00088d25' }
            ]
          },
          fullMatch: true,
          showAdvancedVerification: false,
          script: '',
          webScript: '',
          taskId: '60dc5bf4fdbc9e17646376bd-'
        }
      ],
      dataFlowName: 'test js ',
      status: 'done',
      ping_time: 1625054200766,
      user_id: '60cd992ff0e73a006742801b',
      last_updated: '2021-06-30T11:56:42.483Z',
      createTime: '2021-06-30T11:56:36.442Z',
      agentId: '01c4cdc6-f95a-40f4-80b5-a2fff87a0092',
      lastStartTime: 1625054200766,
      scheduleTime: 1625054200772,
      scheduleTimes: 1,
      errorMsg: '',
      result: 'failed'
    },
    code: 'ok',
    msg: 'ok'
  },
  '/tm/api/InspectResults/count': { data: { count: 65 }, code: 'ok', msg: 'ok' },
  '/tm/api/InspectResults': {
    data: [
      {
        parentId: 'ssss',
        status: 'done',
        id: '60ded44a412e0b08d632d9d1',
        inspect_id: '60dc424afdbc9e17646325fa',
        firstCheckId: 'xxxx',
        threads: 1,
        agentId: '',
        errorMsg: '',
        progress: 1,
        source_total: 51788,
        target_total: 51787,
        stats: [
          {
            taskId: '60ded447412e0b08d632d9c3-',
            source: {
              connectionId: '60cda022f0e73a0067428c38',
              connectionName: 'jason-mysql-3306',
              table: 'CLAIM',
              sortColumn: 'CLAIM_ID',
              direction: 'DESC',
              columns: null,
              limit: 0,
              skip: 0,
              where: null
            },
            target: {
              connectionId: '60cda022f0e73a0067428c38',
              connectionName: 'jason-mysql-3306',
              table: 'CLAIM_C1',
              sortColumn: 'CLAIM_ID',
              direction: 'DESC',
              columns: null,
              limit: 0,
              skip: 0,
              where: null
            },
            start: 1625216074322,
            end: 1625216080464,
            status: 'done',
            errorMsg: null,
            result: 'failed',
            progress: 1,
            cycles: 51788,
            source_total: 51788,
            target_total: 51787,
            both: 51787,
            source_only: 1,
            target_only: 0,
            row_passed: 51787,
            row_failed: 0,
            speed: 7398
          },
          {
            taskId: '60ded447412e0b08d632d9c3-',
            source: {
              connectionId: '60cda022f0e73a0067428c38',
              connectionName: 'jason-mysql-3306',
              table: 'CLAIM',
              sortColumn: 'CLAIM_ID',
              direction: 'DESC',
              columns: null,
              limit: 0,
              skip: 0,
              where: null
            },
            target: {
              connectionId: '60cda022f0e73a0067428c38',
              connectionName: 'jason-mysql-3306',
              table: 'CLAIM_C1',
              sortColumn: 'CLAIM_ID',
              direction: 'DESC',
              columns: null,
              limit: 0,
              skip: 0,
              where: null
            },
            start: 1625216074322,
            end: 1625216080464,
            status: 'done',
            errorMsg: null,
            result: 'failed',
            progress: 1,
            cycles: 51788,
            source_total: 51788,
            target_total: 51787,
            both: 51787,
            source_only: 1,
            target_only: 0,
            row_passed: 51787,
            row_failed: 0,
            speed: 7398
          }
        ],
        spendMilli: 0,
        inspect: {
          id: '60dc424afdbc9e17646325fa',
          name: 'js处理错误 (1)',
          status: 'done',
          mode: 'manual',
          inspectMethod: 'field',
          timing: { intervals: 1440, intervalsUnit: 'minute', start: '1625047619296', end: '1625134019296' },
          limit: { keep: 100, fullMatchKeep: 100, action: 'stop' },
          tasks: [
            {
              taskId: '60ded447412e0b08d632d9c3-',
              fullMatch: true,
              compareFn: null,
              confirmFn: null,
              batchSize: 10000,
              source: {
                connectionId: '60cda022f0e73a0067428c38',
                connectionName: 'jason-mysql-3306',
                table: 'CLAIM',
                sortColumn: 'CLAIM_ID',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              target: {
                connectionId: '60cda022f0e73a0067428c38',
                connectionName: 'jason-mysql-3306',
                table: 'CLAIM_C1',
                sortColumn: 'CLAIM_ID',
                direction: 'DESC',
                columns: null,
                limit: 0,
                skip: 0,
                where: null
              },
              limit: null,
              script: '',
              showAdvancedVerification: false
            }
          ],
          customId: null,
          user_id: '60cd992ff0e73a006742801b'
        },
        start: 1625216074256,
        end: 1625216080507,
        user_id: '60cd992ff0e73a006742801b',
        customId: '',
        ttlTime: '2021-09-30T08:54:34.270Z',
        last_updated: '2021-07-02T08:54:40.512Z',
        createTime: '2021-07-02T08:54:34.271Z',
        difference_number: 1,
        result: 'failed'
      }
    ],
    code: 'ok',
    msg: 'ok'
  },
  '/tm/api/InspectDetails/count': { data: { count: 1 }, code: 'ok', msg: 'ok' },
  '/tm/api/InspectDetails': {
    data: [
      {
        id: '60ded450412e0b08d632da19',
        inspect_id: '60dc424afdbc9e17646325fa',
        taskId: '60ded447412e0b08d632d9c3-',
        type: 'uniqueField',
        source: {
          settled_amount: 0,
          p2: 'test',
          policy_id: 'P000000001',
          last_change: 1562231635,
          claim_amount: 1111111,
          settled_date: 1196956800,
          claim_id: 'CL_000000002',
          claim_type: 'BUIDLING',
          claim_reason: 'VANDALISM',
          claim_date: 1190304000
        },
        target: null,
        inspectResultId: '60ded44a412e0b08d632d9d1',
        message: null,
        user_id: '60cd992ff0e73a006742801b',
        customId: null,
        ttlTime: '2021-09-30T08:54:40.482Z',
        last_updated: '2021-07-02T08:54:40.483Z',
        createTime: '2021-07-02T08:54:40.483Z'
      }
    ],
    code: 'ok',
    msg: 'ok'
  }
}
