import BBCoder, { type BBCoderVistor } from 'bbcoder';

/**
 * 解析bbcode
 * @param string bbcode
 * @returns html
 */
export const bbcode = (string: string): string => {
	const bbcode = new BBCoder(string);
	try {
		bbcode.parse();
	} catch (err) {
		return `${err}`;
	}
	return bbcode.html(vistor);
};

const vistor: BBCoderVistor = (function defaultVistor(): BBCoderVistor {
	function simpleTag(bbcodeTag: string, htmlTag?: string) {
		if (!htmlTag) htmlTag = bbcodeTag;
		const vi: BBCoderVistor = {};
		vi[bbcodeTag] = (_node, results) => `<${htmlTag}>${results.join('')}</${htmlTag}>`;
		return vi;
	}

	function attrTag(attr: string, bbcodeTag: string, htmlTag?: string) {
		if (!htmlTag) htmlTag = bbcodeTag;
		const vi: BBCoderVistor = {};
		vi[bbcodeTag] = (_node, results) => `<${htmlTag} ${attr}>${results.join('')}</${htmlTag}>`;
		return vi;
	}

	function listTag(bbcodeTag: string, htmlTag?: string) {
		if (!htmlTag) htmlTag = bbcodeTag;
		const vi: BBCoderVistor = {};
		vi[bbcodeTag] = (_node, results) =>
			`<${htmlTag}>${results
				.map((x) => (x.startsWith('<li>') && x.endsWith('</li>') ? x : `<li>${x}</li>`))
				.join('')}</${htmlTag}>`;

		return vi;
	}
	return {
		...simpleTag('b'),
		...simpleTag('s'),
		...simpleTag('center'),
		...simpleTag('pre'),
		...attrTag('style="float:left"', 'left'),
		...attrTag('style="float:right"', 'right'),
		...simpleTag('quote', 'blockquote'),
		spoiler(node, results) {
			return `<details><summary>${node.value || ''}</summary><p>${results}</p></details>`;
		},
		url(node, results) {
			return `<a href="${node.value || results.join('')}">${results.join('')}</a>`;
		},
		img(node, results) {
			let style = '';
			if (node.value) {
				const r = /^(?<w>[0-9]+)x(?<h>[0-9]+)$/.exec(node.value);
				const w = r?.groups?.w;
				const h = r?.groups?.h;
				if (w && h) style = `style="width:${w}px;height:${h}px"`;
			}
			return `<img ${style} src="${results.join('')}" alt="">`;
		},
		...listTag('ul'),
		...listTag('ol'),
		...listTag('list', 'ol'),
		...simpleTag('li'),
		...simpleTag('table'),
		...simpleTag('tr'),
		...simpleTag('td'),
		...simpleTag('th'),
		bili(node, results) {
			//https://zhuanlan.zhihu.com/p/89653416
			return `<iframe src="https://xbeibeix.com/api/bilibili/biliplayer/?url=${results.join('')}" ${
				node.value
			}></iframe>`;
		},
		code(node, results) {
			return `<pre${node.value ? ` class="language-${node.value}"` : ''}>${results.join('')}</pre>`;
		},
		pre(node, results) {
			return `<pre${node.value ? ` class="language-${node.value}"` : ''}>${results.join('')}</pre>`;
		},
	};
})();
/** 所有支持的标签 */
export const supportTags = Object.keys({ ...new BBCoder('').vistor, ...vistor }).sort();
