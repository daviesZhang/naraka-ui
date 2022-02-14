
export interface ICurrentUser{

  username: string;

  /**
   * 密码过期时间
   */
  passwordExpireTime:string;

  /**
   * 创建时间
   */
  createdTime:string;

  /**
   * 接口已过滤字段Map,可配合客服端隐藏掉对已过滤字段的展示
   * URL 过滤字段
   */
  filter:{[key:string]:string};

  /**
   * 已配置的菜单列表
   */
   menus:Array<UserMenu>;
}

export interface UserMenu{
    url:string;

    id:number;

    parent:number;
}

export class CurrentUser implements ICurrentUser{

  username: string;

  /**
   * 密码过期时间
   */
  passwordExpireTime:string;

  /**
   * 创建时间
   */
  createdTime:string;

  /**
   * 接口已过滤字段Map,可配合客服端隐藏掉对已过滤字段的展示
   * URL 过滤字段
   */
  filter:{[key:string]:string};

  /**
   * 已配置的菜单列表
   */
  menus:Array<UserMenu>;


  constructor(me:ICurrentUser) {
    this.username = me.username;
    this.passwordExpireTime = me.passwordExpireTime;
    this.createdTime = me.createdTime;
    this.filter = me.filter||{};
    this.menus = me.menus;
  }




}
