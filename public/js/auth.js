// auth.js - local simulated auth using localStorage
const USERS_KEY = 'pwd_platform_users';
const AUTH_KEY = 'pwd_platform_auth';

// returns { success, user/message }
async function registerLocal(user){
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if(!user.email || !user.password || !user.role) return { success:false, message:'Missing required fields' };
  if(users.find(u=>u.email === user.email)) return { success:false, message:'Email already in use' };

  // basic id
  user.id = Date.now();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id }));
  return { success:true, user };
}

async function loginLocal(email, password){
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u=>u.email === email);
  if(!user) return { success:false, message:'User not found' };
  if(user.password !== password) return { success:false, message:'Invalid password (prototype)' };
  localStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id }));
  return { success:true, user };
}

function logoutLocal(){ localStorage.removeItem(AUTH_KEY); }

function getCurrentUser(){
  const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  if(!auth) return null;
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  return users.find(u => u.id === auth.id) || null;
}
