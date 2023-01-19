imports "html.R";
imports "fileReader.R";

setwd(@dir);





val = load_file("D:\biodeep\mzkit_docs\.vscode\scripts\update_history\2021\update_history.csv");
html = toHtmlText(val);

str(val);

print(html);