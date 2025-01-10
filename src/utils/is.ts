/*
 * @Description: 类型判断
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2022-11-04 10:56:01
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2025-01-10 18:34:02
 */

const toString = Object.prototype.toString;

export function is (val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown> (val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isUnDef<T = unknown> (val?: T): val is T {
  return !isDef(val);
}

export function isObject (val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object');
}

export function isEmpty<T = unknown> (val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }

  return false;
}

export function isDate (val: unknown): val is Date {
  return is(val, 'Date');
}

export function isNull (val: unknown): val is null {
  return val === null;
}

export function isNullAndUnDef (val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val);
}

export function isNullOrUnDef (val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

export function isNumber (val: unknown): val is number {
  return is(val, 'Number');
}

export function isPromise<T = any> (val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export function isString (val: unknown): val is string {
  return is(val, 'String');
}

export function isFunction (val: unknown): val is FunctionConstructor {
  return typeof val === 'function';
}

export function isBoolean (val: unknown): val is boolean {
  return is(val, 'Boolean');
}

export function isRegExp (val: unknown): val is RegExp {
  return is(val, 'RegExp');
}

export function isArray (val: any): val is Array<any> {
  return val && Array.isArray(val);
}

export function isWindow (val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window');
}

export function isElement (val: unknown): val is Element {
  return isObject(val) && !!val.tagName;
}

export function isMap (val: unknown): val is Map<any, any> {
  return is(val, 'Map');
}

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

export function isUrl (path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

/**
 * @description 判断是否是复杂类型
 * @export
 * @param {*} map
 * @returns {*}  {boolean}
 */
export function isValidMap (map: any) {
  return isArray(map) || isObject(map);
}

/**
 * @description 判断一个字符串是否为JSON字符串
 * @export
 * @param {string} str
 * @returns {*}  {boolean}
 */
export function isJsonStr (str: string) {
  if (isString(str)) {
    try {
      const obj = JSON.parse(str);
      if (obj && isObject(obj)) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
}

/**
 * @description 判断一个字符串是否为 Base64 字符串格式
 * @export
 * @param {string} str
 * @returns {*}  {boolean}
 */
export function isBase64 (str: string) {
  if (!str) return false;
  // 验证 Base64 字符串格式
  const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
  return base64Regex.test(str);
}