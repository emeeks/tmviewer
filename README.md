tmviewer
========

A topic model viewer

This is very rough and not documented. I will try to clean up some of the assumptions hardwired in the code. It expects three data files:

topics.json - JSON formatted results from a topic model that provide the total number of tokens in the model, the number of unique tokens, and word tokens with some float representation of how they relate to the model (percent of total tokens, percent of the word, or otherwise)

topictime.csv - CSV-formatted results of each topic and its total density per year. The code is currently hard-coded for years and doesn't calculate the max density

metadata.csv - CSV-formatted metadata for the documents, which is used to populate the dialog when you click on a Topic Title

doclinks.csv - CSV-formatted links between documents and topics, which includes strength