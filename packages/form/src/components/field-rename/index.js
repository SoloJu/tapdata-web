import { connect, mapProps, useForm } from '@formily/vue'
import { observer } from '@formily/reactive-vue'
import { defineComponent } from 'vue-demi'
import VIcon from 'web-core/components/VIcon'
import { handleOperation, convertSchemaToTreeData } from './util'
import './fieldProessor.scss'

export const FieldRename = connect(
  observer(
    defineComponent({
      props: ['loading', 'options'],

      setup() {
        const formRef = useForm()
        const form = formRef.value
        return {
          databaseType: form.values.databaseType,
          operations: form.values.operations,
          form
        }
      },

      data() {
        return {
          nodeKey: '',
          originalFields: [],
          checkAll: false,
          /*字段处理器支持功能类型*/
          RENAME_OPS_TPL: {
            id: '',
            op: 'RENAME',
            field: '',
            operand: ''
          }
        }
      },
      watch: {
        operations: {
          deep: true,
          handler(v) {
            this.$emit('change', v)
            console.log('operations', v) // eslint-disable-line
          }
        }
      },
      render() {
        // eslint-disable-next-line no-console
        console.log('🚗 FieldProcessor', this.loading, this.options)
        let fields = this.options?.[0] || []
        this.originalFields = JSON.parse(JSON.stringify(fields))
        fields = convertSchemaToTreeData(fields) //将模型转换成tree
        //查找是否有被删除的字段且operation有操作
        if (this.operations?.length > 0) {
          let temporary = handleOperation(fields, this.operations)
          temporary.map(item => {
            let targetIndex = fields.findIndex(n => n.id === item.id)
            if (targetIndex === -1 && item.op !== 'CREATE') {
              // data.operations.splice(index,1); //删除找不到id的数据
              return
            }
            if (item.op === 'RENAME') {
              const name = fields[targetIndex].field_name
              let newName = name.split('.')
              newName[newName.length - 1] = item.operand
              const newNameStr = newName.join('.')
              fields[targetIndex].field_name = newNameStr

              // change children field name
              fields.forEach(field => {
                if (field.field_name.startsWith(name + '.')) {
                  field.field_name = newNameStr + field.field_name.substring(name.length)
                }
              })
            }
          })
        }
        // eslint-disable-next-line
        console.log('FieldProcess.mergeOutputSchema', fields)
        return (
          <div class="field-processor-tree-warp bg-body pt-2 pb-5">
            <div class="field-processor-operation flex">
              <ElCheckbox class="check-all mr-4" v-model={this.checkAll} onChange={() => this.handleCheckAllChange()} />
              <span class="field-name inline-block">源字段名</span>
              <span class="field-name inline-block">目标字段名</span>
              <span class="field-ops inline-block">
                <VIcon class="clickable ml-5" small onClick={() => this.handleAllToUpperCase()}>
                  toUpperCase
                </VIcon>
                <VIcon class="clickable ml-5" small onClick={() => this.handleAllToLowerCase()}>
                  toLowerCase
                </VIcon>
                <VIcon class="clickable ml-5" small onClick={() => this.handleAllReset()}>
                  revoke
                </VIcon>
              </span>
            </div>
            <div className="field-processor-tree-warp">
              <ElTree
                ref="tree"
                data={fields}
                node-key="id"
                default-expand-all={true}
                show-checkbox={true}
                expand-on-click-node={false}
                class="field-processor-tree"
                scopedSlots={{
                  default: ({ node, data }) => (
                    <span
                      class="tree-node flex flex-1 justify-content-center align-items flex-row"
                      slot-scope="{ node, data }"
                    >
                      <span class="field-name inline-block">{data.label}</span>
                      <span class={['tree-field-input-wrap', 'item', 'inline-block', 'e-label']}>
                        <ElInput
                          class="tree-field-input"
                          v-model={data.field_name}
                          onChange={() => this.handleRename(node, data)}
                        />
                        <VIcon class="title-input-icon" size="14">
                          edit-outline
                        </VIcon>
                      </span>
                      <span class="e-ops">
                        <ElButton
                          type="text"
                          class="ml-5"
                          disabled={!this.isRename(data.id)}
                          onClick={() => this.handleReset(node, data)}
                        >
                          <VIcon>revoke</VIcon>
                        </ElButton>
                      </span>
                    </span>
                  )
                }}
              />
            </div>
          </div>
        )
      },
      methods: {
        isRename(id) {
          let ops = this.operations.filter(v => v.id === id && v.op === 'RENAME')
          return ops && ops.length > 0
        },
        /*rename
         * @node 当前tree
         * @data 当前数据*/
        handleRename(node, data) {
          console.log('fieldProcessor.handleRename', node, data) //eslint-disable-line
          let nativeData = this.getNativeData(data.id) //查找初始schema
          //该字段若是已被删除 不可再重命名
          if (!data || data.field_name === '') {
            data.field_name = nativeData.field_name
            this.$message.error(this.$t('message.exists_name'))
            return
          }
          let removes = this.operations.filter(v => v.id === data.id && v.op === 'REMOVE')
          if (removes.length > 0) {
            data.field_name = nativeData.field_name
            return
          }
          let existsName = this.handleExistsName(node, data)
          if (existsName) {
            data.field_name = nativeData.field_name
            return
          }
          let createOps = this.operations.filter(v => v.id === data.id && v.op === 'CREATE')
          if (createOps && createOps.length > 0) {
            let op = createOps[0]
            let level = op.level
            let fieldNames = (op.field || op.field_name).split('.')
            fieldNames[level] = data.field_name
            op.field = fieldNames.join('.')
            //同步对js 改名操作
            if (this.scripts && this.scripts.length && this.scripts.length > 0) {
              for (let i = 0; i < this.scripts.length; i++) {
                if (op.id === this.scripts[i].id) {
                  this.scripts[i].field = op.field
                  this.scripts[i].label = op.field
                }
              }
            }
          } else {
            //eslint-disable-next-line
            console.log(
              'fieldProcessor.handlerRename(node,data,nativeData,operations',
              node,
              data,
              nativeData,
              this.operations
            )
            let ops = this.operations.filter(v => v.id === data.id && v.op === 'RENAME')
            let op
            if (ops.length === 0) {
              op = Object.assign(JSON.parse(JSON.stringify(this.RENAME_OPS_TPL)), {
                id: data.id,
                field: nativeData.original_field_name,
                operand: data.field_name,
                table_name: data.table_name,
                type: data.type,
                primary_key_position: data.primary_key_position,
                color: data.color,
                label: data.field_name,
                field_name: data.field_name
              })
              this.operations.push(op)
            } else {
              op = ops[0]
              op.operand = data.field_name
              op.label = data.field_name
              op.field_name = data.field_name
            }
            //删除 相同字段名称
            if (this.scripts && this.operations.length && this.operations.length > 0) {
              for (let i = 0; i < this.operations.length; i++) {
                let originalFieldName = this.operations[i].field
                if (originalFieldName.indexOf('.') >= 0) {
                  originalFieldName = originalFieldName.split('.')
                  originalFieldName = originalFieldName[originalFieldName.length - 1]
                }
                if (originalFieldName === this.operations[i].operand && this.operations[i].op === 'RENAME') {
                  this.operations.splice(i, 1)
                  i--
                }
              }
            }
          }
          console.log(this.operations) //eslint-disable-line
        },
        handleExistsName(node, data) {
          // 改名前查找同级中是否重名，若有则return且还原改动并提示
          let exist = false
          if (node && node.parent && node.parent.childNodes) {
            let parentNode = node.parent.childNodes.filter(v => data.field_name === v.data.field_name)
            if (parentNode && parentNode.length === 2) {
              this.$message.error(data.field_name + this.$t('message.exists_name'))
              exist = true
            }
          }
          return exist
        },
        getNativeData(id) {
          let fields = this.originalFields || []
          let field = null
          let fn = function (fields) {
            if (!fields) {
              return
            }
            for (let i = 0; i < fields.length; i++) {
              let f = fields[i]
              if (f.id === id) {
                field = f
                break
              } else if (f.children) {
                fn(f.children)
              }
            }
          }
          fn(fields)
          return field
        },
        handleReset(node, data) {
          console.log('fieldProcessor.handleReset', node, data) //eslint-disable-line
          let dataLabel = JSON.parse(JSON.stringify(data.field_name))
          let self = this
          let fn = function (node, data) {
            let nativeData = self.getNativeData(data.id)
            for (let i = 0; i < node.childNodes.length; i++) {
              let childNode = node.childNodes[i]
              fn(childNode, childNode.data)
            }
            for (let i = 0; i < self.operations.length; i++) {
              if (self.operations[i].id === data.id) {
                let ops = self.operations[i]
                if (ops.op === 'RENAME') {
                  let existsName = self.handleExistsName(node, data)
                  if (existsName) {
                    return
                  }
                  if (nativeData) node.data.field_name = nativeData.original_field_name
                  self.operations.splice(i, 1)
                  i--
                  continue
                }
              }
            }
          }
          fn(node, data)
          let existsName = this.handleExistsName(node, data)
          if (existsName) {
            data.field_name = dataLabel
          }
        },
        getParentFieldName(node) {
          let fieldName = node.data && node.data.field_name ? node.data.field_name : ''
          if (node.level > 1 && node.parent && node.parent.data) {
            let parentFieldName = this.getParentFieldName(node.parent)
            if (parentFieldName) fieldName = parentFieldName + '.' + fieldName
          }
          return fieldName
        },
        handleAllToUpperCase() {
          let ids = this.$refs.tree.getCheckedNodes()
          if (ids && ids.length > 0) {
            ids.map(id => {
              let node = this.$refs.tree.getNode(id)
              node.data.field_name = node.data.field_name.toUpperCase()
              this.handleRename(node, node.data)
            })
          }
        },
        handleAllToLowerCase() {
          let ids = this.$refs.tree.getCheckedNodes()
          if (ids && ids.length > 0) {
            ids.map(id => {
              let node = this.$refs.tree.getNode(id)
              node.data.field_name = node.data.field_name.toLowerCase()
              this.handleRename(node, node.data)
            })
          }
        },
        handleAllReset() {
          let ids = this.$refs.tree.getCheckedNodes(false, true)
          if (ids && ids.length > 0) {
            ids.map(id => {
              let node = this.$refs.tree.getNode(id)
              if (node) {
                this.handleReset(node, node.data)
              }
            })
          }
        },
        handleCheckAllChange() {
          if (this.checkAll) {
            this.$nextTick(() => {
              this.$refs.tree.setCheckedNodes(this.fields)
            })
          } else {
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys([])
            })
          }
        }
      }
    })
  ),
  mapProps({ dataSource: 'options', loading: true })
)

export default FieldRename
