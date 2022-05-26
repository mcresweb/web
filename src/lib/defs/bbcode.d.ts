declare module 'bbcoder' {
	export default BBCoder;
	declare class BBCoder {
		input: string;
		options?: BBCoderOption;
		parser: bbcoder.ASTParser;
		vistor: BBCoderVistor;
		constructor(input: string, options?: BBCoderOption);
		parse(): bbcoder.ASTParser;

		html(vistor?: BBCoderVistor): string;
	}
	/** 选项 */
	type BBCoderOption = {
		/** 自动关闭未关闭的标签，如[u] 会被补全为[u][/u] */
		autoCloseTag?: boolean;
		/** 是否忽略未关闭的标签，未关闭的标签不会显示，会被删掉 */
		ignoreUncloseTag?: boolean;
		/** 是否输出未关闭的标签，未关闭的标签会原样显示 */
		outputUncloseTag?: boolean;
	};

	/** 标签处理器 */
	export type BBCoderHandler = (node: ASTLabel, results: string[]) => string;
	/** 转换器 */
	export type BBCoderVistor = Record<string, BBCoderHandler>;

	export type ASTType = 'Root' | 'String' | 'Label';

	export interface ASTString {
		new (name: string, value: string);
		type: 'String';
		name: string;
		value: string;
	}
	export interface ASTLabel {
		new (name: string, label: string, value: string);
		type: 'Label';
		name: string;
		value: string;
		label: string;
		children: (ASTString | ASTLabel)[];
		isClose: boolean;
		fullLabel: string;
		setClose(close: boolean);
		push(node: ASTNode);
	}
	export interface AST {
		type: 'Root';
		body: (ASTString | ASTLabel)[];
	}
}
