import { defineComponent, reactive, ref } from '@vue/composition-api'
import { FilterBar, Drawer } from '@tap/component'
import Classification from './Classification.vue'
import DrawerContent from '@/views/dataDiscovery/PreviewDrawer'
import ObjectTable from '@/views/dataDiscovery/ObjectTable'
import './catalogue.scss'

export default defineComponent({
  props: [''],
  setup(props, { refs }) {
    const list = ref([])
    const data = reactive({
      isShowDetails: false,
      isShowSourceDrawer: false, //资源绑定
      searchParams: '',
      desc: '',
      page: {
        size: 10,
        current: 1,
        total: 0,
        count: 1
      },
      filterItems: [
        {
          label: '资源类型',
          key: 'type',
          type: 'select-inner',
          items: [],
          selectedWidth: '200px'
        },
        {
          placeholder: '连接对象名',
          key: 'connectionName',
          type: 'input'
        }
      ]
    })
    const loadData = () => {
      list.value = [
        {
          id: 78,
          name: '测试',
          type: '123',
          desc: '234'
        }
      ]
      data.page.total = 1
    }
    const handlePreview = row => {
      data.isShowDetails = true
      refs.drawerContent.loadData(row)
    }
    const closeDrawer = val => {
      data.isShowDetails = val
    }
    const handleSourceDrawer = () => {
      data.isShowSourceDrawer = true
      refs.objectTable.loadData()
    }
    const closeSourceDrawer = val => {
      data.isShowSourceDrawer = val
    }
    const renderNode = ({ row }) => {
      return (
        <div class="cursor-pointer">
          <span
            class="col-new-field-name inline-block ellipsis align-middle  mr-4 "
            onClick={event => {
              event.stopPropagation()
              handlePreview(row)
            }}
          >
            {row.name}
          </span>
        </div>
      )
    }
    loadData()
    return {
      list,
      data,
      closeDrawer,
      closeSourceDrawer,
      handleSourceDrawer,
      renderNode,
      loadData
    }
  },
  render() {
    return (
      <div class="classify-wrap">
        <div class="catalogue-page-main-box flex">
          <div class="page-left">
            <Classification v-model={this.data.searchParams} ref="classify"></Classification>
          </div>
          <div class="page-right">
            <div class="flex flex-row align-items-center mb-2">
              <span class="ml-2 mr-2">目录</span>
              <span class="mr-2"> FDM </span>
              <span>
                <el-input class="border-0" size="mini" v-model={this.data.desc} clearable></el-input>
              </span>
            </div>
            <div class="catalogue-page-topbar">
              <div class="catalogue-page-search-bar">
                <FilterBar items={this.data.filterItems} {...{ on: { fetch: this.loadData } }}></FilterBar>
              </div>
              <div class="catalogue-page-operation-bar">
                <el-button type="primary" size="mini">
                  <span
                    onClick={() => {
                      this.handleSourceDrawer()
                    }}
                  >
                    资源绑定
                  </span>
                </el-button>
              </div>
            </div>
            <el-table data={this.list}>
              <el-table-column
                label="名称"
                prop="name"
                scopedSlots={{
                  default: this.renderNode
                }}
              ></el-table-column>
              <el-table-column label="类型" prop="type"></el-table-column>
              <el-table-column label="描述" prop="desc"></el-table-column>
            </el-table>
            <el-pagination
              background
              className="table-page-pagination mt-3"
              layout="->,total, sizes,  prev, pager, next, jumper"
              on={{ ['update:current-page']: this.loadData }}
              current-page={this.data.page.current}
              total={this.data.page.total}
              onCurrent-change={this.loadData}
            ></el-pagination>
            <Drawer
              class="object-drawer-wrap"
              width="'1200px'"
              visible={this.data.isShowDetails}
              on={{ ['update:visible']: this.closeDrawer }}
            >
              <DrawerContent ref={'drawerContent'}></DrawerContent>
            </Drawer>
            <el-drawer
              class="object-drawer-wrap"
              size="50%"
              title="资源绑定"
              visible={this.data.isShowSourceDrawer}
              on={{ ['update:visible']: this.closeSourceDrawer }}
            >
              <ObjectTable ref={'objectTable'}></ObjectTable>
            </el-drawer>
          </div>
        </div>
      </div>
    )
  }
})
