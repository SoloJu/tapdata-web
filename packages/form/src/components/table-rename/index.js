import { defineComponent, ref, reactive, set, del, computed, watch } from 'vue-demi'
import { useForm } from '@formily/vue'
import { FormItem } from '../index'
import { observer } from '@formily/reactive-vue'
import EmptyItem from 'web-core/components/EmptyItem'
import VIcon from 'web-core/components/VIcon'
import './style.scss'
import { taskApi } from '@tap/api'
import { observe } from '@formily/reactive'

export const TableRename = observer(
  defineComponent({
    props: ['findParentNode', 'value', 'listStyle', 'disabled'],
    setup(props, { emit, root }) {
      const formRef = useForm()
      const form = formRef.value
      const tableDataRef = ref([])
      const loading = ref(false)
      let nameMap = reactive(props.value ? { ...props.value } : {})
      const config = reactive({
        search: '',
        replaceBefore: '',
        replaceAfter: '',
        prefix: '',
        suffix: '',
        transferCase: ''
      })

      const makeTable = () => {
        if (form.values.$inputs?.length) {
          const { taskId } = root.$store.state.dataflow
          loading.value = true
          taskApi
            .getNodeTableInfo({
              taskId,
              nodeId: form.values.id,
              page: 1,
              pageSize: 10000
            })
            .then(res => {
              tableDataRef.value = res.items.map(item => item.sourceObjectName)
            })
            .finally(() => {
              loading.value = false
            })
        } else {
          tableDataRef.value = []
        }
      }

      makeTable()

      observe(formRef.value.values.$inputs, () => {
        makeTable()
      })

      const updateName = (val, name) => {
        if (val !== name) {
          set(nameMap, name, val)
        } else {
          del(nameMap, name)
        }
      }

      const filterNames = computed(() => {
        const txt = config.search.trim().toLowerCase()
        if (txt) {
          return tableDataRef.value.filter(n => n.toLowerCase().includes(txt))
        }
        return tableDataRef.value
      })

      const doModify = () => {
        const target = filterNames.value
        let flag
        target.forEach(n => {
          let after = n
          after = after.replace(new RegExp(config.replaceBefore, 'g'), config.replaceAfter)
          after = config.prefix + after + config.suffix
          if (config.transferCase) {
            after = after[config.transferCase]()
          }
          if (n !== after) {
            set(nameMap, n, after)
            flag = true
          } else if (n in nameMap) {
            del(nameMap, n)
            flag = true
          }
        })
        flag && emitChange()
      }

      const doReset = () => {
        Object.assign(config, {
          search: '',
          replaceBefore: '',
          replaceAfter: '',
          prefix: '',
          suffix: '',
          transferCase: ''
        })
      }

      const resetNames = () => {
        const keys = Object.keys(nameMap)
        if (keys.length) {
          keys.forEach(key => del(nameMap, key))
          emitChange()
        }
      }

      const emitChange = () => {
        emit('change', { ...nameMap })
      }

      return {
        config,
        filterNames,
        updateName,
        resetNames,
        doModify,
        doReset,
        emitChange,
        nameMap,
        tableData: tableDataRef,
        loading
      }
    },

    render() {
      return (
        <div class="table-rename">
          <FormItem.BaseItem label="搜索表名">
            <ElInput
              v-model={this.config.search}
              disabled={this.disabled}
              prefixIcon="el-icon-search"
              clearable
            ></ElInput>
          </FormItem.BaseItem>

          <div
            v-loading={this.loading}
            class="name-list flex flex-column border rounded-2 overflow-hidden mt-4"
            style={this.listStyle}
          >
            <div class="name-list-header flex flex-shrink-0">
              <div class="name-list-title px-4">原表名</div>
              <div class="name-list-title pl-5 pr-4">新表名</div>
              <div class="name-list-header-extra px-4">
                <ElButton disabled={this.disabled} onClick={this.resetNames} size="mini" type="text">
                  重置
                </ElButton>
              </div>
            </div>
            <div class="name-list-content font-color-light overflow-auto">
              {this.filterNames.length ? (
                this.filterNames.map(name => {
                  return (
                    <div key={name} class="name-list-item flex align-center position-relative">
                      <div class="flex-1 px-4 text-truncate">
                        <span title={name}>{name}</span>
                      </div>
                      <div
                        class={[
                          'flex-1 px-4 text-truncate',
                          {
                            'color-primary': !!this.nameMap[name]
                          }
                        ]}
                      >
                        <input
                          readOnly={this.disabled}
                          class="name-list-item-input"
                          value={this.nameMap[name] || name}
                          onChange={event => {
                            this.updateName(event.target.value, name)
                            this.emitChange()
                          }}
                        />
                      </div>
                      <VIcon size="12" class="name-list-item-center font-color-light">
                        left
                      </VIcon>
                    </div>
                  )
                })
              ) : (
                <EmptyItem></EmptyItem>
              )}
            </div>
          </div>

          <div class="font-color-light mt-4">以下操作仅对已搜索出来的表生效</div>

          <FormItem.BaseItem label="替换">
            <div class="flex">
              <ElInput
                v-model={this.config.replaceBefore}
                disabled={this.disabled}
                prefixIcon="el-icon-search"
                clearable
              />
              <div class="px-4 text-nowrap">改为</div>
              <ElInput
                v-model={this.config.replaceAfter}
                disabled={this.disabled}
                prefixIcon="el-icon-search"
                clearable
              />
            </div>
          </FormItem.BaseItem>

          <FormItem.BaseItem label="前缀">
            <ElInput v-model={this.config.prefix} disabled={this.disabled} clearable />
          </FormItem.BaseItem>

          <FormItem.BaseItem label="后缀">
            <ElInput v-model={this.config.suffix} disabled={this.disabled} clearable />
          </FormItem.BaseItem>

          <FormItem.BaseItem label="大小写">
            <ElSelect v-model={this.config.transferCase} disabled={this.disabled}>
              <ElOption value="" label="不变" />
              <ElOption value="toUpperCase" label="大写" />
              <ElOption value="toLowerCase" label="小写" />
            </ElSelect>
          </FormItem.BaseItem>

          <div class="mt-4">
            <ElButton onClick={this.doModify} disabled={this.disabled} size="small" type="primary">
              修改
            </ElButton>
            <ElButton onClick={this.doReset} disabled={this.disabled} size="small">
              重置
            </ElButton>
          </div>
        </div>
      )
    }
  })
)
