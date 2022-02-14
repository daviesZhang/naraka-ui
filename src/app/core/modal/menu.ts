export interface Menu {
  icon?: string;
  title: string;
}


export const menu: { [key: string]: Menu } = {
  '/system': {
    icon: 'setting',
    title: '系统管理',
  },
  '/system/menu': {
    title: '菜单管理'
  },
  '/system/user': {
    title: '用户管理'
  },
  '/system/authority': {
    title: '权限管理'
  },
  '/system/role': {
    title: '角色管理'
  }


};
