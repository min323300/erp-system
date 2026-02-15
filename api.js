// ========================================
// ERP Lite v11 - API 통신 모듈 (GET 전용)
// Google Apps Script 전용 GET 방식
// ========================================

// ⚠️ 반드시 최신 배포 URL 입력
const API_URL = 'https://script.google.com/macros/s/AKfycbzg0BXVXXOAtOoVrcQwp8rOIpz1fuFNRgx9pFoTYdYKr9Tt264K-oCEkackO586AyEBSw/exec';


// ========================================
// 공통 API 호출 함수 (GET 통일)
// ========================================

async function callAPI(action, data = {}) {
    try {
        let url = `${API_URL}?action=${encodeURIComponent(action)}`;

        // 데이터가 있으면 URL 파라미터로 추가
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

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('API 호출 실패:', error);
        return {
            success: false,
            message: 'API 호출 오류: ' + error.message
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
    return await callAPI('saveMyCompany', { data: companyData });
}


// ========================================
// 판매 관리
// ========================================

async function getSales(params = {}) {
    return await callAPI('getSales', params);
}

async function addSale(saleData) {
    return await callAPI('addSale', { data: saleData });
}

async function getLastPrice(company, item) {
    return await callAPI('getLastPrice', { company, item });
}


// ========================================
// 입금 관리
// ========================================

async function getPayments(params = {}) {
    return await callAPI('getPayments', params);
}

async function addPayment(paymentData) {
    return await callAPI('addPayment', { data: paymentData });
}


// ========================================
// 업체 관리
// ========================================

async function getCompanies(type = null) {
    const params = type ? { type } : {};
    return await callAPI('getCompanies', params);
}

async function addCompany(companyData) {
    return await callAPI('addCompany', { data: companyData });
}


// ========================================
// 품목 관리
// ========================================

async function getItems() {
    return await callAPI('getItems');
}

async function addItem(itemData) {
    return await callAPI('addItem', { data: itemData });
}


// ========================================
// 거래명세표 (GET 방식)
// ========================================

async function generateStatement(saleIndex) {
    return await callAPI('generateStatement', { saleIndex });
}


// ========================================
// 입고 관리
// ========================================

async function getPurchases(params = {}) {
    return await callAPI('getPurchases', params);
}

async function addPurchase(purchaseData) {
    return await callAPI('addPurchase', { data: purchaseData });
}


// ========================================
// 재고 관리
// ========================================

async function getInventory() {
    return await callAPI('getInventory');
}


// ========================================
// 회계 관리
// ========================================

async function getMonthlyReport(year, month) {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    return await callAPI('getMonthlyReport', params);
}

async function getProfitLoss(startDate, endDate) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return await callAPI('getProfitLoss', params);
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
    if (!amount) return '0원';
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function showMessage(message) {
    alert(message);
}

function showLoading(element) {
    element.innerHTML = '<tr><td colspan="13" class="text-center">로딩 중...</td></tr>';
}

function showEmpty(element, message) {
    element.innerHTML = `<tr><td colspan="13" class="text-center text-muted">${message}</td></tr>`;
}
