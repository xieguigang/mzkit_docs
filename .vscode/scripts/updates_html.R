setwd(@dir);


load_file = function(path) {
	const data = read.csv(path);
	
	print(data);
	
}

load_file("D:\biodeep\mzkit_docs\.vscode\scripts\update_history\2021\update_history.csv");