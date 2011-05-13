var actualSentence = -1;

function selectSuggestion(i){
	actualSuggestion = i;
	for (var j = 0; j < numOfSuggestions; j++){
		$("#suggestion-"+j).removeClass("selectedsuggestion");
	}
	$("#suggestion-"+i).addClass("selectedsuggestion");
}

function loadDocument(doc){
	applyChanges();
	
	for (var i = 0; i < doc.data.length; i++) {  
		$("#top-source-sentences").append("<span class=\"sentence\" id=\"ts-"+i+"\">"+doc.data[i].s+"</span>"); 
		$("#top-target-sentences").append("<span class=\"sentence\" id=\"tt-"+i+"\">"+doc.data[i].t+"</span>");
		$("#bottom-source-sentences").append("<span class=\"sentence\" id=\"bs-"+i+"\">"+doc.data[i].s+"</span>"); 
		$("#bottom-target-sentences").append("<span class=\"sentence\" id=\"bt-"+i+"\">"+doc.data[i].t+"</span>");
	}
	$(".sentence").click(function(){
		var clicked = $(this).attr("id").substr(3);
		showSentence(clicked);
	});

	$(".sentence").hover(function(){
		var hovered = $(this).attr("id").substr(3);
		$("#ts-"+hovered).addClass("hover");
		$("#tt-"+hovered).addClass("hover");
		$("#bs-"+hovered).addClass("hover");
		$("#bt-"+hovered).addClass("hover");
	},function(){
		var hovered = $(this).attr("id").substr(3);
		$("#ts-"+hovered).removeClass("hover");
		$("#tt-"+hovered).removeClass("hover");
		$("#bs-"+hovered).removeClass("hover");
		$("#bt-"+hovered).removeClass("hover");
	});

	$(window).keydown(function(event){
		var c = event.which;
		if(c == '33'){
			//pgup
			showSentence(actualSentence - 1);
			return false;
		}else if(c == '34'){
			//pgdown
			showSentence(parseInt(actualSentence) + 1);
			return false;
		}else if(c == '38'){
			//arrowup
			if(actualSuggestion == -1){
				return false;
			}
			selectSuggestion(actualSuggestion - 1);
			return false;
		}else if(c == '40'){
			//arrowdown
			if(actualSuggestion >= numOfSuggestions - 1){
				return false;
			}
			selectSuggestion(actualSuggestion + 1);
			return false;
		}else if(c == '9'){
			//tab
			var i = actualSuggestion;
			if (i == -1) i = 0;
			addPartialSuggestion(i);
			return false;
		}else if(c == '13'){
			//enter
			if (actualSuggestion != -1){
				//alert($("#new-suggestion-"+actualSuggestion).html());
				addSuggestion(actualSuggestion);
				if (event.preventDefault) event.preventDefault();
				if (event.stopPropagation) event.stopPropagation();
				return false;
			}
			return true;
		}else if(c == '83' && event.ctrlKey){
			saveDocument();
			return false;
		}
	});
	
	$(window).keyup(function(event){
		var c = event.which;
		if (c == '38' || c == '40' || c == '13'){
			return false;
		}
		loadSuggestion();
	});

	$("#panel-target").autoResize({
	    extraSpace : 0
	});
	
	$("#button-save").button().click(saveDocument);
	/*.next().button(
			{
				text: false,
				icons: {
					primary: "ui-icon-triangle-1-s"
				}
			}).parent().buttonset();*/
	
	$("#button-settings").button().click(showSettings);
	
	$("#button-preview").button().click(showPreview);
	
	showSentence(doc.position);
}

function showPreview(){
	//alert(2);
	$("#preview-source").text('');
	$("#preview-target").text('');
	
	for(i in doc.data){
		$("#preview-source").append(doc.data[i].s);
		$("#preview-target").append(doc.data[i].t);
	}
	
	$("#preview-tabs").tabs();
	$("#preview-dialog").dialog({modal:true, width: 700});
}

function addSuggestion(i){
	appendText($("#new-suggestion-"+i).html());
	loadSuggestion();
}

function addPartialSuggestion(i){
	var text = $("#new-suggestion-"+i).html().split(" ");
	appendText(text[0]);
	loadSuggestion();
}

function appendText(text){
	$("#panel-target").val($("#panel-target").val()+text+" ");
}

function showSentence(index){
	$("#panel-target").focus();
	if(index < 0 || index >= doc.data.length){
		return false;
	}

	if(actualSentence >= 0){
		$("#tt-"+actualSentence).text($("#panel-target").val());
		$("#bt-"+actualSentence).text($("#panel-target").val());
		doc.data[actualSentence].t = $("#panel-target").val();
	}
	
	actualSentence = index;
	$("#panel-source").text($("#ts-"+index).html());
	$("#panel-target").val($("#tt-"+index).html());
	
	for (var i = 0; i < doc.data.length; i++) {  
		if(i < index){
			$("#ts-"+i).show();
			$("#tt-"+i).show();
			$("#bs-"+i).hide();
			$("#bt-"+i).hide();
		}else if(i == index){
			$("#ts-"+i).hide();
			$("#tt-"+i).hide();
			$("#bs-"+i).hide();
			$("#bt-"+i).hide();
		}else{
			$("#ts-"+i).hide();
			$("#tt-"+i).hide();
			$("#bs-"+i).show();
			$("#bt-"+i).show();
		}
	}
	loadTable();	
	$(window).scrollTop($("#translation-panel").offset().top - 100);

}

