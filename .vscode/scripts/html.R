const html_styles = {
    "enhancement": "badge rounded-pill bg-dark",
            "new": "badge rounded-pill bg-primary",
          "fixed": "badge rounded-pill bg-success",
         "update": "badge rounded-pill bg-info text-dark"
};

toUpdatesHtmlList = function(info, term) {
	sapply(info, function(i) {
		`<li>
			<span class="${html_styles[[term]]}">${term}</span> 
			${i}
		 </li>
		`;
	});
}

toHtmlText = function(info) {
    special_notes = info$updates$note;
	update_list = info$updates;
	update_list = {
        for(term in names(update_list)) {
            if (term != "note") {
                toUpdatesHtmlList(update_list[[term]], term);
            }
        }
    }
	update_list = unlist(update_list);

    print(special_notes);

	`
        <h5>${info$version}</h5>
        <blockquote>DOI: ${info$DOI}</blockquote>
        <p>
            #${as.date(info$date) |> toString('MMM dd, yyyy')}#
        </p>
        <ul>
            ${paste(update_list, "")}
        </ul>
	`;
}