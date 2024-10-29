ace.define("ace/mode/doc_comment_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
	"use strict";
	var r = e("../lib/oop"), i = e("./text_highlight_rules").TextHighlightRules, s = function () {
		this.$rules = {
			start: [{
				token: "comment.doc.tag",
				regex: "@[\\w\\d_]+"
			}, s.getTagRule(), {defaultToken: "comment.doc", caseInsensitive: !0}]
		}
	};
	r.inherits(s, i), s.getTagRule = function (e) {
		return {token: "comment.doc.tag.storage.type", regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b"}
	}, s.getStartRule = function (e) {
		return {token: "comment.doc", regex: "\\/\\*(?=\\*)", next: e}
	}, s.getEndRule = function (e) {
		return {token: "comment.doc", regex: "\\*\\/", next: e}
	}, t.DocCommentHighlightRules = s
}), ace.define("ace/mode/jsx_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function (e, t, n) {
	var r = e("../lib/oop"), i = e("../lib/lang"), s = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
		o = e("./text_highlight_rules").TextHighlightRules, u = function () {
			var e = i.arrayToMap("break|do|instanceof|typeof|case|else|new|var|catch|finally|return|void|continue|for|switch|default|while|function|this|if|throw|delete|in|try|class|extends|super|import|from|into|implements|interface|static|mixin|override|abstract|final|number|int|string|boolean|variant|log|assert".split("|")),
				t = i.arrayToMap("null|true|false|NaN|Infinity|__FILE__|__LINE__|undefined".split("|")),
				n = i.arrayToMap("debugger|with|const|export|let|private|public|yield|protected|extern|native|as|operator|__fake__|__readonly__".split("|")),
				r = "[a-zA-Z_][a-zA-Z0-9_]*\\b";
			this.$rules = {
				start: [{token: "comment", regex: "\\/\\/.*$"}, s.getStartRule("doc-start"), {
					token: "comment",
					regex: "\\/\\*",
					next: "comment"
				}, {
					token: "string.regexp",
					regex: "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
				}, {token: "string", regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {
					token: "string",
					regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
				}, {token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b"}, {
					token: "constant.numeric",
					regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
				}, {
					token: "constant.language.boolean",
					regex: "(?:true|false)\\b"
				}, {
					token: ["storage.type", "text", "entity.name.function"],
					regex: "(function)(\\s+)(" + r + ")"
				}, {
					token: function (r) {
						return r == "this" ? "variable.language" : r == "function" ? "storage.type" : e.hasOwnProperty(r) || n.hasOwnProperty(r) ? "keyword" : t.hasOwnProperty(r) ? "constant.language" : /^_?[A-Z][a-zA-Z0-9_]*$/.test(r) ? "language.support.class" : "identifier"
					}, regex: r
				}, {
					token: "keyword.operator",
					regex: "!|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
				}, {token: "punctuation.operator", regex: "\\?|\\:|\\,|\\;|\\."}, {
					token: "paren.lparen",
					regex: "[[({<]"
				}, {token: "paren.rparen", regex: "[\\])}>]"}, {token: "text", regex: "\\s+"}],
				comment: [{token: "comment", regex: "\\*\\/", next: "start"}, {defaultToken: "comment"}]
			}, this.embedRules(s, "doc-", [s.getEndRule("start")])
		};
	r.inherits(u, o), t.JsxHighlightRules = u
}), ace.define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function (e, t, n) {
	"use strict";
	var r = e("../range").Range, i = function () {
	};
	(function () {
		this.checkOutdent = function (e, t) {
			return /^\s+$/.test(e) ? /^\s*\}/.test(t) : !1
		}, this.autoOutdent = function (e, t) {
			var n = e.getLine(t), i = n.match(/^(\s*\})/);
			if (!i) return 0;
			var s = i[1].length, o = e.findMatchingBracket({row: t, column: s});
			if (!o || o.row == t) return 0;
			var u = this.$getIndent(e.getLine(o.row));
			e.replace(new r(t, 0, t, s - 1), u)
		}, this.$getIndent = function (e) {
			return e.match(/^\s*/)[0]
		}
	}).call(i.prototype), t.MatchingBraceOutdent = i
}), ace.define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (e, t, n) {
	"use strict";
	var r = e("../../lib/oop"), i = e("../../range").Range, s = e("./fold_mode").FoldMode,
		o = t.FoldMode = function (e) {
			e && (this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)), this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)))
		};
	r.inherits(o, s), function () {
		this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/, this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/, this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/, this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/, this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/, this._getFoldWidgetBase = this.getFoldWidget, this.getFoldWidget = function (e, t, n) {
			var r = e.getLine(n);
			if (this.singleLineBlockCommentRe.test(r) && !this.startRegionRe.test(r) && !this.tripleStarBlockCommentRe.test(r)) return "";
			var i = this._getFoldWidgetBase(e, t, n);
			return !i && this.startRegionRe.test(r) ? "start" : i
		}, this.getFoldWidgetRange = function (e, t, n, r) {
			var i = e.getLine(n);
			if (this.startRegionRe.test(i)) return this.getCommentRegionBlock(e, i, n);
			var s = i.match(this.foldingStartMarker);
			if (s) {
				var o = s.index;
				if (s[1]) return this.openingBracketBlock(e, s[1], n, o);
				var u = e.getCommentFoldRange(n, o + s[0].length, 1);
				return u && !u.isMultiLine() && (r ? u = this.getSectionRange(e, n) : t != "all" && (u = null)), u
			}
			if (t === "markbegin") return;
			var s = i.match(this.foldingStopMarker);
			if (s) {
				var o = s.index + s[0].length;
				return s[1] ? this.closingBracketBlock(e, s[1], n, o) : e.getCommentFoldRange(n, o, -1)
			}
		}, this.getSectionRange = function (e, t) {
			var n = e.getLine(t), r = n.search(/\S/), s = t, o = n.length;
			t += 1;
			var u = t, a = e.getLength();
			while (++t < a) {
				n = e.getLine(t);
				var f = n.search(/\S/);
				if (f === -1) continue;
				if (r > f) break;
				var l = this.getFoldWidgetRange(e, "all", t);
				if (l) {
					if (l.start.row <= s) break;
					if (l.isMultiLine()) t = l.end.row; else if (r == f) break
				}
				u = t
			}
			return new i(s, o, u, e.getLine(u).length)
		}, this.getCommentRegionBlock = function (e, t, n) {
			var r = t.search(/\s*$/), s = e.getLength(), o = n, u = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/, a = 1;
			while (++n < s) {
				t = e.getLine(n);
				var f = u.exec(t);
				if (!f) continue;
				f[1] ? a-- : a++;
				if (!a) break
			}
			var l = n;
			if (l > o) return new i(o, r, l, t.length)
		}
	}.call(o.prototype)
}), ace.define("ace/mode/jsx", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/jsx_highlight_rules", "ace/mode/matching_brace_outdent", "ace/mode/behaviour/cstyle", "ace/mode/folding/cstyle"], function (e, t, n) {
	"use strict";

	function f() {
		this.HighlightRules = s, this.$outdent = new o, this.$behaviour = new u, this.foldingRules = new a
	}

	var r = e("../lib/oop"), i = e("./text").Mode, s = e("./jsx_highlight_rules").JsxHighlightRules,
		o = e("./matching_brace_outdent").MatchingBraceOutdent, u = e("./behaviour/cstyle").CstyleBehaviour,
		a = e("./folding/cstyle").FoldMode;
	r.inherits(f, i), function () {
		this.lineCommentStart = "//", this.blockComment = {
			start: "/*",
			end: "*/"
		}, this.getNextLineIndent = function (e, t, n) {
			var r = this.$getIndent(t), i = this.getTokenizer().getLineTokens(t, e), s = i.tokens;
			if (s.length && s[s.length - 1].type == "comment") return r;
			if (e == "start") {
				var o = t.match(/^.*[\{\(\[]\s*$/);
				o && (r += n)
			}
			return r
		}, this.checkOutdent = function (e, t, n) {
			return this.$outdent.checkOutdent(t, n)
		}, this.autoOutdent = function (e, t, n) {
			this.$outdent.autoOutdent(t, n)
		}, this.$id = "ace/mode/jsx"
	}.call(f.prototype), t.Mode = f
});
(function () {
	ace.require(["ace/mode/jsx"], function (m) {
		if (typeof module == "object" && typeof exports == "object" && module) {
			module.exports = m;
		}
	});
})();
            