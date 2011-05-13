
$().ready(function(){
	loadDocuments();
});

function loadDocuments(){
	$("#docs-list").html("");
	var arr = localStorage.getItem("ac-data");
	if(!arr){
		$("#docs-list").html("No saved translations yet.");
		return false;
	}
	arr = eval(arr);
	for (var k in arr) {
		var val = localStorage.getItem(arr[k]);
		val = JSON.parse(val);
		$("#docs-list").append('<a href="document.html#'+arr[k]+'" style="text-decoration: none;"><div class="doc-link"> <span style="font-size: 0.8em; float: right;">'+getPairName(val.pair)+' | '+val.progress+'% <button class="del-button" id="doc-del-'+arr[k]+'" onclick="deleteDocument(\''+arr[k]+'\'); return false;">delete</button></span>'+val.name+'</div></a>');
		$("#doc-del-"+arr[k]).button({
			text: false,
			icons: {
				primary: "ui-icon-circle-close"
			}
		});
	}
}

function deleteDocument(document){
	if(!confirm("Do you really want to delete this translation?"))
		return false;
	var arr = eval(localStorage.getItem("ac-data"));
	var newArr = [];
	var i = 0;
	for (var k in arr) {
		if (arr[k] == document){
			localStorage.removeItem(document);
		}else{
			newArr[i] = arr[k];
			++i;
		}
	}
	if(newArr.length == 0){
		localStorage.removeItem("ac-data");
	}else{
		localStorage.setItem("ac-data",JSON.stringify(newArr));
	}
	loadDocuments();
	return false;
}

function createDocument(){
	var text = $("#translation-input").val();
	var delimiters = [".","!","?"];
	var line = "";
	var spliting = false;
	var firstSplit = false;
	var input = new Array();
	var white = 0;
	var last = ' ';
	for (var i in text){
		c = text[i];
		//if(c == '\n') alert(1);
		if (spliting == true){
				if (c != ' ' && c != '\n' && c != '\t'){
					if (white > 0 || last == '\n'){
						input[input.length] = line;
						line = "";
					}
					spliting = false;
				}else{
					++white;
				}
		}
		line += c;
		if (c == '.' || c == '!' || c == '?' || c == '\n'){
			spliting = true;
			white = 0;
		}
		last = c;
	}
	input[input.length] = line;
	
	var doc = {};
	doc['name']='New translation';
	doc['sourceLanguage']='en';
	doc['targetLanguage']='cs';
	doc['pair']='cs-en';
	var time = new Date();
	doc['createTime'] = time.getTime();
	doc['saveTime'] = time.getTime();
	doc['progress'] = 0;
	doc['position'] = 0;
	var data = [];
	for (var i = 0; i < input.length; ++i){
		var sent = {};
		sent['s'] = input[i];
		sent['t'] = '';
		data[i] = sent;
	}
	doc['data'] = data;
	var str = JSON.stringify(doc);
	var acdata = localStorage.getItem("ac-data");
	if (!acdata){
		acdata = [];
	}else{
		acdata = eval(acdata);
	}
	var name = randomString();
	acdata[acdata.length] = name;
	localStorage.setItem(name,str);
	localStorage.setItem("ac-data",JSON.stringify(acdata));
	location.href = "document.html#"+name;
}

function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 16;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

function languageName(code){
	if(code == 'cs') return 'czech';
	if(code == 'de') return 'deutsch';
	if(code == 'en') return 'english';
	return code;	
}

