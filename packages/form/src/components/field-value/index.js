import { connect, mapProps, useForm } from '@formily/vue'
import { observer } from '@formily/reactive-vue'
import { defineComponent } from 'vue-demi'
import VIcon from 'web-core/components/VIcon'
import '../field-rename/index.scss'
import { convertSchemaToTreeData } from '../field-rename/util'

export const FieldValue = connect(
  observer(
    defineComponent({
      props: ['loading', 'options'],

      setup() {
        const formRef = useForm()
        const form = formRef.value
        return {
          databaseType: form.values.databaseType,
          scripts: form.values.scripts,
          form
        }
      },

      data() {
        return {
          nodeKey: '',
          originalFields: [],
          fields: [],
          checkAll: false,
          scriptDialog: {
            open: false,
            script: '//Enter you code at here',
            fieldName: '',
            fn: function () {}
          },
          current: '',
          /*字段处理器支持功能类型*/
          SCRIPT_TPL: {
            tableName: '',
            field: '',
            scriptType: 'js',
            script: '',
            id: ''
          }
        }
      },
      watch: {
        scripts: {
          deep: true,
          handler(v) {
            this.form.setValuesIn('scripts', v)
            this.$emit('change', v)
            console.log('scripts', v) // eslint-disable-line
          }
        }
      },

      render() {
        // eslint-disable-next-line no-console
        console.log('🚗 FieldProcessor', this.loading, this.options)
        let fields = this.options || []
        fields = convertSchemaToTreeData(fields) || []
        fields = this.checkOps(fields) || []
        this.fields = fields
        this.originalFields = JSON.parse(JSON.stringify(fields))
        return (
          <div class="field-processors-tree-warp bg-body pt-2 pb-5" v-loading={this.loading}>
            <div class="field-processor-operation flex">
              <ElCheckbox class="check-all" v-model={this.checkAll} onChange={() => this.handleCheckAllChange()} />
              <span class="flex-1 text inline-block">字段名称</span>
              <span class="flex-1 text inline-block">字段赋值</span>
              <span class="field-ops inline-block ml-10">
                <VIcon class="clickable ml-5" size="12" onClick={() => this.handleAllReset()}>
                  revoke
                </VIcon>
              </span>
            </div>
            <div className="field-processors-tree-warp">
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
                      <span class="field-name inline-block">
                        {data.field_name}
                        {data.primary_key_position > 0 ? (
                          <VIcon size="12" class="text-warning ml-1">
                            key
                          </VIcon>
                        ) : (
                          ''
                        )}
                      </span>
                      <span class="field-name inline-block">{data.script}</span>
                      <span class="e-ops">
                        <ElButton type="text" class="ml-5" onClick={() => this.handleScript(node, data)}>
                          <VIcon>js</VIcon>
                        </ElButton>
                        <ElButton
                          type="text"
                          class="ml-5"
                          onClick={() => this.handleReset(node, data)}
                          disabled={!this.isScript(data.id)}
                        >
                          <VIcon size="12">revoke</VIcon>
                        </ElButton>
                      </span>
                    </span>
                  )
                }}
              />
            </div>
            <ElDialog
              title={'字段赋值(' + this.scriptDialog.tableName + '[' + this.scriptDialog.fieldName + '])'}
              visible={this.scriptDialog.open}
              append-to-body
              custom-class="scriptDialog"
              close-on-click-modal={false}
            >
              <ElForm>
                <ElFormItem>
                  <ElInput
                    placeholder="$t('editor.cell.processor.field.form.expression')"
                    v-model={this.scriptDialog.script}
                    size="mini"
                  >
                    <template slot="prepend">var result = </template>
                  </ElInput>
                </ElFormItem>
              </ElForm>
              <div class="example">
                <div>示例:</div>
                <div>var result = "a" + "b" // 字符串拼接, result的结果为 "ab"</div>
                <div>var result = 1 + 2 // 数字计算, result 的结果为 3</div>
                <div>var result = fn("1") // 调用自定义函数或内置函数, result的结果为 fn 函数的返回值</div>
                <div>
                  var result = record.isTrue ? true : false // 三元表达式,
                  result的值根据判断表达式（record.isTrue）的结果为 true 或 false
                </div>
              </div>
              <div slot="footer" class="dialog-footer">
                <ElButton size="mini" onClick={() => (this.scriptDialog.open = false)}>
                  取消
                </ElButton>
                <ElButton type="primary" size="mini" onClick={() => this.scriptDialog.fn()}>
                  确认
                </ElButton>
              </div>
            </ElDialog>
          </div>
        )
      },
      methods: {
        isScript(id) {
          let scripts = this.scripts.filter(v => v.id === id)
          return scripts.length > 0 ? scripts[0].script : ''
        },
        /*rename
         * @node 当前tree
         * @data 当前数据*/
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
        checkOps(fields) {
          if (this.scripts?.length > 0 && fields?.length > 0) {
            for (let i = 0; i < this.scripts.length; i++) {
              if (this.scripts[i]?.scriptType === 'js') {
                let targetIndex = fields.findIndex(n => n.id === this.scripts[i].id)
                if (targetIndex === -1) return
                fields[targetIndex].script = this.scripts[i].script
              }
            }
          }
          return fields
        },
        getParentFieldName(node) {
          let fieldName = node.data && node.data.field_name ? node.data.field_name : ''
          if (node.level > 1 && node.parent && node.parent.data) {
            let parentFieldName = this.getParentFieldName(node.parent)
            if (parentFieldName) fieldName = parentFieldName + '.' + fieldName
          }
          return fieldName
        },
        /**
         *
         * @param node
         * @param data
         */
        handleScript(node, data) {
          let self = this

          let fieldName = (self.scriptDialog.fieldName = self.getParentFieldName(node))
          let tableName = (self.scriptDialog.tableName = data.table_name)
          let id = data.id

          let idx = self.scripts.findIndex(script => script.id === id)
          let script
          if (idx !== -1) {
            script = self.scripts[idx]
          } else {
            script = JSON.parse(JSON.stringify(this.SCRIPT_TPL))
            Object.assign(script, {
              field: fieldName,
              type: data.type,
              primary_key_position: data.primary_key_position,
              color: data.color,
              label: data.field_name,
              field_name: data.field_name,
              tableName,
              id
            })
          }
          self.scriptDialog.script = script.script
          self.scriptDialog.open = true
          self.$nextTick(() => {
            self.scriptDialog.open = true
          })

          self.scriptDialog.fn = function () {
            script.script = self.scriptDialog.script

            if (idx === -1) {
              self.scripts.push(script)
            }

            console.log('fieldProcessor.handleScript', node, data, script, self.scripts) //eslint-disable-line
            self.$nextTick(() => {
              self.scriptDialog.open = false
            })
            self.scriptDialog.fn = function () {}
            self.scriptDialog.script = ''
          }
        },
        handleReset(node, data) {
          if (!this.scripts || this.scripts?.length < 0) return
          let self = this
          let fn = function (node, data) {
            for (let i = 0; i < node.childNodes.length; i++) {
              let childNode = node.childNodes[i]
              fn(childNode, childNode.data)
            }
            for (let i = 0; i < self.scripts.length; i++) {
              if (self.scripts[i].id === data.id) {
                self.scripts.splice(i, 1)
                i--
              }
            }
            self.$nextTick(() => {
              self.isScript(data.id) //热更新
            })
          }
          fn(node, data)
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

export default FieldValue
