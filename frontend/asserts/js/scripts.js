document.addEventListener('DOMContentLoaded', () => {
    console.log('Loyiha 1 script yuklandi!');

    // Dashboard uchun foydalanuvchi ismini ko'rsatish va chiqish tugmasi logikasi
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        const username = localStorage.getItem('foydalanuvchi_nomi');
        if (username) {
            usernameDisplay.textContent = `Salom, ${username}!`;
        }
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('foydalanuvchi_nomi');
            window.location.href = '../pages/signin.html';
        });
    }

    // crud.html uchun elementlarni olish va ko'rsatish
    const itemTable = document.getElementById('data-table');
    if (itemTable) {
        loadItems();
        const form = document.getElementById('crud-form');
        if (form) {
            form.addEventListener('submit', saveItem);
            const cancelEditBtn = document.getElementById('cancel-edit');
            if (cancelEditBtn) {
                cancelEditBtn.addEventListener('click', clearForm);
            }
        }
    }

    function loadItems() {
        fetch('http://16.171.141.168:8000/api/api_1/items/') // Sizning API manzilingizga moslang (Loyiha 1)
            .then(response => response.json())
            .then(data => displayItems(data))
            .catch(error => console.error('Elementlarni olishda xatolik (Loyiha 1):', error));
    }

    function displayItems(items) {
        const tbody = document.getElementById('data-body');
        if (tbody) {
            tbody.innerHTML = '';
            items.forEach(item => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>
                        <button onclick="editItem(${item.id})">Tahrirlash</button>
                        <button onclick="deleteItem(${item.id})">O'chirish</button>
                    </td>
                `;
            });
        }
    }

    function saveItem(event) {
        event.preventDefault();
        const nameInput = document.getElementById('name');
        const descriptionInput = document.getElementById('description');
        const idInput = document.getElementById('id');
        if (nameInput && descriptionInput && idInput) {
            const name = nameInput.value;
            const description = descriptionInput.value;
            const id = idInput.value;

            const itemData = { name: name, description: description };
            const method = id ? 'PUT' : 'POST';
            const url = id ? `http://16.171.141.168:8000/api/api_1/items/${id}/` : 'http://16.171.141.168:8000/api/api_1/items/'; // Sizning API manzilingizga moslang (Loyiha 1)

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // Agar kerak bo'lsa, token qo'shing: 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(itemData),
            })
            .then(response => response.json())
            .then(() => {
                loadItems();
                clearForm();
            })
            .catch(error => console.error('Elementni saqlashda xatolik (Loyiha 1):', error));
        }
    }

    function editItem(id) {
        fetch(`http://16.171.141.168:8000/api/api_1/items/${id}/`) // Sizning API manzilingizga moslang (Loyiha 1)
            .then(response => response.json())
            .then(item => {
                document.getElementById('id').value = item.id;
                document.getElementById('name').value = item.name;
                document.getElementById('description').value = item.description;
                const cancelEditBtn = document.getElementById('cancel-edit');
                if (cancelEditBtn) {
                    cancelEditBtn.style.display = 'inline';
                }
            })
            .catch(error => console.error('Elementni olishda xatolik (Loyiha 1):', error));
    }

    function deleteItem(id) {
        if (confirm('Elementni o\'chirishga ishonchingiz komilmi?')) {
            fetch(`http://16.171.141.168:8000/api/api_1/items/${id}/`, { // Sizning API manzilingizga moslang (Loyiha 1)
                method: 'DELETE',
                // Agar kerak bo'lsa, token qo'shing: 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            })
            .then(() => loadItems())
            .catch(error => console.error('Elementni o\'chirishda xatolik (Loyiha 1):', error));
        }
    }

    function clearForm() {
        const form = document.getElementById('crud-form');
        if (form) {
            form.reset();
            document.getElementById('id').value = '';
            const cancelEditBtn = document.getElementById('cancel-edit');
            if (cancelEditBtn) {
                cancelEditBtn.style.display = 'none';
            }
        }
    }

    // Dashboard uchun statistikani olish va ko'rsatish (dashboard.html)
    const statisticTable = document.getElementById('statistic-table');
    if (statisticTable) {
        loadStatistics();
    }

    function loadStatistics() {
        fetch('http://16.171.141.168:8000/api/api_2/statistics/') // Sizning API manzilingizga moslang (Loyiha 1)
            .then(response => response.json())
            .then(data => displayStatistics(data))
            .catch(error => console.error('Statistikalarni olishda xatolik (Loyiha 1):', error));
    }

    function displayStatistics(statistics) {
        const tbody = document.getElementById('statistic-body');
        if (tbody) {
            tbody.innerHTML = '';
            statistics.forEach(statistic => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${statistic.title}</td>
                    <td>${statistic.value}</td>
                    <td>${statistic.timestamp}</td>
                `;
            });
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    console.log('Loyiha 1 script yuklandi!');

    // Dashboard uchun foydalanuvchi ismini ko'rsatish va chiqish tugmasi logikasi
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        const username = localStorage.getItem('foydalanuvchi_nomi');
        if (username) {
            usernameDisplay.textContent = `Salom, ${username}!`;
        }
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('foydalanuvchi_nomi');
            localStorage.removeItem('accessToken'); // Tokenni ham o'chiramiz
            window.location.href = '../pages/signin.html';
        });
    }

    // Sign in formasi logikasi (agar signin.html da bo'lsa)
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const usernameInput = document.getElementById('signin-username');
            const passwordInput = document.getElementById('signin-password');
            if (usernameInput && passwordInput) {
                const username = usernameInput.value;
                const password = passwordInput.value;

                try {
                    const response = await fetch('http://16.171.141.168:8000/api/token/', { // BU YERGA SIGNIN API MANZILINGIZNI KIRITING
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password }),
                    });

                    const data = await response.json();

                    if (response.ok && data.accessToken) { // Agar javob yaxshi bo'lsa va token bo'lsa
                        localStorage.setItem('foydalanuvchi_nomi', username);
                        localStorage.setItem('accessToken', data.accessToken); // Tokenni localStorage ga saqlash
                        window.location.href = 'dashboard.html'; // Yoki kerakli sahifaga yo'naltirish
                    } else {
                        console.error('Kirishda xatolik:', data.message || 'Xatolik yuz berdi');
                        // Xatolik haqida foydalanuvchini ogohlantirish (masalan, xatolik xabarini chiqarish)
                    }
                } catch (error) {
                    console.error('Kirish so\'rovida xatolik:', error);
                    // Tarmoq xatoligi haqida foydalanuvchini ogohlantirish
                }
            }
        });
    }

    // crud.html uchun elementlarni olish va ko'rsatish
    const itemTable = document.getElementById('data-table');
    if (itemTable) {
        loadItems();
        const form = document.getElementById('crud-form');
        if (form) {
            form.addEventListener('submit', saveItem);
            const cancelEditBtn = document.getElementById('cancel-edit');
            if (cancelEditBtn) {
                cancelEditBtn.addEventListener('click', clearForm);
            }
        }
    }

    function loadItems() {
        const token = localStorage.getItem('accessToken'); // Tokenni olish
        fetch('http://16.171.141.168:8000/api/api_1/items/', { // Sizning API manzilingizga moslang (Loyiha 1)
            headers: {
                'Authorization': `Bearer ${token}`, // Tokenni headerga qo'shish
            },
        })
            .then(response => response.json())
            .then(data => displayItems(data))
            .catch(error => console.error('Elementlarni olishda xatolik (Loyiha 1):', error));
    }

    async function saveItem(event) {
        event.preventDefault();
        const nameInput = document.getElementById('name');
        const descriptionInput = document.getElementById('description');
        const idInput = document.getElementById('id');
        if (nameInput && descriptionInput && idInput) {
            const name = nameInput.value;
            const description = descriptionInput.value;
            const id = idInput.value;

            const itemData = { name: name, description: description };
            const method = id ? 'PUT' : 'POST';
            const url = id ? `http://16.171.141.168:8000/api/api_1/items/${id}/` : 'http://16.171.141.168:8000/api/api_1/items/'; // Sizning API manzilingizga moslang (Loyiha 1)
            const token = localStorage.getItem('accessToken'); // Tokenni olish

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Tokenni headerga qo'shish
                    },
                    body: JSON.stringify(itemData),
                });
                const data = await response.json();
                loadItems();
                clearForm();
            } catch (error) {
                console.error('Elementni saqlashda xatolik (Loyiha 1):', error);
            }
        }
    }

    function editItem(id) {
        const token = localStorage.getItem('accessToken'); // Tokenni olish
        fetch(`http://16.171.141.168:8000/api/api_1/items/${id}/`, { // Sizning API manzilingizga moslang (Loyiha 1)
            headers: {
                'Authorization': `Bearer ${token}`, // Tokenni headerga qo'shish
            },
        })
            .then(response => response.json())
            .then(item => {
                document.getElementById('id').value = item.id;
                document.getElementById('name').value = item.name;
                document.getElementById('description').value = item.description;
                const cancelEditBtn = document.getElementById('cancel-edit');
                if (cancelEditBtn) {
                    cancelEditBtn.style.display = 'inline';
                }
            })
            .catch(error => console.error('Elementni olishda xatolik (Loyiha 1):', error));
    }

    function deleteItem(id) {
        if (confirm('Elementni o\'chirishga ishonchingiz komilmi?')) {
            const token = localStorage.getItem('accessToken'); // Tokenni olish
            fetch(`http://16.171.141.168:8000/api/api_1/items/${id}/`, { // Sizning API manzilingizga moslang (Loyiha 1)
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, // Tokenni headerga qo'shish
                },
            })
                .then(() => loadItems())
                .catch(error => console.error('Elementni o\'chirishda xatolik (Loyiha 1):', error));
        }
    }

    function clearForm() {
        const form = document.getElementById('crud-form');
        if (form) {
            form.reset();
            document.getElementById('id').value = '';
            const cancelEditBtn = document.getElementById('cancel-edit');
            if (cancelEditBtn) {
                cancelEditBtn.style.display = 'none';
            }
        }
    }

    // Dashboard uchun statistikani olish va ko'rsatish (dashboard.html)
    const statisticTable = document.getElementById('statistic-table');
    if (statisticTable) {
        loadStatistics();
    }

    function loadStatistics() {
        const token = localStorage.getItem('accessToken'); // Tokenni olish
        fetch('http://16.171.141.168:8000/api/api_2/statistics/', { // Sizning API manzilingizga moslang (Loyiha 1)
            headers: {
                'Authorization': `Bearer ${token}`, // Tokenni headerga qo'shish
            },
        })
            .then(response => response.json())
            .then(data => displayStatistics(data))
            .catch(error => console.error('Statistikalarni olishda xatolik (Loyiha 1):', error));
    }

    function displayStatistics(statistics) {
        const tbody = document.getElementById('statistic-body');
        if (tbody) {
            tbody.innerHTML = '';
            statistics.forEach(statistic => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${statistic.title}</td>
                    <td>${statistic.value}</td>
                    <td>${statistic.timestamp}</td>
                `;
            });
        }
    }
});
