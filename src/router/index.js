import Layout from '../views/Layout.vue'
import Error from '../views/Error.vue'
import SvgList from '../views/SvgList.vue'
import AgentDownload from '@/views/AgentDownload/AgentPage.vue'
import FastDownload from '@/views/AgentDownload/FastDownload.vue'
import UpgradeVersion from '@/views/AgentDownload/UpgradeVersion.vue'
import ContactUs from '@/views/ContactUs'
import i18n from '@/i18n'

const TaskForm = () => import(/* webpackChunkName: "task-form" */ '../views/Task/Form.vue')
const ConnectionForm = () => import(/* webpackChunkName: "connection-form" */ '../views/Connection/Form.vue')
const DataflowDetails = () => import(/* webpackChunkName: "task-form" */ '../views/Task/copy/Index.vue')

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
          title: i18n.t('tap_home')
        },
        redirect: { name: 'Workbench' },
        hidden: true
      },
      {
        path: '/workbench',
        name: 'Workbench',
        component: () => import('../views/Workbench/Workbench.vue'),
        meta: {
          title: i18n.t('tap_workbench'),
          icon: 'workbench',
          hideTitle: true
        },
        children: [
          {
            path: 'notice',
            name: 'WorkbenchNotice',
            component: () => import('../views/Workbench/Notice.vue'),
            meta: {
              title: i18n.t('tap_announcement_notice')
            }
          }
        ]
      },
      {
        path: '/systemNotice',
        name: 'SystemNotice',
        component: () => import('../views/Workbench/SystemNotice.vue'),
        meta: {
          title: i18n.t('tap_system_notification')
        }
      },
      {
        path: '/instance',
        name: 'Instance',
        component: () => import(/* webpackChunkName: "instance" */ '../views/Instance/Instance.vue'),
        meta: {
          title: i18n.t('tap_agent_management'),
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
              title: i18n.t('tap_instance_details')
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
          title: i18n.t('tap_connection_management'),
          icon: 'connection'
        },
        children: [
          {
            path: 'create',
            name: 'ConnectionCreate',
            component: ConnectionForm,
            //component: Iframe,
            meta: {
              title: i18n.t('tap_create_connection')
            }
          },
          {
            path: ':id',
            name: 'ConnectionEdit',
            component: ConnectionForm,
            //component: Iframe,
            meta: {
              title: i18n.t('tap_edit_connection')
            }
          }
        ]
      },
      {
        path: '/task',
        name: 'Task',
        component: () => import(/* webpackChunkName: "task-migration" */ '../views/Task/Migration.vue'),
        meta: {
          title: i18n.t('tap_task_management'),
          icon: 'task'
        },
        children: [
          {
            path: 'create',
            name: 'DataflowCreate',
            component: TaskForm,
            meta: {
              title: i18n.t('tap_create_task')
            }
          },
          {
            path: ':id',
            name: 'DataflowEdit',
            component: TaskForm,
            meta: {
              title: i18n.t('tap_edit_task')
            }
          },
          {
            path: ':id/monitor',
            name: 'Monitor',
            component: () => import(/* webpackChunkName: "task-monitor" */ '../views/Monitor/Dashboard.vue'),
            meta: {
              title: i18n.t('tap_monitor')
            }
          },
          {
            path: ':id/statistics',
            name: 'DataflowDetails',
            component: DataflowDetails,
            meta: {
              title: '任务详情'
            }
          }
        ]
      },
      {
        path: '/verify',
        name: 'Verify',
        component: () => import(/* webpackChunkName: "verify" */ '../views/Verify/List.vue'),
        meta: {
          title: i18n.t('tap_data_validation'),
          icon: 'shujuxiaoyan'
        },
        children: [
          {
            path: 'create',
            name: 'VerifyCreate',
            component: () => import(/* webpackChunkName: "verify-form" */ '../views/Verify/Form.vue'),
            meta: {
              title: i18n.t('tap_create_verification_task')
            }
          },
          {
            path: ':id/edit',
            name: 'VerifyEdit',
            component: () => import(/* webpackChunkName: "verify-form" */ '../views/Verify/Form.vue'),
            meta: {
              title: i18n.t('tap_edit_verification_task')
            }
          },
          {
            path: ':id/details',
            name: 'VerifyDetails',
            component: () => import(/* webpackChunkName: "verify-details" */ '../views/Verify/Details.vue'),
            meta: {
              title: i18n.t('tap_task_verification_details')
            }
          },
          {
            path: 'result/:id/details',
            name: 'VerifyDiffDetails',
            component: () => import(/* webpackChunkName: "verify-result" */ '../views/Verify/Result.vue'),
            meta: {
              title: i18n.t('tap_difference_check_details')
            }
          },
          {
            path: 'result/:id',
            name: 'VerifyResult',
            component: () => import(/* webpackChunkName: "verify-result" */ '../views/Verify/Result.vue'),
            meta: {
              title: i18n.t('tap_check_result')
            }
          },
          {
            path: ':id/history',
            name: 'VerifyHistory',
            component: () => import(/* webpackChunkName: "verify-history" */ '../views/Verify/History.vue'),
            meta: {
              title: i18n.t('tap_task_verification_history')
            }
          },
          {
            path: 'result/:id/history',
            name: 'VerifyDiffHistory',
            component: () => import(/* webpackChunkName: "verify-history" */ '../views/Verify/History.vue'),
            meta: {
              title: i18n.t('tap_difference_check_history')
            }
          }
        ]
      },
      {
        path: '/operationLog',
        name: 'OperationLog',
        component: () => import(/* webpackChunkName: "instance" */ '../views/OperationLog/List.vue'),
        meta: {
          title: i18n.t('tap_operation_log'),
          icon: 'operation-log'
        }
      },
      {
        path: '/noviceGuide',
        name: 'NoviceGuide',
        component: () => import(/* webpackChunkName: "instance" */ '../views/NoviceGuide/Index.vue'),
        meta: {
          title: i18n.t('tap_Beginner_guide')
        }
      }
    ]
  },
  {
    path: '/agentDownload',
    name: 'AgentDownload',
    component: AgentDownload,
    meta: {
      title: i18n.t('tap_agent_download')
    }
  },
  {
    path: '/fastDownload',
    name: 'FastDownload',
    component: FastDownload,
    meta: {
      title: i18n.t('tap_agent_download_now')
    }
  },
  {
    path: '/upgradeVersion',
    name: 'UpgradeVersion',
    component: UpgradeVersion,
    meta: {
      title: i18n.t('tap_upgrade')
    }
  },
  {
    path: '/contactUs',
    name: 'ContactUs',
    component: ContactUs,
    meta: {
      title: i18n.t('tap_contact_us')
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
  },
  {
    path: '/svg',
    name: 'SvgList',
    component: SvgList
  }
]

export default routes
