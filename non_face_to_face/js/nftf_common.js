
//하단 버튼 노출 
var bottomBtn = {
	init : function() {
		var checkLen = $('.j_check_all').length,
			checkOkLen = 0;
		$('.j_check_all').each(function(e) {
			var _this = $(this);
			if (_this.hasClass('check_on')) {
				checkOkLen++;
			}
		});
		if (checkLen == checkOkLen) {
			$('.j_btn_fix').fadeIn(200,'easeInOutCirc');
		}else {
			$('.j_btn_fix').fadeOut(200,'easeInOutCirc');
		}
	}
}

//오토포커스 이동
var focusMove = {
	init : function (target) {
		var _this = target;
		if (_this.next('.j_input_value').length > 0) {
			_this.next('.j_input_value').trigger('focus');
		}else if (_this.parents('.j_focus').nextAll('.j_focus').eq(0).length > 0) {
			_this.blur();
			if (_this.parents('.j_focus').nextAll('.j_focus').eq(0).find('.j_focus_open').length > 0) {
				_this.parents('.j_focus').nextAll('.j_focus').eq(0).show().find('.j_focus_open').trigger('click');
			}else {
				_this.parents('.j_focus').nextAll('.j_focus').eq(0).show().find('.j_input_value').trigger('focus');
			}
		}else if (_this.parents('.j_focus_group').nextAll('.j_focus_group').eq(0).length > 0) {
			_this.blur();

			_this.parents('.j_focus_group').nextAll('.j_focus_group').eq(0).show();

			$('.wrapper').on('scroll click touchstart touchmove',function(e) {e.preventDefault();});
			setTimeout(function() {
				$('body').css('min-height',$('html').height() +  (_this.parents('.j_focus_group').nextAll('.j_focus_group').eq(0).offset().top - 51));
				$('html,body').stop().animate({scrollTop : _this.parents('.j_focus_group').nextAll('.j_focus_group').eq(0).offset().top - 51},500);
				setTimeout(function() {
					$('.wrapper').off('scroll click touchstart touchmove');
					if (_this.parents('.j_focus_group').nextAll('.j_focus_group').eq(0).find('.j_focus').eq(0).find('.j_focus_open').length > 0) {
						_this.parents('.j_focus_group').nextAll('.j_focus_group').eq(0).find('.j_focus').eq(0).find('.j_focus_open').trigger('click');
					}else {
						_this.parents('.j_focus').nextAll('.j_focus_group').eq(0).find('.j_focus').eq(0).find('.j_input_value').trigger('focus');
					}
				},500);
			},200);
		}else {
			_this.blur();
			$('body').stop().animate({'min-height' : $('.contents').outerHeight()},500);
		}
	}
}

//인풋 텍스트 
var inputTxt = {
	init : function(target) {
		var _this = target;
		if ($(_this).prop('readonly')) {
			return false;
		}
		if (_this.val().length > 0) {
			if (_this.hasClass('j_check_all')) {
				_this.addClass('check_on');
			}
			if (_this.hasClass('j_email')) {
				layerEmail.init($(_this));
			}
			_this.siblings('.j_data_del').show();
		}else {
			_this.removeClass('check_on');
			_this.siblings('.j_data_del').hide();
		}
	}
}

//스크롤
var scrollArrOrg=[],
	scrollArr=[],
	layerScroll=[];
var scrollCont = {
	init : function(target) {
		if ($(target).find('.j_scroll').length > 0) {
			$(target).find('.j_scroll').addClass('on');
			scrollArrOrg.push(target);
			$.each(scrollArrOrg, function(i, el){
				if($.inArray(el, scrollArr) === -1) scrollArr.push(el);
			});
			for (var i = $(target).find('.j_scroll.on').length - 1; i >= 0; i--) {
				if ($(target).find('.layer_90').length > 0) {
					var popH = 0;
					if ($(target).find('.pop_fix_area').length > 0) {
						 popH = $(target).find('.pop_tit').height() +  $(target).find('.pop_fix_area').height();
					}else {
						popH = $(target).find('.pop_tit').height();
					}
					$(target).find('.j_scroll').eq(i).height($(target).find('.layer_contents').height() - popH);
				}
				layerScroll[scrollArr.indexOf(target)] = new Swiper($(target).find('.j_scroll.on')[i], {
					direction: 'vertical',
					slidesPerView: 'auto',
					freeMode: true,
					freeModeMomentumBounce: false,
					scrollbar: {
					//el: '.swiper-scrollbar',
					},
					mousewheel: true,
				});
			}
		}
	}
}

