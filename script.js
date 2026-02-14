// ====== جایگزین کن با لینک خودت ======
const SUPABASE_URL = 'https://YOUR-SUPABASE-URL.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====== ورود / ثبت‌نام ======
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const signupBtn = document.getElementById('signup');
const loginBtn = document.getElementById('login');

if(signupBtn){
  signupBtn.onclick = async () => {
    const { error } = await supabase.auth.signUp({ email: emailInput.value, password: passInput.value });
    if(error) alert(error.message);
    else alert('ثبت‌نام موفق! حالا وارد شوید.');
  }
}

if(loginBtn){
  loginBtn.onclick = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email: emailInput.value, password: passInput.value });
    if(error) alert(error.message);
    else window.location.href = 'dashboard.html';
  }
}

// ====== داشبورد ======
const welcome = document.getElementById('welcome');
const lotteryBtn = document.getElementById('lottery');
const resultP = document.getElementById('result');
const logoutBtn = document.getElementById('logout');

if(welcome){
  supabase.auth.getUser().then(({ data: { user } }) => {
    if(user) welcome.innerText = `خوش آمدید ${user.email}`;
    else window.location.href = 'index.html';
  });
}

if(lotteryBtn){
  lotteryBtn.onclick = async () => {
    const prizes = ['جایزه ۱', 'جایزه ۲', 'جایزه ۳', 'هیچ جایزه‌ای'];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    resultP.innerText = `نتیجه قرعه‌کشی: ${prize}`;
    
    // ذخیره در Supabase
    const { error } = await supabase.from('lottery_results').insert([{ email: supabase.auth.getUser().data.user.email, prize }]);
    if(error) console.log(error);
  }
}

if(logoutBtn){
  logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  }
      }
