var pairs =
[
	{
		"code":"cs-en",
		"description":"czech-english"
	},
	{
		"code":"en-cs",
		"description":"english-czech"
	},
	{
		"code":"de-en",
		"description":"deutsch-english"
	},
];

function getPairName(pair){
	for (var i in pairs){
		if(pairs[i].code == pair){
			return pairs[i].description;
		}
	}
	return pair;
}
