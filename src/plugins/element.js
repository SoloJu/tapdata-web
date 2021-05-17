// 按需引入element-ui减少项目体积
import Vue from 'vue'

import {
  Card,
  Image,
  Tabs,
  TabPane,
  Popover,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxGroup,
  CheckboxButton,
  Dialog,
  Switch,
  Loading,
  MessageBox,
  Message,
  Menu,
  Submenu,
  MenuItem,
  Form,
  FormItem,
  Link,
  Input,
  Button,
  ButtonGroup,
  Select,
  Table,
  TableColumn,
  Option,
  Row,
  Col,
  Pagination,
  DatePicker,
  TimePicker,
  Drawer,
  Container,
  Aside,
  Main,
  Header,
  Footer,
  Tree,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Tag,
  Tooltip,
  Upload,
  Autocomplete,
  InputNumber,
  Notification,
  Cascader,
  Alert,
  Steps,
  Step,
  Transfer,
  Badge,
  Progress,
  Collapse,
  CollapseItem
} from 'element-ui'
//重写ElementUI Select组件多选时的触发函数，去掉去重的处理
Select.methods.handleOptionSelect = function (option, byClick) {
  var _this12 = this

  if (_this12.multiple) {
    var value = (_this12.value || []).slice()
    var optionIndex = _this12.getValueIndex(value, option.value)
    if (optionIndex > -1 && byClick) {
      value.splice(optionIndex, 1)
    } else if (
      _this12.multipleLimit <= 0 ||
      value.length < _this12.multipleLimit
    ) {
      value.push(option.value)
    }
    _this12.$emit('input', value)
    _this12.emitChange(value)
    if (option.created) {
      _this12.query = ''
      _this12.handleQueryChange('')
      _this12.inputLength = 20
    }
    if (_this12.filterable) _this12.$refs.input.focus()
  } else {
    _this12.$emit('input', option.value)
    _this12.emitChange(option.value)
    _this12.visible = false
  }
  _this12.isSilentBlur = byClick
  _this12.setSoftFocus()
  if (_this12.visible) return
  _this12.$nextTick(function () {
    _this12.scrollToOption(option)
  })
}

Vue.component(Card.name, Card)
Vue.component(InputNumber.name, InputNumber)
Vue.component(Autocomplete.name, Autocomplete)
Vue.component(Upload.name, Upload)
Vue.component(Image.name, Image)
Vue.component(Tabs.name, Tabs)
Vue.component(TabPane.name, TabPane)
Vue.component(Popover.name, Popover)
Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(RadioButton.name, RadioButton)
Vue.component(Checkbox.name, Checkbox)
Vue.component(CheckboxGroup.name, CheckboxGroup)
Vue.component(CheckboxButton.name, CheckboxButton)
Vue.component(Dialog.name, Dialog)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Button.name, Button)
Vue.component(ButtonGroup.name, ButtonGroup)
Vue.component(Select.name, Select)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Option.name, Option)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Pagination.name, Pagination)
Vue.component(DatePicker.name, DatePicker)
Vue.component(TimePicker.name, TimePicker)
Vue.component(Container.name, Container)
Vue.component(Aside.name, Aside)
Vue.component(Main.name, Main)
Vue.component(Header.name, Header)
Vue.component(Footer.name, Footer)
Vue.component(Tree.name, Tree)
Vue.component(Link.name, Link)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Switch.name, Switch)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Tag.name, Tag)
Vue.component(Drawer.name, Drawer)
Vue.component(Notification.name, Notification)
Vue.component(Cascader.name, Cascader)
Vue.component(Alert.name, Alert)
Vue.component(Steps.name, Steps)
Vue.component(Step.name, Step)
Vue.component(Transfer.name, Transfer)
Vue.component(Badge.name, Badge)
Vue.component(Progress.name, Progress)
Vue.component(Collapse.name, Collapse)
Vue.component(CollapseItem.name, CollapseItem)
Vue.use(Loading.directive)
/***提示只显示一次**/
// 因为使用了new DonMessage()的原因，所以导致this.$message(options)的方式无法使用
// 推荐使用this.$message.success("成功提示")或者this.$message.success(options)的方式进行调用
const showMessage = Symbol('showMessage')

class DoneMessage {
  [showMessage](type, options, single) {
    if (single) {
      if (document.getElementsByClassName('el-message').length === 0) {
        Message[type](options)
      }
    } else {
      Message[type](options)
    }
  }

  info(options, single = true) {
    this[showMessage]('info', options, single)
  }

  warning(options, single = true) {
    this[showMessage]('warning', options, single)
  }

  error(options, single = true) {
    this[showMessage]('error', options, single)
  }

  success(options, single = true) {
    this[showMessage]('success', options, single)
  }
}

export const message = new DoneMessage()

Vue.prototype.$loading = Loading.service

// 封装确认弹窗
Vue.prototype.$confirm = (param1, param2, param3) => {
  return new Promise((resolve, reject) => {
    MessageBox.confirm(param1, param2, param3)
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
  }).catch(() => {
    // TODO error
  })
}

Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = new DoneMessage()
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$notify = Notification
Loading.service({ fullscreen: true })
