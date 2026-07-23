function renderTip(template, context) {
    var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
    return template.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }
        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;
        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    });
}

String.prototype.renderTip = function (context) {
    return renderTip(this, context);
};

if(nospecialtip == false){
	var re = /x/;
	console.log(re);
	re.toString = function() {
		showMessage('哇，好熟练地开控制台，想看我的秘密吗？', 5000);
		return '';
	};

	$(document).on('copy', function (){
		showMessage('复制了什么？欢迎转载，但要记得加上出处哦！', 5000);
	});
}

$("#landlord,#live2d").mousedown(function(e) {
	if (3 == e.which)
	showMessage("秘密通道:<br><a href=\""+home_Path+"\">首页</a> <a href=\""+home_Path+"wp-admin/\">登录</a>",5000);
})

function initTips(){
    $.ajax({
        cache: true,
        url: `${message_Path}message.json.php`,
        dataType: "json",
        success: function (result){
            $.each(result.mouseover, function (index, tips){
                $(tips.selector).mouseover(function (){
                    var text = tips.text;
                    if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                    text = text.renderTip({text: $(this).text()});
                    showMessage(text, 3000);
                });
            });
            $.each(result.click, function (index, tips){
                $(tips.selector).click(function (){
                    var text = tips.text;
                    if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                    text = text.renderTip({text: $(this).text()});
                    showMessage(text, 3000);
                }); 
            });          
        }
     });
}
initTips();

(function (){
	$('#landlord').bind("contextmenu", function() {return false;});
	$('#landlord').bind("selectstart", function() {return false;});
    var text;
    if(document.referrer !== ''){
        var referrer = document.createElement('a');
        referrer.href = document.referrer;
        if(`${home_Path}`.indexOf(referrer.hostname) > 0 ){return;}
        text = '你好呀，来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的小伙伴！很高兴遇到你！欢迎！';
        var domain = referrer.hostname.split('.')[1];
        if (referrer.hostname == 'www.luotianyi.blue') {
            text = '<span style="color:#66CCFF;">❤ 人海相遇，是个奇迹，很高兴在这里遇见你！虎啸！❤</span>';
        }else if (domain == 'github') {
            text = '你好呀，来自Github的大佬！很高兴遇到你！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }else if (domain == 'baidu') {
            text = '你好呀，来自百度的小伙伴！很高兴遇到你！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }else if (domain == 'bing') {
            text = '你好呀，来自必应的小伙伴！很高兴遇到你！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }else if (domain == 'so') {
            text = '你好呀，来自360的小伙伴！很高兴遇到你！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }else if (domain == 'google') {
            text = '你好呀，来自谷歌的小伙伴！很高兴遇到你！<br>你一定是一个技术宅吧！欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span></span>';
        }else if (domain == 'bilibili') {
            text = '你好呀，来自B站的小伙伴！很高兴遇到你！<br>是二次元的Friends呢！</span>';
        }
    }else {
        if (window.location.href == `${home_Path}`) { //主页URL判断，需要斜杠结尾
            var now = (new Date()).getHours();
            if (now > 0 || now <= 5) {
                text = 'We can sleep all day and party all night!';
            } else if (now > 5 && now <= 7) {
                text = '早上好！早餐一定要吃哦！小笼包，叉烧包，奶黄芝麻豆沙包！挑一个吧！';
            } else if (now > 7 && now <= 11) {
                text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
            } else if (now > 11 && now <= 14) {
                text = '已经中午了，准备吃什么呀？好饿好饿好饿(๑´ㅂ`๑)';
            } else if (now > 14 && now <= 17) {
                text = '午后容易犯困呢，打起精神别摸鱼啦，今天的目标完成了吗？';
            } else if (now > 17 && now <= 18) {
                text = '傍晚了！别忘了看看窗外的晚霞，很美丽呢，最美不过夕阳红~~';
            } else if (now > 18 && now <= 19) {
                text = '晚餐时间到！今晚又该吃什么呢？云吞面，麻辣烫，羊肉串，蟹壳黄！';    
            } else if (now > 19 && now <= 21) {
                text = '晚上好，今天过得怎么样？休息一会，开局游戏吧！';
            } else if (now > 21 && now <= 24) {
                text = '已经这么晚了呀，你也是深夜诗人吗？早点休息吧，晚安~~';
            } else {
                text = '？？？你为什么能看见的这句话？？？';
            }
        }else {
            text = '你正在阅读<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        }
    }
    showMessage(text, 12000);
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
			showMessage("要出门了吗？路上小心！（我不觉得你能看到这句话）", 5000);
        } else {
			showMessage("欢迎回来!", 5000);
        }
    });
})();

if(nohitokoto == false){
	var getActed = false;
	window.hitokotoTimer = 0;
	var hitokotoInterval = false;

	$(document).mousemove(function(e){getActed = true;}).keydown(function(){getActed = true;});
	setInterval(function() { if (!getActed) ifActed(); else elseActed(); }, 1000);

	function ifActed() {
		if (!hitokotoInterval) {
			hitokotoInterval = true;
			hitokotoTimer = window.setInterval(showHitokoto(localkoto), 20000);
		}
	}

	function elseActed() {
		getActed = hitokotoInterval = false;
		window.clearInterval(hitokotoTimer);
	}
}

function showHitokoto(lk){
	if(lk) {
		$.getJSON(message_Path+'localkoto.json.php',function(result){
			showMessage(result.localkoto, 5000);
		});
        }
        else {
    $.getJSON('https://v1.hitokoto.cn/',function(result){
        showMessage(result.hitokoto, 5000);
   });
}
}