//레이어 열기
var layerOpen = {
	init : function(layerId, layerIndex) {

		$(layerId).fadeIn(400, 'easeInOutSine');

		setTimeout(function() {
			$('html,body').css('overflow','hidden');
			$('.contents,.layerpopup,.pop_tit').on('touchmove',function(e) {e.preventDefault();});
			
			$(layerId).addClass('on');
			if (layerIndex != undefined) {
				$(layerId).find('.j_select_slide_cont').css({'left' : -$(this).width()*layerIndex});
			}
		},110);

		scrollCont.init(layerId);
	}
}

//레이어 닫기
var layerClose = {
	init : function (target,subTarget) {
		var _this = $(target).parents('.layerpopup');

		if (subTarget == 'all') {
			setTimeout(function() {
				$('.layerpopup.on').fadeOut();
				_this.fadeOut();
				$('.layerpopup.on').removeClass('on');
				$('.j_scroll').removeClass('on');
			},100);
			$('html,body').css('overflow','');
			$('.contents,.layerpopup,.pop_tit').off('touchmove');
		}else {
			setTimeout(function() {
				_this.fadeOut(400, 'easeInOutSine');
				_this.removeClass('on');
				_this.find('.j_scroll').removeClass('on');
			},100);
			if($('.layerpopup.on').length == 1) {
				$('html,body').css('overflow','');
				$('.contents,.layerpopup,.pop_tit').off('touchmove');
			}
		}
		
		bottomBtn.init();
	}
}

//이메일
var layerEmail = {
	init : function(target) {
		$(target).siblings('.j_email_layer').slideDown(200,'easeInOutSine');
		scrollCont.init($(target).siblings('.j_email_layer'));
	}
}

//동의서
var checkType = {
	checking : function(thisTarget){
		var thisInput = thisTarget.attr('class')
		var checkingLength = $("input[type='checkbox']:checked"+'.'+thisInput).length
		var checkedLength = $('.'+thisInput).length
		if(checkedLength === checkingLength){
			thisTarget.parents('.j_checkbox').eq(1).find("input[type='checkbox']").first().prop('checked',true)
		}else if(checkingLength !== checkedLength){
			thisTarget.parents('.j_checkbox').eq(1).find("input[type='checkbox']").first().prop('checked',false)
		}
	}
}
//신청중인 상품 건 수
var applying_listCheck = {
	listCheck : function(lists){
		var list_ea = lists.length
		$('.pages_tit').find('.number').text(list_ea)
	}
}

// 상품 체크리스트
var checkPopup = {
	confirm : function(agrees, layer){
		// this.agrees = agrees
		$(layer).off('click').on('click' ,function(e){
			if(e.target.classList.contains('confirm')){
				$(this).hide()
				agrees.parentElement.classList.add('on')
				var agreeQuantity = $('.check_list li.on').length
				var itemTit = $('.tabs li').eq($(agrees).parents('.tabcont').index()).text();
				var itemName = $(agrees).children('strong').text()
				$('.checking_list').append("<li><span>"+itemTit+"</span><strong>"+itemName+"</strong></li>")    
				if(agreeQuantity > 0){
					$('.btn_fix').show();
				}
				$('.list_sum').text(agreeQuantity)
		   }
		})
	},
	cancel : function(agrees, layer){
		$(layer).click(function(e){
		   if(e.target.className === 'confirm'){
				$(this).hide()
				$(agrees).parent().removeClass('on')
				var agreeQuantity = $('.check_list li.on').length
				var itemName = $(agrees).children('strong').text()
				$('.checking_list li strong').each(function(){
					$(this).filter(function(){
						if($(this).text() === itemName)
						$(this).parent().remove();
					})
				})
				if(agreeQuantity <= 0){
					$('.btn_fix').hide();
				}
				$('.list_sum').text(agreeQuantity)
		   }else if(e.target.className === 'cancel'){
				$(this).hide()
		   }
		})
	},
		remove : function(deleteTarget, layer){
			$(layer).click(function(e){
				if(e.target.className === 'confirm'){
					$(this).hide()
					var targetLeyar = $(e.target).attr('layer-target')
					$(targetLeyar).show()
					$(targetLeyar).click(function(e){
						if(e.target.className === 'confirm'){
							$(this).hide()
							$(deleteTarget).remove();
							applying_listCheck.listCheck($('.applying_list>li'))
						}
					})
				}
			})
		}
	}

