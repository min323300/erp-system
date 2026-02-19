// ========================================
// ERP Lite v18 - API 통신 모듈 (GET 전용)
// v18: getCustomPrices, saveCustomPrice 추가
// ========================================

const API_URL = 'https://script.google.com/macros/s/AKfycbyLKn8HtT5ReF8qtiCrfsHpdimC0plTsUY8jB3ISs4U49WyoxIhk9kC248_vXUYe4bMOA/exec';

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

// ✅ v18 신규: 거래처 전체 품목 단가 조회
async function getCustomPrices(company) {
    return await callAPI('getCustomPrices', { company });
}

// ✅ v18 신규: 거래처별 단가 저장
async function saveCustomPrice(company, item, price) {
    return await callAPI('saveCustomPrice', { data: { company, item, price } });
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
// 거래명세표
// ========================================

async function createStatement(date, customer) {
    return await callAPI('generateStatement', { date, customer });
}

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
// 유틸리티
// ========================================

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
function showLoading(element) {
    element.innerHTML = '<tr><td colspan="13" class="text-center">로딩 중...</td></tr>';
}
function showEmpty(element, message) {
    element.innerHTML = `<tr><td colspan="13" class="text-center text-muted">${message}</td></tr>`;
}
