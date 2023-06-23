imports "html.R";
imports "fileReader.R";

const ROOT as string = `${@dir}/update_history/`;
const dbfiles as string = list.files(ROOT, pattern = "*.csv", recursive = TRUE);

print("database root:");
str(ROOT);
print("get database files about the release notes:");
print(dbfiles);

cat("\n\n");

# parse release notes and then build in 
# html text content
const release_notes = dbfiles 
|> lapply(path -> load_file(path))
|> orderBy(function(release_note) {
	as.date(release_note$date);
}, desc = TRUE)
;
const html as string = release_notes 
|> sapply(x -> toHtmlText(x))
|> paste("")
;
const template as string = `${@dir}/release_template.html`
|> readText()
|> gsub("${release_notes}", html)
;
const history_page = `${dirname(dirname(ROOT))}/HISTORY.html`;

# export html
print("export & updates of the release history:");
print(history_page);

writeLines(html, con = `${ROOT}/release_notes.html`);
writeLines(template, con = history_page);
