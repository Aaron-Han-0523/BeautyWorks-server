function formatDate(d_t) {
    if (!d_t) return '';

    d_t = new Date(d_t);
    //console.log(typeof d_t);

    let year = d_t.getFullYear();
    let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
    let day = ("0" + d_t.getDate()).slice(-2);
    let hour = ("0" + d_t.getHours()).slice(-2);
    let minute = ("0" + d_t.getMinutes()).slice(-2);
    let seconds = ("0" + d_t.getSeconds()).slice(-2);
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;
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