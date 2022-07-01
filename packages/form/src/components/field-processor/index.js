import { defineComponent, ref, reactive } from 'vue-demi'
import { metadataTransformerApi } from '@tap/api'
import { FormItem } from '../index'
import { useForm } from '@formily/vue'
import EmptyItem from 'web-core/components/EmptyItem'
import OverflowTooltip from 'web-core/components/overflow-tooltip'
import VIcon from 'web-core/components/VIcon'
import fieldMapping_table from 'web-core/assets/images/fieldMapping_table.png'
import './style.scss'

export const FieldRenameProcessor = defineComponent({
  props: [''],
  setup(props, { emit }) {
    const formRef = useForm()
    const form = formRef.value
    const list = ref([])
    const tableList = ref([])

    const config = reactive({
      visible: false,
      loadingNav: true,
      selectTableRow: '',
      currentFieldRow: '',
      fieldCount: '',
      checkAll: false,
      checkedTables: [],
      checkedFields: [],
      position: 0,
      dataFlow: '',
      operationVisible: false,
      newFieldName: '',
      operation: {
        prefix: '',
        suffix: '',
        capitalized: ''
      },
      page: {
        size: 10,
        current: 1,
        total: 0,
        count: 1
      }
    })

    const getTaskId = () => {
      let url = window.location.href
      return url.substring(url.lastIndexOf('/') + 1, url.length)
    }

    const loadData = () => {
      config.loadingNav = true
      let { size, current } = config.page
      let id = getTaskId()
      let where = {
        dataFlowId: id,
        sinkNodeId: ''
      }
      let filter = {
        where: where,
        limit: size || 10,
        skip: (current - 1) * size > 0 ? (current - 1) * size : 0
      }
      metadataTransformerApi
        .get({
          filter: JSON.stringify(filter)
        })
        .then(res => {
          let { total, items } = res
          list.value = items || []
          config.page.total = total
          config.page.count = Math.ceil(total / 10) === 0 ? 1 : Math.ceil(total / 10)
          updateView(config.position)
          emit('change', items)
        })
        .finally(() => (config.loadingNav = false))
    }
    let fieldsMapping = form?.fieldsMapping || []
    const restOp = {
      prefix: '',
      suffix: '',
      capitalized: ''
    }
    const mapping = data => {
      let map = {}
      if (!data || data?.length === 0) return map
      data.forEach(t => {
        if (!map[t.qualifiedName]) {
          map[t.qualifiedName] = {
            qualifiedName: t?.qualifiedName,
            originTableName: t?.sinkObjectName,
            operation: t?.operation,
            fields: t.fields || []
          }
        }
      })
      return map
    }
    const mappingField = data => {
      let map = {}
      if (!data || data?.length === 0) return map
      data.forEach(t => {
        if (!map[t.sourceFieldName]) {
          map[t.sourceFieldName] = {
            sourceFieldName: t?.sourceFieldName,
            targetFieldName: t?.targetFieldName,
            isShow: t.isShow
          }
        }
      })
      return map
    }
    const toList = map => {
      let list = []
      for (let key in map) {
        list.push(map[key])
      }
      return list
    }
    const doUpateField = (row, target, val) => {
      let map = mapping(fieldsMapping)
      let current = config.selectTableRow?.sinkQulifiedName
      let tableName = config.selectTableRow?.sinkObjectName
      if (!map[current]) {
        map[current] = {
          qualifiedName: current,
          originTableName: tableName,
          operation: config.operation,
          fields: []
        }
      }
      let fields = mappingField[map[current]?.fields] || {}
      if (target === 'rest' && fields[row.sourceFieldName]?.sourceFieldName === row.sourceFieldName) {
        delete fields[row.sourceFieldName]
      } else {
        fields[row.sourceFieldName] = {
          sourceFieldName: row.sourceFieldName,
          targetFieldName: target === 'rename' ? val : row.targetFieldName,
          isShow: target === 'del' ? val : row.isShow
        }
      }

      map[current].fields = toList(fields)
      fieldsMapping = toList(map)
      // eslint-disable-next-line
      console.log(fieldsMapping)
    }
    //选择左侧table
    const doCheckAllChange = val => {
      config.checkAll = val
      if (val) {
        config.checkedTables = list.value.map(t => t.sinkQulifiedName)
      } else {
        config.checkedTables = []
      }
    }
    const doCheckedTablesChange = value => {
      let checkedCount = value.length
      config.checkAll = checkedCount === list.value.length
    }
    //选择右侧字段
    const doSelectionField = value => {
      config.checkedFields = value
    }
    const doVisible = (target, val) => {
      config[target] = val
    }
    const updateView = index => {
      config.position = index
      config.selectTableRow = list.value[index]
      tableList.value = config.selectTableRow?.migrateFieldsMapping || []
      config.fieldCount = config.selectTableRow?.sourceFieldCount - config.selectTableRow?.userDeletedNum || 0
    }
    //单个修改字段名
    const doEditName = row => {
      config.newFieldName = row.targetFieldName
      config.currentFieldRow = row
      config.operationVisible = true
    }
    const doEditNameSave = () => {
      //修改名字 生成配置
      doUpateField(config.currentFieldRow, 'rename', config.newFieldName)
      config.operationVisible = false
      config.currentFieldRow = ''
    }
    //批量操作
    const doOperationSave = () => {
      let map = mapping(fieldsMapping)
      if (config.checkedTables?.length > 0) {
        //表级别
        config.checkedTables.forEach(t => {
          map[t] = {
            qualifiedName: t,
            operation: config.operation,
            fields: t === map[t]?.qualifiedName ? map[t]?.fields || [] : []
          }
        })
      } else if (config.checkedFields?.length > 0) {
        //字段级别
        config.checkedFields.forEach(t => {
          let newField = config.operation.prefix + t?.targetFieldName + config.operation.suffix
          if (config.operation.capitalized) {
            newField = newField[config.operation.capitalized]()
          }
          doUpateField(t, 'rename', newField)
        })
      }
      config.checkedTables = []
      config.checkedFields = []
      config.operation = restOp
      doVisible('visible', false)
    }
    //重置
    const doOperationRest = () => {
      let map = mapping(fieldsMapping)
      if (config.checkedTables?.length > 0) {
        //表级别
        config.checkedTables.forEach(t => {
          if (t === map[t]?.qualifiedName) {
            delete map[t]
          }
        })
      } else if (config.checkedFields?.length > 0) {
        //字段级别
        config.checkedFields.forEach(t => {
          doUpateField(t, 'rest', t.targetFieldName)
        })
      }
      fieldsMapping = toList(map)
      // eslint-disable-next-line
      console.log(fieldsMapping)
    }
    //单个删除字段
    const doShowRow = row => {
      for (let i = 0; i < tableList.length; i++) {
        if (tableList[i].sourceFieldName === row.sourceFieldName) {
          tableList[i]['isShow'] = true
        }
      }
      doUpateField(row, 'del', true)
    }
    const doDeleteRow = row => {
      for (let i = 0; i < tableList.length; i++) {
        if (tableList[i].sourceFieldName === row.sourceFieldName) {
          tableList[i]['isShow'] = false
        }
      }
      doUpateField(row, 'del', false)
    }
    const tableRowClassName = ({ row }) => {
      if (!row.isShow) {
        return 'row-deleted'
      }
    }
    //右侧表格slot渲染
    const renderNode = ({ row }) => {
      return (
        <div class="cursor-pointer" onClick={() => doEditName(row)}>
          <span class="col-new-field-name inline-block ellipsis align-middle  mr-4 ">{row.targetFieldName}</span>
          <VIcon>edit</VIcon>
        </div>
      )
    }
    const renderOpNode = ({ row }) => {
      return row.isShow ? (
        <span class="text-primary cursor-pointer" onClick={() => doDeleteRow(row)}>
          屏蔽
        </span>
      ) : (
        <span class="text-primary cursor-pointer" onClick={() => doShowRow(row)}>
          恢复
        </span>
      )
    }
    loadData()
    return {
      list,
      tableList,
      config,
      loadData,
      doVisible,
      doEditNameSave,
      doOperationSave,
      doCheckAllChange,
      doCheckedTablesChange,
      doSelectionField,
      tableRowClassName,
      renderNode,
      renderOpNode,
      updateView,
      doOperationRest
    }
  },
  render() {
    return (
      <div class="processor-field-mapping flex flex-column">
        <div class="task-form-body" style={this.listStyle}>
          <div class="task-form-left flex flex-column">
            <div class="flex mb-2 ml-2 mr-2">
              <div class="flex">
                <ElInput
                  size="mini"
                  placeholder="请输入表名"
                  suffix-icon="el-icon-search"
                  clearable
                  onInput={this.loadData}
                ></ElInput>
              </div>
            </div>
            <div class="bg-main flex justify-content-between line-height processor-ml-10">
              <span>
                <el-checkbox v-model={this.config.checkAll} onChange={this.doCheckAllChange}></el-checkbox>
                <span class="table-name ml-2">表名</span>
              </span>
            </div>
            <div class="task-form-left__ul flex flex-column" v-loading={this.config.loadingNav}>
              {this.list.length > 0 ? (
                <ul>
                  <el-checkbox-group v-model={this.config.checkedTables} onChange={this.doCheckedTablesChange}>
                    {this.list.map((item, index) => (
                      <li key={index} class={[this.config.position === index ? 'active' : '']}>
                        <el-checkbox label={item.sinkQulifiedName}>
                          <br />
                        </el-checkbox>
                        <div class="task-form__img" onClick={() => this.updateView(index)}>
                          <img src={fieldMapping_table} alt="" />
                        </div>
                        <div class="task-form-text-box" onClick={() => this.updateView(index)}>
                          <OverflowTooltip
                            class="w-100 text-truncate source"
                            text={item.sourceObjectName}
                            placement="right"
                            open-delay={400}
                          />
                          <OverflowTooltip
                            class="w-100 text-truncate target"
                            text={item.sinkObjectName}
                            placement="right"
                            open-delay={400}
                          />
                          <div class="select" onClick={() => this.updateView(index)}>
                            <span>
                              <span>已选中 </span>
                              {item.sourceFieldCount - item.userDeletedNum} /{item.sourceFieldCount}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </el-checkbox-group>
                </ul>
              ) : (
                <div class="task-form-left__ul flex flex-column align-items-center">
                  <EmptyItem></EmptyItem>
                </div>
              )}
            </div>
            <ElPagination
              small
              class="flex mt-3 din-font"
              layout="total, prev, slot, next"
              current-page={this.config.page.current}
              total={this.config.page.total}
              pager-count={5}
              current-change={this.loadData}
            >
              <div class="text-center">
                <span class="page__current" style="min-width: 22px">
                  {this.config.page.current}
                </span>
                <span class="icon-color" style="min-width: 22px">
                  /
                </span>
                <span class="icon-color" style="min-width: 22px">
                  {this.config.page.count}
                </span>
              </div>
            </ElPagination>
          </div>
          <div class="main">
            <div class="flex ml-2 text-start justify-content-between" style="margin-bottom: 8px">
              <div class="flex">
                <ElInput size="mini" placeholder="请输入字段名" suffix-icon="el-icon-search"></ElInput>
                <ElButton plain class="btn-refresh ml-2">
                  <VIcon>refresh</VIcon>
                </ElButton>
              </div>
              <div class="item ml-2">
                <ElButton
                  type="text"
                  class="btn-operation"
                  disabled={this.config.checkedTables.length === 0 && this.config.checkedFields.length === 0}
                  onClick={() => this.doVisible('visible', true)}
                >
                  批量操作
                </ElButton>
                <ElButton type="text" class="btn-rest" onClick={this.doOperationRest}>
                  重置
                </ElButton>
              </div>
            </div>
            <ElTable
              class="field-mapping-table table-border"
              height="100%"
              data={this.tableList}
              row-class-name={this.tableRowClassName}
              onSelection-change={this.doSelectionField}
            >
              <ElTableColumn type="selection" width="55"></ElTableColumn>
              <ElTableColumn show-overflow-tooltip label="字段名" prop="sourceFieldName"></ElTableColumn>
              <ElTableColumn
                show-overflow-tooltip
                label="新字段名"
                prop="targetFieldName"
                scopedSlots={{
                  default: this.renderNode
                }}
              ></ElTableColumn>
              <ElTableColumn
                show-overflow-tooltip
                label="操作"
                prop="isShow"
                width={'60px'}
                scopedSlots={{
                  default: this.renderOpNode
                }}
              ></ElTableColumn>
              <div class="field-mapping-table__empty" slot="empty">
                <EmptyItem></EmptyItem>
              </div>
            </ElTable>
          </div>
        </div>
        <ElDialog
          title="修改字段名"
          width={'30%'}
          visible={this.config.operationVisible}
          append-to-body
          before-close={() => this.doVisible('operationVisible', false)}
        >
          <FormItem.BaseItem>
            <ElInput v-model={this.config.newFieldName} clearable />
          </FormItem.BaseItem>
          <span slot="footer" className="dialog-footer">
            <el-button onClick={() => this.doVisible('operationVisible', false)}>取 消</el-button>
            <el-button type="primary" onClick={() => this.doEditNameSave()}>
              确 定
            </el-button>
          </span>
        </ElDialog>
        <ElDialog
          title="批量操作"
          visible={this.config.visible}
          append-to-body
          before-close={() => this.doVisible('visible', false)}
        >
          <div>
            <FormItem.BaseItem
              label="前缀"
              tooltip="以英文字母开头，仅支持英文、数字、下划线、点、中划线，限0~50字符，前缀不允许以 system 开头"
            >
              <ElInput v-model={this.config.operation.prefix} clearable />
            </FormItem.BaseItem>
            <FormItem.BaseItem
              label="后缀"
              tooltip="以英文字母、下划线开头，仅支持英文、数字、下划线、点、中划线，限0~50字符"
            >
              <ElInput v-model={this.config.operation.suffix} clearable />
            </FormItem.BaseItem>

            <FormItem.BaseItem label="大小写">
              <ElSelect v-model={this.config.operation.capitalized}>
                <ElOption value="" label="不变" />
                <ElOption value="toUpperCase" label="大写" />
                <ElOption value="toLowerCase" label="小写" />
              </ElSelect>
            </FormItem.BaseItem>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button onClick={() => this.doVisible('visible', false)}>取 消</el-button>
            <el-button type="primary" onClick={() => this.doOperationSave()}>
              确 定
            </el-button>
          </span>
        </ElDialog>
      </div>
    )
  }
})
