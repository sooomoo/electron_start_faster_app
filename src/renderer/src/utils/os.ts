export type OSType = "macos" | "windows" | "linux" | "unknown";

/**
 * 用于获取操作系统类型
 * @returns {OSType} The type of the operating system.
 */
export const getOSType = (): OSType => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("mac os x")) return "macos";
  if (userAgent.includes("windows")) return "windows";
  if (userAgent.includes("linux")) return "linux";
  return "unknown";
};
