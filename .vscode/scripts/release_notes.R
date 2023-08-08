imports "html.R";
imports "fileReader.R";

const ROOT as string = `${@dir}/update_history/`;
const dbfiles as string = list.files(ROOT, pattern = "*.csv", recursive = TRUE);
const zh_flags = dbfiles == $".+[-]zh.csv";
const db_eng as string = dbfiles[!zh_flags];
const db_chs as string = dbfiles[zh_flags];

print("database root:");
str(ROOT);
print("get database files about the release notes:");
print("eng:");
print(db_eng);
print("chs:");
print(db_chs);

cat("\n\n");

const write_releaseNote = function(dbfiles, lang = NULL) {
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
	|> paste(sep = "")
	;
	const template as string = `${@dir}/release_template.html`
	|> readText()
	|> gsub("${release_notes}", html)
	|> gsub("${lang}", ifelse(is.null(lang), "zh", ""))
	|> gsub("${lang-suffix}", ifelse(is.null(lang), "-zh", ""))
	;
	const history_page = {
		if (is.null(lang)) {
			`${dirname(dirname(ROOT))}/HISTORY.html`
		} else {
			`${dirname(dirname(ROOT))}/HISTORY-${lang}.html`
		}
	};

	# export html
	print("export & updates of the release history:");
	print(history_page);

	writeLines(html, con = {
		if (is.null(lang)) {
			`${ROOT}/release_notes.html`;
		} else {
			`${ROOT}/release_notes-${lang}.html`
		}
	});
	writeLines(template, con = history_page);
}

write_releaseNote(db_eng, lang = NULL);
write_releaseNote(db_chs, lang = "zh");