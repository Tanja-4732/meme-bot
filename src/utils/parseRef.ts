export default class ParseRef {
  public static parseRoleRef(roleRef: string): string {
    return roleRef.slice(3, roleRef.length - 1);
  }
  
  public static parseChannelRef(channelRef: string): string {
    return channelRef.slice(2, channelRef.length - 1);
  }
}