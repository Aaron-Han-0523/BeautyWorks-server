const en_month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(d_t, sep = '.') {
  if (!d_t) return '';
  d_t = new Date(d_t)
  let year = ("" + d_t.getFullYear()).slice(-2);
  let month = en_month[d_t.getMonth()];
  // let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
  let day = ("0" + d_t.getDate()).slice(-2);
  return day + sep + month + sep + year;
}

function cancel() {
    let chk = confirm("취소하시겠습니까?");
    if (chk) {
        history.back();
    }
}

function delete_(event, url) {
    event.stopPropagation();

    // console.log('/' + url.split('/')[1]);

    let chk = confirm("정말로 삭제하시겠습니까?");
    if (chk) {
        fetch(url)
            .then(res => {
                if (res.ok) {
                    alert("삭제되었습니다.");
                    const redirectUrl = url.split('/')[1];
                    location.href = redirectUrl;
                    // window.location.reload();
                } else {
                    alert(res.statusText);
                }
            })
    }
}

function exportExcel(table_id, fileName, sheetName) {
    // step 1. workbook 생성
    var wb = XLSX.utils.book_new();

    // step 2. 시트 만들기 
    var newWorksheet = excelHandler.getWorksheet(table_id);

    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
    XLSX.utils.book_append_sheet(wb, newWorksheet, sheetName);

    // step 4. 엑셀 파일 만들기 
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // step 5. 엑셀 파일 내보내기 
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), fileName + '.xlsx');
}

var excelHandler = {
    getExcelData: function (table_id) {
        return document.getElementById(table_id); 	//TABLE id
    },
    getWorksheet: function (table_id) {
        return XLSX.utils.table_to_sheet(this.getExcelData(table_id));
    }
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}

function loadImageFile(input, img) {
    let file = input.files[0];
    img.src = URL.createObjectURL(file);
}

function make_pagination_by_func(page, count, func_name, limit = 10) {
    let end_page = parseInt((count - 1) / limit) + 1;
    let end_list_num = end_page > 6 ? 5 : end_page;
    let temp_html = `<div class="d-flex justify-content-center mt-4">
    <!-- 페이징처리 시작 -->
    <!-- 처음 & 이전페이지 -->
    <ul class="p-2 pagination">
      `;
    if (page == 1) {
        temp_html += `
      <li class="page-item disabled"><button type="button" class="page-link">
      <i class='fa-solid fa-angles-left'></i>
        </button>
      </li>
      <li class="page-item disabled"><button type="button" class="page-link">
      <i class='fa-solid fa-angle-left'></i>
        </button>
      </li>
      `;
    } else {
        temp_html += `
      <li class="page-item"><button type="button" class="page-link" onclick="${func_name}(1);">
      <i class='fa-solid fa-angles-left'></i>
        </button>
      </li>
      <li class="page-item"><button type="button" class="page-link" onclick="${func_name}(${page - 1});">
      <i class='fa-solid fa-angle-left'></i>
        </button>
      </li>
      `;
    }
    temp_html += `
    </ul>
    <!-- 페이지 리스트 -->
    <ul class="p-2 pagination">
      `;
    if (page < 4) {
        for (let i = 1; i <= end_list_num; i++) {

            if (page == i) {
                temp_html += `
      <li class="page-item disabled">
        <button type="button" class="page-link current_page">
          ${i}
        </button>
      </li>
      `;
            } else {
                temp_html += `
      <li class="page-item"><button type="button" class="page-link" onclick="${func_name}(${i});">
          ${i}
        </button></li>
      `;
            }
        }
        temp_html += `
      `;
    } else if (page > end_page - 3) {
        for (let i = end_page - 4; i <= end_page; i++) {
            if (page == i) {
                temp_html += `
      <li class="page-item disabled">
        <button type="button" class="page-link current_page">
          ${i}
        </button>
      </li>
      `;
            } else {
                temp_html += `
      <li class="page-item">
        <button type="button" class="page-link" onclick="${func_name}(${i});">
          ${i}
        </button>
      </li>
      `;
            }
        }
    } else {
        for (let i = page - 2; i < page + 3; i++) {
            if (page == i) {
                temp_html += `
      <li class="page-item disabled">
        <button type="button" class="page-link current_page">
          ${i}
        </button>
      </li>
      `;
            } else {
                temp_html += `
      <li class="page-item">
        <button type="button" class="page-link" onclick="${func_name}(${i});">
          ${i}
        </button>
      </li>
      `;
            }
        }
    }
    temp_html += `
    </ul>
    <!-- 다음 & 마지막페이지 -->
    <ul class="p-2 pagination">
      `;
    if (page == end_page) {
        temp_html += `
      <li class="page-item disabled">
        <button type="button" class="page-link">
        <i class='fa-solid fa-angle-right'></i>
        </button>
      </li>
      <li class="page-item disabled">
        <button type="button" class="page-link">
        <i class='fa-solid fa-angles-right'></i>
        </button>
      </li>
      `;
    } else {
        temp_html += `
      <li class="page-item">
        <button type="button" class="page-link" onclick="${func_name}(${page + 1});">
        <i class='fa-solid fa-angle-right'></i>
        </button>
      </li>
      <li class="page-item">
        <button type="button" class="page-link" onclick="${func_name}(${end_page});">
        <i class='fa-solid fa-angles-right'></i>
        </button>
      </li>
      `;
    }
    temp_html += `
    </ul>
    <!-- 페이징처리 끝 -->
  </div>`
    return temp_html;
};