$(document).ready(function(){
	window.addEventListener("load", function(){
		setTimeout( function(){ window.scrollTo(0, 1); }, 100 );
		
		// guide_section 버튼 위치
		var browserHeight = $(window).height();  
		var contentHeight = $('.guide_section').outerHeight();  
		if(browserHeight < contentHeight){
			$('.guide_section').css({'position':'relative'})
			$('.btn_fix').css({'position':'absolute'}) 
		}

		
		if($('.wrapper').find('.go_center').hasClass('go_center') === true){
			if($('.wrapper').find('.point_position').hasClass('tpye01') === true){
				$('.go_center').height($('.point_position').offset().top)
			}
			if($('.wrapper').find('.point_position').hasClass('tpye02') === true){
				$('.go_center').height($(window).height()-$('.point_position').offset().top)
			}
		}

		if($('.wrapper').find('.first_intro').hasClass('first_intro') === true){
			setTimeout(function(){
				$('.first_intro').addClass('on')
			},500);
		}
		// if($('.wrapper').find('.loading_dot').hasClass('loading_dot') === true){
		// 	setTimeout(function(){
		// 		$('.loading_dot').addClass('on')
		// 	},500);
		//  }
		// 2020-03-26 삭제
	})
	// finance_list
	if($('.wrapper').find('.finance_list').hasClass('finance_list') === true){
		$('.finance_list li a').each(function(){
			var financeName = $(this).text();
			var financeList = $(this);
			switch(financeName){
				case '하나은행': financeList.css({'backgroundImage':'url(../images/symbol00@2x.png)'})
				break
				case '국민은행': financeList.css({'backgroundImage':'url(../images/symbol01@2x.png)'})
				break
				case '농협은행': financeList.css({'backgroundImage':'url(../images/symbol02@2x.png)'})
				break
				case '우리은행': financeList.css({'backgroundImage':'url(../images/symbol03@2x.png)'})
				break
				case '우체국': financeList.css({'backgroundImage':'url(../images/symbol04@2x.png)'})
				break
				case '신한은행': financeList.css({'backgroundImage':'url(../images/symbol05@2x.png)'})
				break
				case '기업은행': financeList.css({'backgroundImage':'url(../images/symbol06@2x.png)'})
				break
				case '경남은행': financeList.css({'backgroundImage':'url(../images/symbol07@2x.png)'})
				break
				case '광주은행': financeList.css({'backgroundImage':'url(../images/symbol08@2x.png)'})
				break
				case '대구은행': financeList.css({'backgroundImage':'url(../images/symbol09@2x.png)'})
				break
				case '부산은행': financeList.css({'backgroundImage':'url(../images/symbol07@2x.png)'})
				break
				case '산업은행': financeList.css({'backgroundImage':'url(../images/symbol10@2x.png)'})
				break
				case '상호저축은행중앙회': financeList.css({'backgroundImage':'url(../images/symbol11@2x.png)'})
				break
				case '새마을금고중앙회': financeList.css({'backgroundImage':'url(../images/symbol12@2x.png)'})
				break
				case '신협중앙회': financeList.css({'backgroundImage':'url(../images/symbol13@2x.png)'})
				break
				case '산림조합중앙회': financeList.css({'backgroundImage':'url(../images/symbol14@2x.png)'})
				break
				case '수협중앙회': financeList.css({'backgroundImage':'url(../images/symbol15@2x.png)'})
				break
				case '전북은행': financeList.css({'backgroundImage':'url(../images/symbol08@2x.png)'})
				break
				case '제주은행': financeList.css({'backgroundImage':'url(../images/symbol05@2x.png)'})
				break
				case '한국씨티은행': financeList.css({'backgroundImage':'url(../images/symbol16@2x.png)'})
				break
				case 'SC은행': financeList.css({'backgroundImage':'url(../images/symbol17@2x.png)'})
				break
				case '케이은행': financeList.css({'backgroundImage':'url(../images/symbol19@2x.png)'})
				break
				case '카카오뱅크': financeList.css({'backgroundImage':'url(../images/symbol18@2x.png)'})
				break
				case 'HMC투자증권': financeList.css({'backgroundImage':'url(../images/symbol20@2x.png)'})
				break
				case '케이프투자증권': financeList.css({'backgroundImage':'url(../images/symbol21@2x.png)'})
				break
				case 'NH투자증권': financeList.css({'backgroundImage':'url(../images/symbol02@2x.png)'})
				break
				case '교보증권': financeList.css({'backgroundImage':'url(../images/symbol22@2x.png)'})
				break
				case '대신증권': financeList.css({'backgroundImage':'url(../images/symbol23@2x.png)'})
				break
				case '미래에셋대우': financeList.css({'backgroundImage':'url(../images/symbol24@2x.png)'})
				break
				case 'DB금융투자': financeList.css({'backgroundImage':'url(../images/symbol25@2x.png)'})
				break
				case '메리츠종합금융증권': financeList.css({'backgroundImage':'url(../images/symbol26@2x.png)'})
				break
				case '부국증권': financeList.css({'backgroundImage':'url(../images/symbol27@2x.png)'})
				break
				case '상섬증권': financeList.css({'backgroundImage':'url(../images/symbol28@2x.png)'})
				break
				case '신영증권': financeList.css({'backgroundImage':'url(../images/symbol29@2x.png)'})
				break
				case '신한금융투자': financeList.css({'backgroundImage':'url(../images/symbol05@2x.png)'})
				break
				case '에스케이증권': financeList.css({'backgroundImage':'url(../images/symbol30@2x.png)'})
				break
				case '유안타증권': financeList.css({'backgroundImage':'url(../images/symbol31@2x.png)'})
				break
				case '유진투자증권': financeList.css({'backgroundImage':'url(../images/symbol32@2x.png)'})
				break
				case '이베스트투자증권': financeList.css({'backgroundImage':'url(../images/symbol33@2x.png)'})
				break
				case '키움증권': financeList.css({'backgroundImage':'url(../images/symbol34@2x.png)'})
				break
				case '하나금융투자': financeList.css({'backgroundImage':'url(../images/symbol00@2x.png)'})
				break
				case '한화투자증권': financeList.css({'backgroundImage':'url(../images/symbol35@2x.png)'})
				break
				case 'KB증권': financeList.css({'backgroundImage':'url(../images/symbol01@2x.png)'})
				break
				case '하이투자증권': financeList.css({'backgroundImage':'url(../images/symbol09@2x.png)'})
				break
				case '한국투자증권': financeList.css({'backgroundImage':'url(../images/symbol36@2x.png)'})
				break
			}
		})
	}

	// 상품 체크리스트
	$('.check_list li a').each(function(){
		$(this).on('click', function(e){
			if(!e.currentTarget.parentElement.classList.contains('on')){
				if($(this).attr('check-target') === undefined){
					$('.check_popup').show();
					checkPopup.confirm(e.currentTarget, $('.check_popup'));
				}else{
					var targetLeyar = $(this).attr('check-target')
					$(targetLeyar).show()
					checkPopup.confirm(e.currentTarget, $(targetLeyar));
				}
			}else if(e.currentTarget.parentElement.classList.contains('on')){
				$('.cancel_popup').show();
				checkPopup.cancel(e.currentTarget, $('.cancel_popup'));
			}
		})
	})

	// 신청중인 상품 리스트 삭제
	if($(this).find('.applying_list').hasClass('applying_list') === true){
		applying_listCheck.listCheck($('.applying_list>li'))
		$('.applying_list').children('li').click(function(e){
			if($(e.target).attr('class') === 'list_del'){
				var targetLeyar = $(e.target).attr('layer-target')
				$(targetLeyar).show()
				checkPopup.remove(e.currentTarget, $(targetLeyar))
			}
		})
	}
	
	// 동의서 체크
	$("input[type='checkbox']").change(function(){
		if($(this).prop('checked') === true){
			$(this).nextAll().children().find("input[type='checkbox']").prop('checked',true)
			checkType.checking($(this))
		}else if($(this).prop('checked') !== true){
			$(this).nextAll().children().find("input[type='checkbox']").prop('checked',false)
			checkType.checking($(this))
		}
	})



	//하단 버튼 노출
    bottomBtn.init();

	//오토포커싱 라벨 클릭 
	$('.j_focus').on('click','.j_focus_open',function (e) {
		var _this = $(this).parents('.j_focus');
		_this.addClass('on');
		setTimeout(function() {
			if (!_this.hasClass('focus')) {
				_this.addClass('focus');
			}
		},200);
		_this.find('.j_input_value').eq(0).trigger('click');
	});

	//오토포커싱 포커스, 키 이벤트
	$('.j_focus .input_data').on('click focusin focusout keypress',function(e) {
		var _this = $(this);
		if (e.type == 'focusin' || e.type == 'click') {
			$('.j_focus').removeClass('focus');
			_this.parents('.j_focus').addClass('focus');
			setTimeout(function() {
				inputTxt.init(_this);
			},110);
			if (_this.parents('.j_focus').nextAll('.j_focus').eq(0).length == 0) {
				_this.parents('.j_focus_group').nextAll('.j_focus_group').eq(0).show();
			}
		}else if (e.type == 'focusout') {
			setTimeout(function() {
				bottomBtn.init();
			},100);
		}else if (e.type == 'keypress') {
			if(e.keyCode == 13){
				_this.siblings('.j_data_del').hide();

				focusMove.init($(this));
			}
		}
	});

	//체크 박스, 라디오 포커스
	$('.j_focus,.j_focus02').on('change','.j_input_check',function(e) {
		var _this = $(this),
			_thisParent = $(this).parents('.j_focus,.j_focus02'),
			_inputTarget = $(this).attr('input-target');

		$('input:radio').prop('name',_this.attr('name')).parents('.j_focus,.j_focus02').removeClass('on');

		if ($(this).prop('checked')) {
			_thisParent.addClass('on');
			$(this).addClass('check_on');
			setTimeout(function() {
				_thisParent.addClass('focus');
				if ($(_inputTarget).prop('tagName') == 'INPUT') {
					$(_inputTarget).trigger('focus');
				}else {
					$(_inputTarget).trigger('click');
				}
			},100);
		}else {
			_thisParent.removeClass('focus');
			$(this).removeClass('check_on');
			setTimeout(function() {
				_thisParent.removeClass('on');	
			},100);
		}
		if (layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))] != undefined) {
			layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].update();
			layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].translateTo(0,0);
		}

		bottomBtn.init();
	});

	//input 텍스트 지우기 
	$('.j_data_del').on('touchstart click',function(e) {
		e.preventDefault();

		$(this).siblings('.j_input_value,.j_input_modify').removeClass('check_on').val('').trigger('focus');
		$('.j_email_layer').hide();
		bottomBtn.init();
	});

	//input 입력시 
	$('.j_input_value').on('click focusin focusout keyup',function(e) {
		var _this = $(this);
		if (e.type == 'keyup') {
			inputTxt.init($(this));
			layerEmail.init($(this));
		}
		if(e.type == 'focusin') {
			$('.j_data_del').hide();
			
			if (!_this.parents('.j_focus,.j_focus02').hasClass('focus')) {
				_this.parents('.j_focus,.j_focus02').addClass('focus');
			}
			inputTxt.init($(this));
		}else if (e.type == 'focusout') {
			$('.j_focus,.j_focus02').removeClass('focus');
			setTimeout(function() {
				$('.j_data_del').hide();
			},200);
		}
	});

	//셀렉트 선택
	$('body').on('click','.j_select li a',function(e) {
		e.preventDefault();
		var targetId = $(this).attr('href'),
			txt = $(this).text(),
			_thisSelectSlide = $(this).parents('.j_select_slide'),
			_thisSelectCont = $(this).parents('.j_select_slide_cont'),
			slideIndex = _thisSelectSlide.index() + 1;

		if (_thisSelectCont.is(':animated')) {
			return false;
		}

		$(targetId).removeClass('input_placeholder');
		if ($(targetId).prop('tagName') == 'INPUT') {
			$(targetId).val(txt).addClass('check_on');
		}else {
			$(targetId).text(txt).addClass('check_on');
		}

		if (_thisSelectSlide.length > 0) {
			if ($(this).parents('.j_select_slide_cont').find('.j_select_slide').length == slideIndex) {
				layerClose.init(this);
			}else {
				_thisSelectCont.stop().animate({'left' : -_thisSelectCont.find('.j_select_slide').width()*slideIndex},400,'easeInOutCirc');
			}
		}else {
			layerClose.init(this);
		}

		$('.j_focus,.j_focus02').removeClass('focus');
		if ($(this).hasClass('j_layer_open')) {
			layerClose.init(this);
		}else {
			focusMove.init($(targetId));
		}
	});

	//토글
	$('.j_toggle').on('click','.j_toggle_open',function(e) {
		var _this = $(this);
		$(this).siblings('.j_toggle_cont').slideToggle({
			progress: function(animation,progress) {
				if (layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))] != undefined) {
					layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].update();
				}
			},
			duration: 200,
			easing: 'easeInOutCirc'
		}).parents('.j_toggle').toggleClass('on');
	});

	//상단 자동 스크롤
	if ($('.wrapper').hasClass('j_up_scroll')) {
		$('.wrapper').on('scroll click touchstart touchmove',function(e) {e.preventDefault();});
		$('body').css('min-height',$('html').height() +  ($('#upScroll').offset().top - 51));
		setTimeout(function() {
			$('html,body').stop().animate({scrollTop : $('#upScroll').offset().top - 51},400,'easeInOutCubic');
			setTimeout(function() {
				$('.wrapper').off('scroll click touchstart touchmove');
				if ($('.j_focus_group').eq(0).find('.j_focus').eq(0).find(' .j_focus_open').length > 0) {
					$('.j_focus_group').eq(0).find('.j_focus').eq(0).find(' .j_focus_open').trigger('click');
				}else {
					$('.j_focus_group').eq(0).find('.j_focus').eq(0).find('j_input_value').eq(0).trigger('focus');
				}
			},400);
		},1000);
	}

	//포커스 이동
	$('.j_focus_move').on('click',function(e) {
		e.preventDefault();
		if ($('.layerpopup').is(':animated')) {
			return false;
		}
		var _this = this;
		if ($(this).attr('move-target') != undefined) {
			_this = $(this).attr('move-target');
		}
		focusMove.init($(_this));
	});

	//버튼 텍스트 변경
	$('.j_btn_toggle').on('click',function() {
		$(this).text($(this).attr('toggle-text'));
	});

	//input 수정 토글
	$(document).on('click','.j_data_modify',function() {
		$(this).hide().siblings('.j_input_modify').prop('readonly','').focus();
	});

	//input 수정 입력시 
	$('.j_input_modify').on('click focusin focusout keyup keypress',function(e) {
		var _this = $(this);
		if (_this.prop('readonly')) {
			return false;
		}
		if (e.type == 'keyup') {
			inputTxt.init(_this);
		}
		if(e.type == 'focusin') {
			$('.j_data_del').hide();
			
			if (!_this.parents('.j_focus,.j_focus02').hasClass('focus')) {
				_this.parents('.j_focus,.j_focus02').addClass('focus');
			}
			inputTxt.init(_this);
		}else if (e.type == 'focusout') {
			$('.j_focus,.j_focus02').removeClass('focus');
			setTimeout(function() {
				$('.j_data_del').hide();
				if (!_this.parents('.j_focus,.j_focus02').hasClass('focus')) {
					_this.prop('readonly','readonly').siblings('.j_data_modify').show();
				}
			},200);
		}else if (e.type == 'keypress') {
			if(e.keyCode == 13){
				$('.j_data_del').hide();
				$('.j_focus,.j_focus02').removeClass('focus');
				_this.prop('readonly','readonly').siblings('.j_data_modify').show();
			}
		}
		// 2020-03-27 추가 (신분증 확인 Input)
		bottomBtn.init();
	});

	//class 추가 
	$('.j_target_on').on('click',function() {
		$(this).addClass('on');
	});

	//리스트 토글
	$('.j_toggle_list').on('click','.j_toggle_open',function() {
		var _this = $(this);
		$(this).parents('li').addClass('on').siblings().removeClass('on').find('.j_toggle_cont').slideUp(200,'easeInOutCirc');
		$(this).siblings('.j_toggle_cont').slideDown({
			progress : function() {
				//$('body').scrollTop(_this.offset().top - 51);	
			},
			duration: 200,
			easing: 'easeInOutCirc'
		});
		$(this).siblings('.j_toggle_cont').promise().done(function() {
			if (layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))] != undefined) {
				layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].update();
			}
			if ($(this).parents('.j_scroll').length > 0) {
				layerScroll.translateTo( -(_this.offset().top - ($(this).parents('.j_toggle_list').offset().top ) + 20),500);
			}else {
				$('body').animate({
					'scrollTop' : _this.offset().top - 51
				},500);
			}
		});
	});

	$('.j_toggle_modify').on('click',function() {
		if ($(this).text() == '수정') {
			$(this).text('저장');
			$(this).parents('li').addClass('modify').find('.j_modify').removeClass('disabled').prop('readonly','');
		}else {
			$(this).text('수정');
			$(this).parents('li').removeClass('modify').find('.j_modify').addClass('disabled').prop('readonly','readonly');
		}
	});

	//
	$(document).on('click',function(e) {
		if (!$(e.target).parents('.j_email_layer').length > 0 && !$(e.target).hasClass('j_email')) {
			$('.j_email_layer').slideUp(200,'easeInOutSine');
		}
	});

	//탭이동
	$('.tabs li').each(function(){
        $(this).click(function(){
			var _this = $(this);
            $(this).addClass('on').siblings().removeClass('on')
            // console.log($('.tab_area .tabcont'))
			$(this).parents('.tab_area').siblings('.tab_cont_area').find('.tabcont').eq($(this).index()).show().siblings('.tabcont').hide();
			setTimeout(function() {
				if (layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))] != undefined) {
					layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].update();
					layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].translateTo(0,0);
				}
			},100);
        })
	})
});

$(window).load(function() {
	var haiSwiper = new Swiper('.hai_slide', {
		pagination: {
			el: '.swiper-pagination',
		}
	});

	//레이어 열기
	$('.j_layer_open').on('click',function(e) {
		if ($('.layerpopup').is(':animated')) {
			return false;
		}

		if ($(this).hasClass('disabled')) {
			return false;
		}

		var layerId = $(this).attr('layer-target'),
			layerIndex = $(this).attr('layer-slide-index');

		$('.j_focus,.j_focus02').removeClass('focus');
		$(this).parents('.j_focus,.j_focus02').addClass('focus');

		if ($(layerId).find('.hai_slide').length > 0) {
			setTimeout(function() {
				haiSwiper.update();
			},100);
		}

		layerOpen.init(layerId,layerIndex);
	});

	//레이어 닫기
	$('.j_layer_close').on('click',function(e) {
		// if ($('.layerpopup').is(':animated')) {
		// 	return false;
		// }
		layerClose.init(this);
	});
	$('.j_layer_all_close').on('click',function() {
		// if ($('.layerpopup').is(':animated')) {
		// 	return false;
		// }
		layerClose.init(this,'all');
	});
});