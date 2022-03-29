import { Connections, MetadataInstances } from '@daas/api'
import { action } from '@formily/reactive'

const connections = new Connections()
const metadataApi = new MetadataInstances()

export default {
  data() {
    return {
      scope: {
        /**
         * 统一的异步数据源方法
         * @param service
         * @param fieldName 数据设置指定的字段
         * @param serviceParams 缺省参数，传递给service方法
         * @returns {(function(*=): void)|*}
         */
        useAsyncDataSource: (service, fieldName = 'dataSource', ...serviceParams) => {
          return field => {
            field.loading = true
            service({ field }, ...serviceParams).then(
              action.bound(data => {
                if (fieldName === 'value') {
                  field.setValue(data)
                } else field[fieldName] = data
                field.loading = false
              })
            )
          }
        },

        useRemoteQuery: (service, fieldName = 'dataSource', ...serviceParams) => {
          return field => {
            const handle = keyword => {
              field.loading = true
              service({ field, keyword }, ...serviceParams).then(
                action.bound(data => {
                  if (fieldName === 'value') {
                    field.setValue(data)
                  } else field[fieldName] = data
                  field.loading = false
                })
              )
            }

            if (!field.componentProps.remoteMethod) {
              field.setComponentProps({
                remoteMethod: value => {
                  handle(value)
                }
              })
            }
            handle()
          }
        },

        /**
         * 加载数据库
         * @param field
         * @param databaseType 数据库类型，String或Array
         * @returns {Promise<*[]|*>}
         */
        loadDatabase: async ({ field }, databaseType = field.form.values.databaseType) => {
          try {
            const { isSource, isTarget } = field.form.values
            const filter = {
              where: {
                database_type: databaseType
                  ? {
                      $in: Array.isArray(databaseType) ? databaseType : [databaseType]
                    }
                  : {
                      $nin: ['file', 'dummy', 'gridfs', 'rest api', 'custom_connection']
                    }
              },
              fields: {
                name: 1,
                id: 1,
                database_type: 1,
                connection_type: 1,
                status: 1
              },
              order: ['status DESC', 'name ASC']
            }

            // 过滤连接类型
            if (isSource && isTarget) {
              filter.where.connection_type = 'source_and_target'
            } else if (isSource) {
              filter.where.connection_type = {
                like: 'source',
                options: 'i'
              }
            } else if (isTarget) {
              filter.where.connection_type = {
                like: 'target',
                options: 'i'
              }
            }

            let result = await connections.get({
              filter: JSON.stringify(filter)
            })
            return (result.items || result).map(item => {
              return {
                id: item.id,
                name: item.name,
                label: `${item.name} (${this.$t('connection.status.' + item.status) || item.status})`,
                value: item.id,
                databaseType: item.database_type,
                connectionType: item.connection_type
              }
            })
          } catch (e) {
            console.log('catch', e) // eslint-disable-line
            return []
          }
        },

        /**
         * 加载数据库的详情
         * @param field
         * @param connectionId
         * @returns {Promise<AxiosResponse<any>>}
         */
        loadDatabaseInfo: async ({ field }, connectionId = field.query('connectionId').get('value')) => {
          if (!connectionId) return
          return await connections.customQuery([connectionId], {
            schema: true
          })
        },

        /**
         * 加载数据库的表，只返回表名的集合
         * @param field
         * @param keyword
         * @param connectionId
         * @returns {Promise<*|AxiosResponse<any>>}
         */
        loadDatabaseTable: async ({ field, keyword }, connectionId = field.query('connectionId').get('value')) => {
          if (!connectionId) return
          const filter = {
            where: {
              'source.id': connectionId,
              meta_type: {
                in: ['collection', 'table', 'view'] //,
              },
              is_deleted: false
            },
            fields: {
              original_name: true
            }
          }

          if (keyword) {
            filter.where.original_name = {
              like: keyword,
              options: 'i'
            }
          }

          const data = await metadataApi.get({ filter: JSON.stringify(filter) })
          return data.items.map(item => item.original_name)
        },

        /**
         * 加载表的详情，返回表的数据对象
         * @param field
         * @param connectionId
         * @param tableName
         * @returns {Promise<AxiosResponse<any>>}
         */
        loadTableInfo: async (
          { field },
          connectionId = field.query('connectionId').get('value'),
          tableName = field.query('tableName').get('value')
        ) => {
          if (!connectionId || !tableName) return
          // console.log('loadTableInfo', field, id) // eslint-disable-line
          const params = {
            filter: JSON.stringify({
              where: {
                'source.id': connectionId,
                original_name: tableName,
                is_deleted: false
              }
            })
          }
          return await metadataApi.get(params)
        },

        /**
         * 加载表字段，返回字段名的集合
         * @param field
         * @param connectionId
         * @param tableName
         * @returns {Promise<*>}
         */
        loadTableField: async (
          { field },
          connectionId = field.query('connectionId').get('value'),
          tableName = field.query('tableName').get('value')
        ) => {
          if (!connectionId || !tableName) return
          const params = {
            filter: JSON.stringify({
              where: {
                'source.id': connectionId,
                original_name: tableName,
                is_deleted: false
              },
              fields: {
                fields: true
              }
            })
          }
          const data = await metadataApi.get(params)
          return data.items[0]?.fields.map(item => item.field_name) || []
          // const tableData = await metadataApi.findOne(params)
          // return tableData.fields.map(item => item.field_name)
        },

        // 加载数据集
        loadCollections: async ({ field }, connectionId = field.query('connectionId').get('value')) => {
          if (!connectionId) return
          let result = await connections.get([connectionId])
          const tables = result.data?.schema?.tables || []
          return tables
        },

        /**
         * 对目标端已存在的结构和数据的处理，下拉选项
         * @param field
         */
        loadDropOptions: field => {
          const options = [
            {
              label: this.$t('editor.cell.link.existingSchema.keepSchema'),
              value: 'no_drop'
            },
            {
              label: this.$t('editor.cell.link.existingSchema.keepExistedData'),
              value: 'drop_data'
            }
          ]
          if (field.form.values.database_type === 'mongodb') {
            options.push({
              label: this.$t('editor.cell.link.existingSchema.removeSchema'),
              value: 'drop_schema'
            })
          }
          field.dataSource = options
        },

        /**
         * 数据写入模式
         * @param field
         */
        loadWriteModelOptions: field => {
          const options = [
            {
              label: this.$t('editor.cell.link.writeMode.append'),
              value: 'append' // insert				{source: ''} + {target: ''}  =  {source: '', target: ''}
            },
            {
              label: this.$t('editor.cell.link.writeMode.upsert'),
              value: 'upsert' // OneOne				{source: ''} + {target: ''}  =  {source: '', joinPath: {target: ''}}
            },
            {
              label: this.$t('editor.cell.link.writeMode.update'),
              value: 'update' // OneMany				{source: ''} + {target: ''}  =  {source: '', joinPath: {target: ''}}
            }
          ]
          if (field.form.values.type !== 'table') {
            // SupportEmbedArray
            options.push({
              label: this.$t('editor.cell.link.writeMode.merge_embed'),
              value: 'merge_embed' // ManyOne		{source: ''} + {target: ''}  =  {source: '', joinPath: [{target: ''}]}
            })
          }
          field.dataSource = options
        },

        isSource: field => {
          const id = field.form.values.id
          const allEdges = this.$store.getters['dataflow/allEdges']
          field.value = allEdges.some(({ source }) => source === id)
        },

        isTarget: field => {
          const id = field.form.values.id
          const allEdges = this.$store.getters['dataflow/allEdges']
          field.value = allEdges.some(({ target }) => target === id)
        },

        getSourceNode: (field, fieldName = 'value') => {
          const id = field.form.values.id
          const edges = this.$store.getters['dataflow/allEdges']
          const nodes = this.$store.getters['dataflow/allNodes']
          const sourceArr = edges.filter(({ target }) => target === id)
          field[fieldName] = sourceArr.map(({ source }) => {
            return {
              value: source,
              label: nodes.find(node => node.id === source).name
            }
          })
        },
        getTargetNode: field => {
          const id = field.form.values.id
          const edges = this.$store.getters['dataflow/allEdges']
          const nodes = this.$store.getters['dataflow/allNodes']
          const sourceArr = edges.filter(({ source }) => source === id)
          return sourceArr.map(({ target }) => {
            return {
              value: target,
              label: nodes.find(node => node.id === target).name
            }
          })
        },

        /**
         * 加载源节点的schema
         * @param field
         * @param dataType 数据类型 默认 array（二维数组） | object （key是节点ID，value是字段数组）
         * @returns {Promise<{}>}
         */
        loadSourceNodeField: async ({ field }, dataType = 'array') => {
          const id = field.form.values.id
          const allEdges = this.$store.getters['dataflow/allEdges']
          const sourceArr = allEdges.filter(({ target }) => target === id)
          if (!sourceArr.length) return
          // eslint-disable-next-line no-console
          // console.log('loadSourceNodeField🚗', id, sourceArr, field.form.values)
          let stopWatch
          let fetch
          let result = []
          if (this.transformStatus === 'loading') {
            fetch = new Promise((resolve, reject) => {
              stopWatch = this.$watch('transformStatus', async v => {
                if (v === 'finished') {
                  const result = await Promise.all(sourceArr.map(({ source }) => metadataApi.nodeSchema(source)))
                  resolve(result)
                } else {
                  reject('推演失败')
                }
              })
            })
          } else {
            fetch = Promise.all(sourceArr.map(({ source }) => metadataApi.nodeSchema(source)))
          }

          try {
            result = await fetch
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
          }
          stopWatch?.()

          if (dataType === 'array') {
            return result.reduce((arr, [item]) => {
              if (item.fields) {
                arr.push(item.fields)
              }
              return arr
            }, [])
          }
          const data = {}
          result.forEach(([item], i) => {
            if (item) data[sourceArr[i].source] = item.fields
          })
          return data
        },

        /**
         * 加载节点的字段选项列表（默认是第一个源节点）
         * @param field
         * @param nodeId
         * @returns {Promise<{}|*>}
         */
        loadNodeFieldOptions: async (field, nodeId) => {
          if (!nodeId) {
            const id = field.form.values.id
            const allEdges = this.$store.getters['dataflow/allEdges']
            const edge = allEdges.find(({ target }) => target === id)
            if (!edge) return
            nodeId = edge.source
          }

          let fields
          try {
            const data = await metadataApi.nodeSchema(nodeId)
            fields = data.fields
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('nodeSchema', e)
          }

          return fields
            ? fields.map(item => ({
                label: item.field_name,
                value: item.id
              }))
            : []
        },

        /**
         * 加载节点的字段名列表（默认是第一个源节点）
         * @param field
         * @param nodeId
         * @returns {Promise<{}|*>}
         */
        loadNodeFieldNames: async ({ field }, nodeId, defaultValueType) => {
          if (!nodeId) {
            const id = field.form.values.id
            const allEdges = this.$store.getters['dataflow/allEdges']
            const edge = allEdges.find(({ target }) => target === id)
            if (!edge) return
            nodeId = edge.source
          }

          let fields
          try {
            const data = await metadataApi.nodeSchema(nodeId)
            fields = data?.[0]?.fields || []
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('nodeSchema', e)
          }
          let primaryKeys = []
          let result = []
          for (let i = 0; i < fields.length; i++) {
            const f = fields[i]
            if (f.primary_key_position > 0) {
              primaryKeys.push(f.field_name)
            }
            result.push(f.field_name)
          }
          if (field.value && !field.value.length && defaultValueType === 'primaryKey') {
            field.setInitialValue(primaryKeys)
            field.validate()
          }

          return result
        },
        getMergeItemsFromSourceNode(field, sourceNodes) {
          let mergeList = field.value || []
          let list = []
          sourceNodes.forEach(it => {
            let item = mergeList.find(mit => mit.sourceId === it.value)
            if (!item) {
              list.push({
                tableName: it.label,
                sourceId: it.value,
                mergeType: 'appendWrite',
                tablePath: '',
                joinKeys: [
                  {
                    source: '',
                    target: ''
                  }
                ]
              })
            } else {
              list.push(item)
            }
          })
          field.value = list
        },

        /**
         * 获取源节点的字段，和sourceNode搭配使用
         * @param field
         * @param nodeId
         * @returns {Promise<*[]>}
         */
        loadSourceNodeFieldNames: async ({ field }, nodeId) => {
          const sourceNode = field.query('sourceNode').get('value')

          if (!sourceNode?.length) return []

          nodeId = sourceNode[0].value

          try {
            const data = await metadataApi.nodeSchema(nodeId)
            return (data?.[0]?.fields || []).map(item => item.field_name)
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('nodeSchema', e)
            return []
          }
        }
      }
    }
  }
}