function showMessage(text, timeout){
    if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
    //console.log('showMessage', text);
    $('.message').stop();
    $('.message').html(text).fadeTo(200, 1);
    if (timeout === null) timeout = 5000;
//      $('.hide-button').css("top",$("#landlord .message").height() - 30 + "px");
//      $('.switch-button').css("top",$("#landlord .message").height() - 5 + "px");
//		$('.sing-button').css("top",$("#landlord .message").height() - 5 + "px");
// 		$('.message').css("top",62 - $("#landlord .message").height() + "px");
    hideMessage(timeout);
}

function hideMessage(timeout){
    $('.message').stop().css('opacity',1);
    if (timeout === null) timeout = 5000;
    $('.message').delay(timeout).fadeOut(200);
}

function positionWrap(){
	$('.h2wrap, .h3wrap').click(function() {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
			if ($target.length) {
				var targetOffset = $target.offset().top;
				$('html,body').animate({
					scrollTop: targetOffset
				},
				800);
				return false;
			}
		}
	});
}

function initLive2d (){
    var theModel = new Array("天依", "Poi");
	var modelIdx = 0;
    $('#landlord').append("<ul class=\"l2d-menu\"><li class=\"l2d-action-L\" id=\"change-button\">变身</li><li class=\"l2d-action-L\" id=\"switch-button\">变装</li><li class=\"l2d-action\" id=\"hide-button\">隐藏</li><li class=\"l2d-action\" id=\"sing-button\" onclick=getsong();>Sing</li></ul>");
	if(false == nocatalog) $('.l2d-menu').prepend("<li class=\"l2d-action\" id=\"catalog-button\">目录</li>");
	$('body').append("<div class=\"show-button\">召唤</div>");
    if ($('.l2d-menu').fadeOut(0)){
        $('#hide-button').on('click', () => {
        $('#landlord').css('display', 'none');
			$('.show-button').fadeIn(300);
        });
        $('#change-button').on('click', () => {
            modelIdx = (modelIdx + 1) % theModel.length;
            loadlive2d('live2d',message_Path+'model/'+theModel[modelIdx]+'/model.json.php');
            showMessage("已切换成"+theModel[modelIdx],5000);
        });
        $('#switch-button').on('click', () => {
            $("#live2d").animate({opacity:'0'},100);
            loadlive2d('live2d', message_Path+'model/'+theModel[modelIdx]+'/model.json.php',showConsoleTips("更换"));
        });
        if(false == nocatalog){
			$('#catalog-button').on('click', () => {
				var tits = 0;
				var catalog;
				if ($('article h2').length || $('article h3').length) {
					catalog = "<p class=\"l2d-cat\">这里有文章的目录哦~</p><br>";
					$('article h2, article h3').each(function(){
						$(this).attr("id","title-" + tits);
						if(0 == $(this).filter('h2').val()) catalog += "<p class=\"l2d-h2cat\">&raquo;<a class=\"h2wrap\" href=\"#title-"+tits+"\">"+$(this).text()+"</a></p><br>";
						if(0 == $(this).filter('h3').val()) catalog += "<p class=\"l2d-h3cat\">&raquo;<a class=\"h3wrap\" href=\"#title-"+tits+"\">"+$(this).text()+"</a></p><br>";
						tits++;
					});
					setTimeout("positionWrap()",200);
				}
				else {
					catalog = "然而这里并没有目录。";
				}
				showMessage(catalog, 10000);
            });
	$('#sing-button').on('click', () => {
        //$("#sing").animate({opacity:'0'},100);
        //setTimeout("sing()",100);
    });
        }
    }
    $('#landlord').hover(() => {
    //  $('.hide-button').css("top",$("#landlord .message").height() - 30 + "px");
    //  $('.switch-button').css("top",$("#landlord .message").height() - 5 + "px");
	//	$('.sing-button').css("top",$("#landlord .message").height() - 5 + "px");
    //  $('.hide-button').fadeIn(200);
    //  $('.switch-button').fadeIn(200);
	//	$('.sing-button').fadeIn(200);
        $('.l2d-menu').fadeIn(200)
    }, () => {
    /*  $('.hide-button').fadeOut(200);
        $('.switch-button').fadeOut(200);
		$('.sing-button').fadeOut(200);*/
        $('.l2d-menu').fadeOut(200)
    });
	$('.show-button').on('click', () => {
		$('#landlord').css('display', 'block');
		$('.show-button').fadeOut(200);
    })
}
initLive2d ();

var num=2;
function getsong(){
		if(num%2==0){
					
	$.getJSON(`${live2d_Path}songs.json`,function(songs_json){
			var rnum = parseInt(Math.random()*songs_json.length);
			var songs_url = songs_json[rnum]["url"];
			var songs_name = songs_json[rnum]["name"];
		showMessage("正在播放 [ " + songs_name + " ]", 5000);
        document.getElementById("sing").innerHTML='<audio src='+songs_url+' id="myaudio" controls="controls" loop="false" hidden="true">';
		
		document.getElementById("sing-button").innerHTML="Pause";
		var myAuto = document.getElementById('myaudio');
            myAuto.play();
			num=num+1;
	});
}		
		else {
		document.getElementById("sing-button").innerHTML="Sing";
		document.getElementById("sing").innerHTML='<audio src="" id="myaudio" controls="controls" loop="false" hidden="true">';
		num=num+1;
        }

}
