#' Read csv database file and then convert to content list
#' 
#' @param path the file path to the csv table file, the
#'    data fields of ``option,value`` should contains in
#'    this table file.
#' 
load_file = function(path) {
    const description(x) = sapply(x, i -> i$value);
	const configs = path 
	|> read.csv(row.names = NULL, check.modes = FALSE) 
	|> as.list(byrow = TRUE) 
	|> groupBy("option")
	;

	# str(configs);
	
	{
		version: .Internal::first(configs$version)$value,
		DOI: .Internal::first(configs$DOI)$value,
		date: .Internal::first(configs$date)$value,
		updates: {
			"new": description(configs$new),
			"enhancement": description(configs$enhancement),
			"fixed": description(configs$fixed),
			"update": description(configs$update)
		}
	};
}