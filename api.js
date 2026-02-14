// ========================================
// API 통신 모듈 v6
// CORS 문제 완전 해결 버전
// ========================================

// ⚠️ 배포 후 여기에 새 Google Apps Script URL을 입력하세요
const API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_URL_HERE/exec';

// ========================================
// 기본 API 호출 함수
// ========================================

async function callAPI(action, data = null, method = 'GET') {
    try {
        let url = API_URL;
        let options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (method === 'GET' && action) {
            url += `?action=${action}`;
            if (data) {
                Object.keys(data).forEach(key => {
                    url += `&${key}=${encodeURIComponent(data[key])}`;
                });
            }
        } else if (method === 'POST') {
            options.body = JSON.stringify({
                action: action,
                ...data
            });
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('API 호출 실패:', error);
        return { 
            success: false, 
            message: 'API 호출 중 오류가 발생했습니다: ' + error.message 
        };
    }
}

// ========================================
// 회사 정보
// ========================================

async function getMyCompany() {
    return await callAPI('getMyCompany');
}

async function saveMyCompany(companyData) {
    return await callAPI('saveMyCompany', { data: companyData }, 'POST');
}

// ========================================
// 판매 관리
// ========================================

async function getSales(params = {}) {
    return await callAPI('getSales', params, 'GET');
}

async function addSale(saleData) {
    return await callAPI('addSale', { data: saleData }, 'POST');
}

async function getLastPrice(company, item) {
    return await callAPI('getLastPrice', { company, item }, 'POST');
}

// ========================================
// 입금 관리
// ========================================

async function getPayments(params = {}) {
    return await callAPI('getPayments', { params: params }, 'POST');
}

async function addPayment(paymentData) {
    return await callAPI('addPayment', { data: paymentData }, 'POST');
}

// ========================================
// 업체 관리
// ========================================

async function getCompanies(type = null) {
    const params = type ? { type } : {};
    return await callAPI('getCompanies', params, 'GET');
}

async function addCompany(companyData) {
    return await callAPI('addCompany', { data: companyData }, 'POST');
}

// ========================================
// 품목 관리
// ========================================

async function getItems() {
    return await callAPI('getItems');
}

async function addItem(itemData) {
    return await callAPI('addItem', { data: itemData }, 'POST');
}

// ========================================
// 거래명세표
// ========================================

async function generateStatement(saleIndex) {
    return await callAPI('generateStatement', { saleIndex }, 'POST');
}

// ========================================
// 대시보드
// ========================================

async function getDashboard() {
    return await callAPI('getDashboard');
}

// ========================================
// 유틸리티 함수
// ========================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}. ${day}.`;
}

function showMessage(message, type = 'success') {
    alert(message);
}

function showLoading(element) {
    element.innerHTML = '<tr><td colspan="13" class="text-center">로딩 중...</td></tr>';
}

function showEmpty(element, message) {
    element.innerHTML = `<tr><td colspan="13" class="text-center text-muted">${message}</td></tr>`;
}
