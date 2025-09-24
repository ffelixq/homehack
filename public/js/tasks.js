// tasks.js - mock DB using localStorage
const TASKS_KEY = 'pwd_platform_tasks';
const APPLICATIONS_KEY = 'pwd_platform_apps';

// seed example tasks if empty
function seedTasks(){
  let tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  if(tasks.length === 0){
    tasks = [
      { id: 't1', title: 'Data entry (simple)', description: 'Enter product catalog into spreadsheet', skills_required: 'Excel, Typing', accommodations:'Large font CSV', duration: '1 week', mode:'Remote', company_id: 1001 },
      { id: 't2', title: 'Packaging assistant', description: 'Package light items in warehouse', skills_required: 'Packaging', accommodations:'Seated workstation', duration: '1 day', mode:'On-site', company_id: 1002 },
    ];
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
}
seedTasks();

function getAllTasks(){
  return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
}

function createLocalTask(task){
  const tasks = getAllTasks();
  task.id = 't' + Date.now();
  tasks.unshift(task);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return task;
}

function renderTaskList(filters = {}){
  const container = document.getElementById('jobs');
  if(!container) return;
  const tasks = getAllTasks().filter(t=>{
    if(filters.skill && !t.skills_required.toLowerCase().includes(filters.skill.toLowerCase())) return false;
    if(filters.duration && filters.duration !== '' && t.duration !== filters.duration) return false;
    if(filters.remote && filters.remote !== '' && t.mode !== filters.remote) return false;
    return true;
  });
  if(tasks.length === 0) container.innerHTML = '<p>No tasks found.</p>';
  else container.innerHTML = tasks.map(t => `
    <div class="col-md-6">
      <article class="task-card" role="article" aria-labelledby="task-${t.id}-title">
        <h3 id="task-${t.id}-title">${escapeHtml(t.title)}</h3>
        <p>${escapeHtml(t.description)}</p>
        <p><strong>Skills:</strong> ${escapeHtml(t.skills_required)}</p>
        <p><strong>Duration:</strong> ${escapeHtml(t.duration)} • <strong>Mode:</strong> ${escapeHtml(t.mode || 'Remote')}</p>
        <div class="d-flex gap-2">
          <a class="btn btn-sm btn-primary" href="task-detail.html?id=${t.id}" aria-label="Open ${escapeHtml(t.title)} details">View</a>
          <button class="btn btn-sm btn-outline-success" onclick="applyToTask('${t.id}')">Quick apply</button>
        </div>
      </article>
    </div>
  `).join('');
}

function renderCompanyTasks(){
  const container = document.getElementById('company-tasks');
  if(!container) return;
  const user = getCurrentUser();
  const tasks = getAllTasks().filter(t=>t.company_id === user.id);
  container.innerHTML = tasks.map(t=>`
    <div class="col-md-6">
      <div class="task-card">
        <h4>${escapeHtml(t.title)}</h4>
        <p>${escapeHtml(t.description)}</p>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-danger" onclick="deleteTask('${t.id}')">Delete</button>
          <button class="btn btn-sm btn-outline-primary" onclick="viewApplicants('${t.id}')">View applicants</button>
        </div>
      </div>
    </div>
  `).join('');
}

function applyToTask(taskId){
  const user = getCurrentUser();
  if(!user) { alert('Please sign in'); location.href='login.html'; return; }
  const apps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]');
  if(apps.find(a=>a.task_id===taskId && a.pwd_id===user.id)) return alert('You already applied');
  apps.push({ id: 'a'+Date.now(), task_id: taskId, pwd_id: user.id, status: 'applied', submission: '' });
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  alert('Applied successfully (prototype).');
}

function renderTaskDetail(id){
  const tasks = getAllTasks();
  const t = tasks.find(x=>x.id===id);
  if(!t) { document.getElementById('task-detail').innerText = 'Task not found'; return;}
  document.getElementById('task-detail').innerHTML = `
    <article>
      <h1>${escapeHtml(t.title)}</h1>
      <p>${escapeHtml(t.description)}</p>
      <p><strong>Skills:</strong> ${escapeHtml(t.skills_required)}</p>
      <p><strong>Duration:</strong> ${escapeHtml(t.duration)}</p>
      <p><strong>Accommodations:</strong> ${escapeHtml(t.accommodations || 'None')}</p>
      <div class="mt-3">
        <button class="btn btn-primary" onclick="applyToTask('${t.id}')">Apply for this task</button>
      </div>
    </article>
  `;
}

function deleteTask(id){
  let tasks = getAllTasks();
  tasks = tasks.filter(t=>t.id!==id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  renderCompanyTasks();
}

function viewApplicants(taskId){
  const apps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]').filter(a=>a.task_id===taskId);
  if(apps.length===0) return alert('No applicants yet (prototype).');
  const users = JSON.parse(localStorage.getItem('pwd_platform_users')||'[]');
  const names = apps.map(a=>{
    const u = users.find(x=>x.id===a.pwd_id);
    return u ? `${u.name} (${u.email})` : 'Unknown';
  }).join('\n');
  alert('Applicants:\n' + names);
}

// small helper
function escapeHtml(s){ return (s||'').toString().replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
