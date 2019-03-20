export default class ParseRef {
  public static parseRoleRef(roleRef: string): string {
    return roleRef.slice(3, roleRef.length - 1);
  }
}