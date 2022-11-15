const fs = require('fs');

module.exports.mkdir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

module.exports.getRandomInt = (min, max) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

module.exports.formatDateTime = (d_t, sep = '-') => {
  if (!d_t) return '';
  let year = d_t.getFullYear();
  let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
  let day = ("0" + d_t.getDate()).slice(-2);
  let hour = ("0" + d_t.getHours()).slice(-2);
  let minute = ("0" + d_t.getMinutes()).slice(-2);
  let seconds = ("0" + d_t.getSeconds()).slice(-2);
  return year + sep + month + sep + day + " " + hour + ":" + minute + ":" + seconds;
}

module.exports.formatDate = (d_t, sep = '-') => {
  if (!d_t) return '';
  let year = d_t.getFullYear();
  let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
  let day = ("0" + d_t.getDate()).slice(-2);
  return year + sep + month + sep + day;
}

// array = "1,2,3,4"
module.exports.array_i18n = (array, i18n_func) => {
  array = array.split(',');
  let result = [];
  array.forEach((item, index) => {
    result.push(i18n_func(item));
  })
  return result;
}

// 부트스트랩 v5 이용
module.exports.make_pagination_by_href = function (i18n_func, page, count, baseURL, limit = 10) {
  let end_page = parseInt((count - 1) / limit) + 1;
  let end_list_num = end_page > 6 ? 5 : end_page;
  let temp_html = `<div class="d-flex justify-content-center mt-4">
  <!-- 페이징처리 시작 -->
  <!-- 처음 & 이전페이지 -->
  <ul class="p-2 pagination">
    `;
  if (page == 1) {
    temp_html += `
    <li class="page-item disabled"><a class="page-link">
        ${i18n_func('users.pagination.처음으로')}
      </a>
    </li>
    <li class="page-item disabled"><a class="page-link">
        ${i18n_func('users.pagination.이전으로')}
      </a>
    </li>
    `;
  } else {
    temp_html += `
    <li class="page-item"><a class="page-link" href="${baseURL}?p=1&limit=${limit}">
        ${i18n_func('users.pagination.처음으로')}
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="${baseURL}?p=${page - 1}&limit=${limit}">
        ${i18n_func('users.pagination.이전으로')}
      </a>
    </li>
    `;
  } temp_html += `
  </ul>
  <!-- 페이지 리스트 -->
  <ul class="p-2 pagination">
    `;
  if (page < 4) {
    for (let i = 1; i <= end_list_num; i++) {

      if (page == i) {
        temp_html += `
    <li class="page-item disabled">
      <a class="page-link current_page">
        ${i}
      </a>
    </li>
    `;
      } else {
        temp_html += `
    <li class="page-item"><a class="page-link" href="${baseURL}?p=${i}&limit=${limit}">
        ${i}
      </a></li>
    `;
      }
    } temp_html += `
    `;
  } else if (page > end_page - 3) {
    for (let i = end_page - 4; i <= end_page; i++) {
      if (page == i) {
        temp_html += `
    <li class="page-item disabled">
      <a class="page-link current_page">
        ${i}
      </a>
    </li>
    `;
      } else {
        temp_html += `
    <li class="page-item">
      <a class="page-link" href="${baseURL}?p=${i}&limit=${limit}">
        ${i}
      </a>
    </li>
    `;
      }
    }
  } else {
    for (let i = page - 2; i < page + 3; i++) {
      if (page == i) {
        temp_html += `
    <li class="page-item disabled">
      <a class="page-link current_page">
        ${i}
      </a>
    </li>
    `;
      } else {
        temp_html += `
    <li class="page-item">
      <a class="page-link" href="${baseURL}?p=${i}&limit=${limit}">
        ${i}
      </a>
    </li>
    `;
      }
    }
  } temp_html += `
  </ul>
  <!-- 다음 & 마지막페이지 -->
  <ul class="p-2 pagination">
    `;
  if (page == end_page) {
    temp_html += `
    <li class="page-item disabled">
      <a class="page-link">
        ${i18n_func('users.pagination.다음으로')}
      </a>
    </li>
    <li class="page-item disabled">
      <a class="page-link">
        ${i18n_func('users.pagination.마지막으로')}
      </a>
    </li>
    `;
  } else {
    temp_html += `
    <li class="page-item">
      <a class="page-link" href="${baseURL}?p=${page + 1}&limit=${limit}">
        ${i18n_func('users.pagination.다음으로')}
      </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="${baseURL}?p=${end_page}&limit=${limit}">
        ${i18n_func('users.pagination.마지막으로')}
      </a>
    </li>
    `;
  } temp_html += `
  </ul>
  <!-- 페이징처리 끝 -->
</div>`
  return temp_html;
}
// 부트스트랩 v5 이용
module.exports.make_pagination_by_func = function (i18n_func, page, count, baseURL, func_name, limit = 10) {
  let end_page = parseInt((count - 1) / limit) + 1;
  let end_list_num = end_page > 6 ? 5 : end_page;
  let temp_html = `<div class="d-flex justify-content-center">
    <!-- 페이징처리 시작 -->
    <!-- 처음 & 이전페이지 -->
    <ul class="p-2 pagination">
      `;
  if (page == 1) {
    temp_html += `
      <li class="page-item disabled"><button type="button" class="page-link">
          ${i18n_func('users.pagination.처음으로')}
        </button>
      </li>
      <li class="page-item disabled"><button type="button" class="page-link">
          ${i18n_func('users.pagination.이전으로')}
        </button>
      </li>
      `;
  } else {
    temp_html += `
      <li class="page-item"><button type="button" class="page-link" onclick="${func_name}('${baseURL}', 1);">
          ${i18n_func('users.pagination.처음으로')}
        </button>
      </li>
      <li class="page-item"><button type="button" class="page-link" onclick="${func_name}('${baseURL}', ${page - 1});">
          ${i18n_func('users.pagination.이전으로')}
        </button>
      </li>
      `;
  } temp_html += `
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
      <li class="page-item"><button type="button" class="page-link" onclick="${func_name}('${baseURL}', ${i});">
          ${i}
        </button></li>
      `;
      }
    } temp_html += `
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
        <button type="button" class="page-link" onclick="${func_name}('${baseURL}', ${i});">
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
        <button type="button" class="page-link" onclick="${func_name}('${baseURL}', ${i});">
          ${i}
        </button>
      </li>
      `;
      }
    }
  } temp_html += `
    </ul>
    <!-- 다음 & 마지막페이지 -->
    <ul class="p-2 pagination">
      `;
  if (page == end_page) {
    temp_html += `
      <li class="page-item disabled">
        <button type="button" class="page-link">
          ${i18n_func('users.pagination.다음으로')}
        </button>
      </li>
      <li class="page-item disabled">
        <button type="button" class="page-link">
          ${i18n_func('users.pagination.마지막으로')}
        </button>
      </li>
      `;
  } else {
    temp_html += `
      <li class="page-item">
        <button type="button" class="page-link" onclick="${func_name}('${baseURL}', ${page + 1});">
          ${i18n_func('users.pagination.다음으로')}
        </button>
      </li>
      <li class="page-item">
        <button type="button" class="page-link" onclick="${func_name}('${baseURL}', ${end_page});">
          ${i18n_func('users.pagination.마지막으로')}
        </button>
      </li>
      `;
  } temp_html += `
    </ul>
    <!-- 페이징처리 끝 -->
  </div>`
  return temp_html;
}