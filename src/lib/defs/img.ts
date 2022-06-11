/**
 * 图片使用类型定义
 *
 * 内部名 - 展示名
 */
export class ImgUsing {
	head = false;
	list = false;
}
/**
 * 图片使用类型描述
 */
export const imgUsingDescribe: Record<keyof ImgUsing, string> = {
	head: '导航展示',
	list: '列表展示',
};
/**
 * 图片使用类型的键
 */
export const imgUsingKeys: (keyof ImgUsing)[] = Object.keys(imgUsingDescribe) as any;

/**
 * 图片上传响应
 */
export type ImgUploadResp = { success: true; uuid: string } | { success: false; err: string };
