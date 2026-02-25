// ========================================
// ERP Lite v18 - API 통신 모듈 (GET 전용)
// v18: getCustomPrices, saveCustomPrice 추가
// v18.1: 멀티 업체 지원 (?co=업체코드)
// ========================================

// ✅ 업체별 API URL 설정
const COMPANY_URLS = {
  sungsim:   'https://script.google.com/macros/s/AKfycbw2TDz0vXR9Rncia_s6utqx2sj8Y3HtIpKHgwnktd7E4Y7aXZF7N_LcORpp2BXkh08_5A/exec',
  bscompany: 'https://script.google.com/macros/s/AKfycbxQo49dolbpHIOQX2XUPaiTBamxsYSrKBB8vYDRaBR5t8AiA1KpsoAF82IMZHf7oweb/exec',
  spare:     '여기에_예비업체_URL_입력',
};

// URL 파라미터에서 업체 코드 읽기
const _co = new URLSearchParams(window.location.search).get('co') || 'sungsim';
const API_URL = COMPANY_URLS[_co] || COMPANY_URLS.sungsim;

// 현재 업체 표시 + 네비게이션 링크에 co 파라미터 자동 추가
const COMPANY_LABELS = { sungsim: '성심', bscompany: '비에스컴퍼니', spare: '예비' };
document.addEventListener('DOMContentLoaded', () => {
  const label = COMPANY_LABELS[_co] || '성심';
  document.title = document.title + ' [' + label + ']';
  const brand = document.querySelector('.nav-brand a');
  if (brand) brand.textContent = '거래명세 관리 시스템 [' + label + ']';

  // ✅ 모든 내부 링크에 ?co=xxx 자동 추가 (성심은 기본값이라 생략)
  if (_co && _co !== 'sungsim') {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.includes('co=')) {
        a.setAttribute('href', href + (href.includes('?') ? '&' : '?') + 'co=' + _co);
      }
    });
  }
});

async function callAPI(action, data = {}) {
    try {
        let url = `${API_URL}?action=${encodeURIComponent(action)}`;
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (value !== null && value !== undefined) {
                if (typeof value === 'object') {
                    url += `&${key}=${encodeURIComponent(JSON.stringify(value))}`;
                } else {
                    url += `&${key}=${encodeURIComponent(value)}`;
                }
            }
        });
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API 호출 실패:', error);
        return { success: false, message: 'API 호출 오류: ' + error.message };
    }
}

async function getMyCompany() { return await callAPI('getMyCompany'); }
async function saveMyCompany(companyData) { return await callAPI('saveMyCompany', { data: companyData }); }
async function getSales(params = {}) { return await callAPI('getSales', params); }
async function addSale(saleData) { return await callAPI('addSale', { data: saleData }); }
async function getLastPrice(company, item) { return await callAPI('getLastPrice', { company, item }); }
async function getCustomPrices(company) { return await callAPI('getCustomPrices', { company }); }
async function saveCustomPrice(company, item, price) { return await callAPI('saveCustomPrice', { data: { company, item, price } }); }
async function getPayments(params = {}) { return await callAPI('getPayments', params); }
async function addPayment(paymentData) { return await callAPI('addPayment', { data: paymentData }); }
async function getCompanies(type = null) { return await callAPI('getCompanies', type ? { type } : {}); }
async function addCompany(companyData) { return await callAPI('addCompany', { data: companyData }); }
async function getItems() { return await callAPI('getItems'); }
async function addItem(itemData) { return await callAPI('addItem', { data: itemData }); }
async function createStatement(date, customer) { return await callAPI('generateStatement', { date, customer }); }
async function generateStatement(saleIndex) { return await callAPI('generateStatement', { saleIndex }); }
async function getPurchases(params = {}) { return await callAPI('getPurchases', params); }
async function addPurchase(purchaseData) { return await callAPI('addPurchase', { data: purchaseData }); }
async function getSupplierPayments(params = {}) { return await callAPI('getSupplierPayments', params); }
async function addSupplierPayment(paymentData) { return await callAPI('addSupplierPayment', { data: paymentData }); }
async function getInventory() { return await callAPI('getInventory'); }
async function getMonthlyReport(year, month) {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    return await callAPI('getMonthlyReport', params);
}
async function getYearlyReport(year) {
    const params = {};
    if (year) params.year = year;
    return await callAPI('getYearlyReport', params);
}
async function getProfitLoss(startDate, endDate) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return await callAPI('getProfitLoss', params);
}
async function getDashboard() { return await callAPI('getDashboard'); }

function formatCurrency(amount) {
    if (!amount) return '0원';
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function showMessage(message) { alert(message); }
function showLoading(element) { element.innerHTML = '<tr><td colspan="13" class="text-center">로딩 중...</td></tr>'; }
function showEmpty(element, message) { element.innerHTML = `<tr><td colspan="13" class="text-center text-muted">${message}</td></tr>`; }
