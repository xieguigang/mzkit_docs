var vanillavb;
(function (vanillavb) {
    var app;
    (function (app) {
        /**
         * Website markdown to html render
        */
        class markdown extends markedjs.htmlRenderer {
            image(href, title, text) {
                href = markedjs.helpers.cleanUrl(this.options.sanitize, this.options.baseUrl, href);
                if (href === null) {
                    return text;
                }
                else if (!markdown.isFullName(href)) {
                    href = `/docs/${href}`;
                }
                var out = '<img src="' + href + '" alt="' + text + '"';
                if (title) {
                    out += ' title="' + title + '"';
                }
                out += this.options.xhtml ? '/>' : '>';
                return out;
            }
            static isFullName(href) {
                return href.toLowerCase().indexOf("://") > -1;
            }
            code(code, infostring, escaped) {
                var lang = (infostring || '').match(/\S*/)[0];
                if (this.options.highlight) {
                    var out = this.options.highlight(code, lang);
                    if (out != null && out !== code) {
                        escaped = true;
                        code = out;
                    }
                }
                if (!lang) {
                    return '<pre><code>'
                        + (escaped ? code : markedjs.helpers.escape.doescape(code, true))
                        + '</code></pre>';
                }
                else if (lang != "vbnet") {
                    let highlight = window.hljs
                        .highlightAuto(code)
                        .value;
                    code = `<pre><code class="highlight ${lang} hljs">${highlight}</code></pre>`;
                    return code;
                }
                return '<pre><code class="highlight ' + lang + '">'
                    + (escaped ? code : markedjs.helpers.escape.doescape(code, true))
                    + '</code></pre>\n';
            }
        }
        app.markdown = markdown;
    })(app = vanillavb.app || (vanillavb.app = {}));
})(vanillavb || (vanillavb = {}));
/// <reference path="markdown.ts" />
var vanillavb;
(function (vanillavb) {
    var app;
    (function (app) {
        let config = markedjs.option.Defaults;
        let vbcodeStyle = vscode.VisualStudio;
        let language = lang();
        /**
         * A stack for enable back to previous article
        */
        let history = [];
        function lang() {
            let folder = $ts.location.path;
            if (Strings.Empty(folder) || folder == "/") {
                return "";
            }
            else if (folder.charAt(0) == "#") {
                return "";
            }
            else {
                return folder.split("/")[0];
            }
        }
        function getTargetFile(fileName = $ts.location.hash(), multipleLanguage = true) {
            let pathFallback;
            let path;
            let folder = lang();
            if (folder == "vbscripts") {
                if (!Strings.Empty(fileName, true)) {
                    pathFallback = `/vbscripts/docs/${fileName}.md`;
                }
                else {
                    fileName = $ts.location.fileName;
                    if (fileName == "index.html" || Strings.Empty(fileName, true)) {
                        // show home page
                        pathFallback = "/vbscripts/README.md";
                    }
                    else {
                        return null;
                    }
                }
                path = pathFallback;
            }
            else {
                if (!Strings.Empty(fileName, true)) {
                    pathFallback = `/docs/${fileName}.md`;
                    path = pathFallback;
                    if (multipleLanguage && !Strings.Empty(language, true)) {
                        path = `/docs/${fileName}.${language}.md`;
                    }
                }
                else {
                    // show home page
                    pathFallback = "/README.md";
                    path = pathFallback;
                    if (multipleLanguage && !Strings.Empty(language, true)) {
                        path = `/README.${language}.md`;
                    }
                }
            }
            return {
                path: path,
                pathFallback: pathFallback
            };
        }
        function initialize() {
            // initialize styles and events
            window.onhashchange = app.loadDocument;
            config.renderer = new app.markdown();
            vbcodeStyle.lineHeight = "5px";
            language = lang();
            app.renderDocument(getTargetFile());
        }
        app.initialize = initialize;
        function loadDocument() {
            app.renderDocument(getTargetFile());
        }
        app.loadDocument = loadDocument;
        /**
         * This function returns title of the article
        */
        function updateArticle(html, time) {
            let h1;
            let dateTag;
            // update article content
            $ts("#article").innerHTML = html;
            // and then highligh vb code block
            vscode.highlightVB(vbcodeStyle);
            h1 = $ts("#article").getElementsByTagName("h1")[0];
            dateTag = $ts("<span>", {
                style: "color: grey; font-size: 0.8em;"
            }).display("#" + time.toLocaleDateString() + "#");
            let diff = Date.now() - time.getTime();
            let days = Math.floor(diff / (1000 * 60 * 60 * 24));
            if (!isNullOrUndefined(h1)) {
                document.title = h1.innerText;
                h1.insertAdjacentElement("afterend", dateTag);
                if (days > 30) {
                    let warn = $ts("<p>", {
                        style: "color: lightgrey; background-color: yellow;"
                    }).display(`This article is posted ${days} days before, information in this article may be obsolete...`);
                    dateTag.insertAdjacentElement("afterend", warn);
                    dateTag.insertAdjacentElement("afterend", $ts("<br>"));
                }
            }
            return h1.innerText;
        }
        app.updateArticle = updateArticle;
        /**
         * Render a given markdown document to html and display on the document body
         *
         * @param ref The document fullname reference or file basename
        */
        function renderDocument(ref) {
            let count = 0;
            let url = (function () {
                if (typeof ref == "string") {
                    return getTargetFile(ref);
                }
                else {
                    return ref;
                }
            })();
            let renderDocumentInternal = function (markdown) {
                let html;
                if (Strings.Empty(markdown, true)) {
                    // 404的时候返回的是空字符串
                    if (count == 0) {
                        count++;
                        // request for fallback document path
                        $ts.getText(url.pathFallback, renderDocumentInternal, {
                            nullForNotFound: true
                        });
                        return;
                    }
                    else {
                        // 目标文档查找失败
                        html = `
<h1>404 Not Found</h1>
<p>The requested URL <strong>${url.path}</strong> was not found on this server.</p>`;
                    }
                }
                else {
                    html = marked(markdown, config);
                }
                let date = markdown.match(/[<][!][-]{2,}\s+\d+([-]\d+){2}\s+[-]{2,}>/g)[0];
                let time = new Date(Date.parse(date.match(/\d+([-]\d+){2}/g)[0]));
                let title = vanillavb.app.updateArticle(html, time);
                // push stack
                let frame = new NamedValue(title, $ts.location.hash({
                    trimprefix: false
                }));
                if (history.length == 0) {
                    $ts("#goback").hide();
                }
                else {
                    let back = history[history.length - 1];
                    let a = $ts("<a>", {
                        title: back.name,
                        href: executeJavaScript,
                        onclick: function () {
                            if (history.length > 0) {
                                history.pop();
                            }
                            if (back.value == window.location.hash) {
                                $ts("goback").hide();
                            }
                            else {
                                window.location.hash = back.value;
                            }
                        }
                    }).display(back.name);
                    $ts("#previous-article-title").display(a);
                    $ts("#goback").show();
                }
                history.push(frame);
            };
            if (isNullOrUndefined(url)) {
                // stop render when path is nothing
                return;
            }
            // fetch markdown document from server and run renderer
            $ts.getText(url.path, renderDocumentInternal, {
                nullForNotFound: true
            });
        }
        app.renderDocument = renderDocument;
    })(app = vanillavb.app || (vanillavb.app = {}));
})(vanillavb || (vanillavb = {}));
/// <reference path="../linq.d.ts" />
/// <reference path="../marked.d.ts" />
/// <reference path="../vbcode.d.ts" />
/// <reference path="initialize.ts" />
$ts.mode = Modes.debug;
// run web app
$ts(vanillavb.app.initialize);
//# sourceMappingURL=docs.js.map