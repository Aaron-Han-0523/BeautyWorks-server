/*
=========================================
|                                       |
|       Multi-Check checkbox            |
|                                       |
=========================================
*/

function checkall(clickchk, relChkbox) {

  let checker = $('#' + clickchk);
  let multichk = $('.' + relChkbox);


  checker.click(function () {
    multichk.prop('checked', $(this).prop('checked'));
  });
}


/*
=========================================
|                                       |
|           MultiCheck                  |
|                                       |
=========================================
*/

/*
    This MultiCheck Function is recommanded for datatable
*/

function multiCheck(tb_var) {
  tb_var.on("change", ".chk-parent", function () {
    let e = $(this).closest("table").find("td:first-child .child-chk"), a = $(this).is(":checked");
    $(e).each(function () {
      a ? ($(this).prop("checked", !0), $(this).closest("tr").addClass("active")) : ($(this).prop("checked", !1), $(this).closest("tr").removeClass("active"))
    })
  }),
    tb_var.on("change", "tbody tr .new-control", function () {
      $(this).parents("tr").toggleClass("active")
    })
}


/*
=========================================
|                                       |
|           Import page                 |
|                                       |
=========================================
*/

/*
    This Code is import other html page!
*/

window.addEventListener('load', function () {
  let allElements = document.getElementsByTagName('*');
  Array.prototype.forEach.call(allElements, function (el) {
    let includePath = el.dataset.includePath;
    if (includePath) {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          el.outerHTML = this.responseText;
          let path = window.location.pathname;
          let page = path.split("/").pop();
          page = page.replace("add-", "");

          let aTags = document.querySelectorAll('#sidebar a');
          aTags.forEach(function (item, index, arr2) {
            let fileName = item.pathname.split("/").pop();

            if(fileName === page) {
              item.parentElement.classList.add("active");
            }
          })
        }
      };
      xhttp.open('GET', includePath, true);
      xhttp.send();
    }
  });


});


/*
=========================================
|                                       |
|           사이드 바 색깔                |
|                                       |
=========================================
*/

/*
    페이지 명을 기준으로 sidebar 의 active 를 자동으로 설정
*/

