# Load the necessary package for reading Excel files
library(readxl)

# Read in the Excel file
my_data <- read_excel("trials.xlsx", sheet = "final")

# Select the columns you're interested in
selected_cols <- c("s1", "o1", "s2", "o2", "randomnr", "ingroup")

# Loop through each row of the selected columns and create the text you want
output_list <- list()
for (i in 1:nrow(my_data)) {
  temp_dict <- list(
    s1 = my_data[i, "s1"],
    o1 = my_data[i, "o1"],
    s2 = my_data[i, "s2"],
    o2 = my_data[i, "o2"],
    ingroup = my_data[i, "ingroup"],
    random = my_data[i, "randomnr"]
  )
  output_list[[i]] <- paste0("{\n  \"", paste(names(temp_dict), sapply(temp_dict, function(x) x), sep = "\": ", collapse = ",\n  \""), "\"\n},")
}

# Print the output
cat(paste(output_list, collapse = "\n"))
