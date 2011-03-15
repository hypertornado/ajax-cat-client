<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr">

<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
	<meta name="description" content=""/>
	<meta name="keywords" content="" />
	<meta name="author" content="" />
	
	<script src="libraries/jquery.js" type="text/javascript"></script>
	<script src="libraries/scripts.js" type="text/javascript"></script>	
	<script src="libraries/autoresize.jquery.js" type="text/javascript"></script>
	
	<script type="text/javascript" src="libraries/jquery_smoothness/js/jquery-ui-1.8.6.custom.min.js"></script>
	<link type="text/css" href="libraries/jquery_smoothness/css/smoothness/jquery-ui-1.8.6.custom.css" rel="stylesheet" />	
	
	
	<link rel="stylesheet" type="text/css" href="libraries/styles.css" media="screen" />
	<title>ajax-cat</title>
	
</head>
<body>
<div class="top-panel" style="text-align: center;">
	<div style="width: 800px; border: 0px solid black; margin: 0px auto; text-align: left;">
		<img src="libraries/logo.png" style="width: 140px;margin: 5px 0px 0px 0px;" />
		<span style="float: right; margin: 25px 0px 0px 0px;">online tool for computer-aided translation based on moses smts</span>
	</div>
</div>
<div class="static-content">

<!--
<input type="button" onclick="localStorage.clear()" value="Smazat"></input>
-->

<h2>Your translations</h2>
<div id="docs-list"></div>

<h2>Navigation</h2>
<ul>
<li><a href="http://localhost:8888/raw?pair=de-en&q=das ist kleines haus" target="_blank">raw</a>
<li><a href="http://localhost:8888/simple?pair=de-en&q=das ist kleines haus" target="_blank">simple</a>
<li><a href="http://localhost:8888/table?pair=de-en&q=das ist kleines haus" target="_blank">table</a>
<li><a href="http://localhost:8888/suggestion?pair=de-en&translated=todlencto&covered=100000&q=das ist kleines haus" target="_blank">suggestion</a>
</ul>
<!--
 -->

<h2>New translation</h2>

<textarea rows="1" cols="1" class="quick-translation" name="text" id="translation-input" spellcheck="false">
	Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
</textarea>
<input type="button" onclick="createDocument()" value="Start translating" class="big-button" />
</div>
<div class="footer">Created by Ondřej Odcházel & Ondřej Bojar - <a href="http://ufal.mff.cuni.cz/">Institute of Formal and Applied Linguistics</a>, 
Charles University in Prague<br>
Supported by the grant:
FP7-ICT-2007-3-231720 (EuroMatrix Plus)</div>

<script>

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
		$("#docs-list").append('<a href="document.html#'+arr[k]+'" style="text-decoration: none;"><div class="doc-link"> <span style="font-size: 0.8em; float: right;">'+languageName(val.sourceLanguage)+' → '+languageName(val.targetLanguage)+' | '+val.progress+'% <button class="del-button" id="doc-del-'+arr[k]+'" onclick="deleteDocument(\''+arr[k]+'\'); return false;">delete</button></span>'+val.name+'</div></a>');
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
		if(c == '\n') alert(1);
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

</script>

</body>
</html>