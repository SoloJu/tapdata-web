import Vue from 'vue'

Vue.directive('readonlybtn', {
  inserted: function (el, binding, vnode) {
    const code = binding.value

    if (!Vue.prototype.$has(code)) {
      el.remove()
      vnode.child && vnode.child.$destroy()
    }
  }
})

Vue.prototype.$has = function (code) {
  return hasPermissionByCode(code)
}
Vue.prototype.$disabledByPermission = function (code, id) {
  return permissionBtnDisable(code, id)
}

export function hasPermissionByCode(code) {
  let permissions = sessionStorage.getItem('tapdata_permissions')
  permissions = JSON.parse(permissions)

  if (!permissions || permissions.length === 0) {
    return false
  }
  let _codes = []
  if (typeof code === 'string') {
    _codes.push(code)
  } else if (Object.prototype.toString.call(code) === '[object Array]') {
    _codes = code
  }
  // for (let i = 0; i < permissions.length; i++) {
  // 	let permission = permissions[i];
  // 	if (permission.type === 'button') {

  // 	}
  // }
  let res = permissions.filter(
    (resource) => _codes.indexOf(resource.code) !== -1
  )
  if (res && res.length > 0) {
    return true
  }
  return false
}

export function permissionBtnDisable(code, id) {
  if (
    ['SYNC_job_edition_all_data', 'SYNC_job_operation_all_data'].includes(
      code
    ) &&
    window.getSettingByKey('DFS_TCM_PLATFORM') === 'drs'
  ) {
    return false
  }
  let falg = false
  let cookie = window.VueCookie
  let user_id = cookie.get('user_id')

  if (!id) {
    return true
  }
  if (!Vue.prototype.$has(code)) {
    if (id !== user_id) {
      falg = true
    }
  }
  return falg
}
