// ====== تنظیمات Supabase ======
const SUPABASE_URL = 'vbmjsttfmznthcynuhcy'; // هم URL پروژه هم کلید anon
const SUPABASE_ANON_KEY = 'vbmjsttfmznthcynuhcy';
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====== ورود / ثبت‌نام ======
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const signupBtn = document.getElementById('signup');
const loginBtn = document.getElementById('login');

if(signupBtn){
  signupBtn.onclick = async () => {
    const { error } = await supabase.auth.signUp({
      email: emailInput.value,
      password: passInput.value
    });
    if(error) alert(error.message);
    else alert('ثبت‌نام موفق! حالا وارد شوید.');
  }
}

if(loginBtn){
  loginBtn.onclick = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.value,
      password: passInput.value
    });
    if(error) alert(error.message);
    else window.location.href = 'dashboard.html';
  }
}

// ====== داشبورد و قرعه‌کشی ======
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

// تابع قرعه‌کشی با درصد شانس واقعی
function getPrize() {
  const prizes = [
    { name: 'جایزه ویژه', chance: 10 },
    { name: 'جایزه ۱', chance: 30 },
    { name: 'جایزه ۲', chance: 40 },
    { name: 'هیچ جایزه‌ای', chance: 20 }
  ];

  const rand = Math.random() * 100;
  let sum = 0;
  for(let prize of prizes){
    sum += prize.chance;
    if(rand < sum) return prize.name;
  }
  return 'هیچ جایزه‌ای';
}

// اجرای قرعه‌کشی و ذخیره در جدول
if(lotteryBtn){
  lotteryBtn.onclick = async () => {
    const prize = getPrize();
    resultP.innerText = `نتیجه قرعه‌کشی: ${prize}`;

    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user.email;

    const { error } = await supabase.from('lottery_results').insert([
      { email: userEmail, prize }
    ]);

    if(error) console.log('خطا در ثبت قرعه‌کشی:', error);
  }
}

if(logoutBtn){
  logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  }
}
