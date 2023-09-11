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

#' create doi badge image html
#' 
#' @param doi the doi string
#' @param version the mzkit software version
#' 
doi_badge = function(doi as string, version as string) {
    `
        <a href="https://doi.org/${doi}">
            <img src="https://zenodo.org/badge/DOI/${doi}.svg" alt="DOI of ver${version}">
        </a>
    `;
}

#' Create release note html 
#' 
#' @param info the update release note of the specific version of the mzkit software
#' 
toHtmlText = function(info) {
    special_notes = info$updates$note;
    special_notes = {
        if (length(special_notes) > 0) {
            `
            <p>
                <blockquote>${paste(special_notes, sep = "<br />")}</blockquote>
            </p>
            `;
        } else {
            "";
        }
    }

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
    str(info);

	`
        <h5 id="${info$version}">${info$version}</h5>
        <blockquote>
            ${doi_badge(
                doi = info$DOI, 
                version = info$version
            )}
        </blockquote>
        <p>
            #${as.date(info$date) |> toString('MMM dd, yyyy')}#
        </p>
        <ul>
            ${paste(update_list, sep = "")}
        </ul>

        ${special_notes}
	`;
}