const API = {
    list: () => fetch('/api/tasks').then(r => r.json()),
    create: (title) => fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    }).then(r => r.json()),
    toggle: (id) => fetch(`/api/tasks/${id}/toggle`, { method: 'POST' }).then(r => r.json()),
    update: (id, payload) => fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(r => r.json()),
    remove: (id) => fetch(`/api/tasks/${id}`, { method: 'DELETE' }).then(r => r.json())
};

const el = {
    form: document.getElementById('todo-form'),
    input: document.getElementById('todo-input'),
    list: document.getElementById('todo-list'),
    empty: document.getElementById('empty-state'),
    filters: document.getElementById('toolbar')
};

let tasks = []; // 快取於前端記憶體以便渲染與過濾
let currentFilter = 'all';

function render() {
    el.list.innerHTML = '';
    const filtered = tasks.filter(t => {
        if (currentFilter === 'active') return !t.completed;
        if (currentFilter === 'done') return t.completed;
        return true;
    });

    filtered.forEach(t => el.list.appendChild(renderItem(t)));
    el.empty.style.display = filtered.length ? 'none' : 'block';
}

function renderItem(task) {
    const li = document.createElement('li');
    li.id = `task-${task.id}`;
    li.className = task.completed ? 'done' : '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', async () => {
        const updated = await API.toggle(task.id);
        const idx = tasks.findIndex(t => t.id === task.id);
        tasks[idx] = updated;
        render();
    });

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.title;
    title.title = task.title;

    // 雙擊可 inline 編輯標題
    title.addEventListener('dblclick', () => enterEditMode(li, task));

    const del = document.createElement('button');
    del.className = 'delete';
    del.textContent = '刪除';
    del.addEventListener('click', async () => {
        await API.remove(task.id);
        tasks = tasks.filter(t => t.id !== task.id);
        render();
    });

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(del);
    return li;
}

function enterEditMode(li, task) {
    li.classList.add('editing');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.title;
    input.maxLength = 200;
    input.className = 'edit';

    const finish = async (commit) => {
        li.classList.remove('editing');
        if (commit) {
            const newTitle = input.value.trim();
            if (newTitle && newTitle !== task.title) {
                const updated = await API.update(task.id, { title: newTitle });
                const idx = tasks.findIndex(t => t.id === task.id);
                tasks[idx] = updated;
            }
        }
        render();
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finish(true);
        if (e.key === 'Escape') finish(false);
    });
    input.addEventListener('blur', () => finish(true));

    li.replaceChild(input, li.querySelector('.title'));
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}

// 新增任務
el.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = el.input.value.trim();
    if (!title) return;
    const created = await API.create(title);
    tasks.unshift(created); // 依建立時間倒序
    el.input.value = '';
    render();
});

// 篩選切換
el.filters.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    Array.from(el.filters.querySelectorAll('button')).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
});

// 初始載入
(async function init() {
    tasks = await API.list();
    render();
})();
