// ====== تنظیمات Supabase ======
const SUPABASE_URL = 'vbmjsttfmznthcynuhcy';
const SUPABASE_ANON_KEY = 'vbmjsttfmznthcynuhcy';
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====== بررسی ورود کاربر ======
const welcome = document.getElementById('welcome');
supabase.auth.getUser().then(({ data: { user } }) => {
  if(!user) window.location.href = 'index.html';
});

// ====== قرعه کشی باشگاه مشتریان ======
const clubLotteryBtn = document.getElementById('club-lottery');
const clubResultP = document.getElementById('club-result');

if(clubLotteryBtn){
  clubLotteryBtn.onclick = async () => {
    const prizes = [
      { name: 'جایزه طلایی', chance: 10 },
      { name: 'جایزه نقره‌ای', chance: 30 },
      { name: 'جایزه برنزی', chance: 40 },
      { name: 'هیچ جایزه‌ای', chance: 20 }
    ];

    const rand = Math.random() * 100;
    let sum = 0;
    let prize = 'هیچ جایزه‌ای';
    for(let p of prizes){
      sum += p.chance;
      if(rand < sum){
        prize = p.name;
        break;
      }
    }

    clubResultP.innerText = `نتیجه قرعه‌کشی باشگاه: ${prize}`;

    // ذخیره در Supabase
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('club_lottery_results').insert([{ email: user.email, prize }]);
    if(error) console.log('خطا در ذخیره قرعه‌کشی باشگاه:', error);
  }
}

// ====== خروج از حساب ======
const logoutBtn = document.getElementById('logout');
logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
        }
