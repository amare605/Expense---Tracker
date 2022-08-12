// const
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// 取出localstorage的 transcactions使用
const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
  );

// 如果localstorage的transctions 不為空 就使用localStorageTransactions 這個array
let transactions =
    localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
  



// function 
function addTransaction(e) {
    e.preventDefault();

    //如果兩個欄位其一有未輸入的，跳提示訊息
    if(text.value.trim() === '' || amount.value.trim() ===''){
        window.alert('請確認所有欄位都有輸入');
    } else {
      // 兩個欄位都有輸入，建立一筆交易
      const transaction = {
        id: generateID(),
        text: text.value,
        // 確保amount 必須是數字
        amount: +amount.value
      };
        // 將建立的transaction 新增到 transcations (註這個還不是localstorage)
        transactions.push(transaction);
        // 將建立的transaction 新增到 ui
        addTransactionDOM(transaction);
        // 更新value(total/收入/支出)
        updateValues();
        // 更新/新增到localstorage
        updateLocalStorage();

        // 清除text/ amount 欄位
        text.value = '';
        amount.value = '';

    }

}


// 建立id
function generateID(){
    // 回傳一個整數的亂數
    return  Math.floor(Math.random() * 100000000);
}


// Add transcation to dom
function addTransactionDOM(transaction) {
    // 取得正負號
    const sign = transaction.amount < 0 ? '-' : '+';

    // 建立要插入的item
    const item = document.createElement('li');

    // item 依據正負號加入class
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    // 建立完整的item
    item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id})">x</button>
    `;

    // 加入到list
    list.appendChild(item);

}

// 更新餘額 收入 支出
function updateValues(){
    // 取得所有transcation 的金額
    const amount = transactions.map(transaction => transaction.amount);

    // 餘額的總額
    const total = amount.reduce((acc, item) =>(acc+=item), 0).toFixed(2);

    // 收入
    const income = amount.filter(item => item > 0).reduce((acc, item) =>(acc += item ), 0).toFixed(2);
    // 支出
    const expense = amount.filter(item => item < 0).reduce((acc, item) => (acc += item), 0).toFixed(2) ;


    // 呈現在ui
    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}


// 更新localstorage
function updateLocalStorage(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


// remove transction by id
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}


// init app
function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}



// eventlistner
form.addEventListener('submit', addTransaction);

// 初始化
init();