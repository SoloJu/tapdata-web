import Layout from '../views/Layout.vue'
import Iframe from '../views/Iframe.vue'
import Error from '../views/Error.vue'
import AgentDownload from '@/views/AgentDownload/AgentPage.vue'
import FastDownload from '@/views/AgentDownload/FastDownload.vue'
import UpgradeVersion from '@/views/AgentDownload/UpgradeVersion.vue'
import ContactUs from '@/views/ContactUs'
import Purchase from '@/views/Purchase/Purchase'

const TaskForm = () => import(/* webpackChunkName: "task-form" */ '../views/Task/Form.vue')
const ConnectionForm = () => import(/* webpackChunkName: "connection-form" */ '../views/Connection/Form.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    meta: {},
    children: [
      {
        path: '/',
        name: 'Home',
        meta: {
          title: '首页'
        },
        redirect: { name: 'Workbench' },
        hidden: true
      },
      {
        path: '/workbench',
        name: 'Workbench',
        component: () => import('../views/Workbench/Workbench.vue'),
        meta: {
          title: '工作台',
          icon: 'workbench'
        },
        children: [
          {
            path: 'notice',
            name: 'WorkbenchNotice',
            component: () => import('../views/Workbench/Notice.vue'),
            meta: {
              title: '公告通知'
            }
          }
        ]
      },
      {
        path: '/systemNotice',
        name: 'SystemNotice',
        component: () => import('../views/Workbench/SystemNotice.vue'),
        meta: {
          title: '系统通知'
        }
      },
      // {
      // 	path: '/dashboard',
      // 	name: 'Dashboard',
      // 	component: Dashboard,
      // 	meta: {
      // 		title: '运行概览',
      // 		icon: 'dashboard'
      // 	}
      // },
      {
        path: '/instance',
        name: 'Instance',
        component: () => import(/* webpackChunkName: "instance" */ '../views/Instance/Instance.vue'),
        meta: {
          title: 'Agent管理',
          icon: 'agent'
        },
        children: [
          {
            path: '/instanceDetails',
            name: 'InstanceDetails',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "instance-details" */ '../views/Instance/Details.vue'),
            meta: {
              title: '实例详情'
            }
          }
        ]
      },
      {
        path: '/connection',
        name: 'Connection',
        // component: Iframe,
        component: () => import(/* webpackChunkName: "connection-list" */ '../views/Connection/List.vue'),
        meta: {
          title: '连接管理',
          link: './tm/#/connections',
          icon: 'connection'
        },
        children: [
          {
            path: 'create',
            name: 'ConnectionCreate',
            component: ConnectionForm,
            //component: Iframe,
            meta: {
              title: '创建连接'
              // link: './tm/#/connections/create'
            }
          },
          {
            path: ':id',
            name: 'ConnectionEdit',
            component: ConnectionForm,
            //component: Iframe,
            meta: {
              title: '编辑连接'
              //link: './tm/#/connections/:id/edit'
            }
          }
        ]
      },
      {
        path: '/task',
        name: 'Task',
        component: () => import(/* webpackChunkName: "task-migration" */ '../views/Task/Migration.vue'),
        meta: {
          title: '任务管理',
          icon: 'task'
        },
        children: [
          {
            path: 'create',
            name: 'DataflowCreate',
            component: TaskForm,
            meta: {
              title: '创建任务',
              link: './tm/#/createTask/create'
            }
          },
          {
            path: ':id',
            name: 'DataflowEdit',
            component: TaskForm,
            meta: {
              title: '编辑任务'
            }
          }
        ]
      },

      {
        path: '/operationLog',
        name: 'OperationLog',
        component: () => import(/* webpackChunkName: "instance" */ '../views/OperationLog/List.vue'),
        meta: {
          title: '操作日志',
          icon: 'operationLog'
        }
      },
      {
        path: '/noviceGuide',
        name: 'NoviceGuide',
        component: () => import(/* webpackChunkName: "instance" */ '../views/NoviceGuide/Index.vue'),
        meta: {
          title: '新手引导'
        }
      }
    ]
  },
  {
    path: '/agentDownload',
    name: 'AgentDownload',
    component: AgentDownload,
    meta: {
      title: 'Agent 下载'
    }
  },
  {
    path: '/fastDownload',
    name: 'FastDownload',
    component: FastDownload,
    meta: {
      title: 'Agent 立即下载'
    }
  },
  {
    path: '/upgradeVersion',
    name: 'UpgradeVersion',
    component: UpgradeVersion,
    meta: {
      title: 'Agent 升级'
    }
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: Iframe,
    meta: {
      title: '任务监控',
      link: './tm/#/job'
    }
  },
  {
    path: '/contactUs',
    name: 'ContactUs',
    component: ContactUs,
    meta: {
      title: '联系我们'
    }
  },
  {
    path: '/500',
    name: '500',
    component: Error
  },
  {
    path: '/invalid',
    name: 'Invalid',
    component: Error
  },
  {
    path: '/freeze',
    name: 'Freeze',
    component: Error
  },
  {
    path: '/off',
    name: 'Off',
    component: Error
  }
]
if (process.env.VUE_APP_INSTANCE_TEST_BTN === 'true') {
  routes.push({
    path: '/Purchase',
    name: 'Purchase',
    component: Purchase
  })
}

export default routes
