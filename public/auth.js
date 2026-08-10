const message=document.querySelector('#authMessage'),login=document.querySelector('#loginForm'),register=document.querySelector('#registerForm');
async function request(path,body){const r=await fetch('/api'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw Error(d.message||'Request failed');return d}
function finish(data){localStorage.setItem('raksha_token',data.token);location.href='dashboard.html'}
login.onsubmit=async e=>{e.preventDefault();try{finish(await request('/auth/login',Object.fromEntries(new FormData(login))))}catch(err){message.textContent=err.message}};
register.onsubmit=async e=>{e.preventDefault();try{finish(await request('/auth/register',Object.fromEntries(new FormData(register))))}catch(err){message.textContent=err.message}};
showRegister.onclick=()=>{login.hidden=true;register.hidden=false;showRegister.hidden=true;showLogin.hidden=false;authTitle.textContent='Create your gym'};showLogin.onclick=()=>{login.hidden=false;register.hidden=true;showRegister.hidden=false;showLogin.hidden=true;authTitle.textContent='Owner login'};