function loadTable(){
	var text = $("#panel-source").text();
	var source = "proxy/table.php?pair="+doc.pair+"&q="+encodeURI(text);
	//alert(source);
	$.getJSON(source,function (data){
		//alert(data.source.length);
		tableData = data;
		var table = "";
		table += '<table class="table"><tr>';
		headLength = data.source.length;
		for(var i in data.source){
			var classes = "";
			if (i == 0){
				classes += " leftcell";
			}
			if (i == data.source.length - 1){
				classes += " rightcell";
			}
			table += '<td><div id="head-'+i+'" class="head'+classes+'" onclick="clickHead(\''+i+'\')">'+data.source[i]+'</div></td>';
			clickedVector[i] = false;
		}
		table += "</tr>";
		for(var i in data.target){
			table += '<tr>';
			var start = 0;
			for(var j in data.target[i]){
				table += '<td colspan="'+data.target[i][j].s+'">';
				if(!data.target[i][j].empty){
					table += '<div class="cell" onclick="cellClick('+i+','+j+','+start+','+ (parseInt(start) + parseInt(data.target[i][j].s) - 1) +')">'+data.target[i][j].t+'</div>';
				}
				start += parseInt(data.target[i][j].s);
				table += '</td>';
			}
			table += '</tr>';
		}
		table += "</table>";
		$("#translation-table").html(table);
	});
}

function cellClick(i, j, from, to){
	appendText(tableData.target[i][j].t);
	coverInput(from,to);
}

function coverInput(from, to){
	for (var i = from; i <= to; ++i){
		$("#head-"+i).addClass("clickedhead");
		clickedVector[i] = true;
	}
	loadSuggestion();
}

var tableData;
var numOfSuggestions;
var actualSuggestion;

function loadSuggestion(){
	var res = "";
	var text = $("#panel-source").text();
	for (var i = 0; i < headLength; ++i){
		if(clickedVector[i] == true){
			res += "1";
		}else{
			res += "0";
		}
	}
	//var source = "suggestion.json";
	var translated = $("#panel-target").val();
	var source = "proxy/suggestion.php?pair="+doc.pair+"&translated="+encodeURI(translated)+"&covered="+res+"&q="+encodeURI(text);
	$.getJSON(source,function (data){
		$("#suggestions").html("");
		numOfSuggestions = data.suggestions.length;
		actualSuggestion = -1;
		for(var i in data.suggestions){
			var c = '';
			if(i == data.suggestions.length - 1){
				c = ' bottom';
			}
			$("#suggestions").append('<pre class="suggestion'+c+'" id="suggestion-'+i+'" onclick="addSuggestion('+i+')" onmouseout="selectSuggestion(-1)" onmouseover="selectSuggestion('+i+')"><span class="translated">'+translated+'</span><span id="new-suggestion-'+i+'" class="new-suggestion">'+data.suggestions[i]+'</span></pre>');
		}
	});
}

function saveDocument(){
	showSentence(actualSentence);
	doc.position = actualSentence;
	countProgress();
	localStorage.setItem(hash,JSON.stringify(doc));
	//alert('Document saved');
}

function showSettings(){
	//<option value="cs">czech</option>
	
	for(var p in pairs){
		var t = '<option value="'+pairs[p].code+'"';
		if(pairs[p].code == doc.pair) t += 'selected';
		t += '>'+pairs[p].description+'</option>';
		
		$("#lng-pair").append(t);
	}
	
	$("#settings-name").val(doc.name);
	$("#settings-save").button().click(saveSettings);

	$("#settings-tabs").tabs();
	$("#settings-dialog").dialog({modal:true, width: 700});
	
	$("#settings-name").change(saveSettings);
	$("#lng-pair").change(saveSettings);
}

function applyChanges(){
	document.title = doc.name + " | ajax-cat";	
	$("#doc-name").text(doc.name);	
	$("#doc-pair").html(getPairName(doc.pair));
}

function countProgress(){
	var sum = 0;
	for(var d in doc.data){
		if(doc.data[d].t.length > 0)
			++sum;
	}
	doc.progress = parseInt((sum * 100) / doc.data.length);
}

function saveSettings(){
	doc.name = $("#settings-name").val();
	doc.pair = $("#lng-pair").val();
	applyChanges();
	saveDocument();
}

function clickHead(i){
	if(clickedVector[i] == false){
		$("#head-"+i).addClass("clickedhead");
		clickedVector[i] = true;
	}else{
		$("#head-"+i).removeClass("clickedhead");
		clickedVector[i] = false;
	}
	loadSuggestion();
}

var clickedVector = new Array();
var headLength;
var doc;
var hash;

$().ready(function(){
	hash = window.location.hash.substr(1);
	var data = localStorage.getItem(hash);
	doc = JSON.parse(data);
	loadDocument(doc);
});

function languageName(code){
	if(code == 'cs') return 'czech';
	if(code == 'de') return 'deutsch';
	if(code == 'en') return 'english';
	return code;	
}
