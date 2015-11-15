$(document).ready(function () {

    // var request="";
    var request;
    //var request = [{ "id": 1, "parent": null, "text": "Прибор регистрирующий" }, { "id": 2, "text": "Датчик давления", "parent": 1 }, { "id": 3, "text": "Датчик температуры", "parent": 1 }, { "id": 5, "text": "Прибор Анализирующий", "parent": null }];
    var Level1 = Array();
    var Result_HTML = "";
    var tree;
    var matcl;
    var REQUEST;
    var text = "";
    var text2 = "";

    //$('#js-tree').jstree({
    //    'core': {
    //        'data': [
    //           { "id": "ajson1", "parent": "#", "text": "Simple root node" },
    //           { "id": "ajson2", "parent": "#", "text": "Root node 2" },
    //           { "id": "ajson3", "parent": "ajson2", "text": "Child 1" },
    //           { "id": "ajson4", "parent": "ajson2", "text": "Child 2" },
    //        ]
    //    }
    //});
    Start_Page();
   

    function Build_Tree(req) {
        //alert(req);
        tree = req;
        tree = JSON.parse(tree);
        request = JSON.stringify(req);
       

        request = request.replace(/ID/g, "id");

        request = request.replace(/AssemblyClassid/g, "parent");
       
        request = request.replace(/Description/g, "text");

        request = request.replace(/null/g, "\\\"#\\\"");
      
       // request.replace(/\0/g, "");
        request = JSON.parse(request);
        request = JSON.parse(request);
       
        $('#js-tree').on('changed.jstree', function (e, data) {
                var i, j, r = [];
                for (i = 0, j = data.selected.length; i < j; i++) {
                    r.push(data.instance.get_node(data.selected[i]).text);
                }
                for (var q = 0; q < tree.length; q++) {
                    if (tree[q].Description == r.join(', ')) {
                        matcl = tree[q].ID;
                    }
                }
                $("#content1 table tbody").empty();
                text = "";
                $.ajax({
                    url: 'api/Odata_servise/MaterialClassProperty?$filter=MaterialClassID eq ' + '"' + matcl + '"',
                    type: "GET",
                    async:false,
                    dataType: 'json',
                    success: function (result) {
                       
                        var dat = JSON.parse(result);
                        $.each(dat, function (i, item) {
                            text += "<tr> <td>" + item.Description + "</td><td>" + item.Value + "</td><td>not applicable</td></tr>";
                        });
                       
                        $("#content1 table tbody").html(text);

                    }
                });
                $("#content2 table tbody").empty();
                text2 = "";
                $.ajax({
                    url: 'api/Odata_servise/MaterialDefinition?$filter=MaterialClassID eq ' + '"' + matcl + '"',
                    type: "GET",
                    dataType: 'json',
                    success: function (result2) {
                       
                        var dat2 = JSON.parse(result2);
                        $.each(dat2, function (i, item1) {
                            text2 += "<tr> <td>" + item1.Description + "</td><td>" + item1.MaterialTestSpecification + "</td><td>" + item1.AssemblyDefinitionID + "</td><td>" + item1.AssemblyDefinitionID + "</td><td>" + item1.AssemblyType + "</td><td>" + item1.AssemblyRelationship + "</td></tr>";
                        });

                        $("#content2 table tbody").html(text2);

                    }
                });
                
        }).jstree({
            'core': {
                'data': request,
                'themes': {
                    'name': 'proton',
                    'responsive': true,
                    'url': "../Content/jstree/src/themes/proton/style.css"
                }

            },
            'plugins': ["search", "types", "ui"]
        });
        var to = false;
        $('#search_tree').keyup(function () {
            if (to) { clearTimeout(to); }
            to = setTimeout(function () {
                var v = $('#search_tree').val();
                $('#js-tree').jstree(true).search(v);
            }, 250);
        });

    }

    $('#myLink').click(getIt);

    function getIt() {
        $.ajax({
            type: "GET",
            url: $(this).attr('href'),
            error: function () {
                //show error handler
            },
            success: function (r) {
                $('.order').html(r);
            }
        });

        return false;
    }


    function Start_Page() {

        $.ajax({
            url: "http://localhost:51710/api/Odata_servise/MaterialClass?select=ID,Description,AssemblyClassID",
            type: "GET",
            dataType: 'json',
            success: function (result) {
                Build_Tree(result);

            }
        });
       
        
    }
    
  

    //function build_tree(cats, parent_id) {

    //    //if(cats[parent_id].length>0){

    //        tree = '<ul>';

    //        //foreach($cats[$parent_id] as $cat){

    //        //    $tree .= '<li>'.$cat['name'];

    //        //   $tree .=  build_tree($cats,$cat['id']);

    //        //  $tree .= '</li>';         

    //        //}
    //        for (var i = 0; i < cats.length; i++) {
    //            tree += '<li>' + cats[i].description;
    //            tree += build_tree(cats, cats[i].assclassid);
    //            tree += '</li>';
    //        }

    //        tree += '</ul>';

    //   // }
    //   // else return null;

    //    return tree;
    //}



    //function GetMaterialClass()
    //{
      
    //    rez = $.parseJSON(request);
    //    $("#multi-derevo").html(build_tree(rez,0));
    //}

    //GetMaterialClass();




    //$('#multi-derevo li:has("ul")').find('a:first').prepend('<em class="marker"></em>');
    //// вешаем событие на клик по ссылке
    //$('#multi-derevo li span').click(function () {
    //    // снимаем выделение предыдущего узла
    //    $('a.current').removeClass('current');
    //    var a = $('a:first', this.parentNode);
    //    // Выделяем выбранный узел
    //    //было a.hasClass('current')?a.removeClass('current'):a.addClass('current');
    //    a.toggleClass('current');
    //    var li = $(this.parentNode);
    //    /* если это последний узел уровня, то соединительную линию к следующему
    //     рисовать не нужно */
    //    if (!li.next().length) {
    //        /* берем корень разветвления <li>, в нем находим поддерево <ul>,
    //        выбираем прямых потомков ul > li, назначаем им класс 'last' */
    //        li.find('ul:first > li').addClass('last');
    //    }
    //    // анимация раскрытия узла и изменение состояния маркера
    //    var ul = $('ul:first', this.parentNode);// Находим поддерево
    //    if (ul.length) {// поддерево есть
    //        ul.slideToggle(300); //свернуть или развернуть
    //        // Меняем сосотояние маркера на закрыто/открыто
    //        var em = $('em:first', this.parentNode);// this = 'li span'
    //        // было em.hasClass('open')?em.removeClass('open'):em.addClass('open');
    //        em.toggleClass('open');
    //    }
    //});

    $('body').click(function () {
        $('a.current').removeClass('current');
    });

  


    ///////////////
    var cba = 0;
    var cbu = 0;
    var cbd = 0;
    var cbTab = 0;
    var list = "<li>прибор регистрирующий</li> <li>датчик давления</li> <li>датчик температуры</li> <li>датчик влажности</li> <li>датчик дыма</li>";
    var strResult = "";
   
    SetPage();


    ///////////////////////////////////////////////////////
    $('#e_b').click(function () {
       
        $('#search').css('display', 'none')
        
    });
    
    $('.ser').keyup(function () {
        strResult = "";
        $('.sub_menu').html(list);
        if ($('.ser').val()=="") {
            strResult = list;
            $(".sub_menu li").remove();
            $(".sub_menu").html(strResult);
            return;
        }

        var searchString = $('.ser').val();
        searchString = searchString.replace(/\s{2,}/g, ' ');
        searchString = $.trim(searchString);
        searchString = searchString.toLowerCase();
        var list_search = $('.sub_menu li:contains("' + searchString + '")');
        $.each(list_search, function (index, element) {

            strResult += "<li>" + $(element).text() + "</li>";

        });

        $(".sub_menu li").remove();
        $(".sub_menu").html(strResult);
        strResult = "";
    });




    $('table tr').click(function(){
        if(this.rowIndex>0)
        {
            $('#count').text($(this.cells[0]).text());
        }
    });

    //
    $('#inp').click(function () {

        setTimeout(function () {
            $.fancybox.close();
            SetPage();
        }, 3000);
        
        
    });

  
    

    //

    $('#ad').click(function(){
      
        if(cba==0)
        {
            $("#ad").css('border-radius','50px');
            $("#create").css('display','block');
            cba++;
        }
        else
        {
            $("#ad").css('border-radius','5px');
            $("#create").css('display','none');
            cba=0;
        }
          
    });
    
    $('#up').click(function(){
      
        if(cbu==0)
        {
            $("#up").css('border-radius','50px');
            $("#edit").css('display','block');
            cbu++;
        }
        else
        {
            $("#up").css('border-radius','5px');
            $("#edit").css('display','none');
            cbu=0;
        }
           
    });
    
    $('#del').click(function(){
       
        if(cbd==0)
        {
            $("#del").css('border-radius','50px');
            $("#delete").css('display','block');
            cbd++;
        }
        else
        {
            $("#del").css('border-radius','5px');
            $("#delete").css('display','none');
            cbd=0;
        }
            
           
    });

    
  function SetPage() {
		//if($("#ll").val()=="admin" && $("#lp").val()=="admin")
        //{
           
           
            $(".maian_mnu").css('cursor','pointer');
            $(".table-responsive").css('display','block');
          

            //var user = $("#loguser").text();
            //$(".top_links").text(user);
          
            //$(".logo").text('Сервер доступен!');
            
           
            $.fancybox.close();
            //setTimeout(function() {
				//$.fancybox.close();
			//}, 1000);
        //}
	} 
    
    $(".top_contacts").click(function() {
		location.reload(true);
	});  
    
    
	$(".auth_buttons").click(function() {
		$(this).next().slideToggle();
	});
	$(".main_mnu_button").click(function () {
	    $(".sub_menu").css('opacity', '0');
	    $(".sub_menu").css('z-index', '0');
	    cbTab = 0;
		$(".maian_mnu ul").slideToggle();
	});

	//Таймер обратного отсчета
	//Документация: http://keith-wood.name/countdown.html
	//<div class="countdown" date-time="2015-01-07"></div>
	var austDay = new Date($(".countdown").attr("date-time"));
	$(".countdown").countdown({until: austDay, format: 'yowdHMS'});

	//Попап менеджер FancyBox
	//Документация: http://fancybox.net/howto
	//<a class="fancybox"><img src="image.jpg" /></a>
	//<a class="fancybox" data-fancybox-group="group"><img src="image.jpg" /></a>
	$(".fancybox").fancybox();

	//Навигация по Landing Page
	//$(".top_mnu") - это верхняя панель со ссылками.
	//Ссылки вида <a href="#contacts">Контакты</a>
	$(".top_mnu").navigation();

	//Добавляет классы дочерним блокам .block для анимации
	//Документация: http://imakewebthings.com/jquery-waypoints/
	$(".block").waypoint(function(direction) {
		if (direction === "down") {
			$(".class").addClass("active");
		} else if (direction === "up") {
			$(".class").removeClass("deactive");
		};
	}, {offset: 100});

	//Плавный скролл до блока .div по клику на .scroll
	//Документация: https://github.com/flesler/jquery.scrollTo
	$("a.scroll").click(function() {
		$.scrollTo($(".div"), 800, {
			offset: -90
		});
	});

	//Каруселька
	//Документация: http://owlgraphic.com/owlcarousel/
	var owl = $(".carousel");
	owl.owlCarousel({
		items : 1,
		autoHeight : true
	});
    
	owl.on("mousewheel", ".owl-wrapper", function (e) {
		if (e.deltaY > 0) {
			owl.trigger("owl.prev");
		} else {
			owl.trigger("owl.next");
		}
		e.preventDefault();
	});
	$(".next_button").click(function() {
		owl.trigger("owl.next");
	});
	$(".prev_button").click(function() {
		owl.trigger("owl.prev");
	});

	//Кнопка "Наверх"
	//Документация:
	//http://api.jquery.com/scrolltop/
	//http://api.jquery.com/animate/
	$("#top").click(function () {
		$("body, html").animate({
			scrollTop: 0
		}, 800);
		return false;
	});
	
	//Аякс отправка форм
	//Документация: http://api.jquery.com/jquery.ajax/
	$("#log").submit(function() {
		$.ajax({
			type: "POST",
			url: "mail.php",
			data: $("#log").serialize()
            
		})
            //.done(function() {
			//setTimeout(function() {
				//$.fancybox.close();
			//}, 1000);
		//});
		return false;
	});




    // Получаем тиблички и добавляем




	function GetTables() {

	    $.ajax({

	        url: 'http://localhost:51496/api/values?what=tables',

	        type: 'GET',

	        dataType: 'json',

	        success: function (data) {

	            WriteResponse(data);

	        },

	        error: function (x, y, z) {

	            alert(x + '\n' + y + '\n' + z);

	        }

	    });

	}

	function WriteResponse(tables) {

	    var strResult = "";

	    $.each(tables, function (index, tables) {

	        strResult += "<li>" + tables + "</li>";

	    });

	    $(".sub_menu").html(strResult);



	}
    // ----------------------------------------

    // Нажимаем на выбранную таблицу
	$('.sub_menu').click(function (event) {
	    

	    //$.ajax({

	    //    url: 'http://localhost:51496/api/values?tab=table&dev=' + $(event.target).text(),

	    //    type: 'GET',

	    //    dataType: 'json',

	    //    success: function (data) {

	    //        WriteTab(data);

	    //    },

	    //    error: function (x, y, z) {

	    //        alert(x + '\n' + y + '\n' + z);

	    //    }

	    //});

	})

	function WriteTab(table) {

	    var strResult = "";

	    $.each(tables, function (index, tables) {

	        strResult += "<li>" + tables + "</li>";

	    });

	    $(".sub_menu").html(strResult);



	}

    //
});