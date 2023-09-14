import i18n from '@/i18n'
import Vue from 'vue'
import {
  Alert,
  Card,
  Container,
  Header,
  Main,
  Aside,
  Menu,
  MenuItem,
  Button,
  Drawer,
  Form,
  FormItem,
  Checkbox,
  Image,
  Radio,
  RadioGroup,
  RadioButton,
  Select,
  Option,
  OptionGroup,
  Input,
  InputNumber,
  Tooltip,
  Link,
  Table,
  TableColumn,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  Message as _Message,
  MessageBox,
  Loading,
  Dialog,
  Row,
  Col,
  DatePicker,
  TimePicker,
  Progress,
  Footer,
  Switch,
  Popover,
  Tabs,
  TabPane,
  Transfer,
  Steps,
  Step,
  Badge,
  Cascader,
  ButtonGroup,
  Upload,
  Autocomplete,
  Collapse,
  CollapseItem,
  Notification,
  Divider,
  Tree,
  CheckboxGroup,
  Skeleton,
  SkeletonItem,
  Submenu,
  InfiniteScroll,
  Empty,
  Slider,
  Timeline,
  TimelineItem,
} from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import 'element-ui/lib/theme-chalk/index.css'

const showMessage = Symbol('showMessage')

class MessageConstructor {
  constructor() {
    const types = ['success', 'warning', 'info', 'error']
    types.forEach(type => {
      this[type] = options => this[showMessage](type, options)
    })
  }

  [showMessage](type, options) {
    const domList = document.getElementsByClassName('el-message')

    if (!domList.length) {
      return _Message[type](options)
    } else {
      let canShow = true
      const message = typeof options === 'string' ? options : options.message
      for (const dom of domList) {
        if (message === dom.innerText) {
          console.log(i18n.t('dfs_plugins_element_chongfuxiaoxi'), dom) // eslint-disable-line
          canShow = false
          break
        }
      }
      if (canShow) {
        return _Message[type](options)
      }
    }
  }
}

export const Message = new MessageConstructor()

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.prototype.$message = Message

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert

Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
window.loading = Loading.service

Vue.use(Loading.directive)

Vue.use(Card)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Drawer)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Checkbox)
Vue.use(Image)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Tooltip)
Vue.use(Link)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(TableColumn)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Pagination)
Vue.use(Tag)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Dialog)
Vue.use(Row)
Vue.use(Col)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Progress)
Vue.use(Footer)
Vue.use(Switch)
Vue.use(Popover)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Transfer)
Vue.use(Badge)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(ButtonGroup)
Vue.use(Upload)
Vue.use(Autocomplete)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Divider)
Vue.use(Tree)
Vue.use(CheckboxGroup)
Vue.use(Skeleton)
Vue.use(SkeletonItem)
Vue.use(Submenu)
Vue.use(InfiniteScroll)
Vue.use(Alert)
Vue.use(Empty)
Vue.use(Slider)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.component(CollapseTransition.name, CollapseTransition)
