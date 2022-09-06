import i18n from '@tap/i18n'
import { merge } from 'lodash'
import Mousetrap from 'mousetrap'
import { taskApi } from '@tap/api'
import { makeStatusAndDisabled } from '@tap/business'
import { connectorActiveStyle } from '../style'
import { DEFAULT_SETTINGS, NODE_HEIGHT, NODE_PREFIX, NODE_WIDTH } from '../constants'
import {
  AddConnectionCommand,
  AddNodeCommand,
  AddNodeOnConnectionCommand,
  CommandManager,
  MoveNodeCommand,
  QuickAddTargetCommand,
  RemoveConnectionCommand,
  RemoveNodeCommand
} from '../command'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import dagre from 'dagre'
import { validateBySchema } from '@tap/form/src/shared/validate'
import resize from '@tap/component/src/directives/resize'

export default {
  directives: {
    resize
  },

  computed: {
    ...mapState('dataflow', ['activeNodeId', 'showConsole', 'transformLoading']),
    ...mapGetters('dataflow', [
      'allNodes',
      'allEdges',
      'activeType',
      'isActionActive',
      'nodeById',
      'stateIsDirty',
      'stateIsReadonly',
      'processorNodeTypes',
      'hasNodeError'
    ]),

    selectBoxStyle() {
      let attr = this.selectBoxAttr
      return attr
        ? {
            left: attr.x + 'px',
            top: attr.y + 'px',
            width: attr.w + 'px',
            height: attr.h + 'px'
          }
        : null
    }
  },

  watch: {
    $route() {
      this.initView()
    }
  },

  beforeDestroy() {
    this.destory = true
    this.stopDagWatch?.()
  },

  methods: {
    ...mapMutations('dataflow', [
      'setStateDirty',
      'setStateReadonly',
      'setEdges',
      'setTaskId',
      'addResourceIns',
      'updateNodeProperties',
      'setActiveNode',
      'setActiveConnection',
      'resetSelectedNodes',
      'addSelectedNode',
      'addConnection',
      'removeConnection',
      'removeNode',
      'removeNodeFromSelection',
      'removeAllNodes',
      'reset',
      'addNode',
      'setActiveType',
      'setFormSchema',
      'setTransformStatus',
      'setTransformLoading',
      'setEditVersion',
      'copyNodes',
      'pasteNodes',
      'setNodeError',
      'setNodeErrorMsg',
      'clearNodeError',
      'resetState',
      'selectConnection',
      'deselectAllConnections',
      'setCanBeConnectedNodeIds',
      'setValidateLanguage',
      'addProcessorNode',
      'toggleConsole'
    ]),

    ...mapActions('dataflow', ['addNodeAsync', 'updateDag', 'loadCustomNode']),

    async addNodes({ nodes, edges }) {
      if (!nodes?.length) return
      const getResourceIns = this.$store.getters['dataflow/getResourceIns']
      const outputsMap = {}
      const inputsMap = {}

      edges.forEach(({ source, target }) => {
        let _source = outputsMap[source]
        let _target = inputsMap[target]

        if (!_source) {
          outputsMap[source] = [target]
        } else {
          _source.push(target)
        }

        if (!_target) {
          inputsMap[target] = [source]
        } else {
          _target.push(source)
        }
      })

      nodes.forEach(node => {
        node.$inputs = inputsMap[node.id] || []
        node.$outputs = outputsMap[node.id] || []

        // 数据兼容
        const defaultAttrs = {
          position: [0, 0]
        }
        if (!node.attrs) node.attrs = defaultAttrs
        else if (!node.attrs.position) Object.assign(node.attrs, defaultAttrs)

        const ins = getResourceIns(node)
        Object.defineProperty(node, '__Ctor', {
          value: ins,
          enumerable: false
        })
        this.addNode(node)
      })

      await this.$nextTick()

      // 连线
      edges.forEach(({ source, target }) => {
        this.jsPlumbIns.connect({ uuids: [`${NODE_PREFIX}${source}_source`, `${NODE_PREFIX}${target}_target`] })
      })
    },

    getRealId(str) {
      return str.replace(new RegExp(`^${NODE_PREFIX}`), '')
    },

    checkAsTarget(target, showMsg) {
      let { allowSource } = target.__Ctor
      allowSource = typeof allowSource === 'boolean' ? allowSource : true
      const connectionType = target.attrs.connectionType
      if (!allowSource || (connectionType && !connectionType.includes('target'))) {
        showMsg &&
          this.$message.error(
            i18n.t('packages_dag_mixins_editor_gaijiedianta', {
              val1: target.name
            })
          )
        return false
      }
      return true
    },

    checkAsSource(source, showMsg) {
      let { allowTarget } = source.__Ctor
      allowTarget = typeof allowTarget === 'boolean' ? allowTarget : true
      const connectionType = source.attrs.connectionType
      if (!allowTarget || (connectionType && !connectionType.includes('source'))) {
        showMsg &&
          this.$message.error(
            i18n.t('packages_dag_mixins_editor_gaijiedianso', {
              val1: source.name
            })
          )
        return false
      }
      return true
    },

    checkTargetMaxInputs(target, showMsg) {
      const maxInputs = target.__Ctor.maxInputs ?? -1
      const connections = this.jsPlumbIns.getConnections({ target: NODE_PREFIX + target.id })

      if (maxInputs !== -1 && connections.length >= maxInputs) {
        showMsg && this.$message.error(i18n.t('packages_dag_mixins_editor_gaijiedianyijing'))
        return false
      }
      return true
    },

    checkSourceMaxOutputs(source, showMsg) {
      const maxOutputs = source.__Ctor.maxOutputs ?? -1
      const connections = this.jsPlumbIns.getConnections({ source: NODE_PREFIX + source.id })

      if (maxOutputs !== -1 && connections.length >= maxOutputs) {
        showMsg && this.$message.error(i18n.t('packages_dag_mixins_editor_gaijiedianyijing'))
        return false
      }
      return true
    },

    checkAllowTargetOrSource(source, target, showMsg) {
      const { allowSource } = target.__Ctor
      const { allowTarget } = source.__Ctor

      if (typeof allowSource === 'function' && !allowSource(source, target)) {
        showMsg &&
          this.$message.error(
            i18n.t('packages_dag_mixins_editor_gaijiedianta', {
              val1: target.name,
              val2: source.name
            })
          )
        return false
      }
      if (typeof allowTarget === 'function' && !allowTarget(target, source)) {
        showMsg &&
          this.$message.error(
            i18n.t('packages_dag_mixins_editor_sourc', {
              val1: source.name,
              val2: target.name
            })
          )
        return false
      }
      return true
    },

    checkCanBeConnected(sourceId, targetId, showMsg) {
      if (sourceId === targetId) return false
      if (this.isConnected(sourceId, targetId)) return false

      const source = this.nodeById(sourceId)
      const target = this.nodeById(targetId)

      if (!this.checkAsTarget(target, showMsg)) return false
      if (!this.checkTargetMaxInputs(target, showMsg)) return false
      return this.allowConnect(sourceId, targetId) && this.checkAllowTargetOrSource(source, target, showMsg)
    },

    checkGotoViewer() {
      if (this.dataflow.disabledData.edit) {
        // 不可编辑
        this.gotoViewer()
        this.setStateReadonly(true)
        return true
      }
    },

    async newDataflow() {
      this.dataflow.name = i18n.t('packages_dag_mixins_editor_xinrenwu') + new Date().toLocaleTimeString()
      await this.saveAsNewDataflow()
    },

    onNodeDragStart() {
      if (this.ifNodeDragStart) {
        this.ifNodeDragStart = false
        return
      }
      this.ifNodeDragStart = true
    },

    onNodeDragMove(param) {
      if (!this.ifNodeDragStart) return
      let { id, pos } = param
      let nw = param.el.offsetWidth
      let nh = param.el.offsetHeight
      let diffPos = { x: 0, y: 0 }
      let horiArr = []
      let verArr = []
      let rangeX = 10
      let rangeY = 10

      this.allNodes.forEach(item => {
        if (item.id !== id) {
          let [x, y] = item.attrs.position
          let _x = x - pos[0]
          let _y = y - pos[1]
          if (Math.abs(_x) <= Math.abs(rangeX)) {
            if (_x === rangeX) {
              verArr.push(y)
            } else {
              rangeX = _x
              verArr = [y]
            }
            diffPos.x = rangeX
          }
          if (Math.abs(_y) <= Math.abs(rangeY)) {
            if (_y === rangeY) {
              horiArr.push(x)
            } else {
              rangeY = _y
              horiArr = [x]
            }
            diffPos.y = rangeY
          }
        }
      })

      pos[0] += diffPos.x
      pos[1] += diffPos.y

      param.el.style.left = pos[0] + 'px'
      param.el.style.top = pos[1] + 'px'
      this.jsPlumbIns.revalidate(param.el) // 重绘

      let t = pos[1],
        b = pos[1] + nh,
        l = pos[0],
        r = pos[0] + nw
      verArr.forEach(y => {
        t = Math.min(y + nh, t)
        b = Math.max(y, b)
      })
      horiArr.forEach(x => {
        l = Math.min(x + nw, l)
        r = Math.max(x, r)
      })

      // 组装导航线
      let lines = []
      if (t < pos[1]) {
        let top = t + 'px',
          height = pos[1] - t + 'px'
        lines.push(
          {
            top,
            left: pos[0] + 'px',
            height
          },
          {
            top,
            left: pos[0] + nw + 'px',
            height
          }
        )
      }
      if (b > pos[1] + nh) {
        let top = pos[1] + nh + 'px',
          height = b - pos[1] - nh + 'px'
        lines.push(
          {
            top,
            left: pos[0] + 'px',
            height
          },
          {
            top,
            left: pos[0] + nw + 'px',
            height
          }
        )
      }

      if (l < pos[0]) {
        let left = l + 'px',
          width = pos[0] - l + 'px'
        lines.push(
          {
            top: pos[1] + 'px',
            left,
            width
          },
          {
            top: pos[1] + nh + 'px',
            left,
            width
          }
        )
      }

      if (r > pos[0] + nw) {
        let left = pos[0] + nw + 'px',
          width = r - pos[0] - nw + 'px'
        lines.push(
          {
            top: pos[1] + 'px',
            left,
            width
          },
          {
            top: pos[1] + nh + 'px',
            left,
            width
          }
        )
      }
      this.navLines = lines
    },

    onNodeDragStop(isNotMove, oldProperties, newProperties) {
      this.ifNodeDragStart = false
      this.navLines = []

      this.$refs.paperScroller.autoResizePaper()

      !isNotMove && this.command.exec(new MoveNodeCommand(oldProperties, newProperties))
    },

    nodeSelectedById(id, setActive, deselectAllOthers) {
      if (deselectAllOthers) {
        this.deselectAllNodes()
      }

      const node = this.nodeById(id)

      node && this.nodeSelected(node)
      if (setActive) {
        this.setActiveNode(node.id)
      }
    },

    nodeSelected(node) {
      this.addSelectedNode(node)
      const nodeElement = `node-${node.id}`
      this.jsPlumbIns.addToDragSelection(nodeElement)
    },

    nodeDeselected(node) {
      this.removeNodeFromSelection(node)
      const nodeElement = NODE_PREFIX + node.id
      this.jsPlumbIns.removeFromDragSelection(nodeElement)
    },

    nodeDeselectedById(id) {
      const node = this.nodeById(id)
      if (node) {
        this.nodeDeselected(node)
      }
    },

    /**
     * 取消选择所有节点
     */
    deselectAllNodes() {
      this.jsPlumbIns.clearDragSelection()
      this.resetSelectedNodes()
      this.handleDeselectAllConnections()
    },

    /**
     * 取消选中连线
     */
    handleDeselectAllConnections() {
      const selectedConnections = this.$store.state.dataflow.selectedConnections
      if (!selectedConnections.length) return

      const { NODE_PREFIX, jsPlumbIns } = this

      selectedConnections.forEach(({ target, source }) => {
        const conn = jsPlumbIns.select({
          target: NODE_PREFIX + target,
          source: NODE_PREFIX + source
        })

        if (conn) {
          conn.removeClass('connection-selected')
          conn.hideOverlay('removeConn')
          conn.hideOverlay('addNodeOnConn')
        }
      })

      this.deselectAllConnections()
    },

    onHideSidebar() {
      const activeType = this.$store.getters['dataflow/activeType']
      if (activeType === 'connection') {
        this.handleDeselectAllConnections(...arguments)
      }
      this.setActiveType(null)
    },

    getNodesInSelection(selectBoxAttr) {
      let $node = this.$refs.layoutContent.querySelector('.df-node')
      if (!$node) return []
      let nw = $node.offsetWidth
      let nh = $node.offsetHeight
      let { x, y, bottom, right } = selectBoxAttr

      return this.allNodes.filter(node => {
        const [left, top] = node.attrs.position
        return left + nw > x && left < right && bottom > top && y < top + nh
      })
    },

    // 循环检查检查链路的末尾节点类型是否是表节点
    isEndOfTable(source, sourceMap, nodeMap) {
      if (!sourceMap[source.id]) {
        // 末位节点
        return source.type === 'database'
      }

      for (let edge of sourceMap[source.id]) {
        if (!this.isEndOfTable(nodeMap[edge.target], sourceMap, nodeMap)) {
          return false
        }
      }

      return true
    },

    reformDataflow(data, fromWS) {
      makeStatusAndDisabled(data)
      if (data.status === 'edit') data.btnDisabled.start = false // 任务编辑中，在编辑页面可以启动
      this.$set(this.dataflow, 'status', data.status)
      this.$set(this.dataflow, 'disabledData', data.btnDisabled)
      this.$set(this.dataflow, 'taskRecordId', data.taskRecordId)
      this.$set(this.dataflow, 'stopTime', data.stopTime)

      if (!fromWS) {
        Object.keys(data).forEach(key => {
          if (!['dag'].includes(key)) {
            // 坑啊...formily响应式observable和vue2搭配需要加个避免属性不更新Field
            this.dataflow[key] = data[key]
            this.$set(this.dataflow, key, data[key])
          }
        })
      }

      // makeStatusAndDisabled(data)
      // this.$set(this.dataflow, 'status', data.status)
      // this.$set(this.dataflow, 'disabledData', data.btnDisabled)
      // this.$set(this.dataflow, 'taskRecordId', data.taskRecordId)
      // console.log('this.dataflow', this.dataflow) // eslint-disable-line
    },

    async confirmMessage(message, headline, type, confirmButtonText, cancelButtonText) {
      try {
        await this.$confirm(message, headline, {
          confirmButtonText,
          cancelButtonText,
          type,
          dangerouslyUseHTMLString: true
        })
        return true
      } catch (e) {
        return false
      }
    },

    async initView(first) {
      this.stopDagWatch?.()

      if (this.$route.params.action === 'dataflowEdit') {
        // 保存后路由跳转
        this.setStateDirty(false)
        this.setStateReadonly(false)
        this.stopDagWatch = this.$watch(
          () => [this.allNodes.length, this.allEdges.length],
          () => {
            console.log(i18n.t('packages_dag_mixins_editor_initV')) // eslint-disable-line
            this.updateDag()
          }
        )
        // 从查看进入编辑，清掉轮询
        return Promise.resolve()
      }

      if (this.$route.params.action === 'dataflowViewer') {
        this.setStateReadonly(true)
        return Promise.resolve()
      }

      const { id } = this.$route.params
      this.dataflow.id = id

      if (!first) {
        this.resetWorkspace()
        this.initNodeView()
      }
      if (['DataflowViewer', 'MigrationMonitor', 'MigrateViewer'].includes(this.$route.name)) {
        await this.openDataflow(id)
        // await this.startLoop()
        this.setStateReadonly(true)
      } else {
        if (id) {
          await this.openDataflow(id)
          // 检查任务是否可编辑
          if (this.checkGotoViewer()) return // 跳转到viewer不需要继续往下走
        } else {
          await this.newDataflow()
        }
        this.stopDagWatch = this.$watch(
          () => [this.allNodes.length, this.allEdges.length],
          () => {
            console.log(i18n.t('packages_dag_mixins_editor_initV')) // eslint-disable-line
            this.updateDag()
          }
        )
      }

      this.initWS()
    },

    initCommand() {
      this.command = new CommandManager(this.$store, this.jsPlumbIns)
      Mousetrap.bind('mod+c', () => {
        !this.stateIsReadonly && this.copyNodes()
      })
      Mousetrap.bind('mod+v', () => {
        !this.stateIsReadonly && this.pasteNodes(this.command)
      })
      Mousetrap.bind('mod+z', e => {
        e.preventDefault()
        !this.stateIsReadonly && this.command.undo()
      })
      Mousetrap.bind('mod+shift+z', () => {
        !this.stateIsReadonly && this.command.redo()
      })
      Mousetrap.bind('mod+shift+o', () => {
        this.$refs.paperScroller.toggleMiniView()
      })
      Mousetrap.bind(['backspace', 'del'], () => {
        !this.stateIsReadonly && this.handleDelete()
      })
      Mousetrap.bind(['option+command+l', 'ctrl+alt+l'], e => {
        e.preventDefault()
        this.handleAutoLayout()
      })
    },

    initNodeView() {
      const { jsPlumbIns } = this
      jsPlumbIns.setContainer('#node-view')
      jsPlumbIns.registerConnectionType('active', connectorActiveStyle)

      jsPlumbIns.bind('connection', (info, event) => {
        const { sourceId, targetId } = info
        const source = this.getRealId(sourceId)
        const target = this.getRealId(targetId)
        const connection = { source, target }
        const connectionIns = info.connection

        info.connection.bind('click', () => {
          if (this.stateIsReadonly) return
          this.handleDeselectAllConnections()
          info.connection.showOverlay('removeConn')
          info.connection.showOverlay('addNodeOnConn')
          info.connection.addClass('connection-selected')
          this.selectConnection(connection)
        })
        info.connection.bind('mouseover', () => {
          if (!this.stateIsReadonly) {
            info.connection.showOverlay('removeConn')
            info.connection.showOverlay('addNodeOnConn')
          }
        })
        info.connection.bind('mouseout', () => {
          if (
            connectionIns.hasClass('connection-selected') /* ||
            (this.nodeMenu.show && this.nodeMenu.reference === connectionIns.canvas)*/
          )
            return
          connectionIns.hideOverlay('removeConn')
          connectionIns.hideOverlay('addNodeOnConn')
        })

        // 添加新增按钮，并且绑定事件，默认不可见
        info.connection.addOverlay([
          'Custom',
          {
            id: 'addNodeOnConn',
            location: 0.35,
            create() {
              const div = document.createElement('div')
              div.title = i18n.t('packages_dag_components_dfnode_tianjiajiedian')
              div.classList.add('conn-btn__wrap')
              div.innerHTML = `<div class="conn-btn"><span class="v-icon"> <svg class="v-icon__svg"><use xlink:href="#icon-plus"></use></svg> </span></div>`
              return div
            },
            visible: false,
            events: {
              click: async overlay => {
                const rect = info.connection.canvas.getBoundingClientRect()
                this.nodeMenu.connectionCenterPos = [rect.x + rect.width / 2, rect.y + rect.height / 2]
                await this.showNodePopover('connection', connection, overlay.canvas)
              }
            }
          }
        ])

        info.connection.addOverlay([
          'Custom',
          {
            id: 'removeConn',
            location: 0.65,
            create() {
              const div = document.createElement('div')
              div.title = i18n.t('packages_dag_mixins_editor_shanchulianjie')
              div.classList.add('conn-btn__wrap')
              div.innerHTML = `<div class="conn-btn"><span class="v-icon"> <svg class="v-icon__svg"><use xlink:href="#icon-close"></use></svg> </span></div>`
              return div
            },
            visible: false,
            events: {
              click: () => {
                this.command.exec(
                  new RemoveConnectionCommand({
                    source,
                    target
                  })
                )
              }
            }
          }
        ])

        // 拖动连接
        if (event) {
          this.addConnection(connection)

          this.command.exec(new AddConnectionCommand(connection), true)
        }
      })

      jsPlumbIns.bind('beforeDrop', info => {
        if (this.stateIsReadonly) return false
        const { sourceId, targetId } = info

        return this.checkCanBeConnected(this.getRealId(sourceId), this.getRealId(targetId), true)
      })

      jsPlumbIns.bind('beforeDrag', ({ sourceId }) => {
        if (this.stateIsReadonly) return false
        // 根据连接类型判断，节点是否仅支持作为目标
        const node = this.nodeById(this.getRealId(sourceId))
        return this.checkAsSource(node, true)
      })

      // 连线拖动时，可以被连的节点在画布上凸显
      jsPlumbIns.bind('connectionDrag', info => {
        if (this.stateIsReadonly) return false
        const source = this.nodeById(this.getRealId(info.sourceId))
        const canBeConnectedNodes = this.allNodes.filter(target => this.checkCanBeConnected(source.id, target.id))
        this.setCanBeConnectedNodeIds(canBeConnectedNodes.map(n => n.id))
      })

      jsPlumbIns.bind('connectionDragStop', () => {
        if (this.stateIsReadonly) return false
        this.setCanBeConnectedNodeIds([])
      })
    },

    getDataflowDataToSave() {
      const dag = this.$store.getters['dataflow/dag']
      const editVersion = this.$store.state.dataflow.editVersion
      return {
        dag,
        editVersion,
        ...this.dataflow,
        syncType: 'migrate'
      }
    },

    async save(needStart) {
      this.isSaving = true
      const errorMsg = await this.validate()
      if (errorMsg) {
        this.$message.error(errorMsg)
        this.isSaving = false
        return
      }

      if (!this.dataflow.id) {
        return this.saveAsNewDataflow()
      }

      this.toggleConsole(true)
      this.$refs.console?.autoLoad() // 信息输出自动加载

      const data = this.getDataflowDataToSave()
      let isOk = false

      try {
        const result = await taskApi[needStart ? 'saveAndStart' : 'save'](data)
        this.reformDataflow(result)
        !needStart && this.$message.success(this.$t('packages_dag_message_save_ok'))
        this.setEditVersion(result.editVersion)
        this.isSaving = false
        isOk = true
      } catch (e) {
        this.handleError(e)
      }
      this.isSaving = false
      if (!needStart) this.$refs.console?.loadData() // 再load一下信息输出，并且停掉计时器
      return isOk
    },

    handleUndo() {
      this.command.undo()
    },

    handleRedo() {
      this.command.redo()
    },

    /**
     * 删除选中的节点
     */
    handleDelete() {
      const selectNodes = this.$store.getters['dataflow/getSelectedNodes']
      this.command.exec(new RemoveNodeCommand(selectNodes))
      this.resetSelectedNodes()
      this.deleteSelectedConnections()
    },

    handleDeleteById(id) {
      const node = this.nodeById(id)
      this.command.exec(new RemoveNodeCommand(node))
      this.nodeDeselected(node)

      this.nodeMenu.show = false // 防止节点删除后，popover仍在显示
    },

    handleZoomIn() {
      this.$refs.paperScroller.zoomIn()
    },

    handleZoomOut() {
      this.$refs.paperScroller.zoomOut()
    },

    handleZoomTo(scale) {
      this.$refs.paperScroller.zoomTo(scale)
    },

    handleShowSettings() {
      this.deselectAllNodes()
      if (this.activeType === 'settings') {
        this.setActiveType(null)
      } else {
        this.setActiveType('settings')
      }
    },

    /**
     * 画布内容居中在可视区域
     */
    handleCenterContent() {
      this.$refs.paperScroller.centerContent()
    },

    /**
     * 自动布局
     */
    handleAutoLayout() {
      const nodes = this.allNodes
      if (nodes.length < 2) return

      let hasMove = false
      const nodePositionMap = {}
      const dg = new dagre.graphlib.Graph()
      const newProperties = []
      const oldProperties = []

      dg.setGraph({ nodesep: 60, ranksep: 120, marginx: 50, marginy: 50, rankdir: 'LR' })
      dg.setDefaultEdgeLabel(function () {
        return {}
      })

      nodes.forEach(n => {
        dg.setNode(NODE_PREFIX + n.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
        nodePositionMap[NODE_PREFIX + n.id] = n.attrs?.position || [0, 0]
      })
      this.jsPlumbIns.getAllConnections().forEach(edge => {
        dg.setEdge(edge.source.id, edge.target.id)
      })

      dagre.layout(dg)
      dg.nodes().forEach(n => {
        const node = dg.node(n)
        const top = Math.round(node.y - node.height / 2)
        const left = Math.round(node.x - node.width / 2)

        if (nodePositionMap[n].join(',') !== `${left},${top}`) {
          hasMove = true
          oldProperties.push({
            id: this.getRealId(n),
            properties: {
              attrs: {
                position: nodePositionMap[n]
              }
            }
          })
          newProperties.push({
            id: this.getRealId(n),
            properties: {
              attrs: {
                position: [left, top]
              }
            }
          })
        }
      })

      hasMove && this.command.exec(new MoveNodeCommand(oldProperties, newProperties))
      this.$refs.paperScroller.autoResizePaper()
      this.$refs.paperScroller.centerContent()
    },

    /**
     * 判断node之间是否相连
     * @param s
     * @param t
     * @returns {boolean}
     */
    isConnected(s, t) {
      s = NODE_PREFIX + s
      t = NODE_PREFIX + t
      return this.nodeELIsConnected(s, t)
    },

    nodeELIsConnected(s, t) {
      // const connections = this.jsPlumbIns.getConnections('*')
      // eslint-disable-next-line
      // console.log('connections', connections)
      return this.jsPlumbIns.getConnections('*').some(c => `${c.sourceId}` === s && `${c.targetId}` === t)
    },

    allowConnect(sourceId, targetId) {
      const allEdges = this.allEdges
      const map = allEdges.reduce((map, item) => {
        let target = map[item.target]
        if (target) {
          target.push(item.source)
        } else {
          map[item.target] = [item.source]
        }
        return map
      }, {})

      if (!map[sourceId]) return true

      return !this.isParent(sourceId, targetId, map)
    },

    // 循环检查target是否是source的上级
    isParent(sourceId, targetId, map) {
      let flag = false
      if (!map[sourceId]) return flag
      for (let id of map[sourceId]) {
        flag = id === targetId
        if (flag || this.isParent(id, targetId, map)) return true
      }
      return flag
    },

    resetWorkspace() {
      this.dataflow = merge(
        {
          id: '',
          name: ''
        },
        DEFAULT_SETTINGS
      )
      this.jsPlumbIns.reset()
      this.deselectAllNodes()
      this.reset()
      this.setActiveNode(null)
      this.resetSelectedNodes()
    },

    async validateNode(node) {
      try {
        await validateBySchema(node.__Ctor.formSchema, node, this.formScope || this.scope)
        this.clearNodeError(node.id)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(i18n.t('packages_dag_mixins_editor_jiedianjiaoyancuo'), e)
        this.setNodeError(node.id)
      }
    },

    async validateAllNodes() {
      await Promise.all(
        this.allNodes.map(node => {
          if (this.activeNodeId === node.id) {
            return this.$refs.configPanel.validateForm()
          } else {
            return this.validateNode(node)
          }
        })
      )
    },

    validateDag() {
      let someErrorMsg = ''
      // 检查每个节点的源节点个数、连线个数、节点的错误状态
      this.allNodes.some(node => {
        const { id } = node
        const minInputs = node.__Ctor.minInputs ?? 1
        // 非数据节点至少有一个目标
        const minOutputs = node.__Ctor.minOutputs ?? (node.type !== 'database' && node.type !== 'table') ? 1 : 0
        const inputNum = node.$inputs.length
        const outputNum = node.$outputs.length

        if (this.hasNodeError(id)) {
          someErrorMsg = i18n.t('packages_dag_mixins_editor_noden', {
            val1: node.name
          })
          return true
        }

        if (inputNum < minInputs) {
          someErrorMsg = i18n.t('packages_dag_mixins_editor_noden', {
            val1: node.name,
            val2: minInputs
          })
          return true
        }

        if (outputNum < minOutputs) {
          someErrorMsg = i18n.t('packages_dag_mixins_editor_noden', {
            val1: node.name,
            val2: minOutputs
          })
          return true
        }

        if (!inputNum && !outputNum) {
          // 存在没有连线的节点
          someErrorMsg = i18n.t('packages_dag_mixins_editor_noden', {
            val1: node.name
          })
          return true
        }
      })
      return someErrorMsg
    },

    /**
     * 校验agent设置
     * @returns {*}
     */
    validateAgent() {
      let someErrorMsg
      const nodes = this.allNodes.filter(node => node.type === 'database' || node.type === 'table')
      const accessNodeProcessIdArr = [
        ...nodes.reduce((set, item) => {
          item.attrs.accessNodeProcessId && set.add(item.attrs.accessNodeProcessId)
          return set
        }, new Set())
      ]

      if (accessNodeProcessIdArr.length > 1) {
        // 所属agent节点冲突
        const chooseId = this.dataflow.accessNodeProcessId

        if (!chooseId) {
          // someErrorMsg = `请配置任务运行agent`
          someErrorMsg = i18n.t('packages_dag_mixins_editor_suoshuage') // 一样提示冲突
        } else {
          let isError = false
          const agent = this.scope.$agentMap[chooseId]
          nodes.forEach(node => {
            if (node.attrs.accessNodeProcessId && chooseId !== node.attrs.accessNodeProcessId) {
              this.setNodeErrorMsg({
                id: node.id,
                msg: i18n.t('packages_dag_mixins_editor_gaijiedianbuzhi', { val1: agent.hostName, val2: agent.ip })
              })
              isError = true
            }
          })
          isError && (someErrorMsg = i18n.t('packages_dag_mixins_editor_suoshuage'))
        }
      } else if (accessNodeProcessIdArr.length === 1) {
        // 如果画布上仅有一个所属agent，自动设置为任务的agent
        this.$set(this.dataflow, 'accessNodeType', 'MANUALLY_SPECIFIED_BY_THE_USER')
        this.$set(this.dataflow, 'accessNodeProcessId', accessNodeProcessIdArr[0])
      }
      return someErrorMsg
    },

    async validateSetting() {
      try {
        await this.$refs.configPanel.validateSetting()
      } catch (e) {
        this.setActiveType('settings')
        return i18n.t('packages_dag_mixins_editor_renwushezhiyi')
      }
    },

    loadLeafNode(node) {
      let arr = []
      if (node.$outputs.length) {
        node.$outputs.forEach(id => {
          console.log('this.loadLeafNode(this.nodeById(id))', this.loadLeafNode(this.nodeById(id))) // eslint-disable-line
          arr.push(...this.loadLeafNode(this.nodeById(id)))
        })
      } else {
        arr.push(node.id)
      }
      return arr
    },

    eachOutputs(node) {
      this.eachMap[node.id] = true
      const size = node.$outputs.length
      if (size > 0) {
        node.$outputs.forEach(id => {
          if (this.eachMap[id]) return
          const output = this.nodeById(id)
          if (output.$inputs.length > 1) {
            this.eachInputsByFilter(output, node.id)
          }
          this.eachOutputs(output)
        })
      }
    },

    eachInputsByFilter(node, filterId) {
      this.eachMap[node.id] = true
      node.$inputs.forEach(id => {
        if (id !== filterId && !this.eachMap[id]) {
          const input = this.nodeById(id)
          this.eachInputs(input)
          if (input.$outputs.length > 1) {
            this.eachOutputsByFilter(input, node.id)
          }
        }
      })
    },

    eachOutputsByFilter(node, filterId) {
      this.eachMap[node.id] = true
      node.$outputs.forEach(id => {
        if (id !== filterId && !this.eachMap[id]) {
          const output = this.nodeById(id)
          this.eachOutputs(output)
          if (output.$inputs.length > 1) {
            this.eachInputsByFilter(output, node.id)
          }
        }
      })
    },

    eachInputs(node) {
      this.eachMap[node.id] = true
      const size = node.$inputs.length
      if (size > 0) {
        node.$inputs.forEach(id => {
          if (this.eachMap[id]) return
          const input = this.nodeById(id)
          if (input.$outputs.length > 1) {
            this.eachOutputsByFilter(input, node.id)
          }
          this.eachInputs(input)
        })
      }
    },

    validateLink() {
      const firstSourceNode = this.allNodes.find(node => !node.$inputs.length)
      if (!firstSourceNode) return i18n.t('packages_dag_mixins_editor_renwulianlubu')
      this.eachMap = {}
      this.eachOutputs(firstSourceNode)

      if (this.allNodes.some(node => !this.eachMap[node.id])) {
        return i18n.t('packages_dag_mixins_editor_buzhichiduotiao')
      }
    },

    validateDDL() {
      let hasEnableDDL
      let hasEnableDDLAndIncreasesql
      let hasJsNode
      this.allNodes.forEach(node => {
        if (node.enableDDL) {
          hasEnableDDL = true
          if (node.increasePoll === 'customizeSql') {
            hasEnableDDLAndIncreasesql = true
            this.setNodeErrorMsg({
              id: node.id,
              msg: i18n.t('packages_dag_mixins_editor_gaijiedianbuzhi')
            })
          }
        }
        if (node.type === 'js_processor' || node.type === 'custom_processor' || node.type === 'migrate_js_processor') {
          hasJsNode = true
        }
      })
      if ((hasEnableDDL && hasJsNode) || hasEnableDDLAndIncreasesql) {
        return i18n.t('packages_dag_mixins_editor_renwuzhonghanyou')
      }
      // 任务中没有JS节点、自定义节点、并开关闭增量自定义SQL 时DDL按钮才会开放
    },

    async eachValidate(...fns) {
      for (let fn of fns) {
        let result = fn()
        if (result) {
          if (result instanceof Promise) {
            result = await result
            if (!result) continue
          }
          return result
        }
      }
    },

    async validate() {
      if (!this.dataflow.name) return this.$t('packages_dag_editor_cell_validate_empty_name')
      if (!this.allNodes.length) return this.$t('packages_dag_editor_cell_validate_none_data_node')

      await this.validateAllNodes()

      return await this.eachValidate(
        this.validateSetting,
        this.validateDag,
        this.validateAgent,
        this.validateLink,
        this.validateDDL
      )
    },

    /**
     * 从侧边栏拖拽节点时，判断是否能放置到连线，并且高亮可以放置的线
     * @param item
     * @param position
     * @param el
     */
    handleDragMoveNode(item, position, el) {
      this.jsPlumbIns.select().removeClass('connection-highlight')
      const $elemBelow = document.elementFromPoint(...position)

      if ($elemBelow?.nodeName === 'path' && $elemBelow.parentElement._jsPlumb) {
        $elemBelow.parentElement.classList.add('connection-highlight')
      }

      let lines = []

      if (document.getElementById('dfEditorContent').contains($elemBelow)) {
        el.style.transform = `scale(${this.scale})`
        let nw = el.offsetWidth
        let nh = el.offsetHeight
        const pos = this.$refs.paperScroller.getDropPositionWithinPaper(position, {
          width: nw,
          height: nh
        })
        let diffPos = { x: 0, y: 0 }
        let horiArr = []
        let verArr = []
        let rangeX = 10
        let rangeY = 10

        this.allNodes.forEach(item => {
          let [x, y] = item.attrs.position
          let _x = x - pos[0]
          let _y = y - pos[1]
          if (Math.abs(_x) <= Math.abs(rangeX)) {
            if (_x === rangeX) {
              verArr.push(y)
            } else {
              rangeX = _x
              verArr = [y]
            }
            diffPos.x = rangeX
          }
          if (Math.abs(_y) <= Math.abs(rangeY)) {
            if (_y === rangeY) {
              horiArr.push(x)
            } else {
              rangeY = _y
              horiArr = [x]
            }
            diffPos.y = rangeY
          }
        })

        pos[0] += diffPos.x
        pos[1] += diffPos.y

        // console.log('diffPos', diffPos.x, diffPos.y)
        el.style.left = parseInt(el.style.left) + diffPos.x * this.scale + 'px'
        el.style.top = parseInt(el.style.top) + diffPos.y * this.scale + 'px'

        let t = pos[1],
          b = pos[1] + nh,
          l = pos[0],
          r = pos[0] + nw
        verArr.forEach(y => {
          t = Math.min(y + nh, t)
          b = Math.max(y, b)
        })
        horiArr.forEach(x => {
          l = Math.min(x + nw, l)
          r = Math.max(x, r)
        })

        // 组装导航线
        if (t < pos[1]) {
          let top = t + 'px',
            height = pos[1] - t + 'px'
          lines.push(
            {
              top,
              left: pos[0] + 'px',
              height
            },
            {
              top,
              left: pos[0] + nw + 'px',
              height
            }
          )
        }
        if (b > pos[1] + nh) {
          let top = pos[1] + nh + 'px',
            height = b - pos[1] - nh + 'px'
          lines.push(
            {
              top,
              left: pos[0] + 'px',
              height
            },
            {
              top,
              left: pos[0] + nw + 'px',
              height
            }
          )
        }

        if (l < pos[0]) {
          let left = l + 'px',
            width = pos[0] - l + 'px'
          lines.push(
            {
              top: pos[1] + 'px',
              left,
              width
            },
            {
              top: pos[1] + nh + 'px',
              left,
              width
            }
          )
        }

        if (r > pos[0] + nw) {
          let left = pos[0] + nw + 'px',
            width = r - pos[0] - nw + 'px'
          lines.push(
            {
              top: pos[1] + 'px',
              left,
              width
            },
            {
              top: pos[1] + nh + 'px',
              left,
              width
            }
          )
        }
      } else {
        el.style.transform = 'scale(1)'
      }

      this.navLines = lines
    },

    /**
     * 通过拖拽添加节点
     * 🎉 支持拖到连线上快速添加
     * @param item
     * @param position
     * @param rect
     */
    handleAddNodeByDrag(item, position, rect) {
      const paper = this.$refs.paperScroller
      // const newPosition = paper.getDropPositionWithinPaper(position, rect)
      const point = paper.getMouseToPage(rect)
      const newPosition = [point.x, point.y]
      const $elemBelow = document.elementFromPoint(...position)

      // 节点拖放在连线上
      if ($elemBelow.nodeName === 'path' && $elemBelow.parentElement._jsPlumb) {
        const connection = $elemBelow.parentElement._jsPlumb
        const source = this.getRealId(connection.sourceId)
        const target = this.getRealId(connection.targetId)
        this.addNodeOnConn(item, newPosition, source, target)
      } else {
        this.handleAddNodeToPos(newPosition, item)
      }

      paper.autoResizePaper()
      // 重置导航线
      this.navLines = []
    },

    handleAddNodeToPos(position, item) {
      const node = this.createNode(position, item)
      this.command.exec(new AddNodeCommand(node))
      return node
    },

    handleAddNode(item) {
      const { x, y } = this.$refs.paperScroller.getPaperCenterPos()
      const position = this.getNewNodePosition([x - NODE_WIDTH / 2, y - NODE_HEIGHT / 2], [120, 0])
      const node = this.handleAddNodeToPos(position, item)
      if (position[1] !== y) {
        this.$refs.paperScroller.centerNode(node)
      }
    },

    handleMouseSelect(ifMoved, showSelectBox, selectBoxAttr) {
      // 取消选中所有节点
      this.deselectAllNodes()
      // 清空激活状态
      // this.setActiveType(null)

      if (!ifMoved) {
        this.setActiveType(null)
      } else if (showSelectBox) {
        const selectedNodes = this.getNodesInSelection(selectBoxAttr)
        selectedNodes.forEach(node => this.nodeSelected(node))
      }
    },

    handleChangeScale(scale) {
      this.scale = scale
      this.jsPlumbIns.setZoom(scale)
    },

    isSource(node) {
      const id = node.id
      const allEdges = this.allEdges
      return allEdges.some(({ source }) => source === id)
    },

    /**
     * 快速添加目标节点
     * @param source 源节点
     * @param nodeType 节点的类型对象
     */
    quickAddNode(source, nodeType) {
      const spaceX = 120
      const spaceY = 120

      const newPosition = [source.attrs.position[0] + NODE_WIDTH + spaceX, source.attrs.position[1]]
      let movePosition = [spaceX, 0]

      if (this.isSource(source)) {
        newPosition[1] += spaceY
        movePosition = [0, spaceY]
      }

      const position = this.getNewNodePosition(newPosition, movePosition)
      const target = this.createNode(position, nodeType)

      if (!this.checkAsSource(source, true)) return
      if (!this.checkSourceMaxOutputs(source, true)) return
      if (!this.checkAllowTargetOrSource(source, target, true)) return
      this.command.exec(new QuickAddTargetCommand(source.id, target))
    },

    /**
     * 在连线上添加节点
     * @param nodeType
     * @param position
     * @param source 连线源节点的id
     * @param target 连线目标节点的id
     */
    addNodeOnConn(nodeType, position, source, target) {
      const a = this.nodeById(source)
      const b = this.createNode(position, nodeType)
      const c = this.nodeById(target)

      if (!this.checkAsTarget(b, true)) return
      if (!this.checkAsSource(b, true)) return
      if (!this.checkTargetMaxInputs(b, true)) return
      if (!this.checkSourceMaxOutputs(b, true)) return
      if (!this.checkAllowTargetOrSource(a, b, true)) return
      if (!this.checkAllowTargetOrSource(b, c, true)) return

      this.command.exec(
        new AddNodeOnConnectionCommand(
          {
            source,
            target
          },
          b
        )
      )
    },

    addNodeOnConnByNodeMenu(nodeType) {
      const { nodeMenu } = this
      const position = this.$refs.paperScroller.getDropPositionWithinPaper(nodeMenu.connectionCenterPos, {
        width: NODE_WIDTH,
        height: NODE_HEIGHT
      })
      this.addNodeOnConn(nodeType, position, nodeMenu.data.source, nodeMenu.data.target)
      this.$nextTick(() => {
        this.handleAutoLayout()
      })
    },

    canUsePosition(position1, position2) {
      if (Math.abs(position1[0] - position2[0]) <= NODE_WIDTH) {
        if (Math.abs(position1[1] - position2[1]) <= NODE_HEIGHT) {
          return false
        }
      }

      return true
    },

    getNewNodePosition(newPosition, movePosition) {
      newPosition = newPosition.slice()

      if (!movePosition) {
        movePosition = [50, 50]
      }

      let conflictFound = false // 查找冲突
      let i, node
      do {
        conflictFound = false
        for (i = 0; i < this.allNodes.length; i++) {
          node = this.allNodes[i]
          if (!this.canUsePosition(node.attrs.position, newPosition)) {
            conflictFound = true
            break
          }
        }

        if (conflictFound === true) {
          newPosition[0] += movePosition[0]
          newPosition[1] += movePosition[1]
        }
      } while (conflictFound === true)

      return newPosition
    },

    handleError(error, msg = i18n.t('packages_dag_src_editor_chucuole')) {
      error = error.data
      if (error?.code === 'Task.ListWarnMessage') {
        let names = []
        if (error.data) {
          const keys = Object.keys(error.data)
          keys.forEach(key => {
            const node = this.$store.state.dataflow.NodeMap[key]
            if (node) {
              names.push(node.name)
              this.setNodeErrorMsg({
                id: node.id,
                msg: error.data[key][0].msg
              })
            }
          })
          if (!names.length && keys.length) {
            // 兼容错误信息id不是节点id的情况
            const nodeMsg = error.data[keys[0]][0]?.msg
            if (nodeMsg) {
              this.$message.error(nodeMsg)
              return
            }
          } else if (msg) {
            this.$message.error(msg)
          }
        }
        // this.$message.error(`${this.$t('packages_dag_dag_save_fail')} ${names.join('，')}`)
      }
      // else if (error?.data?.message) {
      //   this.$message.error(error.data.message)
      // } else {
      //   // eslint-disable-next-line no-console
      //   console.error(error)
      //   this.$message.error(msg)
      // }
    },

    async handleUpdateName(name) {
      this.dataflow.name = name
      taskApi
        .patch({
          id: this.dataflow.id,
          name
        })
        .catch(this.handleError)
    },

    handleEditFlush(result) {
      if (result.data) {
        this.reformDataflow(result.data, true)
        this.setTransformLoading(!result.data.transformed)
      }
    },

    handleLocateNode(node) {
      this.$refs.paperScroller.centerNode(node)
      this.nodeSelectedById(node.id, true, true)
    },

    async handleStart() {
      const flag = await this.save(true)
      if (flag) {
        this.dataflow.disabledData.edit = true
        this.dataflow.disabledData.start = true
        this.dataflow.disabledData.stop = true
        this.dataflow.disabledData.reset = true
        this.gotoViewer()
      }
    },

    handleStop() {
      let message = this.getConfirmMessage('stop')

      this.$confirm(message, '', {
        type: 'warning',
        showClose: false
      }).then(async resFlag => {
        if (!resFlag) {
          return
        }

        this.dataflow.disabledData.stop = true
        await taskApi.stop(this.dataflow.id).catch(e => {
          this.handleError(e, this.$t('packages_dag_message_operation_error'))
        })
        this.$message.success(this.$t('packages_dag_message_operation_succuess'))
      })
    },

    handleForceStop() {
      let msg = this.getConfirmMessage('force_stop')
      this.$confirm(msg, '', {
        type: 'warning',
        showClose: false
      }).then(async resFlag => {
        if (!resFlag) {
          return
        }

        this.dataflow.disabledData.stop = true
        await taskApi.forceStop(this.dataflow.id)
        // this.startLoop(true)
      })
    },

    handleReset() {
      let msg = this.getConfirmMessage('initialize')
      this.$confirm(msg, '', {
        type: 'warning'
      }).then(async resFlag => {
        if (!resFlag) {
          return
        }
        try {
          this.dataflow.disabledData.reset = true
          const data = await taskApi.reset(this.dataflow.id)
          this.responseHandler(data, this.$t('packages_dag_message_resetOk'))
        } catch (e) {
          this.handleError(e, this.$t('packages_dag_message_resetFailed'))
        }
      })
    },

    getConfirmMessage(operateStr) {
      let message = operateStr + '_confirm_message'

      const h = this.$createElement
      let strArr = this.$t('packages_dag_dataFlow_' + message).split('xxx')
      let msg = h('p', null, [
        strArr[0],
        h(
          'span',
          {
            class: 'color-primary'
          },
          this.dataflow.name
        ),
        strArr[1]
      ])
      return msg
    },

    responseHandler(data, msg) {
      let failList = data?.fail || []
      if (failList.length) {
        let msgMapping = {
          5: this.$t('packages_dag_dataFlow_multiError_notFound'),
          6: this.$t('packages_dag_dataFlow_multiError_statusError'),
          7: this.$t('packages_dag_dataFlow_multiError_otherError'),
          8: this.$t('packages_dag_dataFlow_multiError_statusError')
        }
        let nameMapping = {}
        this.table.list.forEach(item => {
          nameMapping[item.id] = item.name
        })
        this.$message.warning({
          dangerouslyUseHTMLString: true,
          message: failList
            .map(item => {
              return `<div style="line-height: 24px;"><span style="color: #409EFF">${
                nameMapping[item.id]
              }</span> : <span style="color: #F56C6C">${msgMapping[item.code]}</span></div>`
            })
            .join('')
        })
      } else if (msg) {
        this.$message.success(msg)
      }
    },

    async loadDataflow(id, params) {
      this.loading = true
      try {
        const data = await taskApi.get(id, params)
        if (!data) {
          this.$message.error(i18n.t('packages_dag_mixins_editor_renwubucunzai'))
          this.handlePageReturn()
        }
        data.dag = data.temp || data.dag // 和后端约定了，如果缓存有数据则获取temp
        this.reformDataflow(data)
        return data
      } catch (e) {
        console.log(i18n.t('packages_dag_mixins_editor_renwujiazaichu'), e) // eslint-disable-line
      } finally {
        this.loading = false
      }
    },

    initWS() {
      this.$ws.off('editFlush', this.handleEditFlush)
      this.$ws.on('editFlush', this.handleEditFlush)
      this.$ws.send({
        type: 'editFlush',
        taskId: this.dataflow.id,
        data: {
          opType: 'subscribe'
        }
      })
    },

    deleteSelectedConnections() {
      const selectedConnections = this.$store.state.dataflow.selectedConnections
      if (!selectedConnections.length) return

      selectedConnections.forEach(({ target, source }) => {
        const conn = this.jsPlumbIns.select({
          target: NODE_PREFIX + target,
          source: NODE_PREFIX + source
        })

        if (conn) {
          this.command.exec(
            new RemoveConnectionCommand({
              source,
              target
            })
          )
        }
      })

      this.deselectAllConnections()
    },

    async showNodePopover(type, data, el) {
      type === 'node' && this.handleDeselectAllConnections()
      this.nodeMenu.show = false
      this.nodeMenu.reference = null
      await this.$nextTick()
      this.nodeMenu.reference = el
      this.nodeMenu.type = type
      this.nodeMenu.data = data
      await this.$nextTick()
      this.nodeMenu.show = true
      this.nodeMenu.typeId = data.id
    },

    handleClickNodePopover(node) {
      this.nodeMenu.show = false
      if (this.nodeMenu.type === 'node') {
        this.quickAddNode(this.nodeMenu.data, node)
      } else {
        this.addNodeOnConnByNodeMenu(node)
      }
    },

    handleToggleExpand() {
      this.showLeftSider = !this.showLeftSider
      if (this.activeType === 'node') {
        this.deselectAllNodes()
        this.setActiveNode(null)
      }
    }
  }
}
