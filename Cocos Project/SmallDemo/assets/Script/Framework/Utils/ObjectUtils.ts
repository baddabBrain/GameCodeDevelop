/*
 * @Description: 
 * @Author: chenguanhui
 * @Date: 2019-08-13 16:24:42
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-13 16:25:23
 */
	/**
	 * 对象相关的常用功能
	 * @export
	 * @class Obj
	 */
	export default class ObjectUtils
	{
		/**
		 * 判定对象是否为null或者undefined
		 * @static
		 * @param {*} target 目标对象
		 * @returns {boolean} 
		 * @memberOf Obj
		 */
		static isEmpty(target: any): boolean 
		{
			return (target === null || target === undefined);
		}

		/**
		 * 获取对象的属性值
		 * @param {any} obj 对象实例
		 * @param {string} name 属性名称
		 * @param {any} def 默认值
		 */
		static getProperty(obj: any, name: string, def: any): any
		{
			if (obj)
			{
				if (obj[name] !== null && obj[name] !== undefined)
				{
					return obj[name];
				}
			}

			return def;
		}


		static getPropertyByNames(obj: any, def: any, ...names: any[]): any
		{
			var tmp: any = obj;
			for (var i: number = 0; i < names.length; i++)
			{
				if (!tmp) break;
				var n: any = names[i];
				if (tmp[n] !== null && tmp[n] !== undefined)
				{
					tmp = tmp[n];
				}
				else break;

				if (i === names.length - 1)
				{
					if (tmp !== null && tmp !== undefined) return tmp;
				}
			}

			return def;
		}

		static getPropertyStringByNames(obj: any, def: string, ...names: any[]): string
		{
			var tmp: any = obj;
			var ret: string = def;
			for (var i: number = 0; i < names.length; i++)
			{
				if (!tmp) break;
				var n: any = names[i];
				if (tmp[n] !== null && tmp[n] !== undefined)
				{
					tmp = tmp[n];
				}
				else break;

				if (i === names.length - 1)
				{
					if (tmp !== null && tmp !== undefined) 
					{
						let _v = tmp;
						if (typeof (_v) === 'string')
						{
							ret = _v;
						}
						else if (typeof (_v) === 'number')
						{
							ret = _v.toString();
						}
						break;
					}
				}
			}
			return ret;
		}

		static getPropertyNumberByNames(obj: any, def: number, ...names: any[]): number
		{
			var tmp: any = obj;
			var ret: number = def;
			for (var i: number = 0; i < names.length; i++)
			{
				if (!tmp) break;
				var n: any = names[i];
				if (tmp[n] !== null && tmp[n] !== undefined)
				{
					tmp = tmp[n];
				}
				else break;

				if (i === names.length - 1)
				{
					if (tmp !== null && tmp !== undefined) 
					{
						let _v = tmp;
						if (typeof (_v) === 'number')
						{
							ret = _v;
						}
						else if (typeof (_v) === 'string')
						{
							ret = parseInt(_v);
						}
						break;
					}
				}
			}
			return ret;
		}


		/** 判定target是否是指定的类型type */
		static is(target: any, type: any): boolean
		{
			var ret: boolean = false;

			if (type === Function && typeof (target) === "function") ret = true;
			else if (type === Number && typeof (target) === "number") ret = true;
			else if (type === Boolean && typeof (target) === "boolean") ret = true;
			else if (type === String && typeof (target) === "string") ret = true;
			else if (typeof (target) === "object")
			{
				ret = target instanceof (type);
			}

			return ret;
		}

		/**
		 * 判定对象是否为字符串
		 * @static
		 * @param {*} target 
		 * @returns {boolean} 
		 * @memberOf Obj
		 */
		static isString(target: any): boolean
		{
			return typeof (target) === "string";
		}

		/**
		 * 判定对象是否为数值
		 * @static
		 * @param {*} target 
		 * @returns {boolean} 
		 * @memberOf Obj
		 */
		static isNumber(target: any): boolean
		{
			return typeof (target) === "number";
		}

		/**
		 * 判定对象是否为函数
		 * @static
		 * @param {*} target 
		 * @returns {boolean} 
		 * 
		 * @memberOf Obj
		 */
		static isFunction(target: any): boolean
		{
			return typeof (target) === "function";
		}

		static getClassName(target: any): string
		{
			if (target !== null && target !== undefined)
			{
				if (target.constructor)
				{
					if (target.constructor.name !== null && target.constructor.name !== undefined)
					{
						return target.constructor.name;
					}
				}
			}
			return "";
		}
	}